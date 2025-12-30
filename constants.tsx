
import { Product, Language, AboutInfo } from './types';

export const API_BASE_URL = 'https://codebyz.online';
export const TELEGRAM_BOT_TOKEN = '8519627435:AAGMI8QPtKCPW85GR4Hv0yqDc90HKePs4LM';
export const TELEGRAM_CHAT_IDS = ['7571971490', '7882316826'];

export const TRANSLATIONS: Record<Language, any> = {
  uz: {
    nav: { home: 'Bosh sahifa', products: 'Mahsulotlar', about: 'Biz haqimizda' },
    hero: {
      badge: '100% Tabiiy va Shifobaxsh',
      title: 'Sizning Terigingiz',
      titleAccent: 'Tabiat Ehsoni',
      desc: '"Simosh" sovunlari asrlar davomida sinalgan tabiiy usullar va zamonaviy texnologiyalar uyg\'unligida yaratilgan. Terini nafaqat tozalaydi, balki davolaydi.',
      buy: 'Hozir xarid qilish',
      ai: 'AI Maslahatchi',
      feature1: 'Bez ziyan kimyoviy moddalar',
      feature2: 'Eko-do\'stona'
    },
    products: {
      title: "Bizning To'plamimiz",
      desc: "Har bir sovunimiz tabiiy o'simlik ekstraktlari va shifobaxsh moylardan tayyorlangan. Siz uchun eng ma'qulini tanlang."
    },
    about: {
      title: 'Biz Haqimizda',
      subtitle: 'Simosh Hikoyasi',
      addressLabel: 'Ofis Manzili',
      phoneLabel: 'Bog\'lanish',
      socialLabel: 'Ijtimoiy Tarmoqlar',
      experience: 'Yillik Tajriba'
    },
    ai: {
      title: 'Aqlli Teri Konsultanti',
      desc: 'Sun\'iy intellekt yordamida o\'zingizga mos keladigan shifobaxsh sovunni tanlang. Sizning teri turingiz va muammolaringizga qarab eng yaxshi echimni taklif qilamiz.',
      feature1Title: 'Shaxsiy tavsiyalar',
      feature1Desc: 'Faqat sizning muammolaringizga yo\'naltirilgan maslahatlar.',
      feature2Title: '24/7 Aloqa',
      feature2Desc: 'Istalgan vaqtda savollaringizga javob oling.',
      welcome: 'Assalomu alaykum! Men Simosh AI maslahatchisiman. Terigingiz qanday muammolari bor yoki qaysi sovunimiz sizga mos kelishini bilmoqchimisiz?',
      placeholder: 'Teri muammolaringiz haqida yozing...',
      error: 'Uzr, javob olishda xatolik yuz berdi.'
    },
    cart: {
      title: 'Savat',
      empty: 'Savat bo\'sh',
      emptyDesc: 'Hali hech narsa qo\'shmabsiz.',
      start: 'Xarid qilishni boshlash',
      total: 'Jami summa',
      checkout: 'Rasmiylashtirish',
      back: 'Savatga qaytish',
      confirm: 'Buyurtmani tasdiqlash',
      success: 'Buyurtma qabul qilindi!',
      successDesc: 'Tez orada operatorlarimiz siz bilan bog\'lanishadi.',
      form: {
        firstName: 'Ismingiz',
        lastName: 'Familiyangiz',
        phone: 'Telefon raqamingiz',
        required: 'Barcha maydonlarni to\'ldiring'
      }
    },
    footer: {
      mission: 'Bizning vazifamiz — insonlarga tabiat kuchidan foydalanib salomatlik va go\'zallik ulashish. Har bir mahsulotimizda mehr va shifo bor.',
      pages: 'Sahifalar',
      contact: 'Bog\'lanish',
      rights: 'Barcha huquqlar himoyalangan.'
    }
  },
  en: {
    nav: { home: 'Home', products: 'Products', about: 'About Us' },
    hero: {
      badge: '100% Natural & Healing',
      title: 'Your Skin Is A',
      titleAccent: 'Gift of Nature',
      desc: 'Simosh soaps are crafted with centuries-old natural methods combined with modern technology. It doesn\'t just clean; it heals.',
      buy: 'Shop Now',
      ai: 'AI Assistant',
      feature1: 'No harmful chemicals',
      feature2: 'Eco-friendly'
    },
    products: {
      title: 'Our Collection',
      desc: 'Each of our soaps is made from natural plant extracts and healing oils. Choose the best one for you.'
    },
    about: {
      title: 'About Us',
      subtitle: 'Simosh Story',
      addressLabel: 'Office Address',
      phoneLabel: 'Contact Us',
      socialLabel: 'Social Media',
      experience: 'Years of Experience'
    },
    ai: {
      title: 'Smart Skin Consultant',
      desc: 'Choose the healing soap that suits you with the help of artificial intelligence. We offer the best solution based on your skin type and problems.',
      feature1Title: 'Personalized Recommendations',
      feature1Desc: 'Advice focused specifically on your issues.',
      feature2Title: '24/7 Support',
      feature2Desc: 'Get answers to your questions at any time.',
      welcome: 'Hello! I am the Simosh AI consultant. Do you have any skin problems or want to know which soap suits you best?',
      placeholder: 'Write about your skin concerns...',
      error: 'Sorry, an error occurred while getting a response.'
    },
    cart: {
      title: 'Cart',
      empty: 'Cart is empty',
      emptyDesc: 'You haven\'t added anything yet.',
      start: 'Start Shopping',
      total: 'Total Amount',
      checkout: 'Checkout',
      back: 'Back to Cart',
      confirm: 'Confirm Order',
      success: 'Order Accepted!',
      successDesc: 'Our operators will contact you soon.',
      form: {
        firstName: 'First Name',
        lastName: 'Last Name',
        phone: 'Phone Number',
        required: 'Please fill all fields'
      }
    },
    footer: {
      mission: 'Our mission is to share health and beauty by using the power of nature. There is love and healing in every product.',
      pages: 'Pages',
      contact: 'Contact',
      rights: 'All rights reserved.'
    }
  },
  tr: {
    nav: { home: 'Anasayfa', products: 'Ürünler', about: 'Hakkımızda' },
    hero: {
      badge: '%100 Doğal ve Şifalı',
      title: 'Cildiniz Doğanın',
      titleAccent: 'Bir Hediyesidir',
      desc: 'Simosh sabunları, yüzyıllık doğal yöntemlerin modern teknoloji ile birleşimiyle üretilir. Sadece temizlemez, iyileştirir.',
      buy: 'Şimdi Satın Al',
      ai: 'AI Danışmanı',
      feature1: 'Zararlı kimyasal yok',
      feature2: 'Çevre dostu'
    },
    products: {
      title: 'Koleksiyonumuz',
      desc: 'Sabunlarımızın her biri doğal bitki özleri ve şifalı yağlardan yapılmıştır. Sizin için en iyisini seçin.'
    },
    about: {
      title: 'Hakkımızda',
      subtitle: 'Simosh Hikoyasi',
      addressLabel: 'Ofis Adresi',
      phoneLabel: 'Bize Ulaşın',
      socialLabel: 'Sosyal Medya',
      experience: 'Yıllık Deneyim'
    },
    ai: {
      title: 'Akıllı Cilt Danışmanı',
      desc: 'Yapay zeka yardımıyla size uygun şifalı sabunu seçin. Cilt tipinize ve sorunlarınıza göre en iyi çözümü sunuyoruz.',
      feature1Title: 'Kişisel Tavsiyeler',
      feature1Desc: 'Sadece sizin sorunlarınıza odaklanan tavsiyeler.',
      feature2Title: '7/24 İletişim',
      feature2Desc: 'Sorularınıza istediğiniz zaman yanıt alın.',
      welcome: 'Merhaba! Ben Simosh AI danışmanıyım. Cilt sorunlarınız mı var yoksa hangi sabunumuzun size uygun olduğunu mu bilmek istersiniz?',
      placeholder: 'Cilt sorunlarınız hakkında yazın...',
      error: 'Üzgünüz, cevap alınırken bir hata oluştu.'
    },
    cart: {
      title: 'Sepet',
      empty: 'Sepet boş',
      emptyDesc: 'Henüz hiçbir şey eklemediniz.',
      start: 'Alışverişe Başla',
      total: 'Toplam Tutar',
      checkout: 'Ödemeye Geç',
      back: 'Sepete Dön',
      confirm: 'Siparişi Onayla',
      success: 'Sipariş Kabul Edildi!',
      successDesc: 'Operatörlerimiz yakında sizinle iletişime geçecektir.',
      form: {
        firstName: 'Adınız',
        lastName: 'Soyadınız',
        phone: 'Telefon Numaranız',
        required: 'Lütfen tüm alanları doldurun'
      }
    },
    footer: {
      mission: 'Misyonumuz, doğanın gücünü kullanarak sağlık ve güzelliği paylaşmaktır. Her ürünümüzde sevgi ve şifa var.',
      pages: 'Sayfalar',
      contact: 'İletişim',
      rights: 'Tüm hakları saklıdır.'
    }
  },
  ru: {
    nav: { home: 'Главная', products: 'Продукты', about: 'О нас' },
    hero: {
      badge: '100% Натурально и Лечебно',
      title: 'Ваша Кожа —',
      titleAccent: 'Дар Природы',
      desc: 'Мыло Simosh создано на основе вековых натуральных методов в сочетании с современными технологиями. Оно не просто очищает, оно лечит.',
      buy: 'Купить сейчас',
      ai: 'ИИ Консультант',
      feature1: 'Без вредных химикатов',
      feature2: 'Эко-дружелюбно'
    },
    products: {
      title: 'Наша Коллекция',
      desc: 'Каждое наше мыло изготовлено из натуральных растительных экстрактов и целебных масел. Выберите лучшее для себя.'
    },
    about: {
      title: 'О нас',
      subtitle: 'История Simosh',
      addressLabel: 'Адрес офиса',
      phoneLabel: 'Связаться с нами',
      socialLabel: 'Социальные сети',
      experience: 'Лет опыта'
    },
    ai: {
      title: 'Умный Консультант по Коже',
      desc: 'Выберите подходящее вам лечебное мыло с помощью искусственного интеллекта. Мы предложим лучшее решение на основе вашего типа кожи и проблем.',
      feature1Title: 'Личные рекомендации',
      feature1Desc: 'Советы, ориентированные именно на ваши проблемы.',
      feature2Title: 'Связь 24/7',
      feature2Desc: 'Получайте ответы на вопросы в любое время.',
      welcome: 'Здравствуйте! Я ИИ-консультант Simosh. У вас есть проблемы с кожей или вы хотите узнать, какое мыло вам подходит?',
      placeholder: 'Напишите о своих проблемах с кожей...',
      error: 'Извините, произошла ошибка при получении ответа.'
    },
    cart: {
      title: 'Корзина',
      empty: 'Корзина пуста',
      emptyDesc: 'Вы еще ничего не добавили.',
      start: 'Начать покупки',
      total: 'Итоговая сумма',
      checkout: 'Оформить заказ',
      back: 'Назад в корзину',
      confirm: 'Подтвердить заказ',
      success: 'Заказ принят!',
      successDesc: 'Наши операторы свяжутся с вами в ближайшее время.',
      form: {
        firstName: 'Имя',
        lastName: 'Фамилия',
        phone: 'Номер телефона',
        required: 'Пожалуйста, заполните все поля'
      }
    },
    footer: {
      mission: 'Наша миссия — делиться здоровьем и красотой, используя силу природы. В каждом нашем продукте есть любовь и исцеление.',
      pages: 'Страницы',
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
  },
  {
    id: '2',
    name: { uz: 'Zaytun Moyli Sovun', en: 'Olive Oil Soap', tr: 'Zeytinyağı Sabunu', ru: 'Оливковое мыло' },
    description: {
      uz: 'Quruq terini namlaydi va yoshartiradi. Tarkibida E vitamini mavjud.',
      en: 'Moisturizes and rejuvenates dry skin. Contains Vitamin E.',
      tr: 'Kuru cildi nemlendirir ve gençleştirir. E vitamini içerir.',
      ru: 'Увлажняет и омолаживает сухую кожу. Содержит витамин Е.'
    },
    price: 22000,
    image: 'https://picsum.photos/seed/soap2/600/600',
    benefits: {
      uz: ['Namlantiruvchi', 'Antioksidant'],
      en: ['Moisturizing', 'Antioxidant'],
      tr: ['Nemlendirici', 'Antioksidan'],
      ru: ['Увлажняющее', 'Антиоксидант']
    },
    category: 'natural'
  }
];

export const getSystemInstruction = (lang: Language, dynamicProducts?: Product[], aboutInfo?: AboutInfo | null) => {
  const productList = dynamicProducts && dynamicProducts.length > 0 
    ? dynamicProducts.map((p, i) => `${i + 1}. ${p.name[lang]} - Narxi: ${p.price} UZS. Tavsif: ${p.description[lang]}`).join('\n')
    : PRODUCTS.map((p, i) => `${i + 1}. ${p.name[lang]} - Narxi: ${p.price} UZS. Tavsif: ${p.description[lang]}`).join('\n');

  const companyDesc = aboutInfo ? (
    lang === 'uz' ? aboutInfo.descriptionUz :
    lang === 'ru' ? aboutInfo.descriptionRu :
    lang === 'tr' ? aboutInfo.descriptionTr :
    aboutInfo.descriptionEn
  ) : 'Tabiiy shifobaxsh sovunlar ishlab chiqaruvchi Simosh kompanoyasi.';

  const companyAddress = aboutInfo ? (
    lang === 'uz' ? aboutInfo.officeAddressUz :
    lang === 'ru' ? aboutInfo.officeAddressRu :
    lang === 'tr' ? aboutInfo.officeAddressTr :
    aboutInfo.officeAddressEn
  ) : 'Toshkent shahar';

  return `
Siz "Simosh" kompaniyasining professional va samimiy teri parvarishi bo'yicha ekspertisiz. 
Sizning asosiy vazifangiz - foydalanuvchining teri turini (quruq, yog'li, aralash) yoki muammosini (husnbuzar, dog'lar, sezgirlik) aniqlab, unga bizning mahsulotlarimizdan eng mosini tavsiya qilishdir.

Kompaniya haqida ma'lumot:
${companyDesc}
Manzil: ${companyAddress}
Telefon: ${aboutInfo?.phone || '+998 90 123 45 67'}
Ijtimoiy tarmoqlar: Instagram: ${aboutInfo?.instagram || '@simosh_uz'}, Telegram: ${aboutInfo?.telegram || 't.me/simosh_uz'}

Hozirda sotuvda mavjud mahsulotlarimiz (faqat shularni tavsiya qiling):
${productList}

Muloqot qoidalari:
1. Faqat ${lang === 'uz' ? 'o\'zbek' : lang === 'en' ? 'ingliz' : lang === 'tr' ? 'turk' : 'rus'} tilida gapiring.
2. Har doim professional, ammo juda samimiy bo'ling.
3. Agar foydalanuvchi mahsulotlar ro'yxatida yo'q narsani so'rasa, xushmuomalalik bilan bizda faqat yuqoridagi mahsulotlar borligini ayting.
4. Foydalanuvchidan terisi haqida ko'proq ma'lumot so'rang (yog'limi yoki quruqmi?).
5. Tavsiya qilganingizda narxini ham eslatib o'ting.
`;
};
