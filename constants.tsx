
import { Product, Language, AboutInfo, Statistics } from './types';

export const API_BASE_URL = 'https://codebyz.online';
export const TELEGRAM_BOT_TOKEN = '8519627435:AAGMI8QPtKCPW85GR4Hv0yqDc90HKePs4LM';
export const TELEGRAM_CHAT_IDS = ['7882316826'];

// Web App manzili
export const FRONTEND_URL = 'https://simosh-admin-backend-wb84.vercel.app/#/orders/in_progress';

const baseUz = {
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
    successDesc: 'Buyurtmangiz qabul qilindi. Tez orada bog\'lanamiz.',
    form: {
      firstName: 'Ism',
      lastName: 'Familiya',
      phone: 'Telefon',
      description: 'Qo\'shimcha izoh',
      required: 'Barcha maydonlarni to\'ldiring',
      phoneError: 'Raqam xato kiritildi'
    },
    error: 'Xatolik yuz berdi'
  },
  ai: {
    welcome: 'Assalomu alaykum! Men Simosh AI maslahatchisiman. Kompaniyamiz, mahsulotlarimiz va ularning mashhurligi haqida barchasini bilaman. Savollaringiz bo\'lsa, bemalol so\'rang.',
    title: 'AI Ekspert',
    desc: 'Kompaniya va mahsulotlar haqida so\'rang yoki ovozli maslahat oling.',
    placeholder: 'Savolingizni yozing...',
    error: 'Tizimda xatolik.',
    quotaError: 'Limit tugadi.',
    speaking: 'Gapirmoqda...',
    listen: 'Eshiting',
    inCall: 'Muloqotdamiz...',
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
};

