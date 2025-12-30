
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
    <section className="relative pt-12 lg:pt-24 pb-16 lg:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-full lg:w-1/2 h-full opacity-10 dark:opacity-5">
        <img src="https://picsum.photos/seed/heronature/1200/1200" alt="background" className="object-cover w-full h-full rounded-bl-[100px]" />
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6 lg:mb-8">
              <span className="px-4 py-1.5 text-xs lg:text-sm font-bold tracking-wide text-emerald-800 dark:text-emerald-300 uppercase bg-emerald-200 dark:bg-emerald-900/60 rounded-full border border-emerald-300 dark:border-emerald-800">
                {t.badge}
              </span>
              <div className="flex items-center bg-white dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-full shadow-sm">
                <span className="text-lg mr-2 leading-none">🇺🇿</span>
                <span className="text-[10px] lg:text-[11px] font-extrabold text-emerald-900 dark:text-emerald-200 uppercase tracking-tighter">Premium Quality</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-tight mb-6 lg:mb-8">
              {t.title} <br />
              <span className="text-emerald-700 dark:text-emerald-400">{t.titleAccent}</span>
            </h1>
            <p className="text-base lg:text-xl text-slate-700 dark:text-emerald-100/70 mb-8 lg:mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 lg:gap-6">
              <button onClick={() => onNavigate('/products')} className="inline-flex items-center justify-center px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 hover:-translate-y-1 transition-all">
                {t.buy}
              </button>
              <button onClick={() => onNavigate('/simosh-ai')} className="inline-flex items-center justify-center px-10 py-4 border-2 border-emerald-600 text-emerald-800 dark:text-emerald-300 font-bold rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-all">
                {t.ai}
              </button>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-slate-600 dark:text-emerald-300/60 font-semibold">
              <div className="flex items-center"><i className="fas fa-check-circle text-emerald-600 mr-2"></i>{t.feature1}</div>
              <div className="flex items-center"><i className="fas fa-check-circle text-emerald-600 mr-2"></i>{t.feature2}</div>
            </div>
          </div>
          
          <div className="relative order-1 lg:order-2 px-4 sm:px-12 lg:px-0">
            <div className="absolute -inset-4 lg:-inset-10 bg-emerald-200 dark:bg-emerald-800/30 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <img src="https://picsum.photos/seed/simosh-hero/800/800" alt="Simosh soaps" className="relative rounded-3xl shadow-2xl border-4 lg:border-8 border-white dark:border-emerald-900/50 transform rotate-2 hover:rotate-0 transition-transform duration-500 w-full max-w-md mx-auto" />
            
            <div className="absolute -bottom-4 lg:-bottom-8 -left-4 lg:-left-8 bg-white dark:bg-emerald-900 p-3 lg:p-5 rounded-2xl shadow-xl flex items-center space-x-3 border border-emerald-100 dark:border-emerald-800 transform -rotate-3 hover:rotate-0 transition-transform hidden sm:flex">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl lg:text-2xl">
                <i className="fas fa-award"></i>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Certified</p>
                <p className="text-xs lg:text-base font-bold text-emerald-950 dark:text-emerald-50">100% Organic</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
