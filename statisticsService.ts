
import { API_BASE_URL } from "./constants";
import { Statistics } from "./types";

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
 * Umumiy statistikani olish
 */
export const fetchStatistics = async (): Promise<Statistics | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return null;
  }
};

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
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Network error while saving order:", error);
    return false;
  }
};
