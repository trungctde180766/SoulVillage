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
      className={`bg-cream rounded-sm border border-stone overflow-hidden transition-transform transition-shadow duration-300 ease-out-expo ${
        hoverable ? 'hover:-translate-y-[5px] hover:shadow-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
