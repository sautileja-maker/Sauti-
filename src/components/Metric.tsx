'use client';

import React from 'react';

interface MetricProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
}

export default function Metric({ label, value, icon, trend }: MetricProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
      {trend && (
        <div className={`text-sm mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'} Trend
        </div>
      )}
    </div>
  );
}
