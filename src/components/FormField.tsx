'use client';

import React, { useState } from 'react';

interface FormFieldProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options?: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
}

export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  options,
  placeholder,
  required = false,
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'select' && options ? (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="input-field"
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field"
          rows={4}
          required={required}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
          placeholder={placeholder}
          className="input-field"
          required={required}
        />
      )}
    </div>
  );
}
