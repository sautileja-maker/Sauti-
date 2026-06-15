import { Transaction, Product } from './types';

// Mock AI Insights Generator
export const generateAIInsights = (transactions: Transaction[], products: Product[]) => {
  const insights = [];

  // Best selling products
  if (transactions.length > 0) {
    const productSales: { [key: string]: number } = {};
    transactions.forEach(t => {
      productSales[t.productName] = (productSales[t.productName] || 0) + t.quantity;
    });
    
    const bestSeller = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0];
    if (bestSeller) {
      insights.push(`${bestSeller[0]} is your best-selling product with ${bestSeller[1]} units sold.`);
    }
  }

  // Revenue trends
  if (transactions.length > 0) {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.revenue, 0);
    const lastWeekRevenue = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return tDate > weekAgo;
      })
      .reduce((sum, t) => sum + t.revenue, 0);
    
    if (lastWeekRevenue > 0) {
      const growth = Math.round(((totalRevenue - lastWeekRevenue) / lastWeekRevenue) * 100);
      insights.push(`Revenue increased by ${Math.abs(growth)}% this week.`);
    }
  }

  // Low stock warnings
  products.forEach(p => {
    if (p.stockQuantity < 5) {
      insights.push(`Consider restocking ${p.productName}. Current stock: ${p.stockQuantity} units.`);
    }
  });

  // Profit margins
  if (products.length > 0) {
    const highMarginProducts = products
      .map(p => ({
        name: p.productName,
        margin: ((p.sellingPrice - p.costPrice) / p.costPrice * 100),
      }))
      .sort((a, b) => b.margin - a.margin)
      .slice(0, 2);
    
    if (highMarginProducts.length > 0) {
      insights.push(`${highMarginProducts[0].name} has the highest profit margin at ${Math.round(highMarginProducts[0].margin)}%.`);
    }
  }

  return insights.slice(0, 5);
};

// Mock SautiBot Responses
export const generateSautiBotResponse = (
  question: string,
  transactions: Transaction[],
  products: Product[],
  language: string
): string => {
  const lowerQuestion = question.toLowerCase();

  // Sales queries
  if (lowerQuestion.includes('sales') || lowerQuestion.includes('sell')) {
    const totalSales = transactions.reduce((sum, t) => sum + t.revenue, 0);
    return language === 'sw' 
      ? `Jumla ya mauzo yako ni KES ${totalSales.toLocaleString()}.`
      : `Your total sales are KES ${totalSales.toLocaleString()}.`;
  }

  // Weekly sales
  if (lowerQuestion.includes('week')) {
    const weekSales = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return tDate > weekAgo;
      })
      .reduce((sum, t) => sum + t.revenue, 0);
    return language === 'sw'
      ? `Mauzo ya juma hili ni KES ${weekSales.toLocaleString()}.`
      : `This week's sales are KES ${weekSales.toLocaleString()}.`;
  }

  // Restock queries
  if (lowerQuestion.includes('restock') || lowerQuestion.includes('low stock')) {
    const lowStockProducts = products.filter(p => p.stockQuantity < 5);
    if (lowStockProducts.length === 0) {
      return language === 'sw' ? 'Bidhaa zako zote zina hazina nzuri.' : 'All your products have good stock levels.';
    }
    return language === 'sw'
      ? `Unahitaji kujenga hazina ya: ${lowStockProducts.map(p => p.productName).join(', ')}`
      : `You should restock: ${lowStockProducts.map(p => p.productName).join(', ')}`;
  }

  // Best seller
  if (lowerQuestion.includes('best') || lowerQuestion.includes('top')) {
    const productSales: { [key: string]: number } = {};
    transactions.forEach(t => {
      productSales[t.productName] = (productSales[t.productName] || 0) + t.quantity;
    });
    const bestSeller = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0];
    if (bestSeller) {
      return language === 'sw'
        ? `Bidhaa yenye mauzo mengi ni ${bestSeller[0]} na vitengo ${bestSeller[1]}.`
        : `Your best-selling product is ${bestSeller[0]} with ${bestSeller[1]} units sold.`;
    }
  }

  // Default response
  return language === 'sw'
    ? 'Je, unaweza kuuliza kitu kingine? Naposeza kusaidia kwa mauzo, hazina, au ripoti.'
    : 'What else would you like to know? I can help with sales, inventory, or reports.';
};
