'use client';

import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Card({ title, children, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`card ${onClick ? 'cursor-pointer' : ''}`}
    >
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
      {children}
    </div>
  );
}
