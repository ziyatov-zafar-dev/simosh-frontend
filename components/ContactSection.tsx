
import React, { useState } from 'react';
import { Language, AboutInfo } from '../types';
import { TRANSLATIONS, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_IDS } from '../constants';
import { isValidPhoneParts, formatPrettyPhone, formatDisplayPhone } from '../utils';
import CountrySelector from './CountrySelector';

interface ContactSectionProps {
  lang: Language;
  aboutInfo: AboutInfo | null;
}

const ContactSection: React.FC<ContactSectionProps> = ({ lang, aboutInfo }) => {
  const t = TRANSLATIONS[lang]?.contact || TRANSLATIONS['uz'].contact;
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', message: '' });
  const [countryCode, setCountryCode] = useState('+998');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const phone = aboutInfo?.phone || '+998 90 123 45 67';
  const address = aboutInfo ? (
    lang === 'uz' ? aboutInfo.officeAddressUz :
    lang === 'ru' ? aboutInfo.officeAddressRu :
    lang === 'tr' ? aboutInfo.officeAddressTr :
    aboutInfo.officeAddressEn
  ) : (lang === 'uz' ? 'Toshkent shahar' : lang === 'ru' ? 'г. Ташкент' : 'Tashkent city');

  const handlePhoneChange = (val: string) => {
    const formatted = formatDisplayPhone(countryCode, val);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.message) return;
    if (!isValidPhoneParts(countryCode, formData.phone)) return alert(t.phoneError);

    setIsSubmitting(true);
    const prettyPhone = formatPrettyPhone(countryCode, formData.phone);
    const msg = `📩 <b>YANGI XABAR KELDI!</b>\n━━━━━━━━━━━━━━━━━━\n👤 <b>Ism:</b> ${formData.firstName}\n👥 <b>Familiya:</b> ${formData.lastName}\n📞 <b>Tel:</b> <code>${prettyPhone}</code>\n📝 <b>Xabar:</b> <i>${formData.message}</i>\n━━━━━━━━━━━━━━━━━━`;

    const requests = TELEGRAM_CHAT_IDS.map((chatId) =>
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: msg,
          parse_mode: 'HTML'
        }),
      })
    );

    try {
      await Promise.all(requests);
      setIsSent(true);
      setFormData({ firstName: '', lastName: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      alert(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 lg:py-32 px-4 sm:px-6 max-w-7xl mx-auto relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start relative z-10">
        <div className="space-y-10 animate-in fade-in slide-in-from-left duration-1000">
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.4em] text-[9px] lg:text-xs bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/20 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              {t.title}
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-8xl font-black leading-tight tracking-tighter text-slate-900 dark:text-white">
              {t.subtitle.split(' ')[0]} <br className="hidden sm:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-emerald-400 dark:to-emerald-600">
                {t.subtitle.split(' ').slice(1).join(' ')}
              </span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base lg:text-xl leading-relaxed max-w-md mx-auto lg:mx-0 font-medium opacity-90">
              {t.desc}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
            <div className="flex items-center gap-5 lg:gap-8 group p-6 lg:p-8 bg-white dark:bg-white/5 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-lg transition-all hover:bg-emerald-50 dark:hover:bg-emerald-500/5 hover:-translate-y-1">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-emerald-600/10 dark:bg-emerald-600/20 rounded-[1.2rem] lg:rounded-[1.8rem] flex items-center justify-center text-emerald-600 transition-all group-hover:scale-110 shrink-0">
                <i className="fas fa-phone-alt text-xl lg:text-2xl"></i>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-slate-400 dark:text-emerald-400/60 font-black uppercase tracking-[0.2em] mb-0.5">{t.phoneLabel}</p>
                <a href={`tel:${phone}`} className="text-lg lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight hover:text-emerald-600 transition-colors truncate block">{phone}</a>
              </div>
            </div>

            <div className="flex items-center gap-5 lg:gap-8 group p-6 lg:p-8 bg-white dark:bg-white/5 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-lg transition-all hover:bg-emerald-50 dark:hover:bg-emerald-500/5 hover:-translate-y-1">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-emerald-600/10 dark:bg-emerald-600/20 rounded-[1.2rem] lg:rounded-[1.8rem] flex items-center justify-center text-emerald-600 transition-all group-hover:scale-110 shrink-0">
                <i className="fas fa-location-dot text-xl lg:text-2xl"></i>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-slate-400 dark:text-emerald-400/60 font-black uppercase tracking-[0.2em] mb-0.5">{t.addrLabel}</p>
                <p className="text-lg lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0b121d] p-8 lg:p-16 rounded-[3rem] lg:rounded-[4.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.05)] dark:shadow-[0_60px_120px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-white/5 relative group animate-in slide-in-from-right duration-1000 overflow-hidden backdrop-blur-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
          
          {isSent ? (
            <div className="text-center py-16 lg:py-20 animate-in zoom-in duration-700">
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-emerald-500/10 rounded-[2.5rem] lg:rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <i className="fas fa-check-circle text-5xl lg:text-6xl text-emerald-500"></i>
              </div>
              <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">{t.success}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-base lg:text-lg mb-10">{t.successDesc || 'Tez orada bog\'lanamiz.'}</p>
              <button onClick={() => setIsSent(false)} className="px-10 py-4 bg-emerald-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-700 transition-all shadow-xl active:scale-95">
                OK
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-10 relative z-10">
              <h4 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{t.formTitle}</h4>
              
              <div className="grid sm:grid-cols-2 gap-5 lg:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-500 tracking-[0.2em] ml-3">{t.firstName}</label>
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="..." className="w-full bg-slate-50 dark:bg-white/5 px-6 lg:px-8 py-4 lg:py-6 rounded-[1.5rem] lg:rounded-[2rem] outline-none border-2 border-transparent focus:border-emerald-500/40 transition-all text-slate-900 dark:text-white font-bold text-base lg:text-lg shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-500 tracking-[0.2em] ml-3">{t.lastName}</label>
                  <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="..." className="w-full bg-slate-50 dark:bg-white/5 px-6 lg:px-8 py-4 lg:py-6 rounded-[1.5rem] lg:rounded-[2rem] outline-none border-2 border-transparent focus:border-emerald-500/40 transition-all text-slate-900 dark:text-white font-bold text-base lg:text-lg shadow-inner" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-500 tracking-[0.2em] ml-3">{t.phone}</label>
                <div className="flex gap-3 lg:gap-4 h-[72px] lg:h-[88px]">
                  <CountrySelector value={countryCode} onChange={setCountryCode} />
                  <input required type="tel" value={formData.phone} onChange={e => handlePhoneChange(e.target.value)} placeholder="90 123 45 67" className="flex-1 bg-slate-50 dark:bg-white/5 px-6 lg:px-8 py-4 lg:py-6 rounded-[1.5rem] lg:rounded-[2rem] outline-none text-slate-900 dark:text-white font-black border-2 border-transparent focus:border-emerald-500/40 transition-all text-base lg:text-lg shadow-inner" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-500 tracking-[0.2em] ml-3">{t.message}</label>
                <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="..." className="w-full bg-slate-50 dark:bg-white/5 px-6 lg:px-8 py-4 lg:py-6 rounded-[1.8rem] lg:rounded-[2.5rem] outline-none text-slate-900 dark:text-white border-2 border-transparent focus:border-emerald-500/40 font-bold transition-all shadow-inner resize-none text-base lg:text-lg" />
              </div>
              
              <button disabled={isSubmitting} className="w-full group relative py-6 lg:py-8 bg-emerald-600 text-white font-black rounded-[2rem] lg:rounded-[2.5rem] hover:bg-emerald-700 transition-all flex items-center justify-center shadow-[0_20px_40px_rgba(16,185,129,0.3)] uppercase tracking-[0.4em] text-[10px] lg:text-xs overflow-hidden active:scale-[0.98]">
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                {isSubmitting ? (
                  <i className="fas fa-spinner fa-spin mr-3 text-xl lg:text-2xl relative z-10"></i>
                ) : (
                  <i className="fas fa-paper-plane mr-3 text-lg relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                )}
                <span className="relative z-10">{isSubmitting ? '...' : t.send}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
