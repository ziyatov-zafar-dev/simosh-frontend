
import { Product, Language, AboutInfo, Statistics } from './types';

export const API_BASE_URL = 'https://codebyz.online';
export const TELEGRAM_BOT_TOKEN = '8557045477:AAHNSYjRcyRs8iRj1qnYXH9yp788v8o9aLk';
export const TELEGRAM_CHAT_IDS = ['7882316826','7571971490'];

// Web App manzili
export const FRONTEND_URL = 'https://simosh-admin.vercel.app/#/orders/in_progress';

export const TRANSLATIONS: Record<Language, any> = {
  uz: {
    verify: {
      welcome: 'Simosh Natural',
      desc: 'Salomatlik sari ilk qadam. Davom etish uchun robot emasligingizni tasdiqlang.',
      btnLabel: 'Tasdiqlash',
    },
    nav: { home: 'Asosiy', products: 'Sovunlar', about: 'Biz haqimizda', contact: 'Aloqa' },
    hero: {
      badge: '100% Organik Mahsulot',
      title: 'Tabiatning',
      titleAccent: 'Sof Mo\'jizasi',
      desc: 'Simosh sovunlari — bu faqatgina tozalik emas, bali teringiz uchun haqiqiy shifobaxsh terapiyadir.',
      buy: 'Xarid qilish',
      ai: 'AI Maslahatchi',
      feature1: 'Tabiiy tarkib',
      feature2: 'Sinalgan sifat'
    },
    products: {
      title: "Shifobaxsh To'plam",
      desc: "Sizning teringizga munosib parvarish"
    },
    contact: {
      title: 'Bog\'lanish',
      subtitle: 'Savollaringiz bormi?',
      desc: 'Biz bilan istalgan vaqtda bog\'lanishingiz mumkin, biz yordam berishdan xursandmiz.',
      formTitle: 'Xabar yuborish',
      firstName: 'Ismingiz',
      lastName: 'Familiyangiz',
      phone: 'Telefon raqam',
      message: 'Xabaringiz',
      send: 'Yuborish',
      success: 'Xabar yuborildi!',
      successDesc: 'Biz xabaringizni qabul qildik va yaqin orada javob beramiz.',
      error: 'Xatolik yuz berdi.',
      phoneError: 'Raqam xato kiritildi.',
      infoTitle: 'Aloqa ma\'lumotlari',
      addrLabel: 'Manzilimiz',
      phoneLabel: 'Telefon'
    },
    cart: {
      title: 'Savat',
      empty: 'Savat bo\'sh',
      emptyDesc: 'Hali hech qanday mahsulot tanlamadinigiz.',
      start: 'Xaridni boshlash',
      total: 'Jami summa',
      checkout: 'Buyurtma berish',
      back: 'Orqaga',
      confirm: 'Tasdiqlash',
      success: 'Rahmat!',
      successDesc: 'Buyurtmangiz qabul dili. Tez orada bog\'lanamiz.',
      form: {
        firstName: 'Ism',
        lastName: 'Familiya',
        phone: 'Telefon',
        description: 'Qo\'shimcha izoh',
        required: 'Barcha maydonlarni to\'ldiring',
        phoneError: 'Raqam xato kiritildi'
      }
    },
    ai: {
      welcome: 'Assalomu alaykum! Men Simosh AI maslahatchisiman. Kompaniyamiz, mahsulotlarimiz va ularning mashhurligi haqida barchasini bilaman. Teringizni ko\'rsatsangiz, unga mos sovunni tanlab beraman.',
      title: 'AI Ekspert',
      desc: 'Kompaniya va mahsulotlar haqida so\'rang yoki teringizni tahlil qildiring.',
      placeholder: 'Savolingizni yozing...',
      error: 'Tizimda xatolik.',
      quotaError: 'Limit tugadi.',
      speaking: 'Gapirmoqda...',
      listen: 'Eshiting',
      inCall: 'Muloqotdamiz...',
      switchCamera: 'Kamerani almashtirish',
      attachImage: 'Rasm biriktirish',
      endCall: 'Yakunlash',
      voiceCall: 'Ovozli muloqot'
    },
    about: {
      title: 'Biz Haqimizda',
      subtitle: 'Simosh tarixi',
      experience: 'Yillik tajriba',
      addressLabel: 'Bosh ofis',
      phoneLabel: 'Aloqa liniyasi'
    },
    footer: {
      mission: 'Bizning vazifamiz — tabiiy sovunlar orqali insonlarga salomatlik va go\'zallik ulashish.',
      pages: 'Bo\'limlar',
      contact: 'Aloqa',
      rights: 'Barcha huquqlar himoyalangan.'
    }
  },
  en: {
    // ... boshqa tillar uchun ham ai qismini yangilash mumkin
    ai: {
      welcome: 'Hello! I am Simosh AI assistant. I know everything about our company, products, and their popularity. If you show me your skin, I will choose the best soap for you.',
      title: 'AI Expert',
      desc: 'Ask about the company or products, or let me analyze your skin.',
      // ...
    }
  },
  tr: {
    ai: {
      welcome: 'Merhaba! Ben Simosh AI asistanıyım. Şirketimiz, ürünlerimiz ve popülerlikleri hakkında her şeyi biliyorum. Cildinizi gösterirseniz size en uygun sabunu seçerim.',
      title: 'AI Uzmanı',
      desc: 'Şirket veya ürünler hakkında soru sorun veya cildinizi analiz ettirin.',
      // ...
    }
  },
  ru: {
    ai: {
      welcome: 'Здравствуйте! Я ИИ-консультант Simosh. Я знаю всё о нашей компании, продукции и её популярности. Если вы покажете свою кожу, я подберу подходящее мыло.',
      title: 'ИИ Эксперт',
      desc: 'Спрашивайте о компании, товарах или позвольте мне проанализировать вашу кожу.',
      // ...
    }
  }
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: { uz: 'Qora Sedana Sovuni', en: 'Black Cumin Soap', tr: 'Çörek Otu Sabunu', ru: 'Мыло с черным тмином' },
    description: {
      uz: 'Terining immunitetini oshiradi va mikroblarga qarshi kurashadi. Husnbuzarlarni yoqotishda samarali.',
      en: 'Increases skin immunity and fights microbes. Effective in removing acne.',
      tr: 'Cilt bağışıklığını artırır ve mikroplarla savaşır. Akne gidermede etkilidir.',
      ru: 'Повышает иммунитет кожи и борется с микробами. Эффективно в борьбе с акне.'
    },
    price: 25000,
    image: 'https://picsum.photos/seed/soap1/600/600',
    benefits: {
      uz: ['Antiseptik', 'Husnbuzarlarga qarshi'],
      en: ['Antiseptic', 'Anti-acne'],
      tr: ['Antiseptik', 'Akne karşıtı'],
      ru: ['Антисептик', 'Против akne']
    },
    category: 'therapeutic'
  }
];