export const TRANSLATIONS: Record<Language, typeof baseUz> = {
  uz: baseUz,
  en: {
    verify: { welcome: 'Simosh Natural', desc: 'First step to health. Verify you are not a robot.', btnLabel: 'Verify' },
    nav: { home: 'Home', products: 'Soaps', about: 'About', contact: 'Contact' },
    hero: { badge: '100% Organic', title: 'Pure Miracle', titleAccent: 'Of Nature', desc: 'Healing therapy for your skin.', buy: 'Shop Now', ai: 'AI Assistant', feature1: 'Natural', feature2: 'Proven Quality' },
    products: { title: 'Healing Collection', desc: 'Care your skin deserves' },
    contact: { title: 'Contact', subtitle: 'Questions?', desc: 'Feel free to contact us.', formTitle: 'Send Message', firstName: 'Name', lastName: 'Last Name', phone: 'Phone', message: 'Message', send: 'Send', success: 'Sent!', successDesc: 'We received your message.', error: 'Error.', phoneError: 'Invalid number.', infoTitle: 'Contact Info', addrLabel: 'Address', phoneLabel: 'Phone' },
    cart: { title: 'Cart', empty: 'Empty', emptyDesc: 'No items yet.', start: 'Start Shopping', total: 'Total', checkout: 'Checkout', back: 'Back', confirm: 'Confirm', success: 'Thank you!', successDesc: 'Order received.', form: { firstName: 'Name', lastName: 'Last Name', phone: 'Phone', description: 'Note', required: 'Required', phoneError: 'Invalid' }, error: 'Error' },
    ai: { welcome: 'Hello! I am Simosh AI assistant. I know everything about our company and products.', title: 'AI Expert', desc: 'Ask about our company or products.', placeholder: 'Type here...', error: 'Error.', quotaError: 'Limit reached.', speaking: 'Speaking...', listen: 'Listen', inCall: 'In call...', endCall: 'End', voiceCall: 'Voice Call' },
    about: { title: 'About Us', subtitle: 'Our History', experience: 'Years of Experience', addressLabel: 'Main Office', phoneLabel: 'Contact Line' },
    footer: { mission: 'Health and beauty through nature.', pages: 'Pages', contact: 'Contact', rights: 'All rights reserved.' }
  },
  tr: {
    verify: { welcome: 'Simosh Natural', desc: 'Sağlığa ilk adım. Robot olmadığınızı onaylayın.', btnLabel: 'Onayla' },
    nav: { home: 'Anasayfa', products: 'Sabunlar', about: 'Hakkımızda', contact: 'İletişim' },
    hero: { badge: '%100 Organik', title: 'Doğanın Saf', titleAccent: 'Mucizesi', desc: 'Cildiniz için gerçek bir şifa terapisidir.', buy: 'Satın Al', ai: 'AI Danışman', feature1: 'Doğal İçerik', feature2: 'Kaliteli' },
    products: { title: 'Şifalı Koleksiyon', desc: 'Cildinizin hak ettiği bakım' },
    contact: { title: 'İletişim', subtitle: 'Sorular?', desc: 'Bize her zaman ulaşabilirsiniz.', formTitle: 'Mesaj Gönder', firstName: 'Ad', lastName: 'Soyad', phone: 'Telefon', message: 'Mesaj', send: 'Gönder', success: 'Gönderildi!', successDesc: 'Mesajınızı aldık.', error: 'Hata.', phoneError: 'Hatalı numara.', infoTitle: 'İletişim Bilgileri', addrLabel: 'Adres', phoneLabel: 'Telefon' },
    cart: { title: 'Sepet', empty: 'Boş', emptyDesc: 'Henüz ürün yok.', start: 'Alışverişe Başla', total: 'Toplam', checkout: 'Ödeme', back: 'Geri', confirm: 'Onayla', success: 'Teşekkürler!', successDesc: 'Sipariş alındı.', form: { firstName: 'Ad', lastName: 'Soyad', phone: 'Telefon', description: 'Not', required: 'Gerekli', phoneError: 'Hatalı' }, error: 'Hata' },
    ai: { welcome: 'Merhaba! Ben Simosh AI asistanıyım. Şirketimiz ve ürünlerimiz hakkında her şeyi biliyorum.', title: 'AI Uzmanı', desc: 'Ürünlerimiz hakkında soru sorun.', placeholder: 'Buraya yazın...', error: 'Hata.', quotaError: 'Limit doldu.', speaking: 'Konuşuyor...', listen: 'Dinle', inCall: 'Görüşmede...', endCall: 'Kapat', voiceCall: 'Sesli Arama' },
    about: { title: 'Hakkımızda', subtitle: 'Hikayemiz', experience: 'Yıllık Deneyim', addressLabel: 'Merkez Ofis', phoneLabel: 'İletişim' },
    footer: { mission: 'Doğa yoluyla sağlık ve güzellik.', pages: 'Sayfalar', contact: 'İletişim', rights: 'Tüm hakları saklıdır.' }
  },
  ru: {
    verify: { welcome: 'Simosh Natural', desc: 'Первый шаг к здоровью. Подтвердите, что вы не робот.', btnLabel: 'Подтвердить' },
    nav: { home: 'Главная', products: 'Мыло', about: 'О нас', contact: 'Контакты' },
    hero: { badge: '100% Органика', title: 'Чистое Чудо', titleAccent: 'Природы', desc: 'Настоящая лечебная терапия для вашей кожи.', buy: 'Купить', ai: 'ИИ Консультант', feature1: 'Натурально', feature2: 'Качество' },
    products: { title: 'Лечебная Коллекция', desc: 'Уход, который вы заслуживаете' },
    contact: { title: 'Контакты', subtitle: 'Вопросы?', desc: 'Свяжитесь с нами в любое время.', formTitle: 'Сообщение', firstName: 'Имя', lastName: 'Фамилия', phone: 'Телефон', message: 'Сообщение', send: 'Отправить', success: 'Отправлено!', successDesc: 'Мы получили ваше сообщение.', error: 'Ошибка.', phoneError: 'Неверный номер.', infoTitle: 'Инфо', addrLabel: 'Адрес', phoneLabel: 'Телефон' },
    cart: { title: 'Корзина', empty: 'Пусто', emptyDesc: 'Нет товаров.', start: 'За покупками', total: 'Итого', checkout: 'Заказать', back: 'Назад', confirm: 'Подтвердить', success: 'Спасибо!', successDesc: 'Заказ принят.', form: { firstName: 'Имя', lastName: 'Фамилия', phone: 'Телефон', description: 'Заметка', required: 'Обязательно', phoneError: 'Неверно' }, error: 'Ошибка' },
    ai: { welcome: 'Здравствуйте! Я ИИ-консультант Simosh. Я знаю всё о нашей компании и продукции.', title: 'ИИ Эксперт', desc: 'Спрашивайте о компании или продукции.', placeholder: 'Пишите здесь...', error: 'Ошибка.', quotaError: 'Лимит исчерпан.', speaking: 'Говорит...', listen: 'Слушать', inCall: 'На связи...', endCall: 'Завершить', voiceCall: 'Голосовой звонок' },
    about: { title: 'О нас', subtitle: 'Наша история', experience: 'Лет опыта', addressLabel: 'Офис', phoneLabel: 'Контакты' },
    footer: { mission: 'Здоровье и красота через природу.', pages: 'Разделы', contact: 'Контакты', rights: 'Все права защищены.' }
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
  const currentLang = TRANSLATIONS[lang] ? lang : 'uz';
  const productList = dynamicProducts && dynamicProducts.length > 0 
    ? dynamicProducts.map((p, i) => {
        const pStat = stats?.products.find(s => s.productId === p.id);
        const soldText = pStat ? `(Sotilgan soni: ${pStat.soldCount} ta)` : '';
        return `${i + 1}. ${p.name[currentLang]} - Narxi: ${p.price} UZS. ${soldText}`;
      }).join('\n')
    : PRODUCTS.map((p, i) => `${i + 1}. ${p.name[currentLang]} - Narxi: ${p.price} UZS.`).join('\n');

  const companyInfo = aboutInfo ? `
KOMPANIYA HAQIDA MA'LUMOT:
- Tavsif: ${currentLang === 'uz' ? aboutInfo.descriptionUz : currentLang === 'ru' ? aboutInfo.descriptionRu : aboutInfo.descriptionEn}
- Manzil: ${currentLang === 'uz' ? aboutInfo.officeAddressUz : currentLang === 'ru' ? aboutInfo.officeAddressRu : aboutInfo.officeAddressEn}
- Telefon: ${aboutInfo.phone}
- Instagram: ${aboutInfo.instagram}
- Telegram: ${aboutInfo.telegram}
` : '';

  const statsInfo = stats ? `
SOTUV STATISTIKASI:
- Jami sotilgan mahsulotlar soni: ${stats.totalSold} ta.
` : '';

  return `Siz "Simosh" kompaniyasining dermatolog-eksperti va rasmiy vakilisiz. Foydalanuvchi bilan faqat ${currentLang} tilida muloqot qiling.

SIZNING VAZIFALARINGIZ:
1. Kompaniya haqidagi ma'lumotlarni taqdim etish (manzil, telefon, ijtimoiy tarmoqlar).
2. Mahsulotlar (sovunlar) haqida to'liq ma'lumot berish va ularning sotilish statistikasi (mashhurligi) haqida gapirish.
3. Sizda ko'rish qobiliyati YO'Q. Foydalanuvchi bilan faqat ovozli va matnli muloqot qilasiz.

${companyInfo}
${statsInfo}
MAHSULOTLAR RO'YXATI:
${productList}`;
};
