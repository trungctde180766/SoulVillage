import React, { useState } from 'react';
import { Lock, Sparkles, X } from 'lucide-react';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { SectionLabel } from '../../components/shared/SectionLabel';
import { TagBadge } from '../../components/shared/TagBadge';
import { useAuth } from '../../lib/auth';
import type { MessagesDictionary } from '../../lib/i18n';
import type { CulturalCategory, CulturalPlace } from '../../types/place';
import type { JourneyPreference } from '../../types/journey';

const DURATION_OPTIONS = [2, 3, 4, 6, 8] as const;
const CATEGORY_ORDER: readonly CulturalCategory[] = [
  'craft',
  'monument',
  'cuisine',
  'spiritual',
  'nature',
];
const PACE_OPTIONS: readonly JourneyPreference['pace'][] = [
  'relaxed',
  'moderate',
  'intensive',
];
const COMPANION_OPTIONS: readonly JourneyPreference['companion'][] = [
  'solo',
  'couple',
  'family',
  'friends',
];

export interface JourneyFormProps {
  messages: MessagesDictionary;
  durationHours: number;
  interests: CulturalCategory[];
  startLocation: string;
  pace: JourneyPreference['pace'];
  companion: JourneyPreference['companion'];
  priorityPlace: CulturalPlace | null;
  priorityPlaceId: string | null;
  loading: boolean;
  validationError: string | null;
  onDurationChange: (hours: number) => void;
  onToggleInterest: (category: CulturalCategory) => void;
  onStartLocationChange: (value: string) => void;
  onPaceChange: (pace: JourneyPreference['pace']) => void;
  onCompanionChange: (companion: JourneyPreference['companion']) => void;
  onClearPriorityPlace: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const JourneyForm: React.FC<JourneyFormProps> = ({
  messages,
  durationHours,
  interests,
  startLocation,
  pace,
  companion,
  priorityPlace,
  priorityPlaceId,
  loading,
  validationError,
  onDurationChange,
  onToggleInterest,
  onStartLocationChange,
  onPaceChange,
  onCompanionChange,
  onClearPriorityPlace,
  onSubmit,
}) => {
  const t = messages.journey;
  const categoryLabels = messages.explore.categories;
  const { isAuthenticated, user, login } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const selectedSet = new Set<CulturalCategory>(interests);

  const handleQuickLogin = async () => {
    setAuthLoading(true);
    try {
      await login({ email: 'tv2@hoalang.vn', password: 'hoalang2026' });
    } finally {
      setAuthLoading(false);
    }
  };
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="bg-cream border border-stone rounded-sm p-6 sm:p-8 space-y-6 min-w-0"
    >
      <div className="space-y-2 border-b border-stone/70 pb-4">
        <SectionLabel>{t.formSectionLabel}</SectionLabel>
        <h2 className="font-display text-display-md text-charcoal">
          {t.formTitle}
        </h2>
      </div>

      {priorityPlaceId ? (
        <div className="bg-parchment border border-gold/50 rounded-sm p-3.5 flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <span className="block font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
              {t.priorityLabel}
            </span>
            <p className="font-display text-lg text-charcoal truncate">
              {priorityPlace ? priorityPlace.vietnameseName : priorityPlaceId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClearPriorityPlace}
            aria-label={t.clearPriority}
            className="inline-flex items-center gap-1 min-h-[44px] min-w-[44px] justify-center px-2.5 text-[11px] font-body uppercase tracking-[0.10em] text-ash hover:text-lacquer transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {/* Duration selector */}
      <fieldset className="space-y-2.5">
        <legend className="block font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-ash">
          {t.durationLabel}
        </legend>
        <div className="grid grid-cols-5 gap-2">
          {DURATION_OPTIONS.map((hours) => {
            const active = durationHours === hours;
            return (
              <button
                key={hours}
                type="button"
                aria-pressed={active}
                onClick={() => onDurationChange(hours)}
                className={`min-h-[44px] px-2 py-2.5 rounded-sm border font-body text-xs font-semibold tracking-[0.06em] transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-bronze ${
                  active
                    ? 'border-lacquer bg-lacquer-15 text-lacquer'
                    : 'border-stone bg-transparent text-ink hover:border-bronze'
                }`}
              >
                {hours}
                <span className="ml-0.5 font-normal text-[11px]">
                  {t.durationUnit}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Cultural interests chips (>= 44x44px touch targets) */}
      <fieldset className="space-y-2.5">
        <legend className="block font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-ash">
          {t.interestsLabel}
        </legend>
        <p className="font-body text-caption text-ash">{t.interestsHint}</p>
        <div className="flex flex-wrap gap-2 pt-0.5">
          {CATEGORY_ORDER.map((cat) => {
            const isSelected = selectedSet.has(cat);
            return (
              <TagBadge
                key={cat}
                variant={isSelected ? 'gold' : 'stone'}
                onClick={() => onToggleInterest(cat)}
                className="min-h-[44px] px-3.5 py-2 text-[11px]"
              >
                {categoryLabels[cat]}
              </TagBadge>
            );
          })}
        </div>
      </fieldset>

      {/* Starting point input (16px font size via shared Input) */}
      <Input
        id="journey-start-location"
        label={t.startLocationLabel}
        variant="box"
        maxLength={200}
        value={startLocation}
        onChange={(e) => onStartLocationChange(e.target.value)}
        placeholder={t.startLocationPlaceholder}
      />

      {/* Pace selector */}
      <fieldset className="space-y-2.5">
        <legend className="block font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-ash">
          {t.paceLabel}
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {PACE_OPTIONS.map((option) => {
            const active = pace === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => onPaceChange(option)}
                className={`min-h-[44px] px-2.5 py-2 rounded-sm border font-body text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-bronze ${
                  active
                    ? 'border-gold bg-gold-20 text-ink'
                    : 'border-stone bg-transparent text-ash hover:border-bronze hover:text-ink'
                }`}
              >
                {t.paces[option]}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Companion selector */}
      <fieldset className="space-y-2.5">
        <legend className="block font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-ash">
          {t.companionLabel}
        </legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {COMPANION_OPTIONS.map((option) => {
            const active = companion === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => onCompanionChange(option)}
                className={`min-h-[44px] px-2.5 py-2 rounded-sm border font-body text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-bronze ${
                  active
                    ? 'border-gold bg-gold-20 text-ink'
                    : 'border-stone bg-transparent text-ash hover:border-bronze hover:text-ink'
                }`}
              >
                {t.companions[option]}
              </button>
            );
          })}
        </div>
      </fieldset>

      {validationError ? (
        <div
          role="alert"
          className="bg-parchment border border-lacquer/40 rounded-sm px-4 py-3 font-body text-body-sm text-lacquer"
        >
          {validationError}
        </div>
      ) : null}
      {!isAuthenticated ? (
        <div className="bg-parchment border border-gold/60 rounded-sm p-4 space-y-3 text-left">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
            <span className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-charcoal">
              Yêu Cầu Xác Thực Danh Tính Văn Hóa
            </span>
          </div>
          <p className="font-body text-body-sm text-ash leading-relaxed">
            Để bảo toàn tài nguyên trí tuệ nhân tạo và lưu trữ tiến độ cá nhân hóa, vui lòng đăng nhập trước khi khởi tạo hành trình AI.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Button
              type="button"
              variant="ghost"
              isLoading={authLoading}
              onClick={handleQuickLogin}
              className="px-4 py-2 text-xs"
            >
              Đăng Nhập 1 Chạm (TV2 AI Demo)
            </Button>
            <a
              href="#/auth"
              className="font-body text-caption underline text-bronze hover:text-lacquer transition-colors"
            >
              Hoặc mở trang đăng nhập
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-parchment/70 border border-stone rounded-sm px-4 py-2.5 flex items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
            <span className="font-body text-xs text-charcoal font-medium">
              Đã xác thực: <strong className="text-lacquer">{user?.fullName}</strong> ({user?.title})
            </span>
          </div>
          <TagBadge variant="gold">Verified</TagBadge>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={loading}
        disabled={loading || !isAuthenticated}
        className="w-full px-5"
      >
        {loading ? (
          t.submitting
        ) : !isAuthenticated ? (
          <span className="inline-flex items-center gap-2">
            <Lock className="w-4 h-4" aria-hidden="true" />
            <span>Vui Lòng Đăng Nhập Để Khởi Tạo</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>{t.submitCta}</span>
          </span>
        )}
      </Button>
    </form>
  );
};

export default JourneyForm;
