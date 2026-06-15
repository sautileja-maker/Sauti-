// AI utility functions for generating insights and bot responses

import { Transaction, Product } from './localStorage';

export const generateAIInsights = (transactions: Transaction[], products: Product[]): string[] => {
  const insights: string[] = [];

  if (transactions.length === 0 || products.length === 0) {
    return ['Start tracking transactions to get AI insights'];
  }

  // Calculate metrics
  const totalRevenue = transactions.reduce((sum, t) => sum + t.revenue, 0);
  const avgTransaction = totalRevenue / transactions.length;
  const lowStockProducts = products.filter(p => p.stockQuantity < 5);
  const highMarginProducts = products.filter(
    p => (p.sellingPrice - p.costPrice) / p.costPrice > 0.5
  );

  // Generate insights
  if (avgTransaction < 1000) {
    insights.push('Your average transaction is low. Consider bundling products to increase sales.');
  }

  if (lowStockProducts.length > 0) {
    insights.push(
      `You have ${lowStockProducts.length} product(s) with low stock. Reorder soon to avoid stock-outs.`
    );
  }

  if (highMarginProducts.length > 0) {
    insights.push(
      `Focus on selling ${highMarginProducts.slice(0, 2).map(p => p.productName).join(', ')}. They have the highest profit margins.`
    );
  }

  // Weekly trend
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyRevenue = transactions
    .filter(t => new Date(t.date) > weekAgo)
    .reduce((sum, t) => sum + t.revenue, 0);

  if (weeklyRevenue > totalRevenue * 0.3) {
    insights.push('Great week! Your sales are performing well. Keep up the momentum.');
  }

  return insights;
};

export const generateSautiBotResponse = (
  question: string,
  transactions: Transaction[],
  products: Product[],
  language: string
): string => {
  const lowerQuestion = question.toLowerCase();

  // Sales questions
  if (lowerQuestion.includes('sale') || lowerQuestion.includes('revenue') || lowerQuestion.includes('earn')) {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.revenue, 0);
    return `Your total revenue is KES ${totalRevenue.toLocaleString()}. You have made ${transactions.length} transactions so far.`;
  }

  // Stock questions
  if (lowerQuestion.includes('stock') || lowerQuestion.includes('restock') || lowerQuestion.includes('inventory')) {
    const lowStock = products.filter(p => p.stockQuantity < 5);
    if (lowStock.length > 0) {
      return `You need to restock: ${lowStock.map(p => `${p.productName} (${p.stockQuantity} units)`).join(', ')}`;
    }
    return 'All your products have good stock levels. Well managed!';
  }

  // Profit questions
  if (lowerQuestion.includes('profit') || lowerQuestion.includes('margin') || lowerQuestion.includes('profitable')) {
    const sorted = products.sort((a, b) => {
      const marginA = (a.sellingPrice - a.costPrice) / a.costPrice;
      const marginB = (b.sellingPrice - b.costPrice) / b.costPrice;
      return marginB - marginA;
    });
    if (sorted.length > 0) {
      const best = sorted[0];
      const margin = ((best.sellingPrice - best.costPrice) / best.costPrice * 100).toFixed(1);
      return `Your most profitable product is ${best.productName} with a ${margin}% profit margin.`;
    }
  }

  // Product questions
  if (lowerQuestion.includes('product') || lowerQuestion.includes('sell')) {
    const salesCount: { [key: string]: number } = {};
    transactions.forEach(t => {
      salesCount[t.productName] = (salesCount[t.productName] || 0) + t.quantity;
    });
    const bestSelling = Object.entries(salesCount).sort((a, b) => b[1] - a[1])[0];
    if (bestSelling) {
      return `Your best-selling product is ${bestSelling[0]} with ${bestSelling[1]} units sold.`;
    }
  }

  // Recommendation questions
  if (lowerQuestion.includes('recommendation') || lowerQuestion.includes('suggest') || lowerQuestion.includes('grow')) {
    const tips = [
      'Focus on your best-selling products and stock more of them.',
      'Use voice recording to log transactions faster and reduce errors.',
      'Analyze your profit margins - prioritize high-margin products.',
      'Keep your inventory optimized to minimize storage costs.',
      'Track customer preferences and adjust your product mix accordingly.',
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  // Default response
  return 'I\'m here to help! Ask me about your sales, inventory, profits, or tips to grow your business.';
};
