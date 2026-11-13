import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-stone-200/80 shadow-soft overflow-hidden transition-all duration-300 ${
        hoverable ? 'hover:-translate-y-1 hover:shadow-card hover:border-primary-600/30' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
