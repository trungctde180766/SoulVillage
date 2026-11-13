import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'craft' | 'monument' | 'cuisine' | 'spiritual' | 'accent' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles = {
    craft: 'bg-amber-100 text-amber-900 border-amber-200',
    monument: 'bg-primary-100 text-primary-900 border-primary-200',
    cuisine: 'bg-terracotta-100 text-terracotta-800 border-terracotta-200',
    spiritual: 'bg-purple-100 text-purple-900 border-purple-200',
    accent: 'bg-terracotta-500 text-white border-transparent',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
