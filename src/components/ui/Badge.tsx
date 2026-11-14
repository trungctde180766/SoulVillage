import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'craft' | 'monument' | 'cuisine' | 'spiritual' | 'accent' | 'neutral' | 'gold' | 'stone' | 'lacquer';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  className = '',
}) => {
  const variantStyles = {
    gold: 'bg-gold/20 text-gold border-gold/50',
    stone: 'bg-transparent text-ash border-stone',
    lacquer: 'bg-lacquer/15 text-lacquer border-lacquer/50',
    craft: 'bg-gold/20 text-gold border-gold/50',
    monument: 'bg-cream text-charcoal border-stone',
    cuisine: 'bg-lacquer/15 text-lacquer border-lacquer/50',
    spiritual: 'bg-gold/20 text-bronze border-gold/50',
    accent: 'bg-lacquer text-cream border-lacquer',
    neutral: 'bg-transparent text-ash border-stone',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-xs font-body text-[10px] font-semibold uppercase tracking-[0.10em] border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
