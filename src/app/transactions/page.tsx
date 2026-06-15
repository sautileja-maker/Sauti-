'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import FormField from '@/components/FormField';
import Button from '@/components/Button';
import LanguageSelector from '@/components/LanguageSelector';
import { getTranslation } from '@/lib/translations';
import { getUser, getTransactions, saveTransaction, updateTransaction, deleteTransaction } from '@/lib/localStorage';
import { mockVoiceRecognition, extractTransactionDetails } from '@/lib/voiceUtils';

export default function TransactionsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<string>('en');
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [view, setView] = useState<'history' | 'add' | 'voice'>('history');
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [formData, setFormData] = useState({
    productName: '',
    quantity: 1,
    revenue: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

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
    }
  }, [router]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sautileja_language', newLanguage);
    }
  };

  const handleStartRecording = async () => {
    setIsRecording(true);
    // Simulate recording for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get mock recognition result
    const text = await mockVoiceRecognition();
    setRecognizedText(text);
    
    // Extract transaction details
    const details = extractTransactionDetails(text);
    setFormData({
      ...details,
      category: 'Produce',
      date: new Date().toISOString().split('T')[0],
    });
    
    setIsRecording(false);
  };

  const handleSaveTransaction = () => {
    if (!formData.productName || formData.revenue <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      updateTransaction(editingId, formData);
      setEditingId(null);
    } else {
      saveTransaction({
        id: Date.now().toString(),
        ...formData,
      });
    }

    setFormData({
      productName: '',
      quantity: 1,
      revenue: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
    });
    setRecognizedText('');
    setView('history');
    setTransactions(getTransactions());
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Are you sure?')) {
      deleteTransaction(id);
      setTransactions(getTransactions());
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Produce', 'Grains', 'Dairy', 'Other'];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {getTranslation(language, 'transactions')}
            </h1>
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === 'history' ? 'primary' : 'outline'}
              onClick={() => setView('history')}
            >
              {getTranslation(language, 'transactionHistory')}
            </Button>
            <Button
              variant={view === 'voice' ? 'primary' : 'outline'}
              onClick={() => setView('voice')}
            >
              {getTranslation(language, 'recordVoiceTransaction')}
            </Button>
            <Button
              variant={view === 'add' ? 'primary' : 'outline'}
              onClick={() => setView('add')}
            >
              {getTranslation(language, 'manualEntry')}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {view === 'history' && (
          <div>
            <div className="mb-6 grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={getTranslation(language, 'search')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-field"
              />
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {getTranslation(language, 'date')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {getTranslation(language, 'productName')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {getTranslation(language, 'quantity')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {getTranslation(language, 'revenue')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {getTranslation(language, 'category')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {getTranslation(language, 'actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(t => (
                      <tr key={t.id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-600">{t.date}</td>
                        <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                          {t.productName}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">{t.quantity}</td>
                        <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                          KES {t.revenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">{t.category}</td>
                        <td className="px-6 py-3 text-sm">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTransaction(t.id)}
                          >
                            {getTranslation(language, 'delete')}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-3 text-center text-gray-600">
                        {getTranslation(language, 'noData')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'voice' && (
          <Card title={getTranslation(language, 'recordVoiceTransaction')}>
            <div className="text-center">
              {!isRecording ? (
                <>
                  <p className="text-gray-600 mb-6">
                    {recognizedText ? getTranslation(language, 'recognized') : 'Click to start recording'}
                  </p>
                  {recognizedText && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-gray-800">📝 {recognizedText}</p>
                    </div>
                  )}
                  <Button
                    onClick={handleStartRecording}
                    variant="primary"
                    size="lg"
                    className="mb-6"
                  >
                    🎤 {getTranslation(language, 'startRecording')}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-block mb-4">
                    <div className="animate-pulse text-4xl">🎤</div>
                  </div>
                  <p className="text-gray-600">
                    {getTranslation(language, 'processing')}
                  </p>
                </div>
              )}

              {recognizedText && (
                <>
                  <div className="mt-8 text-left">
                    <FormField
                      label={getTranslation(language, 'productName')}
                      value={formData.productName}
                      onChange={val => setFormData(p => ({ ...p, productName: val }))}
                    />
                    <FormField
                      label={getTranslation(language, 'quantity')}
                      type="number"
                      value={formData.quantity}
                      onChange={val => setFormData(p => ({ ...p, quantity: val }))}
                    />
                    <FormField
                      label={getTranslation(language, 'revenue')}
                      type="number"
                      value={formData.revenue}
                      onChange={val => setFormData(p => ({ ...p, revenue: val }))}
                    />
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button variant="primary" onClick={handleSaveTransaction} className="flex-1">
                      {getTranslation(language, 'save')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRecognizedText('');
                        setFormData({
                          productName: '',
                          quantity: 1,
                          revenue: 0,
                          category: '',
                          date: new Date().toISOString().split('T')[0],
                        });
                      }}
                      className="flex-1"
                    >
                      {getTranslation(language, 'cancel')}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        {view === 'add' && (
          <Card title={getTranslation(language, 'addTransaction')}>
            <FormField
              label={getTranslation(language, 'productName')}
              value={formData.productName}
              onChange={val => setFormData(p => ({ ...p, productName: val }))}
              required
            />
            <FormField
              label={getTranslation(language, 'quantity')}
              type="number"
              value={formData.quantity}
              onChange={val => setFormData(p => ({ ...p, quantity: val }))}
              required
            />
            <FormField
              label={getTranslation(language, 'revenue')}
              type="number"
              value={formData.revenue}
              onChange={val => setFormData(p => ({ ...p, revenue: val }))}
              required
            />
            <FormField
              label={getTranslation(language, 'category')}
              type="select"
              value={formData.category}
              onChange={val => setFormData(p => ({ ...p, category: val }))}
              options={categories.map(c => ({ label: c, value: c }))}
            />
            <FormField
              label={getTranslation(language, 'date')}
              type="date"
              value={formData.date}
              onChange={val => setFormData(p => ({ ...p, date: val }))}
            />
            <div className="flex gap-3">
              <Button variant="primary" onClick={handleSaveTransaction} className="flex-1">
                {getTranslation(language, 'save')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setView('history')}
                className="flex-1"
              >
                {getTranslation(language, 'cancel')}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
