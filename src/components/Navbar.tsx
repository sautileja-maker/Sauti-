'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearUser } from '@/lib/localStorage';
import LanguageSelector from './LanguageSelector';
import { getTranslation } from '@/lib/translations';

interface NavbarProps {
  language: string;
  onLanguageChange: (language: string) => void;
  isAuthenticated?: boolean;
}

export default function Navbar({
  language,
  onLanguageChange,
  isAuthenticated = false,
}: NavbarProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    clearUser();
    router.push('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-xl text-primary hidden sm:inline">SautiLeja</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  {getTranslation(language, 'dashboard')}
                </Link>
                <Link
                  href="/transactions"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  {getTranslation(language, 'transactions')}
                </Link>
                <Link
                  href="/inventory"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  {getTranslation(language, 'inventory')}
                </Link>
                <Link
                  href="/insights"
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  {getTranslation(language, 'insights')}
                </Link>
              </>
            )}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="btn-outline text-sm"
              >
                {getTranslation(language, 'logout')}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
