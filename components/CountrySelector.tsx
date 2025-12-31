
import React, { useState, useRef, useEffect } from 'react';

interface CountryOption {
  code: string;
  label: string;
  flag: string;
}

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const countries: CountryOption[] = [
  { code: '+998', label: 'UZ', flag: '🇺🇿' },
  { code: '+90', label: 'TR', flag: '🇹🇷' },
];

const CountrySelector: React.FC<CountrySelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find(c => c.code === value) || countries[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-full bg-slate-50 dark:bg-white/5 px-5 lg:px-6 rounded-[1.5rem] lg:rounded-[2rem] flex items-center gap-3 border-2 border-transparent hover:border-emerald-500/30 transition-all shadow-inner group"
      >
        <span className="text-xl lg:text-2xl">{selectedCountry.flag}</span>
        <span className="font-black dark:text-white text-sm lg:text-base tracking-tighter">{selectedCountry.code}</span>
        <i className={`fas fa-chevron-down text-[10px] text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-48 bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-3xl border border-slate-100 dark:border-white/10 p-2 z-[110] animate-in fade-in zoom-in duration-200 backdrop-blur-xl">
          {countries.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                onChange(c.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                value === c.code 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 scale-[1.02]' 
                  : 'hover:bg-slate-50 dark:hover:bg-white/5 dark:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{c.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{c.label}</span>
                  <span className="font-black tracking-tight">{c.code}</span>
                </div>
              </div>
              {value === c.code && <i className="fas fa-check-circle text-xs"></i>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
