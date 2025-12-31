
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavbarProps {
  logoUrl: string | null;
  cartCount: number;
  lang: Language;
  theme: 'light' | 'dark';
  currentPath: string;
  onLangChange: (l: Language) => void;
  onThemeToggle: () => void;
  onCartClick: () => void;
  onNavigate: (path: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  logoUrl, cartCount, lang, theme, onLangChange, onThemeToggle, onCartClick, onNavigate 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const t = TRANSLATIONS[lang]?.nav || TRANSLATIONS['uz'].nav;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: 'UZ', flag: '🇺🇿' },
    { code: 'tr', label: 'TR', flag: '🇹🇷' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'ru', label: 'RU', flag: '🇷🇺' },
  ];

  const currentHash = window.location.hash || '#/home';

  const NavLink = ({ path, label }: { path: string; label: string }) => {
    const active = currentHash.includes(path);
    return (
      <button 
        onClick={() => { onNavigate(path); setIsMenuOpen(false); }}
        className={`px-5 py-2.5 rounded-full text-[13px] font-bold uppercase tracking-widest transition-all duration-300 ${
          active 
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105' 
            : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] px-4 py-4 lg:py-6 transition-all duration-500`}>
      <nav className={`max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-10 py-3 rounded-[2.5rem] transition-all duration-500 border ${isScrolled ? 'premium-glass shadow-2xl' : 'bg-white/80 dark:bg-black/30 backdrop-blur-md border-transparent'}`}>
        
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('/home')}>
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-600 rounded-[1.2rem] flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform overflow-hidden">
            {logoUrl ? <img src={logoUrl} className="w-full h-full object-cover" alt="Logo" /> : <i className="fas fa-leaf text-white text-xl"></i>}
          </div>
          <span className="text-xl lg:text-2xl font-black tracking-tighter dark:text-white uppercase">Simosh</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100/50 dark:bg-white/5 p-1 rounded-full border border-white/10">
          <NavLink path="/home" label={t.home} />
          <NavLink path="/products" label={t.products} />
          <NavLink path="/about" label={t.about} />
          <NavLink path="/contact" label={t.contact} />
          <NavLink path="/simosh-ai" label="AI" />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 lg:gap-3">
          
          <button 
            onClick={onThemeToggle} 
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-all relative group/theme border border-transparent dark:border-white/5 overflow-hidden"
            title={theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim'}
          >
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out transform ${
              theme === 'dark' ? 'scale-110 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-180'
            }`}>
              <img 
                src="https://cdn-icons-png.flaticon.com/512/4814/4814268.png" 
                alt="Sun" 
                className="w-6 h-6 lg:w-8 lg:h-8 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" 
              />
            </div>
            <i className={`fas fa-moon absolute text-lg lg:text-xl text-indigo-600 transition-all duration-700 ease-out transform ${
              theme === 'light' ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-180'
            }`}></i>
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-all border border-transparent dark:border-white/5"
            >
              <span className="text-lg lg:text-xl">{languages.find(l => l.code === lang)?.flag}</span>
            </button>
            {isLangOpen && (
              <div className="absolute right-0 mt-3 w-36 bg-white dark:bg-slate-900 rounded-[2rem] shadow-3xl border border-slate-100 dark:border-white/10 p-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                {languages.map(l => (
                  <button 
                    key={l.code}
                    onClick={() => { onLangChange(l.code); setIsLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-colors ${
                      lang === l.code ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-white/5 dark:text-white'
                    }`}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={onCartClick} className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-all shadow-lg active:scale-90">
            <i className="fas fa-shopping-bag text-lg"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                {cartCount}
              </span>
            )}
          </button>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center dark:text-white">
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars-staggered'}`}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[101] md:hidden p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative top-20 bg-white dark:bg-slate-900 rounded-[3rem] p-8 space-y-4 shadow-3xl animate-in slide-in-from-top-10 duration-500 border border-emerald-500/10">
            <div className="flex flex-col gap-2">
              <NavLink path="/home" label={t.home} />
              <NavLink path="/products" label={t.products} />
              <NavLink path="/about" label={t.about} />
              <NavLink path="/contact" label={t.contact} />
              <NavLink path="/simosh-ai" label="SIMOSH AI" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
