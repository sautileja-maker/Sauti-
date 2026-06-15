'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import FormField from '@/components/FormField';
import Button from '@/components/Button';
import LanguageSelector from '@/components/LanguageSelector';
import { getTranslation } from '@/lib/translations';
import { getUser, getProducts, saveProduct, updateProduct, deleteProduct } from '@/lib/localStorage';

export default function InventoryPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<string>('en');
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    stockQuantity: 0,
    costPrice: 0,
    sellingPrice: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

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

  const handleSaveProduct = () => {
    if (!formData.productName || formData.stockQuantity < 0 || formData.costPrice <= 0 || formData.sellingPrice <= 0) {
      alert('Please fill in all required fields correctly');
      return;
    }

    if (editingId) {
      updateProduct(editingId, formData);
      setEditingId(null);
    } else {
      saveProduct({
        id: Date.now().toString(),
        ...formData,
      });
    }

    setFormData({
      productName: '',
      category: '',
      stockQuantity: 0,
      costPrice: 0,
      sellingPrice: 0,
    });
    setView('list');
    setProducts(getProducts());
  };

  const handleEditProduct = (product: any) => {
    setEditingId(product.id);
    setFormData({
      productName: product.productName,
      category: product.category,
      stockQuantity: product.stockQuantity,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
    });
    setView('edit');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      setProducts(getProducts());
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Other'];
  const lowStockProducts = products.filter(p => p.stockQuantity < 5);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.stockQuantity * p.costPrice), 0);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {getTranslation(language, 'inventory')}
            </h1>
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === 'list' ? 'primary' : 'outline'}
              onClick={() => setView('list')}
            >
              {getTranslation(language, 'inventory')}
            </Button>
            <Button
              variant={view === 'add' ? 'primary' : 'outline'}
              onClick={() => {
                setView('add');
                setEditingId(null);
                setFormData({
                  productName: '',
                  category: '',
                  stockQuantity: 0,
                  costPrice: 0,
                  sellingPrice: 0,
                });
              }}
            >
              {getTranslation(language, 'addProduct')}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {view === 'list' && (
          <div>
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card title="Total Products">
                <p className="text-3xl font-bold text-gray-900">{products.length}</p>
              </Card>
              <Card title="Low Stock Alerts">
                <p className={`text-3xl font-bold ${
                  lowStockProducts.length > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {lowStockProducts.length}
                </p>
              </Card>
              <Card title="Inventory Value">
                <p className="text-3xl font-bold text-gray-900">
                  KES {totalInventoryValue.toLocaleString()}
                </p>
              </Card>
            </div>

            {/* Low Stock Warning */}
            {lowStockProducts.length > 0 && (
              <div className="mb-8 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                <p className="font-semibold text-yellow-800">
                  ⚠️ Low Stock Alert
                </p>
                <p className="text-sm text-yellow-700 mt-2">
                  {lowStockProducts.map(p => p.productName).join(', ')} need restocking
                </p>
              </div>
            )}

            {/* Filters */}
            <div className="mb-6 grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Search products..."
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

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {getTranslation(language, 'productName')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {getTranslation(language, 'category')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {getTranslation(language, 'currentStock')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {getTranslation(language, 'costPrice')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {getTranslation(language, 'sellingPrice')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Profit Margin
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {getTranslation(language, 'actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(p => {
                      const margin = ((p.sellingPrice - p.costPrice) / p.costPrice * 100).toFixed(1);
                      const status = p.stockQuantity < 5 ? 'bg-red-50' : '';
                      return (
                        <tr key={p.id} className={`border-t hover:bg-gray-50 ${status}`}>
                          <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                            {p.productName}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-600">{p.category}</td>
                          <td className={`px-6 py-3 text-sm font-semibold ${
                            p.stockQuantity < 5 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {p.stockQuantity}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-600">
                            KES {p.costPrice}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-600">
                            KES {p.sellingPrice}
                          </td>
                          <td className="px-6 py-3 text-sm font-medium text-green-600">
                            {margin}%
                          </td>
                          <td className="px-6 py-3 text-sm space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(p)}
                            >
                              {getTranslation(language, 'edit')}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(p.id)}
                            >
                              {getTranslation(language, 'delete')}
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-3 text-center text-gray-600">
                        {getTranslation(language, 'noData')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(view === 'add' || view === 'edit') && (
          <Card title={view === 'add' ? getTranslation(language, 'addProduct') : getTranslation(language, 'editProduct')}>
            <FormField
              label={getTranslation(language, 'productName')}
              value={formData.productName}
              onChange={val => setFormData(p => ({ ...p, productName: val }))}
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
              label={getTranslation(language, 'stockQuantity')}
              type="number"
              value={formData.stockQuantity}
              onChange={val => setFormData(p => ({ ...p, stockQuantity: val }))}
              required
            />
            <FormField
              label={getTranslation(language, 'costPrice')}
              type="number"
              value={formData.costPrice}
              onChange={val => setFormData(p => ({ ...p, costPrice: val }))}
              required
            />
            <FormField
              label={getTranslation(language, 'sellingPrice')}
              type="number"
              value={formData.sellingPrice}
              onChange={val => setFormData(p => ({ ...p, sellingPrice: val }))}
              required
            />
            <div className="flex gap-3">
              <Button variant="primary" onClick={handleSaveProduct} className="flex-1">
                {getTranslation(language, 'save')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setView('list')}
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
