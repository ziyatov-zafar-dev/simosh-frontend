
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
  const t = TRANSLATIONS[lang].ai;
  const [chat, setChat] = useState<ChatState>({
    messages: [
      { role: 'model', text: t.welcome }
    ],
    isLoading: false
  });
  const [input, setInput] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Voice call refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    setChat(prev => ({
      ...prev,
      messages: prev.messages.map((msg, i) => i === 0 ? { ...msg, text: t.welcome } : msg)
    }));
  }, [lang, t.welcome]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages]);

  const handleSend = async () => {
    if (!input.trim() || chat.isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setChat(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isLoading: true
    }));
    setInput('');

    const aiResponse = await getGeminiResponse([...chat.messages, userMsg], lang, products, aboutInfo);
    
    setChat(prev => ({
      ...prev,
      messages: [...prev.messages, { role: 'model', text: aiResponse }],
      isLoading: false
    }));
  };

  // --- Voice Call Implementation ---

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
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

  function createBlob(data: Float32Array): any {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  const startVoiceCall = useCallback(async () => {
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
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const ctx = outputAudioContextRef.current!;
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
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => endVoiceCall(),
          onerror: (e) => {
            console.error("Live Error:", e);
            endVoiceCall();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: getSystemInstruction(lang, products, aboutInfo)
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Mic access denied or error:", err);
      alert("Mikrofonga ruxsat berilmagan yoki xatolik yuz berdi.");
    }
  }, [lang, products, aboutInfo]);

  const endVoiceCall = useCallback(() => {
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e) {}
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setIsCalling(false);
  }, []);

  return (
    <section id="ai-assistant" className="py-20 lg:py-32 bg-emerald-900 dark:bg-[#061210] text-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-6">{t.title}</h2>
            <p className="text-emerald-100/80 text-base lg:text-lg mb-10 max-w-xl mx-auto lg:mx-0">{t.desc}</p>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col items-center lg:items-start p-4 bg-emerald-800/30 rounded-2xl border border-emerald-700/50">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center mb-4"><i className="fas fa-magic"></i></div>
                <h4 className="font-bold text-emerald-50 mb-1">{t.feature1Title}</h4>
                <p className="text-emerald-200/60 text-xs text-center lg:text-left">{t.feature1Desc}</p>
              </div>
              <div className="flex flex-col items-center lg:items-start p-4 bg-emerald-800/30 rounded-2xl border border-emerald-700/50">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center mb-4"><i className="fas fa-clock"></i></div>
                <h4 className="font-bold text-emerald-50 mb-1">{t.feature2Title}</h4>
                <p className="text-emerald-200/60 text-xs text-center lg:text-left">{t.feature2Desc}</p>
              </div>
            </div>
            
            <button 
              onClick={startVoiceCall}
              className="group relative flex items-center justify-center space-x-4 bg-white text-emerald-900 px-8 py-4 rounded-3xl font-black shadow-2xl hover:bg-emerald-50 transition-all mx-auto lg:mx-0"
            >
               <span className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center animate-pulse group-hover:scale-110 transition-transform">
                  <i className="fas fa-phone-alt"></i>
               </span>
               <span className="uppercase tracking-widest text-sm">AI bilan qo'ng'iroqlashish</span>
            </button>
          </div>

          <div className="bg-white dark:bg-emerald-950 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[500px] lg:h-[600px] relative">
            <div className="bg-emerald-600 dark:bg-emerald-800 p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="fas fa-robot text-white"></i>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-emerald-800 rounded-full"></div>
                </div>
                <div>
                  <span className="font-bold text-white block leading-none">Simosh AI</span>
                  <span className="text-[10px] text-emerald-100 uppercase tracking-widest font-bold">Online</span>
                </div>
              </div>
            </div>
            
            {/* Call Overlay */}
            {isCalling && (
              <div className="absolute inset-0 z-50 bg-emerald-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
                <div className="relative mb-12">
                   <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
                   <div className="absolute -inset-8 bg-emerald-500 rounded-full animate-ping opacity-10 [animation-delay:0.5s]"></div>
                   <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl relative">
                      <i className="fas fa-robot text-6xl text-emerald-600"></i>
                   </div>
                </div>
                <h3 className="text-2xl font-black mb-2">Simosh AI</h3>
                <p className="text-emerald-200/60 font-bold uppercase tracking-widest text-xs mb-12">Ovozli muloqotda...</p>
                
                <button 
                  onClick={endVoiceCall}
                  className="w-20 h-20 bg-red-500 text-white rounded-full shadow-2xl shadow-red-500/30 flex items-center justify-center hover:bg-red-600 hover:scale-105 active:scale-95 transition-all"
                >
                  <i className="fas fa-phone-slash text-3xl"></i>
                </button>
              </div>
            )}

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-[#0a1a16] text-gray-800 dark:text-emerald-50">
              {chat.messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-[1.5rem] px-5 py-3 ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg' : 'bg-white dark:bg-emerald-900 shadow-sm border border-gray-100 dark:border-emerald-800 rounded-tl-none'}`}>
                    <p className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              ))}
              {chat.isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-emerald-900 shadow-sm border border-gray-100 dark:border-emerald-800 rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-white dark:bg-emerald-950 border-t border-gray-100 dark:border-emerald-800 flex space-x-3">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                placeholder={t.placeholder} 
                className="flex-1 bg-gray-100 dark:bg-[#0a1a16] border-none rounded-2xl px-5 py-3 text-gray-800 dark:text-emerald-50 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              />
              <button onClick={handleSend} disabled={chat.isLoading} className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-90">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIConsultant;
