'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.replace(/\s+/g, '-').toLowerCase();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--gray-700)] mb-1"
          >
            {label}
            {props.required && <span className="text-[var(--error)] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5
            border rounded-[var(--radius-md)]
            text-[var(--gray-900)]
            placeholder:text-[var(--gray-400)]
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
            disabled:bg-[var(--gray-100)] disabled:cursor-not-allowed
            ${error
              ? 'border-[var(--error)] focus:ring-[var(--error)]'
              : 'border-[var(--gray-300)] hover:border-[var(--gray-400)]'
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[var(--error)]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-[var(--gray-500)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
