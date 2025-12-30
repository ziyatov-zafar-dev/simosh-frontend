
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
    <footer className="bg-emerald-950 dark:bg-[#040d0c] text-emerald-200 py-16 px-4 sm:px-6 lg:px-8 border-t border-emerald-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-emerald-900/50 pb-12 mb-12">
          {/* Brand Column */}
          <div className="sm:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-emerald-600 rounded-full flex items-center justify-center text-white mr-5 shadow-2xl overflow-hidden border-2 border-emerald-500/20">
                {logoUrl ? (
                  <img src={logoUrl} alt="Simosh Logo" className="w-full h-full object-cover p-1.5" />
                ) : (
                  <i className="fas fa-leaf text-3xl"></i>
                )}
              </div>
              <span className="text-3xl lg:text-5xl font-black text-white tracking-tight uppercase">SIMOSH</span>
            </div>
            
            <div className="flex space-x-4 mb-8">
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-emerald-900/50 dark:bg-emerald-800/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-800/30">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href={telegram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-emerald-900/50 dark:bg-emerald-800/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-800/30">
                <i className="fab fa-telegram text-xl"></i>
              </a>
            </div>
          </div>

          {/* Pages Column */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">{t.pages}</h4>
            <div className="flex flex-col space-y-4 text-sm lg:text-base font-medium">
              <button onClick={() => onNavigate('/home')} className="text-left text-emerald-400/60 hover:text-emerald-300 transition-colors">{TRANSLATIONS[lang].nav.home}</button>
              <button onClick={() => onNavigate('/products')} className="text-left text-emerald-400/60 hover:text-emerald-300 transition-colors">{TRANSLATIONS[lang].nav.products}</button>
              <button onClick={() => onNavigate('/about')} className="text-left text-emerald-400/60 hover:text-emerald-300 transition-colors">{TRANSLATIONS[lang].nav.about}</button>
              <button onClick={() => onNavigate('/simosh-ai')} className="text-left text-emerald-400/60 hover:text-emerald-300 transition-colors">Simosh AI</button>
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-widest text-sm lg:text-base">{t.contact}</h4>
            <div className="flex flex-col space-y-6 text-sm lg:text-base">
              <div className="flex items-center group">
                <div className="w-6 h-6 flex items-center justify-center mr-4 text-emerald-500 group-hover:scale-110 transition-transform">
                  <i className="fas fa-phone-alt text-xl"></i>
                </div>
                <a href={`tel:${phone}`} className="text-emerald-500/80 hover:text-emerald-400 font-bold tracking-wide transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-start group">
                <div className="w-6 h-6 flex items-center justify-center mr-4 mt-0.5 text-emerald-500 group-hover:scale-110 transition-transform shrink-0">
                  <i className="fas fa-location-dot text-xl"></i>
                </div>
                <span className="text-emerald-500/80 font-bold tracking-wide leading-relaxed">
                  {address}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs lg:text-sm text-emerald-700 font-medium">
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} Simosh. {t.rights}</p>
          <div className="flex space-x-6">
            <button className="hover:text-emerald-500">Maxfiylik siyosati</button>
            <button className="hover:text-emerald-400">Foydalanish shartlari</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
