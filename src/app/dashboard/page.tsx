'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import Metric from '@/components/Metric';
import Button from '@/components/Button';
import Chart from '@/components/Chart';
import LanguageSelector from '@/components/LanguageSelector';
import { getTranslation } from '@/lib/translations';
import { getUser, getTransactions, getProducts, getSubscription, clearUser } from '@/lib/localStorage';
import { generateAIInsights } from '@/lib/aiUtils';

export default function DashboardPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<string>('en');
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [subscription, setSubscription] = useState('free');

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

      const sub = getSubscription();
      setSubscription(sub);

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

  const handleLogout = () => {
    clearUser();
    router.push('/');
  };

  // Calculate metrics
  const todaysSales = transactions
    .filter(t => t.date === new Date().toISOString().split('T')[0])
    .reduce((sum, t) => sum + t.revenue, 0);

  const weeklySales = transactions
    .filter(t => {
      const tDate = new Date(t.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return tDate > weekAgo;
    })
    .reduce((sum, t) => sum + t.revenue, 0);

  const monthlySales = transactions
    .filter(t => {
      const tDate = new Date(t.date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return tDate > monthAgo;
    })
    .reduce((sum, t) => sum + t.revenue, 0);

  const lowStockAlerts = products.filter(p => p.stockQuantity < 5).length;

  // Chart data
  const chartData = transactions
    .slice(-7)
    .map(t => ({
      name: t.productName,
      revenue: t.revenue,
    }));

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getTranslation(language, 'dashboard')}
              </h1>
              <p className="text-gray-600 mt-2">
                {getTranslation(language, 'welcomeBack')}, {user?.fullName}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={handleLanguageChange}
              />
              <Button variant="outline" onClick={handleLogout}>
                {getTranslation(language, 'logout')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Subscription Badge */}
        <div className="mb-8 p-4 bg-blue-100 border border-blue-300 rounded-lg">
          <p className="text-sm text-blue-800">
            Current Plan: <span className="font-semibold capitalize">{subscription}</span>
            {subscription === 'free' && (
              <Link href="/pricing" className="ml-4 text-blue-600 hover:underline">
                {getTranslation(language, 'upgrade')}
              </Link>
            )}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Metric
            label={getTranslation(language, 'todaysSales')}
            value={`KES ${todaysSales.toLocaleString()}`}
            icon="📅"
          />
          <Metric
            label={getTranslation(language, 'weeklySales')}
            value={`KES ${weeklySales.toLocaleString()}`}
            icon="📊"
            trend="up"
          />
          <Metric
            label={getTranslation(language, 'monthlySales')}
            value={`KES ${monthlySales.toLocaleString()}`}
            icon="📈"
          />
          <Metric
            label={getTranslation(language, 'lowStockAlerts')}
            value={lowStockAlerts}
            icon="⚠️"
            trend={lowStockAlerts > 0 ? 'down' : 'up'}
          />
        </div>

        {/* Charts and Insights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2">
            <Chart
              data={chartData.length > 0 ? chartData : [{ name: 'No data', revenue: 0 }]}
              type="bar"
              title="Recent Transactions"
              xKey="name"
              yKey="revenue"
            />
          </div>
          <Card title={getTranslation(language, 'aiInsights')}>
            <div className="space-y-3">
              {insights.length > 0 ? (
                insights.map((insight, idx) => (
                  <div key={idx} className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-gray-700">💡 {insight}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">
                  {getTranslation(language, 'noData')}
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/transactions">
            <Card title="Transactions" onClick={() => {}}>
              <p className="text-4xl mb-4">💰</p>
              <p className="text-gray-600">
                {transactions.length} {getTranslation(language, 'transactions')}
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                {getTranslation(language, 'view')}
              </Button>
            </Card>
          </Link>

          <Link href="/inventory">
            <Card title="Inventory" onClick={() => {}}>
              <p className="text-4xl mb-4">📦</p>
              <p className="text-gray-600">
                {products.length} {getTranslation(language, 'totalProducts')}
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                {getTranslation(language, 'view')}
              </Button>
            </Card>
          </Link>

          <Link href="/sautibot">
            <Card title="SautiBot" onClick={() => {}}>
              <p className="text-4xl mb-4">🤖</p>
              <p className="text-gray-600">AI Business Assistant</p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                {getTranslation(language, 'chat')}
              </Button>
            </Card>
          </Link>

          <Link href="/insights">
            <Card title="AI Insights" onClick={() => {}}>
              <p className="text-4xl mb-4">📊</p>
              <p className="text-gray-600">Business Analytics</p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                {getTranslation(language, 'view')}
              </Button>
            </Card>
          </Link>

          <Link href="/reports">
            <Card title="Reports" onClick={() => {}}>
              <p className="text-4xl mb-4">📄</p>
              <p className="text-gray-600">Export Data</p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                {getTranslation(language, 'generate')}
              </Button>
            </Card>
          </Link>

          <Link href="/pricing">
            <Card title="Subscription" onClick={() => {}}>
              <p className="text-4xl mb-4">🎯</p>
              <p className="text-gray-600">Manage Plans</p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                {getTranslation(language, 'upgrade')}
              </Button>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
