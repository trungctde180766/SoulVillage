import React from 'react';

export interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span className="inline-block w-8 h-[1px] bg-gold shrink-0" aria-hidden="true" />
      <span className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
        {children}
      </span>
    </div>
  );
};

export default SectionLabel;
