import React from 'react';
import { Compass, Sparkles, Terminal } from 'lucide-react';
import { SectionLabel, OrnamentDivider, TagBadge } from './components/shared';
import { useTranslations } from './lib/i18n';

export const App: React.FC = () => {
  const t = useTranslations('vi');

  return (
    <div className="min-h-screen bg-parchment text-ink flex flex-col justify-between font-body selection:bg-gold/20 selection:text-charcoal">
      {/* Header */}
      <header className="border-b border-stone bg-parchment/92 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-content mx-auto px-5 sm:px-10 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-sm bg-charcoal border border-stone flex items-center justify-center text-gold">
              <Compass className="w-4 h-4 text-gold" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-display font-semibold text-2xl text-charcoal tracking-tight">
                {t.brand.name}
              </span>
              <TagBadge variant="gold">HoaLang v1.0</TagBadge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TagBadge variant="stone">{t.brand.starterBadge}</TagBadge>
          </div>
        </div>
      </header>

      {/* Main Starter Hero & Team Tasks Matrix */}
      <main className="max-w-content mx-auto px-5 sm:px-10 py-16 text-center space-y-10 flex-grow flex flex-col justify-center">
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="flex justify-center">
            <SectionLabel>{t.starter.sectionLabel}</SectionLabel>
          </div>
          <h1 className="font-display text-display-xl text-charcoal tracking-tight">
            {t.starter.heroTitle}
          </h1>
          <p className="font-body text-body-lg text-ink/85">
            {t.starter.heroSubtitle}
          </p>
        </div>

        <OrnamentDivider />

        {/* 3 Member Task Assignment Overview (Asymmetric Editorial Grid: 5 / 4 / 3 cols on lg) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
          <article className="md:col-span-5 p-6 rounded-sm bg-cream border border-stone transition-transform transition-shadow duration-300 ease-out-expo hover:-translate-y-[5px] hover:shadow-hover space-y-3">
            <div className="flex items-center justify-between">
              <TagBadge variant="lacquer">{t.starter.tv1Label}</TagBadge>
              <Compass className="w-4 h-4 text-gold" />
            </div>
            <h2 className="font-display text-display-md text-charcoal">{t.starter.tv1Title}</h2>
            <p className="font-body text-body-sm text-ash">{t.starter.tv1Desc}</p>
          </article>

          <article className="md:col-span-4 p-6 rounded-sm bg-cream border border-stone transition-transform transition-shadow duration-300 ease-out-expo hover:-translate-y-[5px] hover:shadow-hover space-y-3">
            <div className="flex items-center justify-between">
              <TagBadge variant="gold">{t.starter.tv2Label}</TagBadge>
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <h2 className="font-display text-display-md text-charcoal">{t.starter.tv2Title}</h2>
            <p className="font-body text-body-sm text-ash">{t.starter.tv2Desc}</p>
          </article>

          <article className="md:col-span-3 p-6 rounded-sm bg-cream border border-stone transition-transform transition-shadow duration-300 ease-out-expo hover:-translate-y-[5px] hover:shadow-hover space-y-3">
            <div className="flex items-center justify-between">
              <TagBadge variant="stone">{t.starter.tv3Label}</TagBadge>
            </div>
            <h2 className="font-display text-display-md text-charcoal">{t.starter.tv3Title}</h2>
            <p className="font-body text-body-sm text-ash">{t.starter.tv3Desc}</p>
          </article>
        </div>

        {/* Quick Instructions & Documentation Note */}
        <div className="p-4 rounded-sm bg-cream border border-stone text-caption text-ash max-w-2xl mx-auto flex items-center justify-center space-x-2.5">
          <Terminal className="w-4 h-4 text-gold shrink-0" />
          <span>{t.starter.contractNote}</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone/30 bg-charcoal py-8 text-center text-caption text-cream/80 space-y-1">
        <p>{t.footer.copyright}</p>
        <p className="text-[11px] uppercase tracking-[0.15em] text-gold">{t.footer.motto}</p>
      </footer>
    </div>
  );
};

export default App;
