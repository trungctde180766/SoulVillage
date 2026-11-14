import React from 'react';

export interface CraftCardProps {
  title: string;
  subtitle?: string;
  priceText?: string;
  imageUrl: string;
  quickViewLabel?: string;
  onClick?: () => void;
  className?: string;
}

export const CraftCard: React.FC<CraftCardProps> = ({
  title,
  subtitle,
  priceText,
  imageUrl,
  quickViewLabel = 'Khám Phá Tuyệt Tác',
  onClick,
  className = '',
}) => {
  return (
    <article
      onClick={onClick}
      className={`group bg-cream border border-stone rounded-sm overflow-hidden transition-transform transition-shadow duration-300 ease-out-expo hover:-translate-y-[5px] hover:shadow-hover ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-parchment">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-ink-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <span className="px-4 py-2 bg-parchment/92 border border-stone rounded-xs font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal">
            {quickViewLabel}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-1.5">
        {subtitle && (
          <p className="font-body text-[11px] uppercase tracking-[0.12em] text-ash">
            {subtitle}
          </p>
        )}
        <h3 className="font-display text-[20px] text-charcoal">{title}</h3>
        {priceText && (
          <p className="font-display text-[20px] font-semibold text-lacquer">{priceText}</p>
        )}
      </div>
    </article>
  );
};

export default CraftCard;
