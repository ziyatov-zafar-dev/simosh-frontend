
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import AIConsultant from './components/AIConsultant';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import CountrySelector from './components/CountrySelector';
import { Product, CartItem, Language, AboutInfo } from './types';
import { PRODUCTS, TRANSLATIONS } from './constants';
import { fetchLogo } from './logoService';
import { fetchAboutInfo } from './aboutService';
import { fetchActiveProducts } from './productService';
import { sendOrderToTelegram } from './telegramService';
import { createOrder } from './statisticsService';
import { formatFullPhone, formatDisplayPhone, isValidPhoneParts, formatPrettyPhone } from './utils';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('uz');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [countryCode, setCountryCode] = useState('+998');
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', description: '' });

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
        setTimeout(() => setIsInitialLoading(false), 1000);
      }
    };
    loadData();
  }, []);

  // Xavfsiz tarjima olish: agar tanlangan tilda bo'lim bo'lmasa, 'uz'ga qaytadi
  const t = useMemo(() => {
    const selected = TRANSLATIONS[lang] || TRANSLATIONS['uz'];
    const uz = TRANSLATIONS['uz'];
    return {
      ...uz,
      ...selected,
      products: selected.products || uz.products,
      cart: selected.cart || uz.cart,
      nav: selected.nav || uz.nav,
    };
  }, [lang]);

  const navigate = useCallback((path: string) => {
    window.location.hash = path.startsWith('#') ? path : `#${path}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash || '#/home');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const handleRemoveOne = useCallback((productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
      return prev.filter(item => item.id !== productId);
    });
  }, []);

  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.price * item.quantity), 0), [cart]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.phone || cart.length === 0) {
      alert(t.cart.form.required);
      return;
    }

    if (!isValidPhoneParts(countryCode, formData.phone)) {
      alert(t.cart.form.phoneError);
      return;
    }
    
    setIsSubmitting(true);
    const apiPhone = formatFullPhone(countryCode, formData.phone);
    const prettyPhone = formatPrettyPhone(countryCode, formData.phone);
    
    try {
      const apiSuccess = await createOrder({
        items: cart.map(i => ({ productId: i.id, quantity: i.quantity })),
        status: "IN_PROGRESS",
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: apiPhone,
        description: formData.description
      });

      if (apiSuccess) {
        await sendOrderToTelegram({ ...formData, phone: prettyPhone }, cart, cartTotal, lang).catch(console.error);
        setIsOrderSubmitted(true);
        setCart([]);
        setFormData({ firstName: '', lastName: '', phone: '', description: '' });
      } else {
        alert(t.cart.error);
      }
    } catch (error) {
      console.error("Checkout process failed:", error);
      alert(t.cart.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitialLoading) return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center gap-8 z-[200]">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
        <i className="fas fa-leaf text-emerald-500 text-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></i>
      </div>
      <span className="text-emerald-500 font-black uppercase tracking-[0.6em] text-[10px] animate-pulse">Simosh</span>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar 
        logoUrl={logoUrl} 
        cartCount={cart.length} 
        lang={lang} 
        theme={theme} 
        currentPath={currentHash} 
        onLangChange={setLang} 
        onThemeToggle={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} 
        onCartClick={() => setIsCartOpen(true)} 
        onNavigate={navigate} 
      />
      
      <main className="min-h-screen">
        {currentHash.includes('/products') ? (
          <section className="py-32 px-4 max-w-7xl mx-auto space-y-24">
            <div className="text-center space-y-6">
               <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] bg-emerald-500/10 px-6 py-2 rounded-full">{t.products.desc}</span>
               <h2 className="text-6xl lg:text-8xl font-black tracking-tight dark:text-white leading-none">{t.products.title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {activeProducts.map(p => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  lang={lang} 
                  quantity={cart.find(i => i.id === p.id)?.quantity || 0} 
                  onAddToCart={handleAddToCart} 
                  onRemoveOne={handleRemoveOne} 
                />
              ))}
            </div>
          </section>
        ) : currentHash.includes('/about') ? <AboutSection lang={lang} aboutInfo={aboutInfo} logoUrl={logoUrl} /> : 
           currentHash.includes('/contact') ? <ContactSection lang={lang} aboutInfo={aboutInfo} /> : 
           currentHash.includes('/simosh-ai') ? <AIConsultant lang={lang} products={activeProducts} aboutInfo={aboutInfo} /> : 
           <Hero lang={lang} aboutInfo={aboutInfo} onNavigate={navigate} />}
      </main>

      <Footer lang={lang} aboutInfo={aboutInfo} logoUrl={logoUrl} onNavigate={navigate} />

      {isCartOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-[500px] bg-white dark:bg-[#0b121d] h-full shadow-3xl flex flex-col animate-in slide-in-from-right duration-500 border-l dark:border-white/5">
            <div className="p-8 border-b dark:border-white/5 flex items-center justify-between">
              <h2 className="text-3xl font-black tracking-tight dark:text-white uppercase">{showCheckoutForm ? 'Checkout' : t.cart.title}</h2>
              <button onClick={() => { setIsCartOpen(false); setShowCheckoutForm(false); setIsOrderSubmitted(false); }} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 dark:text-white flex items-center justify-center">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              {isOrderSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in">
                  <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white text-4xl shadow-2xl">
                    <i className="fas fa-check"></i>
                  </div>
                  <h3 className="text-3xl font-black dark:text-white uppercase tracking-tight">{t.cart.success}</h3>
                  <p className="text-slate-500 font-medium">{t.cart.successDesc}</p>
                  <button onClick={() => { setIsCartOpen(false); setIsOrderSubmitted(false); setShowCheckoutForm(false); }} className="px-10 py-5 bg-emerald-600 text-white rounded-full font-black uppercase text-xs">Yopish</button>
                </div>
              ) : showCheckoutForm ? (
                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest ml-4">{t.cart.form.firstName}*</label>
                    <input required type="text" placeholder="..." value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 p-6 rounded-3xl outline-none border-2 border-transparent focus:border-emerald-500/50 dark:text-white font-bold" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest ml-4">{t.cart.form.lastName}*</label>
                    <input required type="text" placeholder="..." value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 p-6 rounded-3xl outline-none border-2 border-transparent focus:border-emerald-500/50 dark:text-white font-bold" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest ml-4">{t.cart.form.phone}*</label>
                    <div className="flex gap-2 h-[72px]">
                      <CountrySelector value={countryCode} onChange={setCountryCode} />
                      <input required type="tel" placeholder="90 123 45 67" value={formData.phone} onChange={e => setFormData({...formData, phone: formatDisplayPhone(countryCode, e.target.value)})} className="flex-1 bg-slate-50 dark:bg-white/5 px-6 rounded-3xl outline-none border-2 border-transparent focus:border-emerald-500/50 dark:text-white font-bold" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest ml-4">{t.cart.form.description}</label>
                    <textarea rows={3} placeholder="..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 p-6 rounded-3xl outline-none border-2 border-transparent focus:border-emerald-500/50 dark:text-white font-bold resize-none" />
                  </div>

                  <button disabled={isSubmitting} className="w-full py-6 bg-emerald-600 text-white font-black rounded-full shadow-2xl uppercase tracking-widest text-xs mt-4 active:scale-95 transition-all">
                    {isSubmitting ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-check-circle mr-3"></i>}
                    Tasdiqlash
                  </button>
                  <button type="button" onClick={() => setShowCheckoutForm(false)} className="w-full text-slate-400 font-black uppercase tracking-widest text-[10px] mt-2">Orqaga qaytish</button>
                </form>
              ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-4">
                  <i className="fas fa-shopping-basket text-7xl"></i>
                  <p className="font-black uppercase tracking-widest text-xs">{t.cart.empty}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-5 items-center p-4 bg-slate-50 dark:bg-white/5 rounded-4xl border dark:border-white/5 group">
                      <div className="w-20 h-20 rounded-3xl overflow-hidden shrink-0 shadow-lg">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black dark:text-white truncate uppercase text-sm tracking-tight">{item.name[lang]}</h4>
                        <p className="text-emerald-500 font-black text-lg">{(item.price * item.quantity).toLocaleString()} UZS</p>
                        <div className="flex items-center gap-4 mt-2">
                           <button onClick={() => handleRemoveOne(item.id)} className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 dark:text-white shadow-sm flex items-center justify-center"><i className="fas fa-minus text-[10px]"></i></button>
                           <span className="font-black dark:text-white text-sm">{item.quantity}</span>
                           <button onClick={() => handleAddToCart(item)} className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 dark:text-white shadow-sm flex items-center justify-center"><i className="fas fa-plus text-[10px]"></i></button>
                        </div>
                      </div>
                      <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-slate-400 hover:text-red-500 p-2"><i className="fas fa-trash-alt"></i></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && !showCheckoutForm && !isOrderSubmitted && (
              <div className="p-8 border-t dark:border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">{t.cart.total}</span>
                  <span className="text-3xl font-black text-emerald-600 tracking-tighter">{cartTotal.toLocaleString()} UZS</span>
                </div>
                <button onClick={() => setShowCheckoutForm(true)} className="w-full py-6 bg-emerald-600 text-white rounded-full font-black uppercase tracking-widest text-xs shadow-2xl">Xaridni rasmiylashtirish</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
