import React from 'react';
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { ArrowLeft, Award, Sparkles } from 'lucide-react';
import { AuthProvider } from './lib/auth';
import { LocaleProvider, useTranslations } from './lib/i18n';
import { Layout } from './components/layout';
import { AuthPage } from './components/auth/AuthPage';
import { Button, PageHeader, SectionLabel, TagBadge } from './components/shared';
import { ExplorePage } from './features/explore/ExplorePage';
import { PlaceDetailPage } from './features/places/PlaceDetailPage';

type DynamicPageModule = {
  default?: React.ComponentType;
  JourneyPage?: React.ComponentType;
  PassportPage?: React.ComponentType;
};

// Tự động kết nối JourneyPage (TV2) và PassportPage (TV3) ngay khi nhánh được merge mà không vi phạm allowlist file của TV1
const journeyModules = import.meta.glob<DynamicPageModule>(
  './features/journey/JourneyPage.tsx',
  { eager: true }
);
const passportModules = import.meta.glob<DynamicPageModule>(
  './features/passport/PassportPage.tsx',
  { eager: true }
);

const ResolvedJourneyPage: React.ComponentType | null = (() => {
  const mod = Object.values(journeyModules)[0];
  return mod?.JourneyPage || mod?.default || null;
})();

const ResolvedPassportPage: React.ComponentType | null = (() => {
  const mod = Object.values(passportModules)[0];
  return mod?.PassportPage || mod?.default || null;
})();

const JourneyIntegrationView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const t = useTranslations();
  const selectedPlaceId = searchParams.get('placeId');

  if (ResolvedJourneyPage) {
    return <ResolvedJourneyPage />;
  }

  return (
    <div className="min-h-screen bg-parchment text-ink pb-24">
      <PageHeader
        label={t.journey.sectionLabel}
        title={t.journey.title}
        subtitle={t.journey.subtitle}
        className="pt-28 sm:pt-32"
      />
      <div className="max-w-content mx-auto px-5 sm:px-10 py-14">
        <div className="max-w-2xl mx-auto p-8 bg-cream border border-stone rounded-sm space-y-6">
          <div className="flex items-center justify-between">
            <SectionLabel>{t.journey.sectionLabel}</SectionLabel>
            <Sparkles className="w-5 h-5 text-gold" />
          </div>

          <h2 className="font-display text-display-md text-charcoal">
            {t.journey.standbyTitle}
          </h2>

          {selectedPlaceId && (
            <div className="p-4 bg-parchment border border-gold/50 rounded-sm flex flex-wrap items-center justify-between gap-2">
              <span className="font-body text-body-sm text-ink">
                {t.journey.selectedPlaceBanner}
              </span>
              <TagBadge variant="gold">{selectedPlaceId}</TagBadge>
            </div>
          )}

          <p className="font-body text-body-md text-ash leading-relaxed">
            {t.journey.standbyDesc}
          </p>

          <div className="pt-2">
            <Button variant="primary" onClick={() => navigate('/')}>
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>{t.journey.backExploreCta}</span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PassportIntegrationView: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslations();

  if (ResolvedPassportPage) {
    return <ResolvedPassportPage />;
  }

  return (
    <div className="min-h-screen bg-parchment text-ink pb-24">
      <PageHeader
        label={t.passport.sectionLabel}
        title={t.passport.title}
        subtitle={t.passport.subtitle}
        className="pt-28 sm:pt-32"
      />
      <div className="max-w-content mx-auto px-5 sm:px-10 py-14">
        <div className="max-w-2xl mx-auto p-8 bg-cream border border-stone rounded-sm space-y-6">
          <div className="flex items-center justify-between">
            <SectionLabel>{t.passport.sectionLabel}</SectionLabel>
            <Award className="w-5 h-5 text-gold" />
          </div>

          <h2 className="font-display text-display-md text-charcoal">
            {t.passport.standbyTitle}
          </h2>

          <p className="font-body text-body-md text-ash leading-relaxed">
            {t.passport.standbyDesc}
          </p>

          <div className="pt-2">
            <Button variant="primary" onClick={() => navigate('/')}>
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>{t.passport.backExploreCta}</span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LocaleProvider>
      <AuthProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<ExplorePage />} />
              <Route path="/places/:placeId" element={<PlaceDetailPage />} />
              <Route path="/place/:placeId" element={<PlaceDetailPage />} />
              <Route path="/journey" element={<JourneyIntegrationView />} />
              <Route path="/passport" element={<PassportIntegrationView />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </HashRouter>
      </AuthProvider>
    </LocaleProvider>
  );
};

export default App;
