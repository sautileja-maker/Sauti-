'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Chart from '@/components/Chart';
import LanguageSelector from '@/components/LanguageSelector';
import { getTranslation } from '@/lib/translations';
import { getUser, getTransactions, getProducts } from '@/lib/localStorage';
import { generateAIInsights } from '@/lib/aiUtils';

export default function InsightsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<string>('en');
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('sautileja_language') || 'en';
      setLanguage(savedLanguage);

      const userData = getUser();
      if (!userData) {
        router.push('/login');
        return;
      }
      setUser(userData);

      const txns = getTransactions();
      setTransactions(txns);

      const prods = getProducts();
      setProducts(prods);

      const aiInsights = generateAIInsights(txns, prods);
      setInsights(aiInsights);
    }
  }, [router]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sautileja_language', newLanguage);
    }
  };

  // Calculate metrics
  const totalRevenue = transactions.reduce((sum, t) => sum + t.revenue, 0);
  const avgTransactionValue = transactions.length > 0 ? totalRevenue / transactions.length : 0;
  
  const productSales: { [key: string]: number } = {};
  const productRevenue: { [key: string]: number } = {};
  transactions.forEach(t => {
    productSales[t.productName] = (productSales[t.productName] || 0) + t.quantity;
    productRevenue[t.productName] = (productRevenue[t.productName] || 0) + t.revenue;
  });

  const bestSellingProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, units]) => ({
      name,
      value: units,
    }));

  const topRevenueProducts = Object.entries(productRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, revenue]) => ({
      name,
      revenue,
    }));

  // Weekly data
  const weeklyRevenue = {};
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    weeklyRevenue[dateStr] = transactions
      .filter(t => t.date === dateStr)
      .reduce((sum, t) => sum + t.revenue, 0);
  }

  const weeklyData = Object.entries(weeklyRevenue)
    .reverse()
    .map(([date, revenue]) => ({
      name: date,
      revenue,
    }));

  // Profit analysis
  const profitAnalysis = products.map(p => ({
    name: p.productName,
    profitPerUnit: p.sellingPrice - p.costPrice,
    marginPercent: ((p.sellingPrice - p.costPrice) / p.costPrice * 100).toFixed(1),
  }));

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {getTranslation(language, 'insights')}
            </h1>
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card title="Total Revenue">
            <p className="text-3xl font-bold text-green-600">
              KES {totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-2">All time</p>
          </Card>
          <Card title="Transactions">
            <p className="text-3xl font-bold text-blue-600">{transactions.length}</p>
            <p className="text-sm text-gray-600 mt-2">
              Avg: KES {Math.round(avgTransactionValue).toLocaleString()}
            </p>
          </Card>
          <Card title="Active Products">
            <p className="text-3xl font-bold text-purple-600">{products.length}</p>
            <p className="text-sm text-gray-600 mt-2">In inventory</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Chart
            data={weeklyData.length > 0 ? weeklyData : [{ name: 'No data', revenue: 0 }]}
            type="line"
            title="Weekly Revenue Trend"
            xKey="name"
            yKey="revenue"
          />
          <Chart
            data={bestSellingProducts.length > 0 ? bestSellingProducts : [{ name: 'No data', value: 0 }]}
            type="bar"
            title="Best Selling Products"
            xKey="name"
            yKey="value"
          />
        </div>

        {/* AI Insights */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card title="AI-Generated Insights">
            <div className="space-y-3">
              {insights.length > 0 ? (
                insights.map((insight, idx) => (
                  <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-gray-700">💡 {insight}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">Add transactions to see AI insights</p>
              )}
            </div>
          </Card>

          <Card title="Profit Margins by Product">
            <div className="space-y-2">
              {profitAnalysis.length > 0 ? (
                profitAnalysis.slice(0, 5).map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-700">{p.name}</span>
                    <span className="text-sm font-semibold text-green-600">
                      {p.marginPercent}%
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">Add products to see margins</p>
              )}
            </div>
          </Card>
        </div>

        {/* Top Revenue Products */}
        <Card title="Top Revenue Generators">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Product</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold text-gray-900">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topRevenueProducts.length > 0 ? (
                  topRevenueProducts.map((p, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2 text-sm text-gray-900">{p.name}</td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-green-600">
                        KES {(p.revenue as number).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-4 py-2 text-center text-gray-600">
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
