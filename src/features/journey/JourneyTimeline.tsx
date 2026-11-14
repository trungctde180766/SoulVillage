import React from 'react';
import { Link, useInRouterContext } from 'react-router-dom';
import { BookmarkCheck, Clock, Compass, Navigation, Wallet } from 'lucide-react';
import { Button } from '../../components/shared/Button';
import { OrnamentDivider } from '../../components/shared/OrnamentDivider';
import { SectionLabel } from '../../components/shared/SectionLabel';
import { TagBadge } from '../../components/shared/TagBadge';
import type { MessagesDictionary } from '../../lib/i18n';
import type { JourneyItinerary, JourneyStop } from '../../types/journey';

interface PlaceStopLinkProps {
  placeId: string;
  children: React.ReactNode;
  className?: string;
}

const PlaceStopLink: React.FC<PlaceStopLinkProps> = ({
  placeId,
  children,
  className = '',
}) => {
  const inRouter = useInRouterContext();
  const targetPath = `/place/${encodeURIComponent(placeId)}`;

  if (inRouter) {
    return (
      <Link to={targetPath} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={`#${targetPath}`} className={className}>
      {children}
    </a>
  );
};

export interface JourneyTimelineProps {
  messages: MessagesDictionary;
  itinerary: JourneyItinerary | null;
  isSaved: boolean;
  savedJourneys: JourneyItinerary[];
  onSave: (itinerary: JourneyItinerary) => void;
  onSelectSaved: (itinerary: JourneyItinerary) => void;
  onRemoveSaved: (itineraryId: string) => void;
}

const StopCard: React.FC<{
  stop: JourneyStop;
  messages: MessagesDictionary;
}> = ({ stop, messages }) => {
  const t = messages.journey;
  const orderLabel = `${t.stopPrefix} ${String(stop.order).padStart(2, '0')}`;

  return (
    <article className="bg-cream border border-stone rounded-sm p-5 sm:p-7 space-y-4 transition-all duration-300 ease-out-expo hover:-translate-y-[5px] hover:shadow-hover min-w-0">
      {/* Order eyebrow & Time slot */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2.5">
          <span
            className="inline-block w-6 h-[1px] bg-gold shrink-0"
            aria-hidden="true"
          />
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
            {orderLabel} · {stop.timeSlot}
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-body text-caption text-ash">
          <Clock className="w-3.5 h-3.5 text-bronze" aria-hidden="true" />
          <span>
            {stop.durationMinutes} {t.minutesUnit}
          </span>
        </span>
      </div>

      {/* Place Heading with Link */}
      <div className="space-y-1">
        <h4 className="font-display text-[22px] sm:text-[26px] leading-snug text-charcoal">
          <PlaceStopLink
            placeId={stop.placeId}
            className="text-ink hover:text-lacquer transition-colors duration-300 focus:outline-none focus:underline"
          >
            {stop.placeName}
          </PlaceStopLink>
        </h4>
      </div>

      {/* Activity Recommendation */}
      <p className="font-body text-body-md text-ink leading-[1.7] break-words">
        {stop.activityRecommendation}
      </p>

      {/* Cultural Insight Editorial Callout */}
      <blockquote className="border-l-2 border-gold pl-4 py-0.5 font-body text-body-sm text-charcoal/90 italic leading-relaxed break-words">
        {stop.culturalInsight}
      </blockquote>

      {/* Transit Tip & Story Link */}
      <div className="pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {stop.transportTip ? (
          <div className="bg-parchment border border-stone/60 rounded-xs px-3 py-2 inline-flex items-start gap-2 text-ash font-body text-body-sm">
            <Navigation
              className="w-3.5 h-3.5 text-bronze shrink-0 mt-1"
              aria-hidden="true"
            />
            <span>
              <strong className="font-medium text-ink/80">
                {t.transportLabel}:
              </strong>{' '}
              {stop.transportTip}
            </span>
          </div>
        ) : (
          <span />
        )}

        <PlaceStopLink
          placeId={stop.placeId}
          className="inline-flex items-center min-h-[44px] self-start sm:self-auto font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-bronze border-b border-stone hover:text-lacquer hover:border-lacquer transition-colors shrink-0"
        >
          {t.viewPlaceCta}
        </PlaceStopLink>
      </div>
    </article>
  );
};

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  messages,
  itinerary,
  isSaved,
  savedJourneys,
  onSave,
  onSelectSaved,
  onRemoveSaved,
}) => {
  const t = messages.journey;

  return (
    <div className="space-y-8 min-w-0">
      {itinerary ? (
        <section aria-live="polite" className="space-y-6">
          {/* Editorial Itinerary Header */}
          <div className="bg-cream border border-stone rounded-sm p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {itinerary.isFallback ? (
                <TagBadge variant="stone">{t.fallbackBadge}</TagBadge>
              ) : (
                <TagBadge variant="gold">{t.geminiBadge}</TagBadge>
              )}

              {isSaved ? (
                <TagBadge
                  variant="gold"
                  className="min-h-[44px] px-3.5 py-2 gap-1.5"
                >
                  <BookmarkCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.savedBadge}</span>
                </TagBadge>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onSave(itinerary)}
                  className="px-5 py-2.5"
                >
                  {t.saveCta}
                </Button>
              )}
            </div>

            {itinerary.isFallback ? (
              <p className="bg-parchment border border-stone/70 rounded-sm px-4 py-3 font-body text-body-sm text-ash">
                {t.fallbackNote}
              </p>
            ) : null}

            <div className="space-y-2.5">
              <h3 className="font-display text-display-lg text-charcoal break-words">
                {itinerary.title}
              </h3>
              <p className="font-body text-body-lg text-ink/85 break-words">
                {itinerary.summary}
              </p>
            </div>

            {/* Cost & Cultural Highlights */}
            <div className="pt-4 border-t border-stone/70 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">
                  <Wallet className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                  <span>{t.costLabel}</span>
                </span>
                <p className="font-body text-body-sm font-medium text-charcoal">
                  {itinerary.totalEstimatedCostVND}
                </p>
              </div>

              {itinerary.culturalHighlights.length > 0 ? (
                <div className="space-y-1.5">
                  <span className="block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">
                    {t.highlightsLabel}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {itinerary.culturalHighlights.map((highlight, idx) => (
                      <TagBadge key={`${highlight}-${idx}`} variant="stone">
                        {highlight}
                      </TagBadge>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Sequential Stop Cards */}
          <div className="space-y-4">
            {itinerary.stops.map((stop) => (
              <StopCard
                key={`${itinerary.id}-${stop.order}-${stop.placeId}`}
                stop={stop}
                messages={messages}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="bg-cream border border-stone rounded-sm p-8 sm:p-12 text-center space-y-4">
          <div className="w-11 h-11 mx-auto rounded-sm border border-stone bg-parchment flex items-center justify-center text-gold">
            <Compass className="w-5 h-5" aria-hidden="true" />
          </div>
          <h3 className="font-display text-display-md text-charcoal">
            {t.emptyTitle}
          </h3>
          <p className="font-body text-body-md text-ash max-w-lg mx-auto">
            {t.emptyBody}
          </p>
        </section>
      )}

      {/* Recently Saved Journeys Dossier */}
      {savedJourneys.length > 0 ? (
        <section className="space-y-4 pt-2">
          <OrnamentDivider />
          <div className="space-y-1.5">
            <SectionLabel>{t.savedSectionLabel}</SectionLabel>
            <h3 className="font-display text-display-md text-charcoal">
              {t.savedTitle} ({savedJourneys.length})
            </h3>
          </div>
          <div className="space-y-3">
            {savedJourneys.map((saved) => {
              const isActive = itinerary?.id === saved.id;
              return (
                <div
                  key={saved.id}
                  className={`bg-cream border rounded-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isActive ? 'border-gold' : 'border-stone'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-xl text-charcoal truncate">
                        {saved.title}
                      </span>
                      <TagBadge variant={saved.isFallback ? 'stone' : 'gold'}>
                        {saved.durationHours}
                        {t.durationUnit} · {saved.stops.length} {t.stopPrefix}
                      </TagBadge>
                    </div>
                    <p className="font-body text-caption text-ash line-clamp-1">
                      {saved.stops.map((s) => s.placeName).join(' → ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectSaved(saved)}
                      className="min-h-[44px] px-3.5 py-2 rounded-sm border border-stone font-body text-[11px] font-semibold uppercase tracking-[0.10em] text-ink hover:border-bronze transition-colors"
                    >
                      {t.openSavedCta}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveSaved(saved.id)}
                      className="min-h-[44px] px-3 py-2 rounded-sm border border-transparent font-body text-[11px] font-semibold uppercase tracking-[0.10em] text-ash hover:text-lacquer transition-colors"
                    >
                      {t.removeSavedCta}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default JourneyTimeline;
