
import React from 'react';
import { Language, AboutInfo } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeroProps {
  lang: Language;
  aboutInfo: AboutInfo | null;
  onNavigate: (path: string) => void;
}

const Hero: React.FC<HeroProps> = ({ lang, aboutInfo, onNavigate }) => {
  // Robust fallback for hero translations
  const t = (TRANSLATIONS[lang] && TRANSLATIONS[lang].hero) 
    ? TRANSLATIONS[lang].hero 
    : TRANSLATIONS['uz'].hero;

  const description = aboutInfo ? (
    lang === 'uz' ? aboutInfo.descriptionUz :
    lang === 'ru' ? aboutInfo.descriptionRu :
    lang === 'tr' ? aboutInfo.descriptionTr :
    aboutInfo.descriptionEn
  ) : (t.desc || '');

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden px-4">
      {/* Background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full"></div>
      <div className="absolute top-1/2 left-0 -translate-x-1/2 w-80 h-80 bg-emerald-600/5 blur-[80px] rounded-full"></div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        
        <div className="text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left duration-1000">
          <div className="inline-flex items-center gap-3 bg-white dark:bg-white/5 px-6 py-2.5 rounded-full border border-slate-200 dark:border-white/10 shadow-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-400">{t.badge}</span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.85] dark:text-white">
            {t.title} <br />
            <span className="text-gradient">
              {t.titleAccent}
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <button 
              onClick={() => onNavigate('/products')}
              className="group relative px-12 py-6 bg-emerald-600 text-white font-black rounded-3xl shadow-2xl hover:bg-emerald-700 hover:-translate-y-1 transition-all uppercase tracking-widest text-xs overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                 {t.buy} <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </span>
            </button>
            <button 
              onClick={() => onNavigate('/simosh-ai')}
              className="px-12 py-6 bg-white dark:bg-white/5 dark:text-white text-slate-900 font-black rounded-3xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
            >
              {t.ai}
            </button>
          </div>
        </div>

        <div className="relative animate-in zoom-in duration-1000">
           {/* Visual spotlight */}
           <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000"></div>
              <div className="relative z-10 aspect-square max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-[4rem] p-4 lg:p-10 shadow-3xl border border-white/50 dark:border-white/5 animate-float">
                 <img 
                   src="https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=800&q=80" 
                   className="w-full h-full object-cover rounded-[3rem] shadow-2xl"
                   alt="Simosh Natural Soap"
                 />
              </div>
              
              {/* Stats pill */}
              <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-white dark:bg-slate-800 p-6 rounded-4xl shadow-2xl z-20 flex items-center gap-5 border border-slate-100 dark:border-white/10 animate-in slide-in-from-bottom-10 duration-1000 delay-500">
                 <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-600 text-2xl">
                    <i className="fas fa-check-circle"></i>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Sifat kafolati</p>
                    <p className="text-xl font-black dark:text-white">100% Organik</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
