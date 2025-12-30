
import React from 'react';
import { Language, AboutInfo } from '../types';
import { TRANSLATIONS } from '../constants';

interface AboutSectionProps {
  lang: Language;
  aboutInfo: AboutInfo | null;
  logoUrl: string | null;
}

const AboutSection: React.FC<AboutSectionProps> = ({ lang, aboutInfo, logoUrl }) => {
  const t = TRANSLATIONS[lang].about;
  
  const desc = aboutInfo ? (
    lang === 'uz' ? aboutInfo.descriptionUz :
    lang === 'ru' ? aboutInfo.descriptionRu :
    lang === 'tr' ? aboutInfo.descriptionTr :
    aboutInfo.descriptionEn
  ) : TRANSLATIONS[lang].footer.mission;

  const addr = aboutInfo ? (
    lang === 'uz' ? aboutInfo.officeAddressUz :
    lang === 'ru' ? aboutInfo.officeAddressRu :
    lang === 'tr' ? aboutInfo.officeAddressTr :
    aboutInfo.officeAddressEn
  ) : (lang === 'uz' ? 'Toshkent shahar' : lang === 'ru' ? 'г. Ташкент' : 'Tashkent city');

  const phone = aboutInfo?.phone || '+998 90 123 45 67';
  const telegram = aboutInfo?.telegram || 'https://t.me/simosh';
  const instagram = aboutInfo?.instagram || 'https://instagram.com/simosh';

  return (
    <section id="about" className="py-20 lg:py-32 px-6 bg-white dark:bg-[#020617] relative overflow-hidden font-sans">
      {/* Background soft gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          
          {/* Chotki Logo Frame */}
          <div className="relative group animate-in zoom-in duration-1000">
            {/* Outer Decorative Squircle */}
            <div className="absolute -inset-6 bg-emerald-500/5 rounded-[5rem] rotate-3 group-hover:rotate-0 transition-transform duration-1000"></div>
            
            <div className="relative aspect-square bg-white dark:bg-[#0b121d] rounded-[4.5rem] p-12 lg:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent)]"></div>
              
              <div className="relative w-full h-full flex items-center justify-center">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="Simosh" 
                    className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <i className="fas fa-leaf text-8xl text-emerald-500"></i>
                    <span className="text-3xl font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Simosh</span>
                  </div>
                )}
              </div>

              {/* Floating Status Badge */}
              <div className="absolute top-10 right-10 flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Premium Organic</span>
              </div>
            </div>

            {/* Years Experience Badge - Chotki Version */}
            <div className="absolute -bottom-10 -left-6 bg-white dark:bg-[#1e293b] p-8 rounded-[3rem] shadow-2xl border border-slate-50 dark:border-white/10 transform -rotate-3 hover:rotate-0 transition-all duration-500">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center text-white text-3xl shadow-xl shadow-emerald-600/30">
                  <i className="fas fa-award"></i>
                </div>
                <div>
                  <div className="text-4xl font-black text-slate-950 dark:text-white tracking-tighter leading-none">10+</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-1">{t.experience}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="space-y-12 text-center lg:text-left">
            <div className="space-y-6">
              <span className="text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.4em] text-xs">
                {t.subtitle}
              </span>
              <h2 className="text-5xl lg:text-8xl font-black text-slate-950 dark:text-white tracking-tighter leading-[0.9]">
                {t.title}
              </h2>
              <p className="text-xl lg:text-3xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium pt-4">
                {desc}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-10 rounded-[3rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group transition-all hover:bg-emerald-50 dark:hover:bg-emerald-500/5">
                <div className="w-14 h-14 bg-white dark:bg-emerald-950 rounded-2xl flex items-center justify-center text-emerald-600 shadow-lg mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-location-dot"></i>
                </div>
                <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2">{t.addressLabel}</h4>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{addr}</p>
              </div>

              <div className="p-10 rounded-[3rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group transition-all hover:bg-emerald-50 dark:hover:bg-emerald-500/5">
                <div className="w-14 h-14 bg-white dark:bg-emerald-950 rounded-2xl flex items-center justify-center text-emerald-600 shadow-lg mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-phone"></i>
                </div>
                <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2">{t.phoneLabel}</h4>
                <a href={`tel:${phone}`} className="text-lg font-bold text-slate-900 dark:text-white hover:text-emerald-600">{phone}</a>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <a href={telegram} target="_blank" rel="noopener noreferrer" className="px-12 py-6 bg-slate-900 dark:bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                <i className="fab fa-telegram-plane text-lg"></i> Telegram
              </a>
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="px-12 py-6 border-2 border-slate-100 dark:border-white/10 text-slate-900 dark:text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                <i className="fab fa-instagram text-lg"></i> Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
