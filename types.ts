
export type Language = 'uz' | 'en' | 'tr' | 'ru';

export interface MultiLangContent {
  uz: string;
  en: string;
  tr: string;
  ru: string;
}

export interface Product {
  id: string;
  name: MultiLangContent;
  description: MultiLangContent;
  price: number;
  image: string;
  benefits: {
    uz: string[];
    en: string[];
    tr: string[];
    ru: string[];
  };
  category: 'natural' | 'therapeutic' | 'beauty';
}

export interface APIProduct {
  id: string;
  nameUz: string;
  nameRu: string;
  nameTr: string;
  nameEn: string;
  descUz: string;
  descRu: string;
  descTr: string;
  descEn: string;
  price: number;
  imgUrl: string;
  imgName: string;
  imgSize: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 string for display and processing
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface LogoResponse {
  imgUrl: string;
  imgName: string;
  imgSize: number;
}

export interface AboutInfo {
  descriptionUz: string;
  descriptionRu: string;
  descriptionTr: string;
  descriptionEn: string;
  officeAddressUz: string;
  officeAddressRu: string;
  officeAddressTr: string;
  officeAddressEn: string;
  instagram: string;
  telegram: string;
  phone: string;
}
