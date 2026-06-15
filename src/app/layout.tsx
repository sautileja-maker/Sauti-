'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { getTranslation } from '@/lib/translations';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sautileja_language') || 'en';
    }
    return 'en';
  });

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sautileja_language', newLanguage);
    }
  };

  const isAuthenticated =
    typeof window !== 'undefined' &&
    !!localStorage.getItem('sautileja_session');

  return (
    <html lang={language}>
      <body>
        <Navbar
          language={language}
          onLanguageChange={handleLanguageChange}
          isAuthenticated={isAuthenticated}
        />
        <main className="min-h-screen bg-surface">{children}</main>
      </body>
    </html>
  );
}
