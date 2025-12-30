
/**
 * Telefon raqami formatini qat'iy tekshirish
 * Uzbekistan: +998 [9 ta raqam]
 * Turkey: +90 [10 ta raqam]
 * @param code Davlat kodi (+998 yoki +90)
 * @param phone Formatlangan yoki formatlanmagan raqam
 * @returns boolean
 */
export const isValidPhoneParts = (code: string, phone: string): boolean => {
  const digits = phone.replace(/\D/g, ''); // Faqat raqamlarni qoldirish
  
  if (code === '+998') {
    return digits.length === 9; // O'zbekiston: 9 ta raqam
  }
  if (code === '+90') {
    return digits.length === 10; // Turkiya: 10 ta raqam
  }
  
  return false;
};

/**
 * Raqamlarni kiritish vaqtida formatlash
 * UZ (+998): 94 750 97 38
 * TR (+90): 505 123 45 67
 */
export const formatDisplayPhone = (code: string, input: string): string => {
  const digits = input.replace(/\D/g, '');
  
  if (code === '+998') {
    // 94 750 97 38
    let res = '';
    if (digits.length > 0) res += digits.substring(0, 2);
    if (digits.length > 2) res += ' ' + digits.substring(2, 5);
    if (digits.length > 5) res += ' ' + digits.substring(5, 7);
    if (digits.length > 7) res += ' ' + digits.substring(7, 9);
    return res.trim();
  }
  
  if (code === '+90') {
    // 505 123 45 67
    let res = '';
    if (digits.length > 0) res += digits.substring(0, 3);
    if (digits.length > 3) res += ' ' + digits.substring(3, 6);
    if (digits.length > 6) res += ' ' + digits.substring(6, 8);
    if (digits.length > 8) res += ' ' + digits.substring(8, 10);
    return res.trim();
  }
  
  return digits;
};

/**
 * To'liq telefon raqamini formatlash (Telegramga yuborish uchun)
 */
export const formatFullPhone = (code: string, phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  return `${code}${digits}`;
};

/**
 * Eskicha formatni qo'llab-quvvatlash uchun
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  // Agar + bilan boshlansa va kodi bo'lsa
  if (phone.startsWith('+998')) return cleaned.length === 12;
  if (phone.startsWith('+90')) return cleaned.length === 12;
  return false;
};

export const formatPhoneForTelegram = (phone: string): string => {
  return phone.replace(/\D/g, '');
};
