import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';
import type { CulturalCategory, CulturalPlace } from '../../types/place';
import { fetchCulturalPlaces } from '../../services/api';
import { useLocale, useTranslations } from '../../lib/i18n';
import {
  Button,
  OrnamentDivider,
  SectionLabel,
  TagBadge,
  VillageCard,
} from '../../components/shared';
import { FilterBar } from './FilterBar';
import { HomeIntro, HomeOutro } from './HomeEditorial';

const FALLBACK_HERO_IMAGE =
  'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1400&q=80';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const t = useTranslations();

  const [selectedCategory, setSelectedCategory] = useState<CulturalCategory | 'all'>('all');
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [places, setPlaces] = useState<CulturalPlace[]>([]);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);
  const [resolvedKey, setResolvedKey] = useState<string>('');

  const catalogSectionRef = useRef<HTMLElement | null>(null);
  const requestKey = `${selectedCategory}::${debouncedQuery.trim()}::${reloadTrigger}`;
  const loading = resolvedKey !== requestKey;

  // Debounce tìm kiếm 250ms theo đúng đặc tả Task 1
  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 250);
    return () => window.clearTimeout(timerId);
  }, [searchInput]);

  // Gọi API với AbortController để chống nhảy ngược dữ liệu (race condition)
  useEffect(() => {
    const controller = new AbortController();

    fetchCulturalPlaces(
      {
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        searchQuery: debouncedQuery.trim() || undefined,
      },
      controller.signal
    )
      .then((result) => {
        if (!controller.signal.aborted) {
          setPlaces(result);
          setResolvedKey(requestKey);
        }
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        if (!controller.signal.aborted) {
          setPlaces([]);
          setResolvedKey(requestKey);
        }
      });

    return () => {
      controller.abort();
    };
  }, [selectedCategory, debouncedQuery, reloadTrigger, requestKey]);

  const handleOpenDetail = (place: CulturalPlace) => {
    navigate(`/places/${place.id}`);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchInput('');
    setDebouncedQuery('');
    setReloadTrigger((n) => n + 1);
  };

  const scrollToCatalog = () => {
    catalogSectionRef.current?.focus({ preventScroll: true });
    catalogSectionRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  const featuredPlace = places.length > 0 ? places[0] : null;
  const remainingPlaces = places.length > 1 ? places.slice(1) : [];

  return (
    <div className="hl-home min-h-screen bg-parchment text-ink">
      <HomeIntro onExplore={scrollToCatalog} />

      {/* 2. Section Chẵn: Filter & Search Panel (bg-cream with 1px solid stone border) */}
      <section
        ref={catalogSectionRef}
        id="heritage-collection"
        tabIndex={-1}
        aria-labelledby="home-catalog-title"
        className="hl-catalog bg-parchment border-b border-stone pt-16 pb-10 sm:pt-24 sm:pb-12"
      >
        <div className="max-w-content mx-auto px-5 sm:px-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <SectionLabel>{t.explore.sectionLabel}</SectionLabel>
              <h2 id="home-catalog-title" className="hl-title text-charcoal">
                {t.explore.title}
              </h2>
            </div>
            <p className="font-body text-body-sm text-ash max-w-md">
              {t.explore.subtitle}
            </p>
          </div>

          <FilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchInput}
            onSearchChange={setSearchInput}
            totalResults={loading ? undefined : places.length}
            onResetFilters={handleResetFilters}
          />
        </div>
      </section>

      {/* 3. Section Lẻ: Asymmetric Editorial Catalog Grid (bg-parchment) */}
      <section className="bg-parchment py-12 sm:py-20">
        <div className="max-w-content mx-auto px-5 sm:px-10 space-y-12">
          {loading ? (
            /* Luxury Editorial Loading Skeleton */
            <div className="space-y-8" aria-live="polite">
              <div className="text-center font-body text-body-sm text-ash">
                {t.explore.loading}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-cream border border-stone rounded-sm aspect-[16/9] animate-pulse" />
                <div className="lg:col-span-4 bg-cream border border-stone rounded-sm p-8 space-y-4 animate-pulse">
                  <div className="h-4 w-32 bg-stone/50 rounded-xs" />
                  <div className="h-8 w-3/4 bg-stone/60 rounded-xs" />
                  <div className="h-24 w-full bg-stone/40 rounded-xs" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="bg-cream border border-stone rounded-sm overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-stone/40" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 w-24 bg-stone/50 rounded-xs" />
                      <div className="h-6 w-2/3 bg-stone/60 rounded-xs" />
                      <div className="h-12 w-full bg-stone/40 rounded-xs" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : places.length === 0 ? (
            /* Empty / No Results State */
            <div className="bg-cream border border-stone rounded-sm p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-5">
              <SectionLabel>{t.explore.sectionLabel}</SectionLabel>
              <h3 className="font-display text-display-md text-charcoal">
                {t.explore.emptyTitle}
              </h3>
              <p className="font-body text-body-md text-ash">{t.explore.empty}</p>
              <div className="pt-2">
                <Button variant="primary" onClick={handleResetFilters}>
                  {t.explore.retry}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* ASYMMETRIC FEATURED SPOTLIGHT (2fr / 1fr -> 7 cols image + 5 cols dossier on lg) */}
              {featuredPlace && (
                <article
                  className="group relative grid grid-cols-1 lg:grid-cols-12 bg-cream border border-stone rounded-sm overflow-hidden transition-transform transition-shadow duration-300 ease-out-expo hover:-translate-y-[5px] hover:shadow-hover animate-fade-up"
                >
                  {/* Featured Image Column (7/12 on desktop, 4/3 on mobile) */}
                  <Link to={`/places/${featuredPlace.id}`} className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-parchment border-b lg:border-b-0 lg:border-r border-stone">
                    <img
                      src={featuredPlace.imageUrl || FALLBACK_HERO_IMAGE}
                      alt={
                        locale === 'en'
                          ? featuredPlace.name
                          : featuredPlace.vietnameseName
                      }
                      className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute top-4 left-4">
                      <TagBadge
                        variant="lacquer"
                        className="bg-charcoal/85 text-gold border-gold/60"
                      >
                        {t.explore.featuredBadge}
                      </TagBadge>
                    </div>
                  </Link>

                  {/* Featured Editorial Narrative Column (5/12 on desktop) */}
                  <div className="lg:col-span-5 relative p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    {/* Giant subtle background index number (Asymmetric rule) */}
                    <span
                      aria-hidden="true"
                      className="absolute right-5 top-3 font-display text-7xl sm:text-8xl font-light leading-none text-stone/35 select-none pointer-events-none"
                    >
                      01
                    </span>

                    <div className="relative space-y-4">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <TagBadge variant="gold">
                          {t.explore.categories[featuredPlace.category] ||
                            featuredPlace.categoryLabel}
                        </TagBadge>
                        <span className="inline-flex items-center gap-1 font-body text-[11px] uppercase tracking-[0.10em] text-ash">
                          <Clock className="w-3.5 h-3.5 text-gold" />
                          <span>
                            {featuredPlace.estimatedVisitTimeMinutes}{' '}
                            {t.explore.visitTime}
                          </span>
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="font-display text-display-md text-charcoal group-hover:text-lacquer transition-colors duration-300">
                          <Link to={`/places/${featuredPlace.id}`}>{locale === 'en'
                            ? featuredPlace.name
                            : featuredPlace.vietnameseName}</Link>
                        </h3>
                        <p className="font-body text-caption italic text-bronze">
                          {locale === 'en'
                            ? featuredPlace.vietnameseName
                            : featuredPlace.name}
                        </p>
                        <p className="inline-flex items-center gap-1.5 font-body text-[11px] uppercase tracking-[0.10em] text-ash pt-1">
                          <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span>{featuredPlace.location}</span>
                        </p>
                      </div>

                      <p className="font-body text-body-md text-ink/85 leading-relaxed">
                        {featuredPlace.shortDescription}
                      </p>

                      {featuredPlace.tags && featuredPlace.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {featuredPlace.tags.map((tag) => (
                            <TagBadge key={tag} variant="stone">
                              {tag}
                            </TagBadge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative pt-4 border-t border-stone/60 flex flex-wrap items-center justify-between gap-3">
                      <Link to={`/places/${featuredPlace.id}`} className="inline-flex items-center min-h-[44px] gap-2 font-body text-[12px] font-semibold uppercase tracking-[0.12em] text-lacquer group-hover:translate-x-1 transition-transform duration-300">
                        <span>{t.explore.readStoryCta}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/journey?placeId=${featuredPlace.id}`);
                        }}
                        className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xs border border-stone bg-parchment font-body text-[11px] font-semibold uppercase tracking-[0.10em] text-charcoal hover:border-lacquer hover:text-lacquer transition-colors duration-300"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-gold" />
                        <span>{t.explore.planWithPlaceCta}</span>
                      </button>
                    </div>
                  </div>
                </article>
              )}

              {remainingPlaces.length > 0 && <OrnamentDivider />}

              {/* 3-COLUMN VILLAGE CARDS GRID (Mobile 1 col -> Tablet 2 cols -> Desktop 3 cols, Stagger 0.1s) */}
              {remainingPlaces.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {remainingPlaces.map((place, idx) => (
                    <div
                      key={place.id}
                      style={{ animationDelay: `${Math.min(idx + 1, 8) * 100}ms` }}
                      className="animate-fade-up flex"
                    >
                      <VillageCard
                        place={place}
                        aspectRatio="4/3"
                        indexNumber={idx + 2}
                        onClick={handleOpenDetail}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <HomeOutro onExplore={scrollToCatalog} />
    </div>
  );
};

export default ExplorePage;
