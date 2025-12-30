
import React, { useState } from 'react';
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
  logoUrl, cartCount, lang, theme, currentPath, onLangChange, onThemeToggle, onCartClick, onNavigate 
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang]?.nav || TRANSLATIONS['uz'].nav;

  const languages: { code: Language; label: string; flag: string; nativeName: string }[] = [
    { code: 'uz', label: 'UZB', flag: '🇺🇿', nativeName: "O'zbekcha" },
    { code: 'en', label: 'ENG', flag: '🇺🇸', nativeName: 'English' },
    { code: 'tr', label: 'TUR', flag: '🇹🇷', nativeName: 'Türkçe' },
    { code: 'ru', label: 'RUS', flag: '🇷🇺', nativeName: 'Русский' },
  ];

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  const isPathActive = (path: string) => {
    const current = currentHash.toLowerCase();
    const target = path.toLowerCase();
    if (target.includes('home')) return current === '' || current === '#/home' || current === '#/';
    return current.includes(target);
  };
  
  const currentHash = window.location.hash || '#/home';

  const NavLink = ({ path, label }: { path: string; label: string }) => {
    const active = isPathActive(path);
    return (
      <button 
        onClick={() => { onNavigate(path); setIsMobileMenuOpen(false); }}
        className={`font-black uppercase tracking-widest text-[11px] lg:text-[13px] transition-all relative py-2 px-1 ${
          active 
            ? 'text-emerald-500' 
            : 'text-slate-900 dark:text-slate-100 hover:text-emerald-500'
        }`}
      >
        {label}
        {active && (
          <span className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-full animate-in slide-in-from-left duration-300"></span>
        )}
      </button>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500">
      <div className="mx-auto px-4 sm:px-10 py-4 lg:py-6">
        <div className="max-w-7xl mx-auto h-20 lg:h-24 glass-effect dark:bg-[#030712]/80 bg-white/80 rounded-[2.5rem] lg:rounded-[3rem] border border-white/20 dark:border-white/5 shadow-2xl px-6 lg:px-10 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('/home')}>
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white dark:bg-emerald-950 rounded-2xl lg:rounded-3xl flex items-center justify-center mr-4 shadow-2xl border border-white/20 dark:border-emerald-500/10 group-hover:scale-105 transition-all overflow-hidden relative">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white">
                   <i className="fas fa-leaf text-xl lg:text-3xl"></i>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Simosh</span>
              <span className="text-[9px] lg:text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] mt-1 hidden sm:block">Natural</span>
            </div>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink path="/home" label={t.home} />
            <NavLink path="/products" label={t.products} />
            <NavLink path="/about" label={t.about} />
            <NavLink path="/contact" label={t.contact} />
            <NavLink path="/simosh-ai" label="Simosh AI" />
          </div>

          <div className="flex items-center space-x-3 lg:space-x-5">
            {/* Theme Toggle */}
            <button 
              onClick={onThemeToggle}
              className="w-11 h-11 lg:w-14 lg:h-14 rounded-2xl lg:rounded-[1.5rem] bg-slate-100 dark:bg-white/5 dark:text-emerald-400 text-slate-600 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 transition-all border border-transparent dark:border-white/5 shadow-inner flex items-center justify-center"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-base lg:text-xl`}></i>
            </button>

            {/* Lang Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-3 px-3 lg:px-5 py-2.5 lg:py-3.5 rounded-2xl lg:rounded-[1.5rem] border border-slate-100 dark:border-white/5 bg-slate-100 dark:bg-white/5 shadow-inner hover:border-emerald-500/30 transition-all"
              >
                <span className="text-xl lg:text-2xl leading-none">{currentLang.flag}</span>
                <span className="text-xs font-black text-slate-900 dark:text-white hidden lg:inline tracking-widest">{currentLang.label}</span>
                <i className={`fas fa-chevron-down text-[10px] text-emerald-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`}></i>
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-5 w-48 lg:w-56 bg-white dark:bg-[#080c14] rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-white/5 overflow-hidden animate-in fade-in slide-in-from-top-6 duration-300">
                  <div className="p-3 space-y-1">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { onLangChange(l.code); setIsLangOpen(false); }}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm transition-all ${lang === l.code ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-800 dark:text-slate-300'}`}
                      >
                        <div className="flex items-center space-x-4">
                          <span className="text-xl">{l.flag}</span>
                          <span className="font-black tracking-widest uppercase text-[10px]">{l.nativeName}</span>
                        </div>
                        {lang === l.code && <i className="fas fa-check text-[10px]"></i>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button 
              onClick={onCartClick} 
              className="relative w-11 h-11 lg:w-14 lg:h-14 bg-emerald-600 text-white rounded-2xl lg:rounded-[1.5rem] flex items-center justify-center hover:bg-emerald-700 hover:scale-105 active:scale-90 transition-all shadow-2xl shadow-emerald-600/30"
            >
              <i className="fas fa-shopping-basket text-base lg:text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black min-w-[20px] h-5 flex items-center justify-center rounded-full border-[3px] border-white dark:border-[#030712] shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-11 h-11 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars-staggered'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[90] animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-28 left-4 right-4 bg-white dark:bg-[#080c14] rounded-[3rem] border border-white/10 p-10 space-y-6 shadow-3xl animate-in slide-in-from-top-10 duration-500">
            <button onClick={() => { onNavigate('/home'); setIsMobileMenuOpen(false); }} className={`flex items-center gap-6 w-full text-left px-8 py-6 rounded-3xl text-xl font-black uppercase tracking-widest ${isPathActive('/home') ? 'bg-emerald-500 text-white' : 'text-slate-900 dark:text-slate-100'}`}>
               <i className="fas fa-home-alt w-8 text-center"></i>
               {t.home}
            </button>
            <button onClick={() => { onNavigate('/products'); setIsMobileMenuOpen(false); }} className={`flex items-center gap-6 w-full text-left px-8 py-6 rounded-3xl text-xl font-black uppercase tracking-widest ${isPathActive('/products') ? 'bg-emerald-500 text-white' : 'text-slate-900 dark:text-slate-100'}`}>
               <i className="fas fa-soap w-8 text-center"></i>
               {t.products}
            </button>
            <button onClick={() => { onNavigate('/about'); setIsMobileMenuOpen(false); }} className={`flex items-center gap-6 w-full text-left px-8 py-6 rounded-3xl text-xl font-black uppercase tracking-widest ${isPathActive('/about') ? 'bg-emerald-500 text-white' : 'text-slate-900 dark:text-slate-100'}`}>
               <i className="fas fa-info-circle w-8 text-center"></i>
               {t.about}
            </button>
            <button onClick={() => { onNavigate('/contact'); setIsMobileMenuOpen(false); }} className={`flex items-center gap-6 w-full text-left px-8 py-6 rounded-3xl text-xl font-black uppercase tracking-widest ${isPathActive('/contact') ? 'bg-emerald-500 text-white' : 'text-slate-900 dark:text-slate-100'}`}>
               <i className="fas fa-envelope-open-text w-8 text-center"></i>
               {t.contact}
            </button>
            <button onClick={() => { onNavigate('/simosh-ai'); setIsMobileMenuOpen(false); }} className={`flex items-center gap-6 w-full text-left px-8 py-6 rounded-3xl text-xl font-black uppercase tracking-widest ${isPathActive('/simosh-ai') ? 'bg-emerald-500 text-white' : 'text-slate-900 dark:text-slate-100'}`}>
               <i className="fas fa-robot w-8 text-center"></i>
               Simosh AI
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
