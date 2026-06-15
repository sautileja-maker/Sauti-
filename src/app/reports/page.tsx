'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LanguageSelector from '@/components/LanguageSelector';
import { getTranslation } from '@/lib/translations';
import { getUser, getTransactions, getProducts } from '@/lib/localStorage';

export default function ReportsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<string>('en');
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [reportType, setReportType] = useState<'sales' | 'inventory' | 'profitability'>('sales');
  const [generating, setGenerating] = useState(false);

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
    }
  }, [router]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sautileja_language', newLanguage);
    }
  };

  const generateReport = () => {
    setGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      let reportContent = '';

      if (reportType === 'sales') {
        const totalRevenue = transactions.reduce((sum, t) => sum + t.revenue, 0);
        const avgTransaction = transactions.length > 0 ? totalRevenue / transactions.length : 0;
        reportContent = `SALES REPORT\n\nPeriod: All Time\nGenerated: ${new Date().toLocaleDateString()}\n\nTotal Transactions: ${transactions.length}\nTotal Revenue: KES ${totalRevenue.toLocaleString()}\nAverage Transaction: KES ${Math.round(avgTransaction).toLocaleString()}\n\nTop Selling Products:\n`;
        const sales: { [key: string]: number } = {};
        transactions.forEach(t => {
          sales[t.productName] = (sales[t.productName] || 0) + t.quantity;
        });
        Object.entries(sales)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .forEach(([name, qty]) => {
            reportContent += `  - ${name}: ${qty} units\n`;
          });
      } else if (reportType === 'inventory') {
        const totalValue = products.reduce((sum, p) => sum + p.stockQuantity * p.costPrice, 0);
        reportContent = `INVENTORY REPORT\n\nGenerated: ${new Date().toLocaleDateString()}\n\nTotal Products: ${products.length}\nTotal Inventory Value: KES ${totalValue.toLocaleString()}\n\nCurrent Stock Levels:\n`;
        products.forEach(p => {
          reportContent += `  - ${p.productName}: ${p.stockQuantity} units (${p.category})\n`;
        });
        const lowStock = products.filter(p => p.stockQuantity < 5);
        if (lowStock.length > 0) {
          reportContent += `\nLow Stock Alert:\n`;
          lowStock.forEach(p => {
            reportContent += `  - ${p.productName}: ${p.stockQuantity} units (reorder recommended)\n`;
          });
        }
      } else {
        reportContent = `PROFITABILITY REPORT\n\nGenerated: ${new Date().toLocaleDateString()}\n\nProfit Analysis by Product:\n`;
        products.forEach(p => {
          const margin = ((p.sellingPrice - p.costPrice) / p.costPrice * 100).toFixed(1);
          const profit = (p.sellingPrice - p.costPrice) * p.stockQuantity;
          reportContent += `  - ${p.productName}: ${margin}% margin (KES ${profit} potential profit on stock)\n`;
        });
      }

      // Export as text file
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
      element.setAttribute('download', `${reportType}-report-${new Date().toISOString().split('T')[0]}.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {getTranslation(language, 'reports')}
            </h1>
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card
            title="Sales Report"
            onClick={() => setReportType('sales')}
          >
            <p className="text-4xl mb-4">📊</p>
            <p className="text-gray-600 mb-4">
              Revenue, transactions, and top selling products
            </p>
            <Button
              variant={reportType === 'sales' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setReportType('sales')}
              className="w-full"
            >
              {reportType === 'sales' ? 'Selected' : 'Select'}
            </Button>
          </Card>

          <Card
            title="Inventory Report"
            onClick={() => setReportType('inventory')}
          >
            <p className="text-4xl mb-4">📦</p>
            <p className="text-gray-600 mb-4">
              Stock levels, alerts, and inventory value
            </p>
            <Button
              variant={reportType === 'inventory' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setReportType('inventory')}
              className="w-full"
            >
              {reportType === 'inventory' ? 'Selected' : 'Select'}
            </Button>
          </Card>

          <Card
            title="Profitability Report"
            onClick={() => setReportType('profitability')}
          >
            <p className="text-4xl mb-4">💰</p>
            <p className="text-gray-600 mb-4">
              Profit margins, costs, and revenue by product
            </p>
            <Button
              variant={reportType === 'profitability' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setReportType('profitability')}
              className="w-full"
            >
              {reportType === 'profitability' ? 'Selected' : 'Select'}
            </Button>
          </Card>
        </div>

        <Card title="Generate Report">
          <p className="text-gray-600 mb-6">
            Click the button below to generate and download your {reportType} report as a text file.
          </p>
          <Button
            onClick={generateReport}
            variant="primary"
            size="lg"
            disabled={generating}
            className="w-full"
          >
            {generating ? 'Generating...' : `Generate ${reportType} Report`}
          </Button>
        </Card>

        <div className="mt-12">
          <Card title="Report Information">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📊 Sales Report</h3>
                <p className="text-sm text-gray-600">
                  Overview of your total revenue, number of transactions, and top selling products.
                  Perfect for understanding sales performance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📦 Inventory Report</h3>
                <p className="text-sm text-gray-600">
                  Current stock levels, total inventory value, and alerts for products running low.
                  Essential for inventory management and restocking decisions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">💰 Profitability Report</h3>
                <p className="text-sm text-gray-600">
                  Detailed profit margins, cost analysis, and potential profit by product.
                  Helps identify your most profitable items.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
