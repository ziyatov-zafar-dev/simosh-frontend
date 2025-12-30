
import React from 'react';
import { Language, AboutInfo } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeroProps {
  lang: Language;
  aboutInfo: AboutInfo | null;
  onNavigate: (path: string) => void;
}

const Hero: React.FC<HeroProps> = ({ lang, aboutInfo, onNavigate }) => {
  const t = TRANSLATIONS[lang].hero;

  const description = aboutInfo ? (
    lang === 'uz' ? aboutInfo.descriptionUz :
    lang === 'ru' ? aboutInfo.descriptionRu :
    lang === 'tr' ? aboutInfo.descriptionTr :
    aboutInfo.descriptionEn
  ) : t.desc;

  return (
    <section className="relative pt-16 lg:pt-32 pb-24 lg:pb-40 overflow-hidden px-6 lg:px-12 font-sans bg-white dark:bg-[#020617]">
      {/* Dynamic light sources */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/[0.07] blur-[150px] rounded-full -mr-96 -mt-96 animate-pulse duration-[8s]"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          <div className="text-center lg:text-left animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-3 bg-emerald-500/10 px-6 py-2.5 rounded-full border border-emerald-500/20 mb-10">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="text-[10px] lg:text-xs font-black tracking-[0.3em] text-emerald-600 dark:text-emerald-400 uppercase">
                {t.badge}
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-slate-950 dark:text-white leading-[0.9] tracking-tighter mb-10">
              {t.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-emerald-400 dark:to-emerald-600">
                {t.titleAccent}
              </span>
            </h1>
            
            <p className="text-lg lg:text-2xl text-slate-500 dark:text-slate-400 mb-14 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {description}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5">
              <button 
                onClick={() => onNavigate('/products')} 
                className="px-14 py-7 bg-emerald-600 text-white font-black rounded-[2rem] shadow-[0_30px_60px_rgba(16,185,129,0.3)] hover:bg-emerald-700 hover:-translate-y-1 active:scale-95 transition-all uppercase text-[11px] tracking-[0.2em]"
              >
                {t.buy}
              </button>
              
              <button 
                onClick={() => onNavigate('/simosh-ai')} 
                className="px-14 py-7 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-[2rem] shadow-xl hover:-translate-y-1 active:scale-95 transition-all uppercase text-[11px] tracking-[0.2em]"
              >
                {t.ai}
              </button>
            </div>
          </div>
          
          <div className="relative animate-in zoom-in duration-1000">
            {/* Squircle Image Frame */}
            <div className="relative group">
              <div className="absolute -inset-10 bg-emerald-500/5 rounded-[6rem] rotate-6 group-hover:rotate-0 transition-transform duration-1000 blur-2xl"></div>
              
              <div className="relative max-w-lg mx-auto aspect-square bg-slate-100 dark:bg-white/5 rounded-[5rem] lg:rounded-[7rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-8 border-white dark:border-white/5 transform -rotate-3 group-hover:rotate-0 transition-all duration-700">
                 <img 
                   src="https://picsum.photos/seed/simosh-hero-soap/1000/1000" 
                   alt="Simosh Natural" 
                   className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              {/* Float Decorative Card */}
              <div className="absolute -bottom-10 -right-4 lg:-right-10 bg-white dark:bg-[#0b121d] p-8 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-white/10 hidden sm:flex items-center gap-6">
                  <div className="w-16 h-16 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center text-white text-3xl">
                    <i className="fas fa-seedling"></i>
                  </div>
                  <div className="pr-6">
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest leading-none mb-2">Simosh</p>
                    <p className="text-2xl font-black text-slate-950 dark:text-white leading-none tracking-tight">Pure Organic</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
