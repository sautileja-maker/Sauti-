import { Transaction, Product } from './types';

const STORAGE_KEYS = {
  user: 'sautileja_user',
  transactions: 'sautileja_transactions',
  inventory: 'sautileja_inventory',
  subscription: 'sautileja_subscription',
  session: 'sautileja_session',
  chat_history: 'sautileja_chat_history',
};

// User Management
export const saveUser = (user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  }
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem(STORAGE_KEYS.user);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const clearUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.session);
  }
};

// Session Management
export const saveSession = (session: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
  }
};

export const getSession = () => {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem(STORAGE_KEYS.session);
    return session ? JSON.parse(session) : null;
  }
  return null;
};

export const isLoggedIn = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem(STORAGE_KEYS.session);
  }
  return false;
};

// Transaction Management
export const saveTransaction = (transaction: Transaction) => {
  if (typeof window !== 'undefined') {
    const transactions = getTransactions();
    transactions.push(transaction);
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
  }
};

export const getTransactions = (): Transaction[] => {
  if (typeof window !== 'undefined') {
    const transactions = localStorage.getItem(STORAGE_KEYS.transactions);
    return transactions ? JSON.parse(transactions) : [];
  }
  return [];
};

export const updateTransaction = (id: string, updates: Partial<Transaction>) => {
  if (typeof window !== 'undefined') {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
    }
  }
};

export const deleteTransaction = (id: string) => {
  if (typeof window !== 'undefined') {
    const transactions = getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(filtered));
  }
};

// Inventory Management
export const saveProduct = (product: Product) => {
  if (typeof window !== 'undefined') {
    const products = getProducts();
    products.push(product);
    localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(products));
  }
};

export const getProducts = (): Product[] => {
  if (typeof window !== 'undefined') {
    const products = localStorage.getItem(STORAGE_KEYS.inventory);
    return products ? JSON.parse(products) : [];
  }
  return [];
};

export const updateProduct = (id: string, updates: Partial<Product>) => {
  if (typeof window !== 'undefined') {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(products));
    }
  }
};

export const deleteProduct = (id: string) => {
  if (typeof window !== 'undefined') {
    const products = getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(filtered));
  }
};

// Subscription Management
export const saveSubscription = (planId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.subscription, planId);
  }
};

export const getSubscription = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.subscription) || 'free';
  }
  return 'free';
};

// Chat History
export const saveChatMessage = (message: any) => {
  if (typeof window !== 'undefined') {
    const history = getChatHistory();
    history.push(message);
    localStorage.setItem(STORAGE_KEYS.chat_history, JSON.stringify(history));
  }
};

export const getChatHistory = () => {
  if (typeof window !== 'undefined') {
    const history = localStorage.getItem(STORAGE_KEYS.chat_history);
    return history ? JSON.parse(history) : [];
  }
  return [];
};

export const clearChatHistory = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.chat_history);
  }
};
