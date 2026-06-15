'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/FormField';
import Button from '@/components/Button';
import { getUser, saveSession } from '@/lib/localStorage';
import { getTranslation } from '@/lib/translations';
import LanguageSelector from '@/components/LanguageSelector';

export default function LoginPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<string>('en');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('sautileja_language') || 'en';
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sautileja_language', newLanguage);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please enter email and password');
      setLoading(false);
      return;
    }

    // Check against stored user
    const user = getUser();
    if (!user || user.email !== formData.email || user.password !== formData.password) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    // Create session
    saveSession({
      userId: user.id,
      loginTime: new Date().toISOString(),
    });

    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-md mx-auto">
        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
        </div>

        {/* Card */}
        <div className="card">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            {getTranslation(language, 'welcomeBack')}
          </h1>
          <p className="text-center text-gray-600 mb-6">
            {getTranslation(language, 'login')}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormField
              label={getTranslation(language, 'email')}
              type="email"
              value={formData.email}
              onChange={val => handleInputChange('email', val)}
              placeholder="jane@example.com"
              required
            />

            <FormField
              label={getTranslation(language, 'password')}
              type="password"
              value={formData.password}
              onChange={val => handleInputChange('password', val)}
              placeholder="••••••"
              required
            />

            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                {getTranslation(language, 'rememberMe')}
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? getTranslation(language, 'loading') : getTranslation(language, 'login')}
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            {getTranslation(language, 'alreadyHaveAccount')}{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              {getTranslation(language, 'signup')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
