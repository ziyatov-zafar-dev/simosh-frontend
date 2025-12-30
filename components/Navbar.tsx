
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
    const current = currentPath.toLowerCase();
    const target = path.toLowerCase();
    if (target === '/home') return current === '/' || current.endsWith('/home') || current === '';
    return current.endsWith(target);
  };

  const NavLink = ({ path, label }: { path: string; label: string }) => {
    const active = isPathActive(path);
    return (
      <button 
        onClick={() => { onNavigate(path); setIsMobileMenuOpen(false); }}
        className={`font-semibold transition-all text-sm lg:text-base relative py-1 px-1 ${
          active 
            ? 'text-emerald-600 dark:text-emerald-400' 
            : 'text-emerald-900 dark:text-emerald-100 hover:text-emerald-600 dark:hover:text-emerald-400'
        }`}
      >
        {label}
        {active && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full"></span>
        )}
      </button>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[80] glass-effect border-b border-emerald-200 dark:border-emerald-800/50 transition-all duration-300 dark:bg-emerald-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 lg:h-24">
          {/* Logo */}
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('/home')}>
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white dark:bg-emerald-900 rounded-2xl flex items-center justify-center mr-3 lg:mr-4 shadow-lg group-hover:scale-105 transition-all overflow-hidden relative border border-emerald-100 dark:border-emerald-800">
              {logoUrl ? (
                <img src={logoUrl} alt="Simosh Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white">
                   <i className="fas fa-leaf text-xl lg:text-2xl"></i>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-2xl font-black text-emerald-950 dark:text-emerald-50 tracking-tight leading-none">Simosh</span>
              <span className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mt-1 hidden sm:block">Natural Care</span>
            </div>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            <NavLink path="/home" label={t.home} />
            <NavLink path="/products" label={t.products} />
            <NavLink path="/about" label={t.about} />
            <NavLink path="/simosh-ai" label="Simosh AI" />
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={onThemeToggle}
              className="p-2 rounded-xl bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-200/50 dark:hover:bg-emerald-800 transition-all border border-emerald-200 dark:border-emerald-800"
              title="Mavzuni o'zgartirish"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-base`}></i>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 px-2 lg:px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-900/50 shadow-sm hover:shadow-md transition-all group"
              >
                <span className="text-lg leading-none drop-shadow-sm transform group-hover:scale-110 transition-transform">
                  {currentLang.flag}
                </span>
                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-50 hidden sm:inline">{currentLang.label}</span>
                <i className={`fas fa-chevron-down text-[10px] text-emerald-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`}></i>
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-3 w-40 lg:w-48 bg-white dark:bg-emerald-900 rounded-2xl shadow-2xl border border-emerald-200 dark:border-emerald-800 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                  <div className="py-2">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { onLangChange(l.code); setIsLangOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-colors ${lang === l.code ? 'bg-emerald-50/50 dark:bg-emerald-800/50' : ''}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg leading-none">{l.flag}</span>
                          <span className={`font-bold ${lang === l.code ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-800 dark:text-emerald-100/70'}`}>
                            {l.nativeName}
                          </span>
                        </div>
                        {lang === l.code && <i className="fas fa-check text-[10px] text-emerald-500"></i>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button onClick={onCartClick} className="relative p-2 text-emerald-900 dark:text-emerald-300 hover:text-emerald-600 bg-emerald-100/50 dark:bg-emerald-900/50 rounded-xl transition-all hover:scale-105 border border-emerald-200 dark:border-emerald-800">
              <i className="fas fa-shopping-basket text-base lg:text-lg"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-emerald-900">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-emerald-900 dark:text-emerald-300"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-emerald-950 border-t border-emerald-100 dark:border-emerald-800 py-6 px-4 space-y-2 animate-in slide-in-from-top duration-300">
          <button onClick={() => { onNavigate('/home'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-3 text-lg font-bold ${isPathActive('/home') ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-emerald-950 dark:text-emerald-50'}`}>{t.home}</button>
          <button onClick={() => { onNavigate('/products'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-3 text-lg font-bold ${isPathActive('/products') ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-emerald-950 dark:text-emerald-50'}`}>{t.products}</button>
          <button onClick={() => { onNavigate('/about'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-3 text-lg font-bold ${isPathActive('/about') ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-emerald-950 dark:text-emerald-50'}`}>{t.about}</button>
          <button onClick={() => { onNavigate('/simosh-ai'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-3 text-lg font-bold ${isPathActive('/simosh-ai') ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-emerald-950 dark:text-emerald-50'}`}>Simosh AI</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
