
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import AIConsultant from './components/AIConsultant';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import { Product, CartItem, Language, AboutInfo } from './types';
import { PRODUCTS, TRANSLATIONS } from './constants';
import { fetchLogo } from './logoService';
import { fetchAboutInfo } from './aboutService';
import { fetchActiveProducts } from './productService';
import { sendOrderToTelegram } from './telegramService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('uz');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const t = TRANSLATIONS[lang] || TRANSLATIONS['uz'];

  // Routing Logic: Handles both root and sub-path environments
  const navigate = useCallback((path: string) => {
    if (window.location.pathname === path) return;
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    const path = window.location.pathname;
    if (path === '/' || path === '') {
      navigate('/home');
    }
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

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
      } catch (err) {
        console.error("Data load error:", err);
        setActiveProducts(PRODUCTS);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleAddToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.price * item.quantity), 0), [cart]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert(t.cart.form.required);
      return;
    }

    setIsSubmitting(true);
    const success = await sendOrderToTelegram(formData, cart, cartTotal, lang);
    setIsSubmitting(false);

    if (success) {
      setIsOrderSubmitted(true);
      setCart([]);
      setFormData({ firstName: '', lastName: '', phone: '' });
    } else {
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    }
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setShowCheckoutForm(false);
      setIsOrderSubmitted(false);
    }, 300);
  };

  const renderContent = () => {
    const path = currentPath.toLowerCase();
    if (path.endsWith('/products')) {
      return (
        <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 lg:mb-24">
              <h2 className="text-3xl lg:text-5xl font-black mb-6 text-slate-900 dark:text-white">{t.products.title}</h2>
              <div className="w-24 h-2 bg-emerald-500 mx-auto rounded-full mb-8"></div>
              <p className="text-slate-600 dark:text-emerald-200/60 max-w-2xl mx-auto text-lg font-medium">{t.products.desc}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {(activeProducts || []).map(product => (
                <ProductCard key={product.id} product={product} lang={lang} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </div>
        </section>
      );
    }
    if (path.endsWith('/about')) {
      return <AboutSection lang={lang} aboutInfo={aboutInfo} logoUrl={logoUrl} />;
    }
    if (path.endsWith('/simosh-ai')) {
      return <AIConsultant lang={lang} products={activeProducts} aboutInfo={aboutInfo} />;
    }
    return <Hero lang={lang} aboutInfo={aboutInfo} onNavigate={navigate} />;
  };

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-[#0a1a16] flex flex-col items-center justify-center z-[200]">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
        <div className="text-emerald-600 font-black text-xl animate-pulse tracking-widest uppercase">SIMOSH</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a1a16] text-emerald-50' : 'bg-[#fdfbf7] text-slate-900'}`}>
      <Navbar 
        logoUrl={logoUrl}
        cartCount={cartCount} 
        lang={lang}
        theme={theme}
        currentPath={currentPath}
        onLangChange={setLang}
        onThemeToggle={toggleTheme}
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={navigate}
      />
      
      <main className="pt-20 lg:pt-24 min-h-[calc(100vh-300px)]">
        {renderContent()}
      </main>

      <Footer lang={lang} aboutInfo={aboutInfo} logoUrl={logoUrl} onNavigate={navigate} />

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-md transition-opacity" onClick={closeCart}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white dark:bg-emerald-950 shadow-2xl flex flex-col">
              <div className="px-6 py-8 bg-emerald-100/50 dark:bg-emerald-900/50 flex items-center justify-between border-b border-emerald-100 dark:border-emerald-800">
                <h2 className="text-2xl font-black text-emerald-950 dark:text-emerald-50">
                  {isOrderSubmitted ? t.cart.success : (showCheckoutForm ? t.cart.checkout : t.cart.title)}
                </h2>
                <button onClick={closeCart} className="text-emerald-950 dark:text-emerald-300 hover:text-emerald-600 transition-colors">
                  <i className="fas fa-times text-2xl"></i>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8">
                {isOrderSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 border-4 border-emerald-200">
                      <i className="fas fa-check text-4xl animate-bounce"></i>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-emerald-50 mb-3">{t.cart.success}</h3>
                    <p className="text-slate-600 dark:text-emerald-200/70 mb-8 font-medium">{t.cart.successDesc}</p>
                    <button onClick={closeCart} className="px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all uppercase tracking-widest">{t.cart.start}</button>
                  </div>
                ) : showCheckoutForm ? (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-widest">{t.cart.form.firstName}</label>
                      <input 
                        required
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-emerald-50/50 dark:bg-[#0a1a16] border-2 border-emerald-100 dark:border-emerald-800 rounded-2xl px-5 py-4 text-lg font-bold outline-none focus:border-emerald-500 transition-all"
                        placeholder="Ali"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-widest">{t.cart.form.lastName}</label>
                      <input 
                        required
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-emerald-50/50 dark:bg-[#0a1a16] border-2 border-emerald-100 dark:border-emerald-800 rounded-2xl px-5 py-4 text-lg font-bold outline-none focus:border-emerald-500 transition-all"
                        placeholder="Valiyev"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-widest">{t.cart.form.phone}</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-700 font-black">+998</span>
                        <input 
                          required
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-emerald-50/50 dark:bg-[#0a1a16] border-2 border-emerald-100 dark:border-emerald-800 rounded-2xl pl-16 pr-5 py-4 text-lg font-bold outline-none focus:border-emerald-500 transition-all"
                          placeholder="90 123 45 67"
                        />
                      </div>
                    </div>
                    <div className="pt-6">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-700 disabled:opacity-50 transition-all uppercase tracking-widest flex items-center justify-center space-x-3"
                      >
                        {isSubmitting ? <i className="fas fa-circle-notch fa-spin text-2xl"></i> : <span>{t.cart.confirm}</span>}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowCheckoutForm(false)}
                        className="w-full py-4 mt-4 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                      >
                        {t.cart.back}
                      </button>
                    </div>
                  </form>
                ) : cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-300 mb-6 border border-emerald-200 dark:border-emerald-700">
                      <i className="fas fa-shopping-basket text-3xl"></i>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-emerald-100 mb-2">{t.cart.empty}</h3>
                    <p className="text-slate-600 dark:text-emerald-200/60 mb-8 font-medium text-sm">{t.cart.emptyDesc}</p>
                    <button onClick={() => { setIsCartOpen(false); navigate('/products'); }} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all">{t.cart.start}</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 rounded-2xl bg-white dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
                        <img src={item.image} alt={item.name[lang]} className="w-16 h-16 object-cover rounded-xl" />
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 dark:text-emerald-50 text-sm line-clamp-1">{item.name[lang] || ''}</h4>
                          <p className="text-emerald-700 dark:text-emerald-400 text-sm font-black">{item.price?.toLocaleString() || 0} UZS</p>
                          <span className="text-xs text-slate-500 dark:text-emerald-300/50">Qty: {item.quantity}</span>
                        </div>
                        <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-slate-400 hover:text-red-500 transition-colors p-2"><i className="fas fa-trash text-sm"></i></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!isOrderSubmitted && !showCheckoutForm && cart.length > 0 && (
                <div className="px-6 py-8 bg-emerald-100/50 dark:bg-emerald-900/50 border-t border-emerald-200 dark:border-emerald-800">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-emerald-900 dark:text-emerald-200 font-bold">{t.cart.total}:</span>
                    <span className="text-xl font-black text-emerald-950 dark:text-emerald-50">{cartTotal.toLocaleString()} UZS</span>
                  </div>
                  <button 
                    onClick={() => setShowCheckoutForm(true)}
                    className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg hover:bg-emerald-700 transition-all uppercase tracking-widest text-sm"
                  >
                    {t.cart.checkout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
