
import { API_BASE_URL } from "./constants";

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface OrderPayload {
  items: OrderItem[];
  status: "IN_PROGRESS";
  firstName: string;
  lastName: string;
  phone: string;
  description: string;
}

/**
 * Buyurtmani statistikaga va bazaga qayd etish
 */
export const createOrder = async (orderData: OrderPayload): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics/sale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      console.log("Sotuv muvaffaqiyatli qayd etildi");
      return true;
    } else {
      console.warn(`Statistika qayd etishda xatolik: ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error("Statistika API bilan ulanishda xatolik:", error);
    return false;
  }
};
