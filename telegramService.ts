
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_IDS } from './constants';
import { CartItem, Language } from './types';

export const sendOrderToTelegram = async (
  userData: { firstName: string; lastName: string; phone: string },
  cart: CartItem[],
  total: number,
  lang: Language
) => {
  const date = new Date().toLocaleString();
  const productList = cart
    .map((item) => `📦 ${item.name[lang]} x ${item.quantity} - ${(item.price * item.quantity).toLocaleString()} UZS`)
    .join('\n');

  const message = `
🆕 YANGI BUYURTMA!
📅 Sana: ${date}

👤 MIJOZ:
- Ism: ${userData.firstName}
- Familiya: ${userData.lastName}
- Tel: ${userData.phone}

🛒 MAHSULOTLAR:
${productList}

💰 JAMI: ${total.toLocaleString()} UZS
  `.trim();

  const requests = TELEGRAM_CHAT_IDS.map((chatId) =>
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })
  );

  try {
    await Promise.all(requests);
    return true;
  } catch (error) {
    console.error('Telegram API Error:', error);
    return false;
  }
};
