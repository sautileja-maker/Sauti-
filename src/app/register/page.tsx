'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormField from '@/components/FormField';
import Button from '@/components/Button';
import { saveUser, saveSession, getUser } from '@/lib/localStorage';
import { getTranslation } from '@/lib/translations';
import LanguageSelector from '@/components/LanguageSelector';

export default function RegisterPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<string>('en');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    businessType: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: language,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('sautileja_language') || 'en';
      setLanguage(savedLanguage);
      setFormData(prev => ({ ...prev, preferredLanguage: savedLanguage }));
    }
  }, []);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setFormData(prev => ({ ...prev, preferredLanguage: newLanguage }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('sautileja_language', newLanguage);
    }
  };

  const businessTypes = [
    { label: 'Retail', value: 'retail' },
    { label: 'Agriculture', value: 'agriculture' },
    { label: 'Services', value: 'services' },
    { label: 'Food & Beverage', value: 'food' },
    { label: 'Manufacturing', value: 'manufacturing' },
    { label: 'Other', value: 'other' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Check if email already exists
    const existingUser = getUser();
    if (existingUser && existingUser.email === formData.email) {
      setError('Email already registered');
      setLoading(false);
      return;
    }

    // Save user
    const userData = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      businessName: formData.businessName,
      businessType: formData.businessType,
      language: formData.preferredLanguage,
      password: formData.password, // In production, this would be hashed
    };

    saveUser(userData);

    // Create session
    saveSession({
      userId: userData.id,
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
            {getTranslation(language, 'register')}
          </h1>
          <p className="text-center text-gray-600 mb-6">
            {getTranslation(language, 'createAccount')}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormField
              label={getTranslation(language, 'fullName')}
              value={formData.fullName}
              onChange={val => handleInputChange('fullName', val)}
              placeholder="Jane Doe"
              required
            />

            <FormField
              label={getTranslation(language, 'email')}
              type="email"
              value={formData.email}
              onChange={val => handleInputChange('email', val)}
              placeholder="jane@example.com"
              required
            />

            <FormField
              label={getTranslation(language, 'phoneNumber')}
              type="tel"
              value={formData.phoneNumber}
              onChange={val => handleInputChange('phoneNumber', val)}
              placeholder="+254712345678"
            />

            <FormField
              label={getTranslation(language, 'businessName')}
              value={formData.businessName}
              onChange={val => handleInputChange('businessName', val)}
              placeholder="My Business"
            />

            <FormField
              label={getTranslation(language, 'businessType')}
              type="select"
              value={formData.businessType}
              onChange={val => handleInputChange('businessType', val)}
              options={businessTypes}
            />

            <FormField
              label={getTranslation(language, 'password')}
              type="password"
              value={formData.password}
              onChange={val => handleInputChange('password', val)}
              placeholder="••••••"
              required
            />

            <FormField
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={val => handleInputChange('confirmPassword', val)}
              placeholder="••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? getTranslation(language, 'loading') : getTranslation(language, 'createAccount')}
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            {getTranslation(language, 'alreadyHaveAccount')}{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              {getTranslation(language, 'login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
