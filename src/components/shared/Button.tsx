import React from 'react';

export type HoaLangButtonVariant = 'primary' | 'ghost' | 'ghost-dark' | 'link';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: HoaLangButtonVariant;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const variantClasses: Record<HoaLangButtonVariant, string> = {
    primary:
      'bg-lacquer text-cream border border-lacquer px-8 py-3.5 rounded-sm hover:brightness-90 hover:-translate-y-[1px] active:scale-[0.97]',
    ghost:
      'bg-transparent text-ink border border-stone px-8 py-3.5 rounded-sm hover:border-bronze hover:-translate-y-[1px] active:scale-[0.97]',
    'ghost-dark':
      'bg-transparent text-cream border border-cream/40 px-8 py-3.5 rounded-sm hover:border-cream hover:-translate-y-[1px] active:scale-[0.97]',
    link:
      'bg-transparent text-bronze border-0 border-b border-stone px-0 py-1 rounded-none hover:text-lacquer hover:border-lacquer',
  };

  return (
    <button
      className={`inline-flex items-center justify-center min-h-[44px] font-body text-[12px] font-semibold uppercase tracking-[0.12em] transition-transform transition-colors duration-300 ease-out-expo focus:outline-none focus:ring-1 focus:ring-bronze disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-xs animate-spin"
            aria-hidden="true"
          />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
