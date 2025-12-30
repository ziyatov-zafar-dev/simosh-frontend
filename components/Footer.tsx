
import React from 'react';
import { Language, AboutInfo } from '../types';
import { TRANSLATIONS } from '../constants';

interface FooterProps {
  lang: Language;
  aboutInfo: AboutInfo | null;
  logoUrl: string | null;
  onNavigate: (path: string) => void;
}

const Footer: React.FC<FooterProps> = ({ lang, aboutInfo, logoUrl, onNavigate }) => {
  const t = TRANSLATIONS[lang].footer;
  
  const address = aboutInfo ? (
    lang === 'uz' ? aboutInfo.officeAddressUz :
    lang === 'ru' ? aboutInfo.officeAddressRu :
    lang === 'tr' ? aboutInfo.officeAddressTr :
    aboutInfo.officeAddressEn
  ) : 'Toshkent sh, Chilonzor tumani';

  const phone = aboutInfo?.phone || '+998 90 123 45 67';
  const instagram = aboutInfo?.instagram || '#';
  const telegram = aboutInfo?.telegram || '#';

  return (
    <footer className="bg-emerald-950 dark:bg-[#040d0c] text-emerald-200 py-12 lg:py-20 px-4 sm:px-6 lg:px-8 border-t border-emerald-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-b border-emerald-900/40 pb-12 mb-10">
          
          {/* Brand Column */}
          <div className="sm:col-span-2 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center mb-6">
              <div className="w-20 h-20 bg-white dark:bg-emerald-900 rounded-2xl flex items-center justify-center sm:mr-5 mb-4 sm:mb-0 overflow-hidden border border-emerald-100 dark:border-emerald-800 group hover:scale-105 transition-transform duration-500 shadow-lg">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="Simosh Logo" 
                    className="w-full h-full object-cover rounded-2xl" 
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white">
                    <i className="fas fa-leaf text-3xl"></i>
                  </div>
                )}
              </div>
              <div>
                <span className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase block">SIMOSH</span>
                <span className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] block mt-1">Natural Healing</span>
              </div>
            </div>
            
            <p className="text-emerald-300/60 max-w-md mb-8 text-sm lg:text-base leading-relaxed">
              {t.mission}
            </p>

            <div className="flex space-x-3 justify-center sm:justify-start">
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-emerald-900/40 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-all flex items-center justify-center border border-emerald-800/30 group">
                <i className="fab fa-instagram text-xl group-hover:scale-110"></i>
              </a>
              <a href={telegram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-emerald-900/40 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-all flex items-center justify-center border border-emerald-800/30 group">
                <i className="fab fa-telegram-plane text-xl group-hover:scale-110"></i>
              </a>
            </div>
          </div>

          {/* Pages Column */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-black mb-8 uppercase tracking-widest text-xs lg:text-sm">{t.pages}</h4>
            <nav className="flex flex-col space-y-4 text-sm lg:text-base font-semibold">
              <button onClick={() => onNavigate('/home')} className="text-emerald-400/50 hover:text-white transition-colors block">{TRANSLATIONS[lang].nav.home}</button>
              <button onClick={() => onNavigate('/products')} className="text-emerald-400/50 hover:text-white transition-colors block">{TRANSLATIONS[lang].nav.products}</button>
              <button onClick={() => onNavigate('/about')} className="text-emerald-400/50 hover:text-white transition-colors block">{TRANSLATIONS[lang].nav.about}</button>
              <button onClick={() => onNavigate('/simosh-ai')} className="text-emerald-400/50 hover:text-white transition-colors block">Simosh AI</button>
            </nav>
          </div>

          {/* Contact Column */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-black mb-8 uppercase tracking-widest text-xs lg:text-sm">{t.contact}</h4>
            <div className="flex flex-col space-y-6 items-center sm:items-start">
              <div className="flex items-center group">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/40 flex items-center justify-center text-emerald-500 mr-4 group-hover:bg-emerald-600 group-hover:text-white transition-all border border-emerald-800/20">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <a href={`tel:${phone}`} className="text-emerald-50 font-bold hover:text-emerald-400 transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-start group text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/40 flex items-center justify-center text-emerald-500 mr-4 group-hover:bg-emerald-600 group-hover:text-white transition-all border border-emerald-800/20 shrink-0">
                  <i className="fas fa-location-dot"></i>
                </div>
                <span className="text-emerald-200/70 font-medium text-sm leading-snug">
                  {address}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[11px] lg:text-xs text-emerald-700 font-bold uppercase tracking-widest text-center">
          <p className="mb-6 md:mb-0">&copy; {new Date().getFullYear()} Simosh. {t.rights}</p>
          <div className="flex space-x-6">
            <button className="hover:text-emerald-400 transition-colors">Maxfiylik</button>
            <button className="hover:text-emerald-400 transition-colors">Foydalanish shartlari</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
