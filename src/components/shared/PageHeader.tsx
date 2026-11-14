import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  label,
  title,
  subtitle,
  breadcrumbs,
  className = '',
  children,
}) => {
  return (
    <header className={`bg-charcoal text-cream px-5 sm:px-10 py-14 sm:py-20 border-b border-stone/30 ${className}`}>
      <div className="max-w-content mx-auto space-y-4">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[11px] font-body uppercase tracking-[0.15em] text-ash">
            {breadcrumbs.map((item, idx) => (
              <React.Fragment key={`${item.label}-${idx}`}>
                {idx > 0 && <span className="text-stone/50">/</span>}
                {item.onClick ? (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="text-gold hover:text-cream transition-colors duration-300"
                  >
                    {item.label}
                  </button>
                ) : item.href ? (
                  <a
                    href={item.href}
                    className="text-gold hover:text-cream transition-colors duration-300"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-cream/80">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {label && (
          <div className="inline-flex items-center gap-3">
            <span className="inline-block w-8 h-[1px] bg-gold shrink-0" aria-hidden="true" />
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
              {label}
            </span>
          </div>
        )}

        <h1 className="font-display text-display-xl text-cream tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="font-body text-body-md text-ash max-w-2xl">
            {subtitle}
          </p>
        )}

        {children && <div className="pt-2">{children}</div>}
      </div>
    </header>
  );
};

export default PageHeader;
