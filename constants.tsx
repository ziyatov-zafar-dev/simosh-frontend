
import { Product, Language, AboutInfo } from './types';

export const API_BASE_URL = 'https://codebyz.online';
export const TELEGRAM_BOT_TOKEN = '8519627435:AAGMI8QPtKCPW85GR4Hv0yqDc90HKePs4LM';
export const TELEGRAM_CHAT_IDS = ['7882316826'];

// Web App manzili
export const FRONTEND_URL = 'https://simosh-admin-backend-wb84.vercel.app/#/orders/in_progress';

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
      desc: 'Simosh sovunlari — bu faqatgina tozalik emas, balki teringiz uchun haqiqiy shifobaxsh terapiyadir.',
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
      emptyDesc: 'Hali hech qanday mahsulot tanlamadingiz.',
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
        phoneError: 'Raqam xato'
      }
    },
    ai: {
      welcome: 'Assalomu alaykum! Men Simosh AI maslahatchisiman. Teringiz turiga qarab eng yaxshi sovunni tanlashda yordam beraman.',
      title: 'AI Ekspert',
      desc: 'Savollaringizga soniyalarda javob oling.',
      placeholder: 'Savolingizni yozing...',
      error: 'Tizimda xatolik.',
      quotaError: 'Limit tugadi.',
      speaking: 'Gapirmoqda...',
      listen: 'Eshiting'
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
    verify: {
      welcome: 'Simosh Natural',
      desc: 'First step to health. Please verify you are not a robot to continue.',
      btnLabel: 'Verify',
    },
    nav: { home: 'Home', products: 'Soaps', about: 'About', contact: 'Contact' },
    hero: {
      badge: '100% Organic Product',
      title: 'Pure Miracle',
      titleAccent: 'Of Nature',
      desc: 'Simosh soaps are not just for cleaning, but a real healing therapy for your skin.',
      buy: 'Shop Now',
      ai: 'AI Assistant',
      feature1: 'Natural ingredients',
      feature2: 'Proven quality'
    },
    products: {
      title: 'Healing Collection',
      desc: 'Care your skin deserves'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Any questions?',
      desc: 'Feel free to contact us anytime, we are happy to help.',
      formTitle: 'Send Message',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone Number',
      message: 'Your Message',
      send: 'Send Now',
      success: 'Message sent!',
      successDesc: 'We received your message and will respond soon.',
      error: 'An error occurred.',
      phoneError: 'Invalid phone number.',
      infoTitle: 'Contact Details',
      addrLabel: 'Our Address',
      phoneLabel: 'Phone'
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Cart is empty',
      emptyDesc: 'You haven\'t selected any products yet.',
      start: 'Start Shopping',
      total: 'Total amount',
      checkout: 'Checkout',
      back: 'Go back',
      confirm: 'Confirm Order',
      success: 'Thank you!',
      successDesc: 'Your order has been received. We will contact you soon.',
      form: {
        firstName: 'First Name',
        lastName: 'Last Name',
        phone: 'Phone',
        description: 'Additional notes',
        required: 'Please fill all fields',
        phoneError: 'Invalid phone'
      }
    },
    ai: {
      welcome: 'Hello! I am Simosh AI assistant. I will help you choose the best soap based on your skin type.',
      title: 'AI Expert',
      desc: 'Get answers to your questions in seconds.',
      placeholder: 'Type your question...',
      error: 'System error.',
      quotaError: 'Quota reached.',
      speaking: 'Speaking...',
      listen: 'Listen'
    },
    about: {
      title: 'About Us',
      subtitle: 'Simosh History',
      experience: 'Years Experience',
      addressLabel: 'Head Office',
      phoneLabel: 'Support Line'
    },
    footer: {
      mission: 'Our mission is to bring health and beauty to people through natural soaps.',
      pages: 'Sections',
      contact: 'Contact',
      rights: 'All rights reserved.'
    }
  },
  tr: {
    verify: {
      welcome: 'Simosh Natural',
      desc: 'Sağlığa ilk adım. Devam etmek için robot olmadığınızı doğrulayın.',
      btnLabel: 'Doğrula',
    },
    nav: { home: 'Anasayfa', products: 'Sabunlar', about: 'Hakkımızda', contact: 'İletişim' },
    hero: {
      badge: '%100 Organik Ürün',
      title: 'Doğanın Saf',
      titleAccent: 'Mucizesi',
      desc: 'Simosh sabunları sadece temizlik değil, cildiniz için gerçek bir şifa terapisidir.',
      buy: 'Satın Al',
      ai: 'AI Danışman',
      feature1: 'Doğal içerik',
      feature2: 'Kanıtlanmış kalite'
    },
    products: {
      title: 'Şifalı Koleksiyon',
      desc: 'Cildinizin hak ettiği bakım'
    },
    contact: {
      title: 'İletişim',
      subtitle: 'Sorularınız mı var?',
      desc: 'Bizimle istediğiniz zaman iletişime geçebilirsiniz, yardımcı olmaktan mutluluk duyarız.',
      formTitle: 'Mesaj Gönder',
      firstName: 'Adınız',
      lastName: 'Soyadınız',
      phone: 'Telefon Numarası',
      message: 'Mesajınız',
      send: 'Gönder',
      success: 'Mesaj gönderildi!',
      successDesc: 'Mesajınızı aldık ve yakında cevap vereceğiz.',
      error: 'Bir hata oluştu.',
      phoneError: 'Geçersiz telefon.',
      infoTitle: 'İletişim Bilgileri',
      addrLabel: 'Adresimiz',
      phoneLabel: 'Telefon'
    },
    cart: {
      title: 'Sepetim',
      empty: 'Sepetiniz boş',
      emptyDesc: 'Henüz ürün seçmediniz.',
      start: 'Alışverişe Başla',
      total: 'Toplam tutar',
      checkout: 'Ödeme Yap',
      back: 'Geri dön',
      confirm: 'Siparişi Onayla',
      success: 'Teşekkürler!',
      successDesc: 'Siparişiniz alındı. En kısa sürede iletişime geçeceğiz.',
      form: {
        firstName: 'Ad',
        lastName: 'Soyad',
        phone: 'Telefon',
        description: 'Ek notlar',
        required: 'Tüm alanları doldurun',
        phoneError: 'Geçersiz telefon'
      }
    },
    ai: {
      welcome: 'Merhaba! Ben Simosh AI asistanıyım. Cilt tipinize göre en iyi sabunu seçmenize yardımcı olacağım.',
      title: 'AI Uzmanı',
      desc: 'Sorularınıza saniyeler içinde yanıt alın.',
      placeholder: 'Sorunuzu yazın...',
      error: 'Sistem hatası.',
      quotaError: 'Kota doldu.',
      speaking: 'Konuşuyor...',
      listen: 'Dinle'
    },
    about: {
      title: 'Hakkımızda',
      subtitle: 'Simosh Hikayesi',
      experience: 'Yıllık Deneyim',
      addressLabel: 'Merkez Ofis',
      phoneLabel: 'Destek Hattı'
    },
    footer: {
      mission: 'Misyonumuz, doğal sabunlarla insanlara sağlık ve güzellik katmaktır.',
      pages: 'Bölümler',
      contact: 'İletişim',
      rights: 'Tüm hakları saklıdır.'
    }
  },
  ru: {
    verify: {
      welcome: 'Simosh Natural',
      desc: 'Первый шаг к здоровью. Подтвердите, что вы не робот, чтобы продолжить.',
      btnLabel: 'Подтвердить',
    },
    nav: { home: 'Главная', products: 'Мыло', about: 'О нас', contact: 'Контакты' },
    hero: {
      badge: '100% Органический Продукт',
      title: 'Чистое Чудо',
      titleAccent: 'Природы',
      desc: 'Мыло Simosh — это не просто очищение, а настоящая лечебная терапия для вашей кожи.',
      buy: 'Купить',
      ai: 'ИИ Консультант',
      feature1: 'Натуральный состав',
      feature2: 'Проверенное качество'
    },
    products: {
      title: 'Лечебная Коллекция',
      desc: 'Уход, который заслуживает ваша кожа'
    },
    contact: {
      title: 'Контакты',
      subtitle: 'Есть вопросы?',
      desc: 'Свяжитесь с нами в любое время, мы будем рады помочь.',
      formTitle: 'Отправить сообщение',
      firstName: 'Имя',
      lastName: 'Фамилия',
      phone: 'Номер телефона',
      message: 'Ваше сообщение',
      send: 'Отправить',
      success: 'Сообщение отправлено!',
      successDesc: 'Мы получили ваше сообщение и ответим в ближайшее время.',
      error: 'Произошла ошибка.',
      phoneError: 'Неверный номер.',
      infoTitle: 'Контактная информация',
      addrLabel: 'Наш адрес',
      phoneLabel: 'Телефон'
    },
    cart: {
      title: 'Корзина',
      empty: 'Корзина пуста',
      emptyDesc: 'Вы еще не выбрали ни одного товара.',
      start: 'Начать покупки',
      total: 'Итоговая сумма',
      checkout: 'Оформить заказ',
      back: 'Назад',
      confirm: 'Подтвердить',
      success: 'Спасибо!',
      successDesc: 'Ваш заказ принят. Мы скоро свяжемся с вами.',
      form: {
        firstName: 'Имя',
        lastName: 'Фамилия',
        phone: 'Телефон',
        description: 'Комментарий',
        required: 'Заполните все поля',
        phoneError: 'Неверный номер'
      }
    },
    ai: {
      welcome: 'Здравствуйте! Я ИИ-консультант Simosh. Помогу подобрать лучшее мыло по типу вашей кожи.',
      title: 'ИИ Эксперт',
      desc: 'Получайте ответы на вопросы за секунды.',
      placeholder: 'Напишите ваш вопрос...',
      error: 'Системная ошибка.',
      quotaError: 'Лимит исчерпан.',
      speaking: 'Говорит...',
      listen: 'Слушать'
    },
    about: {
      title: 'О нас',
      subtitle: 'История Simosh',
      experience: 'Лет опыта',
      addressLabel: 'Главный офис',
      phoneLabel: 'Линия поддержки'
    },
    footer: {
      mission: 'Наша миссия — дарить людям здоровье и красоту через натуральное мыло.',
      pages: 'Разделы',
      contact: 'Контакты',
      rights: 'Все права защищены.'
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
      ru: ['Антисептик', 'Против акне']
    },
    category: 'therapeutic'
  }
];

export const getSystemInstruction = (lang: Language, dynamicProducts?: Product[], aboutInfo?: AboutInfo | null) => {
  const productList = dynamicProducts && dynamicProducts.length > 0 
    ? dynamicProducts.map((p, i) => `${i + 1}. ${p.name[lang]} - Narxi: ${p.price} UZS.`).join('\n')
    : PRODUCTS.map((p, i) => `${i + 1}. ${p.name[lang]} - Narxi: ${p.price} UZS.`).join('\n');

  return `Siz "Simosh" kompaniyasining shifobaxsh sovunlar bo'yicha mutaxassisiz. Foydalanuvchi bilan ${lang} tilida muloqot qiling. Mahsulotlar: \n${productList}`;
};
