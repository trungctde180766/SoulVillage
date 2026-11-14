import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Compass,
  ExternalLink,
  MapPin,
  Sparkles,
} from 'lucide-react';
import type { CulturalPlace } from '../../types/place';
import { fetchCulturalPlaces } from '../../services/api';
import { useLocale, useTranslations } from '../../lib/i18n';
import {
  Button,
  OrnamentDivider,
  PageHeader,
  SectionLabel,
  TagBadge,
} from '../../components/shared';

const FALLBACK_DETAIL_IMAGE =
  'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1400&q=80';

export const PlaceDetailPage: React.FC = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const { locale } = useLocale();
  const t = useTranslations();

  const currentPlaceId = placeId || '';
  const [place, setPlace] = useState<CulturalPlace | null>(null);
  const [resolvedPlaceId, setResolvedPlaceId] = useState<string | null>(null);
  const [failedImagePlaceId, setFailedImagePlaceId] = useState<string | null>(null);

  const loading = resolvedPlaceId !== currentPlaceId;

  useEffect(() => {
    const controller = new AbortController();

    fetchCulturalPlaces(undefined, controller.signal)
      .then((places) => {
        if (!controller.signal.aborted) {
          const found = places.find((p) => p.id === currentPlaceId) || null;
          setPlace(found);
          setResolvedPlaceId(currentPlaceId);
        }
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        if (!controller.signal.aborted) {
          setPlace(null);
          setResolvedPlaceId(currentPlaceId);
        }
      });

    return () => {
      controller.abort();
    };
  }, [currentPlaceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment text-ink">
        <div className="bg-charcoal text-cream pt-28 pb-16 px-5 sm:px-10 border-b border-stone/30">
          <div className="max-w-content mx-auto space-y-4 animate-pulse">
            <div className="h-4 w-40 bg-stone/30 rounded-xs" />
            <div className="h-12 w-2/3 bg-stone/40 rounded-xs" />
            <div className="h-5 w-1/3 bg-stone/25 rounded-xs" />
          </div>
        </div>
        <div className="max-w-content mx-auto px-5 sm:px-10 py-12 space-y-8">
          <p className="font-body text-body-md text-ash text-center">
            {t.placeDetail.loading}
          </p>
          <div className="aspect-[16/9] bg-cream border border-stone rounded-sm animate-pulse" />
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-parchment text-ink">
        <PageHeader
          label={t.placeDetail.sectionLabel}
          title={t.placeDetail.notFoundTitle}
          subtitle={t.placeDetail.notFound}
          className="pt-28"
          breadcrumbs={[
            {
              label: t.placeDetail.breadcrumbExplore,
              onClick: () => navigate('/'),
            },
          ]}
        />
        <div className="max-w-content mx-auto px-5 sm:px-10 py-16 text-center">
          <Button variant="primary" onClick={() => navigate('/')}>
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>{t.placeDetail.backToExplore}</span>
            </span>
          </Button>
        </div>
      </div>
    );
  }

  const primaryTitle = locale === 'en' ? place.name : place.vietnameseName;
  const secondaryTitle = locale === 'en' ? place.vietnameseName : place.name;
  const categoryText =
    t.explore.categories[place.category] || place.categoryLabel;
  const imgSrc =
    failedImagePlaceId === place.id
      ? FALLBACK_DETAIL_IMAGE
      : place.imageUrl || FALLBACK_DETAIL_IMAGE;

  return (
    <div className="min-h-screen bg-parchment text-ink pb-24">
      {/* 1. Editorial Charcoal PageHeader (display-2xl heading, breadcrumbs & metadata) */}
      <PageHeader
        label={categoryText}
        title={primaryTitle}
        subtitle={`${secondaryTitle} — ${place.location}`}
        className="pt-28 sm:pt-32"
        breadcrumbs={[
          {
            label: t.placeDetail.breadcrumbExplore,
            onClick: () => navigate('/'),
          },
          {
            label: primaryTitle,
          },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <TagBadge variant="gold">{categoryText}</TagBadge>
          <span className="inline-flex items-center gap-1.5 font-body text-caption text-cream/80">
            <Clock className="w-3.5 h-3.5 text-gold" />
            <span>
              {place.estimatedVisitTimeMinutes} {t.placeDetail.durationUnit}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-body text-caption text-cream/80">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            <span>{place.location}</span>
          </span>
        </div>
      </PageHeader>

      {/* 2. Main Editorial Photojournalism & Story Content */}
      <div className="max-w-content mx-auto px-5 sm:px-10 py-10 sm:py-16 space-y-12">
        {/* Large 16/9 Editorial Frame wrapped in overflow-hidden + stone border */}
        <figure className="bg-cream border border-stone rounded-sm p-2 sm:p-3 animate-fade-up">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-xs bg-parchment">
            <img
              src={imgSrc}
              alt={primaryTitle}
              onError={() => {
                setFailedImagePlaceId(place.id);
              }}
              className="w-full h-full object-cover transition-transform duration-600 ease-out hover:scale-[1.04]"
            />
          </div>
          <figcaption className="pt-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-body text-caption text-ash">
            <span>
              {primaryTitle} · {place.location}
            </span>
            <span>
              {place.coordinates.lat.toFixed(4)}°N, {place.coordinates.lng.toFixed(4)}°E
            </span>
          </figcaption>
        </figure>

        {/* Asymmetric 12-Column Editorial Layout (8 cols Story & Craft + 4 cols Dossier & CTA) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Narrative Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Lead Excerpt */}
            <div className="space-y-3">
              <SectionLabel>{t.placeDetail.storyLabel}</SectionLabel>
              <h2 className="font-display text-display-lg text-charcoal">
                {t.placeDetail.storyHeading}
              </h2>
              <p className="font-display text-2xl leading-[1.45] text-charcoal/90">
                {place.shortDescription}
              </p>
            </div>

            {/* Main Cultural Story (Be Vietnam Pro body-lg 18px line-height 1.8) */}
            <div className="space-y-5 font-body text-body-lg text-ink leading-[1.8]">
              <p>{place.story}</p>
            </div>

            {/* Artisan / Heritage Quote Block (Cormorant Garamond 24px italic gold border) */}
            <blockquote className="border-l-2 border-gold pl-5 sm:pl-6 py-2 bg-cream/60 rounded-r-sm space-y-2">
              <p className="font-display text-[24px] italic leading-[1.4] text-charcoal">
                “
                {place.historicalSignificance ||
                  place.craftDetails ||
                  place.shortDescription}
                ”
              </p>
              <footer className="font-body text-label-sm uppercase text-gold">
                — {t.placeDetail.significanceLabel} · {place.vietnameseName}
              </footer>
            </blockquote>

            {/* Classic Ornament Divider between Narrative Story and Craft Secrets */}
            <OrnamentDivider />

            {/* Craft Mastery & Local Tips Box (bg-cream, border-stone, rounded-sm 3px) */}
            <div className="p-6 sm:p-8 bg-cream border border-stone rounded-sm space-y-6">
              {place.craftDetails && (
                <div className="space-y-2.5">
                  <SectionLabel>{t.placeDetail.craftLabel}</SectionLabel>
                  <h3 className="font-display text-display-md text-charcoal">
                    {t.placeDetail.craftHeading}
                  </h3>
                  <p className="font-body text-body-md text-ink/90 leading-[1.75]">
                    {place.craftDetails}
                  </p>
                </div>
              )}

              {place.craftDetails && place.localTips.length > 0 && (
                <div className="border-t border-stone/60" />
              )}

              {place.localTips && place.localTips.length > 0 && (
                <div className="space-y-3">
                  <SectionLabel>{t.placeDetail.tipsLabel}</SectionLabel>
                  <h3 className="font-display text-display-md text-charcoal">
                    {t.placeDetail.tipsHeading}
                  </h3>
                  <ul className="space-y-2.5">
                    {place.localTips.map((tip, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 font-body text-body-md text-ink/85"
                      >
                        <span className="font-display text-lg font-semibold text-gold leading-none pt-1">
                          0{index + 1}.
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Verified Cultural Sources (sources[]) */}
            {place.sources && place.sources.length > 0 && (
              <div className="p-6 sm:p-8 bg-cream border border-stone rounded-sm space-y-4">
                <div className="space-y-1.5">
                  <SectionLabel>{t.placeDetail.sourcesLabel}</SectionLabel>
                  <h3 className="font-display text-display-md text-charcoal">
                    {t.placeDetail.sourcesHeading}
                  </h3>
                </div>
                <ul className="space-y-3 pt-1">
                  {place.sources.map((src, idx) => (
                    <li
                      key={`${src.title}-${idx}`}
                      className="flex items-start gap-2.5 font-body text-body-sm"
                    >
                      <span className="text-gold pt-0.5">◆</span>
                      {src.url ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1.5 text-bronze border-b border-stone hover:text-lacquer hover:border-lacquer transition-colors duration-300"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-ink/85">{src.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Sidebar: Heritage Dossier & Primary Gemini Journey CTA (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="p-6 sm:p-8 bg-cream border border-stone rounded-sm space-y-6">
              <div className="space-y-2 border-b border-stone pb-4">
                <SectionLabel>{t.placeDetail.sectionLabel}</SectionLabel>
                <h3 className="font-display text-display-md text-charcoal">
                  {t.placeDetail.dossierHeading}
                </h3>
              </div>

              <dl className="space-y-4 font-body text-body-sm">
                <div className="space-y-1">
                  <dt className="text-label-sm uppercase text-ash">
                    {t.placeDetail.locationLabel}
                  </dt>
                  <dd className="text-ink font-medium">{place.location}</dd>
                </div>

                <div className="space-y-1">
                  <dt className="text-label-sm uppercase text-ash">
                    {t.placeDetail.durationLabel}
                  </dt>
                  <dd className="text-ink font-medium">
                    {place.estimatedVisitTimeMinutes} {t.placeDetail.durationUnit}
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="text-label-sm uppercase text-ash">
                    {t.placeDetail.coordinatesLabel}
                  </dt>
                  <dd className="text-ink font-medium">
                    {place.coordinates.lat.toFixed(4)}° N,{' '}
                    {place.coordinates.lng.toFixed(4)}° E
                  </dd>
                </div>

                {place.tags && place.tags.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <dt className="text-label-sm uppercase text-ash">
                      {t.placeDetail.tagsLabel}
                    </dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {place.tags.map((tag) => (
                        <TagBadge key={tag} variant="gold">
                          {tag}
                        </TagBadge>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>

              {/* Primary CTA to /journey?placeId=<ID> */}
              <div className="pt-4 border-t border-stone space-y-3">
                <Button
                  variant="primary"
                  onClick={() => navigate(`/journey?placeId=${place.id}`)}
                  className="w-full"
                >
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{t.placeDetail.planJourneyCta}</span>
                  </span>
                </Button>
                <p className="font-body text-caption text-ash text-center">
                  {t.placeDetail.planJourneyHint}
                </p>
              </div>
            </div>

            {/* Secondary Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full"
            >
              <span className="inline-flex items-center gap-2">
                <Compass className="w-4 h-4 text-gold" />
                <span>{t.placeDetail.backToExplore}</span>
              </span>
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPage;
