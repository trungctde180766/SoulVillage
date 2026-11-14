import React from 'react';

export interface LocaleTextProps {
  vi: string;
  en?: string;
  locale?: 'vi' | 'en';
  showBilingual?: boolean;
  className?: string;
  enClassName?: string;
}

export const LocaleText: React.FC<LocaleTextProps> = ({
  vi,
  en,
  locale = 'vi',
  showBilingual = false,
  className = '',
  enClassName = 'block font-body text-caption text-ash italic mt-0.5',
}) => {
  if (showBilingual && en) {
    return (
      <span className={className}>
        <span>{vi}</span>
        <span className={enClassName}>{en}</span>
      </span>
    );
  }

  return <span className={className}>{locale === 'en' && en ? en : vi}</span>;
};

export default LocaleText;
