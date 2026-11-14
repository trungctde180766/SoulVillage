import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslations } from '../../lib/i18n';
import { SectionLabel } from '../shared/SectionLabel';
import { TagBadge } from '../shared/TagBadge';

export const Footer: React.FC = () => {
  const t = useTranslations();

  return (
    <footer className="bg-charcoal text-cream/80 border-t border-stone/30">
      <div className="max-w-content mx-auto px-5 sm:px-10 py-14 sm:py-16 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Column (Asymmetric 5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-display font-semibold text-2xl text-cream tracking-tight">
                {t.brand.name}
              </span>
              <TagBadge variant="gold">{t.brand.starterBadge}</TagBadge>
            </div>
            <p className="font-body text-body-sm text-cream/75 leading-relaxed max-w-md">
              {t.footer.aboutDesc}
            </p>
          </div>

          {/* Navigation Column (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <SectionLabel>{t.footer.navigationTitle}</SectionLabel>
            <ul className="space-y-2.5 pt-1">
              <li>
                <Link
                  to="/"
                  className="inline-flex items-center min-h-[36px] font-body text-[12px] uppercase tracking-[0.10em] text-cream/80 hover:text-gold transition-colors duration-300"
                >
                  {t.nav.explore}
                </Link>
              </li>
              <li>
                <Link
                  to="/journey"
                  className="inline-flex items-center min-h-[36px] font-body text-[12px] uppercase tracking-[0.10em] text-cream/80 hover:text-gold transition-colors duration-300"
                >
                  {t.nav.journey}
                </Link>
              </li>
              <li>
                <Link
                  to="/passport"
                  className="inline-flex items-center min-h-[36px] font-body text-[12px] uppercase tracking-[0.10em] text-cream/80 hover:text-gold transition-colors duration-300"
                >
                  {t.nav.passport}
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial Standard Column (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <SectionLabel>{t.footer.standardTitle}</SectionLabel>
            <p className="font-body text-body-sm text-cream/75 leading-relaxed pt-1">
              {t.footer.standardDesc}
            </p>
          </div>
        </div>

        {/* Bottom Divider & Colophon */}
        <div className="border-t border-stone/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="font-body text-caption text-cream/70">{t.footer.copyright}</p>
          <p className="font-body text-[11px] uppercase tracking-[0.15em] text-gold">
            {t.footer.motto}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
