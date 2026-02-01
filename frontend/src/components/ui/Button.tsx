'use client';

import { ButtonHTMLAttributes, forwardRef, CSSProperties } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantInlineStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: '#1F6F6B',
    color: '#ffffff',
  },
  secondary: {
    backgroundColor: '#F5A623',
    color: '#ffffff',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#1F6F6B',
    border: '2px solid #1F6F6B',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#4B5563',
  },
  danger: {
    backgroundColor: '#DC2626',
    color: '#ffffff',
  },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    // className에 text- 또는 bg-가 포함되어 있으면 해당 인라인 스타일을 적용하지 않음
    const hasCustomTextColor = className.includes('text-');
    const hasCustomBgColor = className.includes('bg-');

    const computedStyle: CSSProperties = {
      ...variantInlineStyles[variant],
      ...(hasCustomTextColor ? { color: undefined } : {}),
      ...(hasCustomBgColor ? { backgroundColor: undefined } : {}),
      ...style,
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center
          font-medium rounded-[var(--radius-md)]
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:opacity-90
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        style={computedStyle}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            로딩중...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
