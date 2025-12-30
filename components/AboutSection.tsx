
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
  
  // Default qiymatlar (agar aboutInfo bo'lmasa yoki ba'zi maydonlar yetishmasa)
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
  ) : 'Toshkent shahar';

  const phone = aboutInfo?.phone || '+998 90 123 45 67';
  const telegram = aboutInfo?.telegram || 'https://t.me/simosh';
  const instagram = aboutInfo?.instagram || 'https://instagram.com/simosh';

  return (
    <section id="about" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7] dark:bg-[#061210] border-y border-emerald-100 dark:border-emerald-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 lg:mb-24">
          <h2 className="text-3xl lg:text-5xl font-black mb-6 text-slate-900 dark:text-white uppercase tracking-tight">{t.title}</h2>
          <div className="w-24 h-2 bg-emerald-500 mx-auto rounded-full mb-8"></div>
          <p className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-widest text-sm">{t.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-200/50 dark:bg-emerald-800/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-emerald-900 bg-white dark:bg-emerald-900 flex flex-col items-center justify-center p-8 lg:p-12 aspect-square">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Simosh Logo Large" 
                  className="w-full h-full object-cover rounded-[2.5rem] transform hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white rounded-[2.5rem]">
                  <i className="fas fa-leaf text-9xl opacity-20"></i>
                </div>
              )}
              
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800 shadow-xl">
                 <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl lg:text-4xl font-black text-emerald-600 block">10+</span>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{t.experience}</span>
                    </div>
                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl">
                      <i className="fas fa-medal"></i>
                    </div>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-12">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg lg:text-xl text-slate-700 dark:text-emerald-100/70 leading-relaxed font-medium whitespace-pre-wrap first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:text-emerald-600 first-letter:float-left">
                {desc}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <i className="fas fa-location-dot"></i>
                </div>
                <h4 className="font-black text-slate-900 dark:text-emerald-50 mb-2 uppercase text-xs tracking-widest">{t.addressLabel}</h4>
                <p className="text-slate-600 dark:text-emerald-200/60 text-sm font-semibold leading-relaxed">
                  {addr}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <i className="fas fa-phone"></i>
                </div>
                <h4 className="font-black text-slate-900 dark:text-emerald-50 mb-2 uppercase text-xs tracking-widest">{t.phoneLabel}</h4>
                <a href={`tel:${phone}`} className="text-lg font-black text-emerald-800 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">
                  {phone}
                </a>
              </div>

              <div className="sm:col-span-2 p-8 rounded-[2.5rem] bg-emerald-600 text-white shadow-xl shadow-emerald-100 dark:shadow-none overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl -mr-12 -mt-12 pointer-events-none">
                  <i className="fas fa-share-nodes"></i>
                </div>
                <div className="relative z-10">
                  <h4 className="font-black mb-6 uppercase text-xs tracking-widest opacity-80">{t.socialLabel}</h4>
                  <div className="flex flex-wrap gap-4">
                    <a href={telegram} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-2xl transition-all font-black text-sm active:scale-95">
                      <i className="fab fa-telegram text-xl"></i>
                      <span>Telegram</span>
                    </a>
                    <a href={instagram} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-2xl transition-all font-black text-sm active:scale-95">
                      <i className="fab fa-instagram text-xl"></i>
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
