import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: 'box' | 'underline';
  errorText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  variant = 'box',
  errorText,
  className = '',
  id,
  ...props
}) => {
  const variantClasses =
    variant === 'underline'
      ? 'w-full bg-transparent border-0 border-b border-stone py-2.5 px-0 rounded-none text-base text-ink placeholder:text-ash focus:border-bronze focus:outline-none transition-colors duration-300'
      : 'w-full bg-parchment border border-stone py-3 px-4 rounded-sm text-base text-ink placeholder:text-ash focus:border-bronze focus:outline-none transition-colors duration-300';

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-ash"
        >
          {label}
        </label>
      )}
      <input id={id} className={`${variantClasses} min-h-[44px] ${className}`} {...props} />
      {errorText && (
        <p className="font-body text-caption text-lacquer">{errorText}</p>
      )}
    </div>
  );
};

export default Input;
