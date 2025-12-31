
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, ChatState, Language, Product, AboutInfo } from '../types';
import { getGeminiResponse } from '../geminiService';
import { TRANSLATIONS, getSystemInstruction } from '../constants';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface AIConsultantProps {
  lang: Language;
  products?: Product[];
  aboutInfo?: AboutInfo | null;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ lang, products, aboutInfo }) => {
  const t = TRANSLATIONS[lang]?.ai || TRANSLATIONS['uz'].ai;
  
  const [chat, setChat] = useState<ChatState>({
    messages: [
      { role: 'model', text: t.welcome }
    ],
    isLoading: false
  });
  const [input, setInput] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPlayingId, setIsPlayingId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameIntervalRef = useRef<number | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const SHARED_VOICE = 'Zephyr';

  useEffect(() => {
    setChat(prev => ({
      ...prev,
      messages: prev.messages.map((msg, i) => i === 0 ? { ...msg, text: t.welcome } : msg)
    }));
  }, [lang, t.welcome]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chat.messages, chat.isLoading]);

  // Audio helper functions
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || chat.isLoading) return;
    const userMsg: Message = { role: 'user', text: input, image: selectedImage || undefined };
    const currentHistory = [...chat.messages, userMsg];
    setChat(prev => ({ ...prev, messages: currentHistory, isLoading: true }));
    setInput('');
    const base64Image = selectedImage ? selectedImage.split(',')[1] : undefined;
    setSelectedImage(null);
    const aiResponse = await getGeminiResponse(currentHistory, lang, products, aboutInfo, base64Image);
    setChat(prev => ({ ...prev, messages: [...currentHistory, { role: 'model', text: aiResponse }], isLoading: false }));
  };

  const handlePlayTTS = async (text: string, msgIndex: number) => {
    if (!process.env.API_KEY || isPlayingId !== null) return;
    setIsPlayingId(msgIndex);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: SHARED_VOICE } } },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => { setIsPlayingId(null); ctx.close(); };
        source.start();
      } else { setIsPlayingId(null); }
    } catch (error) { setIsPlayingId(null); }
  };

  const endVoiceCall = useCallback(() => {
    if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    if (outputAudioContextRef.current) outputAudioContextRef.current.close().catch(() => {});
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (frameIntervalRef.current) window.clearInterval(frameIntervalRef.current);
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    audioContextRef.current = null;
    outputAudioContextRef.current = null;
    streamRef.current = null;
    frameIntervalRef.current = null;
    sessionPromiseRef.current = null;
    nextStartTimeRef.current = 0;
    setIsCalling(false);
    setIsCameraActive(false);
  }, []);

  const switchCamera = async () => {
    if (!isCalling || !isCameraActive) return;
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    if (streamRef.current) streamRef.current.getVideoTracks().forEach(track => track.stop());
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: newMode }, audio: false });
      const videoTrack = newStream.getVideoTracks()[0];
      if (streamRef.current) {
        const oldTrack = streamRef.current.getVideoTracks()[0];
        if (oldTrack) streamRef.current.removeTrack(oldTrack);
        streamRef.current.addTrack(videoTrack);
      }
      if (videoRef.current) videoRef.current.srcObject = streamRef.current;
    } catch (err) { console.error(err); }
  };

  const toggleCamera = async () => {
    if (!isCalling) return;
    if (isCameraActive) {
      streamRef.current?.getVideoTracks().forEach(t => t.stop());
      setIsCameraActive(false);
    } else {
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } });
        if (streamRef.current) {
          cameraStream.getVideoTracks().forEach(track => streamRef.current!.addTrack(track));
        } else {
          streamRef.current = cameraStream;
        }
        if (videoRef.current) videoRef.current.srcObject = streamRef.current;
        setIsCameraActive(true);
      } catch (err) { console.error(err); }
    }
  };

  const startVoiceCall = useCallback(async () => {
    if (!process.env.API_KEY) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsCalling(true);
            const source = audioContextRef.current!.createMediaStreamSource(streamRef.current!);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob })).catch(() => {});
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);

            frameIntervalRef.current = window.setInterval(() => {
              if (isCameraActive && videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                if (ctx && video.videoWidth > 0) {
                  canvas.width = video.videoWidth;
                  canvas.height = video.videoHeight;
                  ctx.drawImage(video, 0, 0);
                  const base64Data = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
                  sessionPromise.then(session => {
                    session.sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } });
                  }).catch(() => {});
                }
              }
            }, 1000); 
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => endVoiceCall(),
          onerror: () => endVoiceCall()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: SHARED_VOICE } } },
          systemInstruction: getSystemInstruction(lang, products, aboutInfo)
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) { console.error(err); }
  }, [lang, products, aboutInfo, endVoiceCall, isCameraActive, facingMode]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  return (
    <section id="ai-assistant" className="py-20 bg-white dark:bg-[#020617] px-4 sm:px-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/[0.03] blur-[120px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-10 lg:space-y-12">
            <div className="space-y-6 text-center lg:text-left">
              <span className="inline-block text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px] bg-emerald-500/10 px-6 py-2.5 rounded-full border border-emerald-500/20 mb-4">{t.title}</span>
              <h2 className="text-5xl lg:text-8xl font-black leading-tight tracking-tighter text-slate-900 dark:text-white">
                Simosh <span className="text-emerald-600">AI</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg lg:text-2xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">{t.desc}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={isCalling ? endVoiceCall : startVoiceCall}
                className={`flex-1 px-12 py-7 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-5 text-xs ${isCalling ? 'bg-red-500 text-white' : 'bg-slate-900 dark:bg-emerald-600 text-white hover:scale-105 active:scale-95'}`}
              >
                 <i className={`fas ${isCalling ? 'fa-phone-slash' : 'fa-phone-alt'} text-xl`}></i>
                 {isCalling ? t.endCall : t.voiceCall}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#0b121d] rounded-[3.5rem] lg:rounded-[4rem] overflow-hidden shadow-2xl flex flex-col h-[650px] lg:h-[750px] relative border border-slate-100 dark:border-white/5 backdrop-blur-3xl">
            {/* Header */}
            <div className="bg-emerald-600 p-6 lg:p-8 flex items-center justify-between">
              <div className="flex items-center gap-4 lg:gap-5">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white/20 rounded-2xl lg:rounded-[1.5rem] flex items-center justify-center relative">
                  <i className="fas fa-robot text-white text-2xl lg:text-3xl"></i>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-[3px] border-emerald-600 rounded-full"></div>
                </div>
                <div>
                  <span className="font-black text-white text-lg lg:text-xl block">Simosh AI</span>
                  <span className="text-[10px] text-emerald-100 uppercase tracking-widest font-bold opacity-80">Online Expert</span>
                </div>
              </div>
            </div>
            
            {/* Voice Call Overlay */}
            {isCalling && (
              <div className="absolute inset-0 z-50 bg-emerald-950/95 flex flex-col items-center justify-center p-8 lg:p-12 text-center animate-in fade-in duration-700">
                <div className="relative mb-12 w-full flex flex-col items-center">
                   {isCameraActive ? (
                     <div className="w-64 h-80 lg:w-80 lg:h-[400px] bg-black rounded-[3rem] overflow-hidden shadow-3xl border-2 border-emerald-500/30 relative">
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className={`w-full h-full object-cover video-container ${facingMode === 'user' ? 'mirror-effect' : ''}`}
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        <div className="absolute top-4 right-4 flex flex-col gap-3">
                           <button 
                            onClick={switchCamera}
                            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center active:scale-90"
                            title={t.switchCamera}
                           >
                              <i className="fas fa-camera-rotate"></i>
                           </button>
                        </div>

                        <div className="absolute bottom-4 left-0 right-0 text-center">
                          <span className="bg-emerald-500/80 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">Live Analysis</span>
                        </div>
                     </div>
                   ) : (
                     <div className="w-48 h-48 lg:w-64 lg:h-64 bg-emerald-800 rounded-[3.5rem] lg:rounded-[4.5rem] flex items-center justify-center shadow-3xl animate-pulse">
                        <i className="fas fa-microphone text-6xl lg:text-8xl text-white"></i>
                     </div>
                   )}
                </div>

                <h3 className="text-2xl lg:text-4xl font-black text-white mb-8 tracking-tighter">{t.inCall}</h3>
                
                <div className="flex gap-6 items-center">
                  <button onClick={toggleCamera} className={`w-16 h-16 lg:w-20 lg:h-20 rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-center transition-all ${isCameraActive ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                    <i className={`fas ${isCameraActive ? 'fa-video' : 'fa-video-slash'} text-xl lg:text-2xl`}></i>
                  </button>
                  <button onClick={endVoiceCall} className="w-24 h-24 lg:w-28 lg:h-28 bg-red-500 text-white rounded-[2.5rem] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-red-500/40">
                    <i className="fas fa-phone-slash text-3xl lg:text-4xl"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6 lg:space-y-8 custom-scrollbar">
              {chat.messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col gap-3 max-w-[90%] lg:max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-6 lg:px-8 py-4 lg:py-5 shadow-sm text-sm lg:text-lg font-bold leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-[2rem] rounded-tr-none' 
                        : 'bg-white dark:bg-white/10 text-slate-800 dark:text-white rounded-[2rem] rounded-tl-none border border-slate-100 dark:border-white/5'
                    }`}>
                      {m.image && (
                        <div className="mb-3 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
                          <img src={m.image} alt="File" className="w-full max-h-64 object-cover" />
                        </div>
                      )}
                      {m.text && <div>{m.text}</div>}
                    </div>
                    {m.role === 'model' && (
                      <button 
                        onClick={() => handlePlayTTS(m.text, i)}
                        className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 hover:text-white transition-all ${isPlayingId === i ? 'bg-emerald-600 text-white' : ''}`}
                      >
                        <i className={`fas ${isPlayingId === i ? 'fa-spinner fa-spin' : 'fa-play-circle'} mr-2`}></i>
                        {isPlayingId === i ? t.speaking : t.listen}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {chat.isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-white/10 rounded-[2rem] rounded-tl-none px-6 py-4 flex gap-2 border border-slate-50 dark:border-white/5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className="p-4 lg:p-8 bg-white dark:bg-[#04080e] border-t border-slate-100 dark:border-white/5">
              {selectedImage && (
                <div className="mb-4 relative inline-block animate-in slide-in-from-bottom-5">
                   <img src={selectedImage} alt="Selected" className="w-20 h-20 object-cover rounded-2xl shadow-lg border-2 border-emerald-500" />
                   <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-lg">
                     <i className="fas fa-times"></i>
                   </button>
                </div>
              )}

              <div className="flex items-end gap-3 lg:gap-4 max-w-full">
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-14 h-14 lg:w-16 lg:h-16 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-emerald-400 rounded-2xl lg:rounded-[1.8rem] flex items-center justify-center hover:bg-emerald-50 transition-all shrink-0 mb-0.5">
                  <i className="fas fa-camera text-xl lg:text-2xl"></i>
                </button>

                <div className="flex-1 relative">
                  <textarea 
                    rows={1}
                    value={input} 
                    onPaste={handlePaste}
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                    }} 
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
                    placeholder={t.placeholder} 
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[1.8rem] lg:rounded-[2.5rem] px-6 lg:px-8 py-4 lg:py-6 text-slate-900 dark:text-white text-sm lg:text-lg font-bold outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none shadow-inner min-h-[56px] lg:min-h-[72px]" 
                  />
                </div>
                
                <button onClick={handleSend} disabled={chat.isLoading || (!input.trim() && !selectedImage)} className="w-14 h-14 lg:w-16 lg:h-16 bg-emerald-600 text-white rounded-2xl lg:rounded-[1.8rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-600/20 shrink-0 mb-0.5 disabled:opacity-50">
                  <i className="fas fa-paper-plane text-xl lg:text-2xl"></i>
                </button>
              </div>
              <p className="text-[8px] lg:text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] mt-3 lg:mt-4 opacity-50">AI can make mistakes. Verify important info.</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .video-container { transition: transform 0.4s ease-in-out; }
        .mirror-effect { transform: scaleX(-1); -webkit-transform: scaleX(-1); }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b98133; border-radius: 10px; }
      `}</style>
    </section>
  );
};

export default AIConsultant;
