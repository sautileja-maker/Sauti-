export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  businessType: string;
  language: string;
}

export interface Transaction {
  id: string;
  productName: string;
  quantity: number;
  revenue: number;
  category: string;
  date: string;
}

export interface Product {
  id: string;
  productName: string;
  category: string;
  stockQuantity: number;
  costPrice: number;
  sellingPrice: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  badge?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
