
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
  const [isPlayingId, setIsPlayingId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

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

  const handleSend = async () => {
    if (!input.trim() || chat.isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    const currentHistory = [...chat.messages, userMsg];
    
    setChat(prev => ({
      ...prev,
      messages: currentHistory,
      isLoading: true
    }));
    setInput('');

    const aiResponse = await getGeminiResponse(currentHistory, lang, products, aboutInfo);
    
    setChat(prev => ({
      ...prev,
      messages: [...currentHistory, { role: 'model', text: aiResponse }],
      isLoading: false
    }));
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
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: SHARED_VOICE },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => {
          setIsPlayingId(null);
          ctx.close();
        };
        source.start();
      } else {
        setIsPlayingId(null);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsPlayingId(null);
    }
  };

  const endVoiceCall = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close().catch(() => {});
      outputAudioContextRef.current = null;
    }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    setIsCalling(false);
  }, []);

  const startVoiceCall = useCallback(async () => {
    if (!process.env.API_KEY) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsCalling(true);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: btoa(String.fromCharCode(...new Uint8Array(int16.buffer))),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob })).catch(() => {});
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
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
    } catch (err) { console.error(err); }
  }, [lang, products, aboutInfo, endVoiceCall]);

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
                 {isCalling ? "Aloqani yakunlash" : "Ovozli muloqot"}
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
                <div className="relative mb-16">
                   <div className="w-48 h-48 lg:w-64 lg:h-64 bg-emerald-800 rounded-[3.5rem] lg:rounded-[4.5rem] flex items-center justify-center shadow-3xl animate-pulse">
                      <i className="fas fa-microphone text-6xl lg:text-8xl text-white"></i>
                   </div>
                </div>
                <h3 className="text-3xl lg:text-4xl font-black text-white mb-6">Muloqotdamiz...</h3>
                <button onClick={endVoiceCall} className="w-24 h-24 lg:w-28 lg:h-28 bg-red-500 text-white rounded-[2rem] flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                  <i className="fas fa-phone-slash text-3xl lg:text-4xl"></i>
                </button>
              </div>
            )}

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6 lg:space-y-8 custom-scrollbar">
              {chat.messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col gap-3 max-w-[90%] lg:max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-6 lg:px-8 py-4 lg:py-5 shadow-sm text-sm lg:text-lg font-bold leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-[2rem] rounded-tr-none shadow-emerald-500/10' 
                        : 'bg-white dark:bg-white/10 text-slate-800 dark:text-white rounded-[2rem] rounded-tl-none border border-slate-100 dark:border-white/5'
                    }`}>
                      {m.text}
                    </div>
                    {m.role === 'model' && (
                      <button 
                        onClick={() => handlePlayTTS(m.text, i)}
                        className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all ${isPlayingId === i ? 'bg-emerald-600 text-white' : ''}`}
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
            
            {/* Input Area - Redesigned for Mobile (Chotki Version) */}
            <div className="p-4 lg:p-8 bg-white dark:bg-[#04080e] border-t border-slate-100 dark:border-white/5">
              <div className="flex items-end gap-3 lg:gap-4 max-w-full">
                <div className="flex-1 relative">
                  <textarea 
                    rows={1}
                    value={input} 
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                    }} 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }} 
                    placeholder={t.placeholder} 
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[1.8rem] lg:rounded-[2.5rem] px-6 lg:px-8 py-4 lg:py-6 text-slate-900 dark:text-white text-sm lg:text-lg font-bold outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none shadow-inner min-h-[56px] lg:min-h-[72px]" 
                  />
                </div>
                <button 
                  onClick={handleSend} 
                  disabled={chat.isLoading || !input.trim()} 
                  className="w-14 h-14 lg:w-16 lg:h-16 bg-emerald-600 text-white rounded-2xl lg:rounded-[1.8rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-600/20 shrink-0 mb-0.5"
                >
                  <i className="fas fa-paper-plane text-xl lg:text-2xl"></i>
                </button>
              </div>
              <p className="text-[8px] lg:text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] mt-3 lg:mt-4 opacity-50">AI can make mistakes. Verify important info.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIConsultant;