export const getSystemInstruction = (
  lang: Language, 
  dynamicProducts?: Product[], 
  aboutInfo?: AboutInfo | null,
  stats?: Statistics | null
) => {
  const productList = dynamicProducts && dynamicProducts.length > 0 
    ? dynamicProducts.map((p, i) => {
        const pStat = stats?.products.find(s => s.productId === p.id);
        const soldText = pStat ? `(Sotilgan soni: ${pStat.soldCount} ta)` : '';
        return `${i + 1}. ${p.name[lang]} - Narxi: ${p.price} UZS. ${soldText}`;
      }).join('\n')
    : PRODUCTS.map((p, i) => `${i + 1}. ${p.name[lang]} - Narxi: ${p.price} UZS.`).join('\n');

  const companyInfo = aboutInfo ? `
KOMPANIYA HAQIDA MA'LUMOT:
- Tavsif: ${lang === 'uz' ? aboutInfo.descriptionUz : lang === 'ru' ? aboutInfo.descriptionRu : aboutInfo.descriptionEn}
- Manzil: ${lang === 'uz' ? aboutInfo.officeAddressUz : lang === 'ru' ? aboutInfo.officeAddressRu : aboutInfo.officeAddressEn}
- Telefon: ${aboutInfo.phone}
- Instagram: ${aboutInfo.instagram}
- Telegram: ${aboutInfo.telegram}
` : '';

  const statsInfo = stats ? `
SOTUV STATISTIKASI:
- Jami sotilgan mahsulotlar soni: ${stats.totalSold} ta.
` : '';

  return `Siz "Simosh" kompaniyasining dermatolog-eksperti va rasmiy vakilisiz. Foydalanuvchi bilan faqat ${lang} tilida muloqot qiling.

SIZNING VAZIFALARINGIZ:
1. Kompaniya haqidagi ma'lumotlarni taqdim etish (manzil, telefon, ijtimoiy tarmoqlar).
2. Mahsulotlar (sovunlar) haqida to'liq ma'lumot berish va ularning sotilish statistikasi (mashhurligi) haqida gapirish.
3. KO'RISH QOBILIYATI: Foydalanuvchi kamerani yoqqanda tahlil qila olish. Sizga real vaqtda video kadrlar yuboriladi. Teri holatini (quruqlik, akne, qizarish) vizual aniqlang va mahsulot tavsiya qiling.
4. Hech qachon "ko'rolmayman" demang. Sizda video oqimi bor!

${companyInfo}
${statsInfo}
MAHSULOTLAR RO'YXATI:
${productList}`;
};
