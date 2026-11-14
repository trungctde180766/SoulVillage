import React from 'react';

export type TagBadgeVariant = 'gold' | 'stone' | 'lacquer';

export interface TagBadgeProps {
  children: React.ReactNode;
  variant?: TagBadgeVariant;
  className?: string;
  onClick?: () => void;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  children,
  variant = 'gold',
  className = '',
  onClick,
}) => {
  const variantClasses: Record<TagBadgeVariant, string> = {
    gold: 'border-gold/50 bg-gold/20 text-gold',
    stone: 'border-stone bg-transparent text-ash',
    lacquer: 'border-lacquer/50 bg-lacquer/15 text-lacquer',
  };

  const baseClasses = `inline-flex items-center px-2.5 py-1 rounded-xs border font-body text-[10px] font-semibold uppercase tracking-[0.10em] transition-colors duration-300 ${variantClasses[variant]} ${className}`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} min-h-[36px] cursor-pointer hover:border-bronze`}
      >
        {children}
      </button>
    );
  }

  return <span className={baseClasses}>{children}</span>;
};

export default TagBadge;
