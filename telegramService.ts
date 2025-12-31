
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_IDS, FRONTEND_URL } from './constants';
import { CartItem, Language } from './types';

export const sendOrderToTelegram = async (
  userData: { firstName: string; lastName: string; phone: string; description: string },
  cart: CartItem[],
  total: number,
  lang: Language
) => {
  const date = new Date().toLocaleString();
  const productList = cart
    .map((item) => `• <b>${item.name[lang]}</b> x ${item.quantity} - ${(item.price * item.quantity).toLocaleString()} UZS`)
    .join('\n');

  const message = `
🚀 <b>YANGI BUYURTMA QABUL QILINDI!</b>
━━━━━━━━━━━━━━━━━━
📅 <b>Sana:</b> ${date}

👤 <b>MIJOZ MA'LUMOTLARI:</b>
👤 <b>Ism:</b> ${userData.firstName}
👥 <b>Familiya:</b> ${userData.lastName}
📞 <b>Telefon:</b> <code>${userData.phone}</code>
📝 <b>Izoh:</b> <i>${userData.description || 'Izoh qoldirilmagan'}</i>

🛒 <b>MAHSULOTLAR:</b>
${productList}

💰 <b>JAMI SUMMA:</b> <u>${total.toLocaleString()} UZS</u>
━━━━━━━━━━━━━━━━━━
  `.trim();

  const requests = TELEGRAM_CHAT_IDS.map((chatId) =>
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🛍 Buyurtmani boshqarish (Web App)",
                web_app: { url: FRONTEND_URL }
              }
            ]
          ]
        }
      }),
    })
  );

  try {
    const responses = await Promise.all(requests);
    return responses.every(r => r.ok);
  } catch (error) {
    console.error('Telegram API Error:', error);
    return false;
  }
};
