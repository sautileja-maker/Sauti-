// localStorage utilities for managing user data

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  businessName?: string;
  businessType?: string;
  language: string;
  password?: string;
}

export interface Session {
  userId: string;
  loginTime: string;
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

// User Management
export const saveUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sautileja_user', JSON.stringify(user));
  }
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('sautileja_user');
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export const clearUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sautileja_user');
    localStorage.removeItem('sautileja_session');
  }
};

// Session Management
export const saveSession = (session: Session) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sautileja_session', JSON.stringify(session));
  }
};

export const getSession = (): Session | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('sautileja_session');
    return data ? JSON.parse(data) : null;
  }
  return null;
};

// Transactions Management
export const saveTransaction = (transaction: Transaction) => {
  if (typeof window !== 'undefined') {
    const existing = getTransactions();
    existing.push(transaction);
    localStorage.setItem('sautileja_transactions', JSON.stringify(existing));
  }
};

export const getTransactions = (): Transaction[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('sautileja_transactions');
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const updateTransaction = (id: string, updates: Partial<Transaction>) => {
  if (typeof window !== 'undefined') {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      localStorage.setItem('sautileja_transactions', JSON.stringify(transactions));
    }
  }
};

export const deleteTransaction = (id: string) => {
  if (typeof window !== 'undefined') {
    const transactions = getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    localStorage.setItem('sautileja_transactions', JSON.stringify(filtered));
  }
};

// Products Management
export const saveProduct = (product: Product) => {
  if (typeof window !== 'undefined') {
    const existing = getProducts();
    existing.push(product);
    localStorage.setItem('sautileja_products', JSON.stringify(existing));
  }
};

export const getProducts = (): Product[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('sautileja_products');
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const updateProduct = (id: string, updates: Partial<Product>) => {
  if (typeof window !== 'undefined') {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      localStorage.setItem('sautileja_products', JSON.stringify(products));
    }
  }
};

export const deleteProduct = (id: string) => {
  if (typeof window !== 'undefined') {
    const products = getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem('sautileja_products', JSON.stringify(filtered));
  }
};

// Subscription Management
export const getSubscription = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sautileja_subscription') || 'free';
  }
  return 'free';
};

export const setSubscription = (plan: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sautileja_subscription', plan);
  }
};
