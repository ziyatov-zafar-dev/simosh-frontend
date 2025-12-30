
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import AIConsultant from './components/AIConsultant';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { Product, CartItem, Language, AboutInfo } from './types';
import { PRODUCTS, TRANSLATIONS } from './constants';
import { fetchLogo } from './logoService';
import { fetchAboutInfo } from './aboutService';
import { fetchActiveProducts } from './productService';
import { sendOrderToTelegram } from './telegramService';
import { createOrder } from './statisticsService';
import { formatFullPhone, formatDisplayPhone } from './utils';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('uz');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isVerified, setIsVerified] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('simosh_verified') === 'true';
    }
    return false;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [countryCode, setCountryCode] = useState('+998');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    description: ''
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);
  const [currentHash, setCurrentHash] = useState<string>(window.location.hash || '#/home');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    // @ts-ignore
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) {
        setFormData(prev => ({
          ...prev,
          firstName: tg.initDataUnsafe.user.first_name || '',
          lastName: tg.initDataUnsafe.user.last_name || ''
        }));
      }
    }
  }, []);

  const t = TRANSLATIONS[lang] || TRANSLATIONS['uz'];

  const navigate = useCallback((path: string) => {
    const formattedPath = path.startsWith('#') ? path : `#${path}`;
    window.location.hash = formattedPath;
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
    setShowCheckoutForm(false);
    setIsOrderSubmitted(false);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [logo, about, products] = await Promise.all([
          fetchLogo().catch(() => null),
          fetchAboutInfo().catch(() => null),
          fetchActiveProducts().catch(() => [])
        ]);
        if (logo) setLogoUrl(logo);
        if (about) setAboutInfo(about);
        setActiveProducts(products && products.length > 0 ? products : PRODUCTS);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const handleRemoveOne = useCallback((productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.id !== productId);
    });
  }, []);

  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.price * item.quantity), 0), [cart]);

  const handlePhoneChange = (val: string) => {
    const formatted = formatDisplayPhone(countryCode, val);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) return;
    setIsSubmitting(true);
    
    const orderItems = cart.map(item => ({ productId: item.id, quantity: item.quantity }));
    await createOrder({
      items: orderItems,
      status: "IN_PROGRESS",
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formatFullPhone(countryCode, formData.phone),
      description: formData.description
    });

    const success = await sendOrderToTelegram(formData, cart, cartTotal, lang);
    setIsSubmitting(false);
    if (success) {
      setIsOrderSubmitted(true);
      setCart([]);
    }
  };

  const handleVerify = () => {
    setIsVerified(true);
    localStorage.setItem('simosh_verified', 'true');
  };

  if (isInitialLoading) return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center gap-8">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-emerald-500/10 rounded-full"></div>
        <div className="w-24 h-24 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 shadow-[0_0_30px_rgba(16,185,129,0.2)]"></div>
        <i className="fas fa-leaf text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl"></i>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-white font-black tracking-[0.5em] uppercase text-xs">Simosh</h2>
        <div className="h-0.5 w-12 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );

  if (!isVerified) {
    const vt = TRANSLATIONS[lang]?.verify || TRANSLATIONS['uz'].verify;
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_60%)] overflow-hidden font-sans">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full -mr-96 -mt-96 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -ml-64 -mb-64"></div>

        <div className="w-full max-w-[420px] space-y-12 text-center animate-in fade-in slide-in-from-bottom-12 duration-1000 relative z-10">
          <div className="relative mx-auto w-40 h-40">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-[3rem] blur-2xl animate-pulse"></div>
            <div className="relative w-full h-full bg-[#0b121d] rounded-[3.5rem] border border-white/10 flex items-center justify-center shadow-2xl shadow-emerald-500/20 group transform hover:rotate-6 transition-transform duration-700">
               <i className="fas fa-shield-halved text-6xl text-emerald-500"></i>
               <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center border-4 border-[#020617] text-white text-xs">
                 <i className="fas fa-check"></i>
               </div>
            </div>
          </div>
          
          <div className="space-y-6 px-4">
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight">
              {vt.welcome}
            </h1>
            <p className="text-slate-400 font-medium text-lg leading-relaxed opacity-90">
              {vt.desc}
            </p>
          </div>

          <div className="px-4">
            <button 
              onClick={handleVerify}
              className="w-full group relative bg-emerald-600 hover:bg-emerald-700 py-7 rounded-[2.5rem] flex items-center justify-center gap-5 transition-all shadow-[0_30px_60px_rgba(16,185,129,0.3)] active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <i className="fas fa-fingerprint text-2xl relative z-10 text-emerald-100"></i>
              <span className="font-black text-white uppercase tracking-[0.3em] text-[13px] relative z-10">{vt.btnLabel}</span>
              <div className="absolute right-8 opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-700">
                <i className="fas fa-arrow-right"></i>
              </div>
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] opacity-50">
            <span className="w-8 h-px bg-slate-800"></span>
            <span>Premium Security</span>
            <span className="w-8 h-px bg-slate-800"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${theme === 'dark' ? 'bg-[#020617] text-white' : 'bg-[#fdfbf7] text-slate-900'}`}>
      <Navbar logoUrl={logoUrl} cartCount={cart.length} lang={lang} theme={theme} currentPath={currentHash} onLangChange={setLang} onThemeToggle={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} onCartClick={() => setIsCartOpen(true)} onNavigate={navigate} />
      
      <main className="pt-20 lg:pt-24 min-h-screen">
        {currentHash.includes('/products') ? (
          <section className="py-20 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-24 space-y-6 animate-in fade-in slide-in-from-top-10 duration-1000">
              <span className="inline-block text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.5em] text-[10px] lg:text-xs bg-emerald-500/10 px-6 py-2.5 rounded-full border border-emerald-500/20 shadow-sm">{t.products.desc}</span>
              <h2 className="text-5xl lg:text-8xl font-black tracking-tighter text-slate-950 dark:text-white leading-[1.1]">{t.products.title}</h2>
              <div className="w-24 h-2 bg-emerald-500 rounded-full mx-auto shadow-lg shadow-emerald-500/20"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
              {activeProducts.map(p => <ProductCard key={p.id} product={p} lang={lang} quantity={cart.find(i => i.id === p.id)?.quantity || 0} onAddToCart={handleAddToCart} onRemoveOne={handleRemoveOne} />)}
            </div>
          </section>
        ) : currentHash.includes('/about') ? <AboutSection lang={lang} aboutInfo={aboutInfo} logoUrl={logoUrl} /> : 
           currentHash.includes('/contact') ? <ContactSection lang={lang} aboutInfo={aboutInfo} /> : 
           currentHash.includes('/simosh-ai') ? <AIConsultant lang={lang} products={activeProducts} aboutInfo={aboutInfo} /> : 
           <Hero lang={lang} aboutInfo={aboutInfo} onNavigate={navigate} />}
      </main>

      <Footer lang={lang} aboutInfo={aboutInfo} logoUrl={logoUrl} onNavigate={navigate} />

      {/* Cart Drawer Redesign */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeCart}></div>
          <div className="relative w-full max-w-[500px] bg-white dark:bg-[#030712] h-full shadow-[0_0_100px_rgba(0,0,0,0.4)] flex flex-col animate-in slide-in-from-right duration-700 border-l border-slate-100 dark:border-white/10">
            <div className="p-8 lg:p-12 flex justify-between items-center border-b border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-emerald-950/20">
              <div className="flex flex-col">
                <span className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.5em] mb-1">Simosh Shop</span>
                <h2 className="text-3xl lg:text-4xl font-black text-slate-950 dark:text-white tracking-tighter uppercase">{showCheckoutForm ? t.cart.checkout : t.cart.title}</h2>
              </div>
              <button onClick={closeCart} className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-white/5 text-slate-400 dark:text-white hover:text-emerald-500 hover:rotate-90 transition-all border border-slate-100 dark:border-white/10 shadow-lg text-4xl">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
              {isOrderSubmitted ? (
                <div className="text-center py-20 animate-in zoom-in duration-700">
                  <div className="w-40 h-40 bg-emerald-500/10 rounded-[4rem] flex items-center justify-center mx-auto mb-12 shadow-[0_0_60px_rgba(16,185,129,0.2)]">
                    <i className="fas fa-check-double text-7xl text-emerald-500 animate-pulse"></i>
                  </div>
                  <h3 className="text-4xl font-black mb-6 text-slate-900 dark:text-white tracking-tighter">{t.cart.success}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-14 leading-relaxed text-xl font-medium px-6">{t.cart.successDesc}</p>
                  <button onClick={closeCart} className="w-full bg-emerald-600 text-white py-7 rounded-[2.5rem] font-black uppercase tracking-[0.3em] shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all text-xs">{t.cart.start}</button>
                </div>
              ) : showCheckoutForm ? (
                <form onSubmit={handleCheckoutSubmit} className="space-y-12">
                  <div className="grid gap-12">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em] ml-4">{t.cart.form.firstName}</label>
                      <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="..." className="w-full bg-slate-50 dark:bg-white/5 p-7 rounded-[2.5rem] outline-none focus:ring-8 focus:ring-emerald-500/10 text-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-emerald-500/40 transition-all text-xl shadow-inner" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em] ml-4">{t.cart.form.lastName}</label>
                      <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="..." className="w-full bg-slate-50 dark:bg-white/5 p-7 rounded-[2.5rem] outline-none focus:ring-8 focus:ring-emerald-500/10 text-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-emerald-500/40 transition-all text-xl shadow-inner" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em] ml-4">{t.cart.form.phone}</label>
                      <div className="flex gap-4">
                        <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="bg-slate-50 dark:bg-white/5 p-7 rounded-[2rem] text-slate-900 dark:text-white border-2 border-transparent font-black outline-none cursor-pointer text-lg shadow-inner">
                          <option value="+998">🇺🇿 +998</option>
                          <option value="+90">🇹🇷 +90</option>
                        </select>
                        <input required type="tel" value={formData.phone} onChange={e => handlePhoneChange(e.target.value)} placeholder="90 123 45 67" className="flex-1 bg-slate-50 dark:bg-white/5 p-7 rounded-[2rem] outline-none text-slate-900 dark:text-white font-black border-2 border-transparent focus:border-emerald-500/40 transition-all text-xl shadow-inner" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em] ml-4">{t.cart.form.description}</label>
                      <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="..." rows={4} className="w-full bg-slate-50 dark:bg-white/5 p-8 rounded-[3rem] outline-none text-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-emerald-500/40 transition-all text-xl resize-none shadow-inner" />
                    </div>
                  </div>
                  <div className="pt-8">
                    <button disabled={isSubmitting} className="w-full py-8 bg-emerald-600 text-white font-black rounded-[3rem] hover:bg-emerald-700 transition-all flex items-center justify-center shadow-[0_30px_60px_rgba(16,185,129,0.3)] uppercase tracking-[0.4em] text-xs">
                      {isSubmitting ? <i className="fas fa-spinner fa-spin mr-4 text-2xl"></i> : <i className="fas fa-check-circle mr-4 text-xl"></i>}
                      {isSubmitting ? '...' : t.cart.confirm}
                    </button>
                    <button type="button" onClick={() => setShowCheckoutForm(false)} className="w-full text-center mt-10 text-slate-400 font-black uppercase tracking-[0.3em] text-[11px] hover:text-emerald-500 transition-colors">{t.cart.back}</button>
                  </div>
                </form>
              ) : cart.length === 0 ? (
                <div className="text-center py-32 flex flex-col items-center">
                  <div className="w-48 h-48 bg-slate-50 dark:bg-white/5 rounded-[4rem] flex items-center justify-center mb-12 shadow-inner group">
                    <i className="fas fa-shopping-basket text-8xl text-slate-200 dark:text-white/10 group-hover:scale-110 transition-all duration-700"></i>
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-slate-900 dark:text-white uppercase tracking-wider">{t.cart.empty}</h3>
                  <p className="text-slate-400 font-medium text-lg mb-14 px-8 leading-relaxed">{t.cart.emptyDesc}</p>
                  <button onClick={() => { closeCart(); navigate('/products'); }} className="bg-emerald-600 text-white px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all active:scale-95 shadow-2xl shadow-emerald-600/20 text-xs">{t.cart.start}</button>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-8 p-8 bg-slate-50/50 dark:bg-white/5 rounded-[3rem] border border-slate-100 dark:border-white/10 group transition-all hover:bg-white dark:hover:bg-emerald-950/20 hover:shadow-2xl hover:border-emerald-500/20">
                      <div className="w-28 h-28 rounded-[2rem] overflow-hidden shadow-2xl shrink-0 border border-white dark:border-white/10">
                        <img src={item.image} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" />
                      </div>
                      <div className="flex-1 space-y-5">
                        <div className="flex justify-between items-start">
                          <h4 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight leading-tight">{item.name[lang]}</h4>
                          <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-red-500 transition-colors p-2 text-xl"><i className="fas fa-trash-alt"></i></button>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-emerald-600 dark:text-emerald-400 font-black text-xl tracking-tight">{item.price.toLocaleString()} <span className="text-xs opacity-60">UZS</span></p>
                          <div className="flex items-center bg-white dark:bg-[#030712] rounded-[1.5rem] p-1.5 shadow-xl border border-slate-100 dark:border-white/10">
                            <button onClick={() => handleRemoveOne(item.id)} className="w-11 h-11 flex items-center justify-center text-slate-900 dark:text-white hover:bg-emerald-500 hover:text-white rounded-[1.2rem] transition-all font-black text-xl">-</button>
                            <span className="w-12 text-center text-xl font-black text-slate-900 dark:text-white">{item.quantity}</span>
                            <button onClick={() => handleAddToCart(item)} className="w-11 h-11 flex items-center justify-center text-slate-900 dark:text-white hover:bg-emerald-500 hover:text-white rounded-[1.2rem] transition-all font-black text-xl">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!isOrderSubmitted && !showCheckoutForm && cart.length > 0 && (
              <div className="p-10 lg:p-14 border-t border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-emerald-950/40 backdrop-blur-3xl">
                <div className="flex justify-between items-center mb-12">
                  <span className="font-black text-slate-400 uppercase tracking-[0.4em] text-[11px]">{t.cart.total}</span>
                  <span className="text-4xl lg:text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">{cartTotal.toLocaleString()} <span className="text-base font-bold ml-1 opacity-70 uppercase tracking-widest">UZS</span></span>
                </div>
                <button onClick={() => setShowCheckoutForm(true)} className="w-full py-8 bg-emerald-600 text-white font-black rounded-[3rem] text-xs hover:bg-emerald-700 transition-all shadow-[0_30px_60px_rgba(16,185,129,0.3)] uppercase tracking-[0.4em] relative group overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <span className="relative z-10">{t.cart.checkout}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
