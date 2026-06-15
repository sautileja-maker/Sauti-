'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import LanguageSelector from '@/components/LanguageSelector';
import { getTranslation } from '@/lib/translations';
import { getSession } from '@/lib/localStorage';

export default function LandingPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('sautileja_language') || 'en';
      setLanguage(savedLanguage);

      const session = getSession();
      if (session) {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sautileja_language', newLanguage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 md:px-16">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <span className="font-bold text-2xl text-primary">SautiLeja</span>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          SautiLeja
        </h1>
        <p className="text-xl md:text-3xl text-secondary font-semibold mb-6">
          {getTranslation(language, 'tagline')}
        </p>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          {getTranslation(language, 'description')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
          <Link href="/register">
            <Button size="lg" variant="primary">
              {getTranslation(language, 'signup')}
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              {getTranslation(language, 'login')}
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="secondary">
              {getTranslation(language, 'pricing')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-16 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-xl font-semibold mb-3">Voice Transactions</h3>
            <p className="text-gray-600">
              Record transactions using your voice in English, Kiswahili, or Sheng
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-3">Smart Analytics</h3>
            <p className="text-gray-600">
              Get AI-powered insights about your business performance
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-3">SautiBot AI</h3>
            <p className="text-gray-600">
              Ask questions and get instant business recommendations
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-3">Reports</h3>
            <p className="text-gray-600">
              Generate detailed reports and export data as PDF or CSV
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-3">Inventory Management</h3>
            <p className="text-gray-600">
              Track products, stock levels, and get restocking alerts
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-3">Multilingual</h3>
            <p className="text-gray-600">
              Available in English, Kiswahili, and Sheng
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6 md:px-16 text-center">
          <p className="mb-4">&copy; 2024 SautiLeja. All rights reserved.</p>
          <p className="text-gray-400">
            Empowering women entrepreneurs through financial technology
          </p>
        </div>
      </footer>
    </div>
  );
}
