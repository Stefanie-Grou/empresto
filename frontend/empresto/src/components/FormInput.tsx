import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextInput({ label, error, className = '', ...props }: TextInputProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm font-semibold text-gray-800 shrink-0">
        {label}
      </label>
      <div className="flex-1">
        <input
          {...props}
          className={`w-full px-4 py-2.5 bg-gray-100/80 rounded-xl text-sm text-gray-800 outline-none transition-all ${
            error
              ? 'border border-red-500 bg-red-50/30'
              : 'focus:bg-white focus:ring-2 focus:ring-emerald-800'
          } ${props.disabled || props.readOnly ? 'cursor-not-allowed text-gray-500' : ''} ${className}`}
        />
        {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
      </div>
    </div>
  );
}

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function NumberInput({ label, error, className = '', ...props }: NumberInputProps) {
  return (
    <div className="flex items-center gap-4">
      <label className="w-24 text-sm font-semibold text-gray-800 shrink-0">
        {label}
      </label>
      <div className="w-24">
        <input
          type="number"
          {...props}
          className={`w-full px-3 py-2 bg-gray-100/80 rounded-xl text-sm text-center font-medium text-gray-800 outline-none transition-all ${
            error
              ? 'border border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-500'
              : 'focus:bg-main-background-gray focus:ring-2 focus:ring-secondary-light-green'
          } ${className}`}
        />
        {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
      </div>
    </div>
  );
}