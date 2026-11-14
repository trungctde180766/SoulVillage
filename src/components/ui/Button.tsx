import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-body font-semibold uppercase tracking-[0.12em] rounded-sm transition-transform transition-colors duration-300 ease-out-expo focus:outline-none focus:ring-1 focus:ring-bronze disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]';

  const sizeStyles = {
    sm: 'px-4 py-2 text-[11px]',
    md: 'px-8 py-3.5 text-[12px]',
    lg: 'px-10 py-4 text-[13px]',
  };

  const variantStyles = {
    primary: 'bg-lacquer text-cream border border-lacquer hover:brightness-90 hover:-translate-y-[1px] active:scale-[0.97]',
    secondary: 'bg-cream text-charcoal border border-stone hover:border-bronze hover:-translate-y-[1px] active:scale-[0.97]',
    accent: 'bg-gold/20 text-gold border border-gold/50 hover:border-gold hover:-translate-y-[1px] active:scale-[0.97]',
    outline: 'bg-transparent border border-stone text-ink hover:border-bronze hover:-translate-y-[1px] active:scale-[0.97]',
    ghost: 'bg-transparent text-bronze border-b border-stone rounded-none px-0 py-1 hover:text-lacquer',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-xs animate-spin" />
          <span>Đang xử lý...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
