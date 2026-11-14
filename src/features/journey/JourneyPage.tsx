import React, { useEffect, useRef, useState } from 'react';
import { useInRouterContext, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { useTranslations, type SupportedLocale } from '../../lib/i18n';
import { useAuth } from '../../lib/auth';
import { fetchCulturalPlaces } from '../../services/api';
import { generateAIJourney, JourneyApiError } from '../../services/journeyApi';
import {
  loadSavedJourneys,
  removeSavedJourney,
  saveJourney,
} from '../../services/journeyStorage';
import type { JourneyItinerary, JourneyPreference } from '../../types/journey';
import type { CulturalCategory, CulturalPlace } from '../../types/place';
import { JourneyForm } from './JourneyForm';
import { JourneyTimeline } from './JourneyTimeline';

function readPlaceIdFromWindow(): string | null {
  if (typeof window === 'undefined') return null;
  const searchParams = new URLSearchParams(window.location.search);
  const direct = searchParams.get('placeId');
  if (direct && direct.trim()) return direct.trim();

  const hash = window.location.hash;
  const queryIdx = hash.indexOf('?');
  if (queryIdx !== -1) {
    const hashParams = new URLSearchParams(hash.slice(queryIdx + 1));
    const fromHash = hashParams.get('placeId');
    if (fromHash && fromHash.trim()) return fromHash.trim();
  }
  return null;
}

const RouterPlaceIdObserver: React.FC<{
  onPlaceIdChange: (placeId: string | null) => void;
}> = ({ onPlaceIdChange }) => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromRouter = params.get('placeId');
    onPlaceIdChange(
      fromRouter && fromRouter.trim()
        ? fromRouter.trim()
        : readPlaceIdFromWindow(),
    );
  }, [location.search, onPlaceIdChange]);

  return null;
};

export interface JourneyPageProps {
  locale?: SupportedLocale;
}

export const JourneyPage: React.FC<JourneyPageProps> = ({ locale }) => {
  const { isAuthenticated } = useAuth();
  const messages = useTranslations(locale);
  const t = messages.journey;
  const inRouter = useInRouterContext();

  const [durationHours, setDurationHours] = useState<number>(4);
  const [interests, setInterests] = useState<CulturalCategory[]>(['craft']);
  const [startLocation, setStartLocation] = useState<string>('');
  const [pace, setPace] = useState<JourneyPreference['pace']>('moderate');
  const [companion, setCompanion] =
    useState<JourneyPreference['companion']>('solo');

  const [priorityPlaceId, setPriorityPlaceId] = useState<string | null>(() =>
    readPlaceIdFromWindow(),
  );
  const [catalog, setCatalog] = useState<CulturalPlace[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<JourneyItinerary | null>(null);
  const [savedJourneys, setSavedJourneys] = useState<JourneyItinerary[]>(() =>
    loadSavedJourneys(),
  );

  const abortRef = useRef<AbortController | null>(null);

  // Load places catalog opportunistically so ?placeId=<id> can verify ID & adopt its category
  useEffect(() => {
    const controller = new AbortController();
    fetchCulturalPlaces(undefined, controller.signal)
      .then((places) => {
        setCatalog(places);
        if (priorityPlaceId) {
          const found = places.find((item) => item.id === priorityPlaceId);
          if (found) {
            setInterests((prev) =>
              prev.includes(found.category) ? prev : [found.category, ...prev],
            );
          }
        }
      })
      .catch(() => {
        // Catalog may be 501/empty while TV3 is still populating; handled gracefully on submit
      });
    return () => controller.abort();
  }, [priorityPlaceId]);

  const matchedPriorityPlace =
    priorityPlaceId && catalog.length > 0
      ? catalog.find((item) => item.id === priorityPlaceId) ?? null
      : null;

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleToggleInterest = (category: CulturalCategory) => {
    setErrorMessage(null);
    setInterests((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!isAuthenticated) {
      setErrorMessage(
        'Vui lòng đăng nhập danh tính văn hóa để khởi tạo hành trình AI cá nhân hóa.',
      );
      return;
    }

    if (interests.length === 0) {
      setErrorMessage(t.errors.missingInterests);
      return;
    }

    const trimmedStart = startLocation.trim();
    if (trimmedStart.length > 200) {
      setErrorMessage(t.errors.startLocationTooLong);
      return;
    }

    // Only forward selectedPlaceIds when valid (either verified in loaded catalog or catalog not yet fetched)
    const validSelectedIds =
      priorityPlaceId &&
      (catalog.length === 0 ||
        catalog.some((place) => place.id === priorityPlaceId))
        ? [priorityPlaceId]
        : undefined;

    const preference: JourneyPreference = {
      durationHours,
      interests,
      startLocation: trimmedStart || 'Trung tâm TP. Huế',
      pace,
      companion,
      ...(validSelectedIds ? { selectedPlaceIds: validSelectedIds } : {}),
    };

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const generated = await generateAIJourney(preference, controller.signal);
      setItinerary(generated);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      if (err instanceof JourneyApiError) {
        if (err.code === 'DATA_NOT_READY') {
          setErrorMessage(t.errors.dataNotReady);
        } else if (err.code === 'AI_NOT_CONFIGURED') {
          setErrorMessage(t.errors.aiNotConfigured);
        } else if (err.code === 'INVALID_REQUEST') {
          setErrorMessage(err.message || t.errors.invalidRequest);
        } else if (err.code === 'NETWORK_ERROR') {
          setErrorMessage(t.errors.network);
        } else {
          setErrorMessage(err.message);
        }
      } else {
        setErrorMessage(t.errors.network);
      }
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  };

  const handleSaveItinerary = (target: JourneyItinerary) => {
    saveJourney(target);
    setSavedJourneys(loadSavedJourneys());
  };

  const handleRemoveSaved = (id: string) => {
    const remaining = removeSavedJourney(id);
    setSavedJourneys(remaining);
  };

  const isCurrentSaved = itinerary
    ? savedJourneys.some((item) => item.id === itinerary.id)
    : false;

  return (
    <div className="min-h-screen bg-parchment text-ink overflow-x-hidden pb-20">
      {inRouter ? (
        <RouterPlaceIdObserver onPlaceIdChange={setPriorityPlaceId} />
      ) : null}

      <PageHeader
        label={t.sectionLabel}
        title={t.title}
        subtitle={t.subtitle}
        className="pt-28 sm:pt-32"
      />

      <main className="max-w-content mx-auto px-4 sm:px-8 lg:px-10 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 min-w-0">
            <JourneyForm
              messages={messages}
              durationHours={durationHours}
              interests={interests}
              startLocation={startLocation}
              pace={pace}
              companion={companion}
              priorityPlace={matchedPriorityPlace}
              priorityPlaceId={priorityPlaceId}
              loading={loading}
              validationError={errorMessage}
              onDurationChange={setDurationHours}
              onToggleInterest={handleToggleInterest}
              onStartLocationChange={(val) => {
                setErrorMessage(null);
                setStartLocation(val);
              }}
              onPaceChange={setPace}
              onCompanionChange={setCompanion}
              onClearPriorityPlace={() => setPriorityPlaceId(null)}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="lg:col-span-7 min-w-0">
            <JourneyTimeline
              messages={messages}
              itinerary={itinerary}
              isSaved={isCurrentSaved}
              savedJourneys={savedJourneys}
              onSave={handleSaveItinerary}
              onSelectSaved={(saved) => setItinerary(saved)}
              onRemoveSaved={handleRemoveSaved}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default JourneyPage;
