
import { API_BASE_URL } from "./constants";
import { APIProduct, Product } from "./types";

export const fetchActiveProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/active`);
    if (response.ok) {
      const apiProducts = await response.json();
      
      // API'dan kelgan ma'lumot massiv ekanligini tekshiramiz
      if (!Array.isArray(apiProducts)) {
        console.warn("API did not return an array of products:", apiProducts);
        return [];
      }

      return apiProducts.map((api: APIProduct) => ({
        id: api.id,
        name: {
          uz: api.nameUz || '',
          ru: api.nameRu || '',
          tr: api.nameTr || '',
          en: api.nameEn || ''
        },
        description: {
          uz: api.descUz || '',
          ru: api.descRu || '',
          tr: api.descTr || '',
          en: api.descEn || ''
        },
        price: api.price || 0,
        image: api.imgUrl || 'https://picsum.photos/seed/soap/600/600',
        benefits: {
          uz: ['Tabiiy', 'Shifobaxsh'],
          en: ['Natural', 'Healing'],
          tr: ['Doğal', 'Şifalı'],
          ru: ['Натуральное', 'Лечебное']
        },
        category: 'natural'
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching active products:", error);
    return [];
  }
};
