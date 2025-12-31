
/**
 * Telefon raqami formatini qat'iy tekshirish
 * Uzbekistan: +998 [9 ta raqam]
 * Turkey: +90 [10 ta raqam]
 */
export const isValidPhoneParts = (code: string, phone: string): boolean => {
  const digits = phone.replace(/\D/g, ''); 
  if (code === '+998') return digits.length === 9;
  if (code === '+90') return digits.length === 10;
  return false;
};

/**
 * Raqamlarni kiritish vaqtida formatlash (faqat raqam qismi)
 */
export const formatDisplayPhone = (code: string, input: string): string => {
  const digits = input.replace(/\D/g, '');
  if (code === '+998') {
    let res = '';
    if (digits.length > 0) res += digits.substring(0, 2);
    if (digits.length > 2) res += ' ' + digits.substring(2, 5);
    if (digits.length > 5) res += ' ' + digits.substring(5, 7);
    if (digits.length > 7) res += ' ' + digits.substring(7, 9);
    return res.trim();
  }
  if (code === '+90') {
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
 * Telegram bot uchun chiroyli format: +998 90 123 45 67
 */
export const formatPrettyPhone = (code: string, phone: string): string => {
  const display = formatDisplayPhone(code, phone);
  return `${code} ${display}`;
};

/**
 * Statistika API uchun to'liq probellarsiz raqam: +998901234567
 */
export const formatFullPhone = (code: string, phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  return `${code}${digits}`;
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  if (phone.startsWith('+998')) return cleaned.length === 12;
  if (phone.startsWith('+90')) return cleaned.length === 12;
  return false;
};
