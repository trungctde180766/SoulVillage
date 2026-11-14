import React from 'react';

export interface OrnamentDividerProps {
  className?: string;
}

export const OrnamentDivider: React.FC<OrnamentDividerProps> = ({ className = '' }) => {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`py-4 text-center font-display text-sm tracking-[0.25em] text-stone select-none ${className}`}
    >
      ◆ ─────── ◆
    </div>
  );
};

export default OrnamentDivider;
