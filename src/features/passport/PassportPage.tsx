import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  Compass,
  Edit3,
  Gift,
  Globe,
  Hammer,
  MapPin,
  RotateCcw,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Ticket,
  X,
} from 'lucide-react';
import {
  AnimatedNumber,
  Button,
  Input,
  OrnamentDivider,
  PageHeader,
  SectionLabel,
  TagBadge,
} from '../../components/shared';
import { FALLBACK_PLACE_IMAGE_URL, getPlaceById } from '../../data/places';
import { useLocale, useTranslations, type SupportedLocale } from '../../lib/i18n';
import { loadSavedJourneys } from '../../services/journeyStorage';
import {
  CULTURAL_REWARDS_CATALOG,
  getLocalPassport,
  getRedeemedRewards,
  getTotalEarnedPoints,
  QUIZ_CORRECT_POINTS,
  redeemPassportReward,
  resetLocalPassport,
  submitQuizAnswer,
  updatePassportDisplayName,
  type RedeemedRewardRecord,
} from '../../services/storage';
import type { JourneyItinerary } from '../../types/journey';
import type { CulturalBadge, UserPassportProfile } from '../../types/passport';
import { QuizCraftScene } from './components/QuizCraftScene';
import { getLocalizedQuestions, getQuizSceneMeta } from './data/questions';

export interface PassportPageProps {
  locale?: SupportedLocale;
  onSelectPlace?: (placeId: string) => void;
  onNavigateJourney?: () => void;
}

type BadgeTranslationKey =
  | 'badge-heritage-scholar'
  | 'badge-journey-planner'
  | 'badge-craft-connoisseur'
  | 'badge-imperial-master';

function isBadgeTranslationKey(id: string): id is BadgeTranslationKey {
  return (
    id === 'badge-heritage-scholar' ||
    id === 'badge-journey-planner' ||
    id === 'badge-craft-connoisseur' ||
    id === 'badge-imperial-master'
  );
}

function renderBadgeIcon(iconName: string, isUnlocked: boolean): React.ReactNode {
  const colorClass = isUnlocked ? 'text-gold' : 'text-ash';
  switch (iconName) {
    case 'scroll':
      return <ScrollText className={`w-5 h-5 ${colorClass}`} />;
    case 'compass':
      return <Compass className={`w-5 h-5 ${colorClass}`} />;
    case 'hammer':
      return <Hammer className={`w-5 h-5 ${colorClass}`} />;
    case 'award':
    default:
      return <Award className={`w-5 h-5 ${colorClass}`} />;
  }
}

function formatEditorialDate(isoString: string, locale: SupportedLocale): string {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

const PassportPageContent: React.FC<PassportPageProps> = ({
  locale: propLocale,
  onSelectPlace,
  onNavigateJourney,
}) => {
  const { locale: contextLocale, setLocale: setContextLocale } = useLocale();
  const [localFallbackLocale, setLocalFallbackLocale] = useState<SupportedLocale | null>(null);
  const activeLocale: SupportedLocale = propLocale ?? contextLocale ?? localFallbackLocale ?? 'vi';

  const handleSwitchLocale = (next: SupportedLocale) => {
    setLocalFallbackLocale(next);
    setContextLocale(next);
  };

  const t = useTranslations(activeLocale);
  const questions = useMemo(() => getLocalizedQuestions(activeLocale), [activeLocale]);

  const [profile, setProfile] = useState<UserPassportProfile>(() => getLocalPassport());
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedRewardRecord[]>(() =>
    getRedeemedRewards()
  );
  const [savedJourneys, setSavedJourneys] = useState<JourneyItinerary[]>(() => loadSavedJourneys());

  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [wasAlreadyCompletedOnSubmit, setWasAlreadyCompletedOnSubmit] = useState<boolean>(false);
  const [lastPointsAwarded, setLastPointsAwarded] = useState<number>(0);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<CulturalBadge[]>([]);

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(profile.displayName);
  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);
  const [showJourneyHint, setShowJourneyHint] = useState<boolean>(false);

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }

    const syncStorageState = () => {
      setProfile(getLocalPassport());
      setRedeemedRewards(getRedeemedRewards());
      setSavedJourneys(loadSavedJourneys());
    };

    window.addEventListener('storage', syncStorageState);
    window.addEventListener('focus', syncStorageState);
    return () => {
      window.removeEventListener('storage', syncStorageState);
      window.removeEventListener('focus', syncStorageState);
    };
  }, []);

  const currentQuestion = questions[currentQuizIndex] ?? questions[0];
  const currentSceneMeta = useMemo(
    () =>
      currentQuestion
        ? getQuizSceneMeta(currentQuestion.id, activeLocale)
        : getQuizSceneMeta('quiz-non-tay-ho', activeLocale),
    [activeLocale, currentQuestion]
  );

  const linkedPlace = currentQuestion?.placeId ? getPlaceById(currentQuestion.placeId) : undefined;
  const isCurrentQuestionCompleted = currentQuestion
    ? profile.completedQuizIds.includes(currentQuestion.id)
    : false;

  const unlockedBadgesCount = useMemo(
    () => profile.badges.filter((badge) => Boolean(badge.unlockedAt)).length,
    [profile.badges]
  );

  const totalEarnedPoints = useMemo(() => getTotalEarnedPoints(profile), [profile]);
  const maxQuizPoints = questions.length * QUIZ_CORRECT_POINTS;
  const masteryPercent = Math.min(
    100,
    Math.round((totalEarnedPoints / Math.max(maxQuizPoints, 1)) * 100)
  );

  const currentRankTitle = useMemo(() => {
    if (totalEarnedPoints >= 300 || profile.completedQuizIds.length >= 6) {
      return t.passport.rankMaster;
    }
    if (totalEarnedPoints >= 150 || profile.completedQuizIds.length >= 3) {
      return t.passport.rankConnoisseur;
    }
    if (totalEarnedPoints >= 100 || profile.completedQuizIds.length >= 2) {
      return t.passport.rankScholar;
    }
    return t.passport.rankNovice;
  }, [profile.completedQuizIds.length, t.passport, totalEarnedPoints]);

  const decodedPlaces = useMemo(() => {
    return profile.visitedPlaceIds
      .map((id) => getPlaceById(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [profile.visitedPlaceIds]);

  const redeemedMap = useMemo(() => {
    const map = new Map<string, RedeemedRewardRecord>();
    for (const rec of redeemedRewards) {
      map.set(rec.rewardId, rec);
    }
    return map;
  }, [redeemedRewards]);

  const getBadgeText = (badge: CulturalBadge) => {
    if (isBadgeTranslationKey(badge.id)) {
      const translated = t.passport?.badges?.[badge.id];
      if (translated) return translated;
    }
    return {
      name: badge.name,
      description: badge.description,
      requirementText: badge.requirementText,
    };
  };

  const handleSelectQuestion = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    setCurrentQuizIndex(index);
    setSelectedOption(null);
    setAnswered(false);
    setIsCorrect(false);
    setWasAlreadyCompletedOnSubmit(false);
    setLastPointsAwarded(0);
    setNewlyUnlockedBadges([]);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;

    const correct = selectedOption === currentQuestion.correctOptionIndex;
    const result = submitQuizAnswer(currentQuestion.id, correct, currentQuestion.placeId);

    setProfile(result.profile);
    setIsCorrect(correct);
    setAnswered(true);
    setWasAlreadyCompletedOnSubmit(result.alreadyCompleted);
    setLastPointsAwarded(result.pointsAdded);
    setNewlyUnlockedBadges(result.newlyUnlockedBadges);
  };

  const handleRetryQuestion = () => {
    setSelectedOption(null);
    setAnswered(false);
    setIsCorrect(false);
    setLastPointsAwarded(0);
    setNewlyUnlockedBadges([]);
  };

  const handleNextQuestion = () => {
    const nextIdx = (currentQuizIndex + 1) % questions.length;
    handleSelectQuestion(nextIdx);
  };

  const handleSaveDisplayName = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updatePassportDisplayName(nameInput);
    setProfile(updated);
    setNameInput(updated.displayName);
    setIsEditingName(false);
  };

  const handleRedeemReward = (rewardId: string) => {
    const res = redeemPassportReward(rewardId);
    if (res.success) {
      setProfile(res.profile);
      setRedeemedRewards(res.redeemedRewards);
    }
  };

  const handleResetPassport = () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    const fresh = resetLocalPassport();
    setProfile(fresh);
    setRedeemedRewards(getRedeemedRewards());
    setSelectedOption(null);
    setAnswered(false);
    setIsCorrect(false);
    setWasAlreadyCompletedOnSubmit(false);
    setLastPointsAwarded(0);
    setNewlyUnlockedBadges([]);
    setConfirmingReset(false);
  };

  const handleOpenPlace = (placeId: string) => {
    if (onSelectPlace) {
      onSelectPlace(placeId);
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.hash = `#/places/${encodeURIComponent(placeId)}`;
    }
  };

  const handleGoToJourney = () => {
    if (onNavigateJourney) {
      onNavigateJourney();
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.hash = '#/journey';
      return;
    }
    setShowJourneyHint(true);
  };

  const numFontStyle = '[font-variant-numeric:lining-nums_tabular-nums]';

  return (
    <div className="min-h-screen bg-parchment text-ink pb-24 font-body overflow-x-hidden">
      {/* Editorial Charcoal Page Header (pt-28 sm:pt-32 clears fixed Navbar) */}
      <PageHeader
        label={t.passport.sectionLabel}
        title={t.passport.title}
        subtitle={t.passport.subtitle}
        className="pt-28 sm:pt-32"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <TagBadge variant="gold">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.passport.localStorageNote}</span>
              </span>
            </TagBadge>
            <TagBadge variant="stone">{profile.userId}</TagBadge>
          </div>

          {/* Bilingual Editorial Switcher (VI / EN) */}
          <div
            className="inline-flex items-center rounded-sm border border-cream/30 bg-charcoal p-0.5"
            role="group"
            aria-label={t.nav.language}
          >
            <span className="px-2 text-gold" aria-hidden="true">
              <Globe className="w-3.5 h-3.5" />
            </span>
            <button
              type="button"
              onClick={() => handleSwitchLocale('vi')}
              className={`min-h-[36px] min-w-[44px] px-2.5 rounded-xs font-body text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
                activeLocale === 'vi'
                  ? 'bg-gold text-charcoal'
                  : 'text-cream/75 hover:text-cream'
              }`}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => handleSwitchLocale('en')}
              className={`min-h-[36px] min-w-[44px] px-2.5 rounded-xs font-body text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
                activeLocale === 'en'
                  ? 'bg-gold text-charcoal'
                  : 'text-cream/75 hover:text-cream'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </PageHeader>

      <div className="max-w-content mx-auto px-5 sm:px-10 pt-10 sm:pt-14 space-y-12">
        {/* Main Asymmetric Editorial Grid: 5 cols Dossier Card / 7 cols Interactive Quiz */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN (5 cols): Heritage Passport Card */}
          <div className="lg:col-span-5 bg-cream border-2 border-stone rounded-md p-6 sm:p-7 relative">
            {/* Inner subtle gold editorial bookbinding frame */}
            <div
              className="pointer-events-none absolute inset-2 border border-gold/25 rounded-sm"
              aria-hidden="true"
            />

            <div className="relative space-y-6">
              {/* Dossier Header */}
              <div className="space-y-3 border-b border-stone pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <SectionLabel>{t.passport.sectionLabel}</SectionLabel>
                  <TagBadge variant="gold">{currentRankTitle}</TagBadge>
                </div>

                {!isEditingName ? (
                  <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
                    <div className="min-w-0">
                      <p className="font-body text-[11px] uppercase tracking-[0.12em] text-ash">
                        {t.passport.holderLabel}
                      </p>
                      <h2 className="font-display text-display-lg text-charcoal mt-0.5 break-words">
                        {profile.displayName}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNameInput(profile.displayName);
                        setIsEditingName(true);
                      }}
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-1.5 rounded-xs border border-stone bg-parchment/70 text-[11px] font-semibold uppercase tracking-[0.10em] text-bronze hover:border-bronze hover:text-lacquer transition-colors duration-300"
                    >
                      <Edit3 className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.passport.editNameCta}</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSaveDisplayName} className="space-y-3 pt-1">
                    <Input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={60}
                      aria-label={t.passport.holderLabel}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <Button type="submit" variant="primary" className="px-5 py-2.5">
                        {t.passport.saveNameCta}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-5 py-2.5"
                        onClick={() => setIsEditingName(false)}
                      >
                        {t.passport.cancelEditCta}
                      </Button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2 text-caption text-ash">
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.12em] text-ash/80">
                      {t.passport.passportCodeLabel}
                    </span>
                    <span className={`font-semibold text-charcoal break-all ${numFontStyle}`}>
                      {profile.userId}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.12em] text-ash/80">
                      {t.passport.issuedDateLabel}
                    </span>
                    <span className={`font-semibold text-charcoal ${numFontStyle}`}>
                      {formatEditorialDate(profile.joinedAt, activeLocale)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Points Counter Plaque (Zero top clipping, crisp lining numerals) */}
              <div className="bg-parchment border border-stone rounded-sm p-5 sm:p-6 space-y-4 relative">
                <div className="text-center space-y-1.5 pt-1">
                  <span className="font-body text-label-sm uppercase text-ash block">
                    {t.passport.pointsLabel}
                  </span>
                  <div className="flex items-center justify-center gap-2.5 py-2">
                    <div
                      className={`font-display text-5xl sm:text-6xl font-semibold text-gold leading-[1.15] ${numFontStyle}`}
                    >
                      <AnimatedNumber value={profile.points} />
                    </div>
                    {lastPointsAwarded > 0 && answered && (
                      <span
                        className={`px-2 py-0.5 rounded-xs bg-gold-20 border border-gold text-xs font-semibold text-bronze animate-fade-up ${numFontStyle}`}
                      >
                        +{lastPointsAwarded}
                      </span>
                    )}
                  </div>
                </div>

                {/* Total Earned Progress Bar (Never drops when redeeming gifts!) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-caption font-body text-ash">
                    <span>{t.passport.totalEarnedLabel}</span>
                    <span className={`font-semibold text-charcoal ${numFontStyle}`}>
                      {totalEarnedPoints} / {maxQuizPoints} {t.passport.pointsUnit}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-stone/50 rounded-xs overflow-hidden">
                    <div
                      className="h-full bg-gold transition-transform duration-700 ease-out-expo origin-left"
                      style={{ transform: `scaleX(${masteryPercent / 100})` }}
                    />
                  </div>
                </div>

                {/* 3-Column Summary Stats (Lining numerals so 0 never looks like lowercase 'o') */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone/70 text-center">
                  <div className="px-1">
                    <div
                      className={`font-display text-2xl sm:text-3xl font-semibold text-charcoal leading-tight ${numFontStyle}`}
                    >
                      {profile.completedQuizIds.length}/{questions.length}
                    </div>
                    <div className="text-[11px] font-medium text-ash leading-snug mt-1">
                      {t.passport.statsCompletedQuizzes}
                    </div>
                  </div>
                  <div className="border-x border-stone/60 px-1">
                    <div
                      className={`font-display text-2xl sm:text-3xl font-semibold text-charcoal leading-tight ${numFontStyle}`}
                    >
                      {profile.savedItinerariesCount}
                    </div>
                    <div className="text-[11px] font-medium text-ash leading-snug mt-1">
                      {t.passport.statsSavedJourneys}
                    </div>
                  </div>
                  <div className="px-1">
                    <div
                      className={`font-display text-2xl sm:text-3xl font-semibold text-charcoal leading-tight ${numFontStyle}`}
                    >
                      {unlockedBadgesCount}/{profile.badges.length}
                    </div>
                    <div className="text-[11px] font-medium text-ash leading-snug mt-1">
                      {t.passport.statsUnlockedBadges}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cultural Badges Collection (Full text, NO ellipsis truncation!) */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-body text-label-sm uppercase text-charcoal">
                    {t.passport.badgesHeading}
                  </h3>
                  <span className={`font-body text-caption text-ash font-semibold ${numFontStyle}`}>
                    {unlockedBadgesCount}/{profile.badges.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.badges.map((badge) => {
                    const isUnlocked = Boolean(badge.unlockedAt);
                    const localizedBadge = getBadgeText(badge);

                    return (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-xs border transition-colors duration-300 flex flex-col justify-between gap-3 ${
                          isUnlocked
                            ? 'border-gold bg-gold-20 text-charcoal'
                            : 'border-dashed border-stone bg-parchment/55 text-ash'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Badge Emblem */}
                          <div
                            className={`w-10 h-10 shrink-0 rounded-xs border p-0.5 flex items-center justify-center ${
                              isUnlocked
                                ? 'border-gold bg-cream text-gold'
                                : 'border-stone bg-parchment text-ash opacity-60'
                            }`}
                          >
                            <div
                              className={`w-full h-full rounded-xs border flex items-center justify-center ${
                                isUnlocked ? 'border-gold/50' : 'border-stone/70'
                              }`}
                            >
                              {renderBadgeIcon(badge.icon, isUnlocked)}
                            </div>
                          </div>

                          <div className="space-y-1 min-w-0">
                            <div className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal leading-snug">
                              {localizedBadge.name}
                            </div>
                            <p className="font-body text-caption text-ink/85 leading-relaxed">
                              {localizedBadge.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone/60 font-body text-caption flex flex-wrap items-center justify-between gap-1.5">
                          {isUnlocked && badge.unlockedAt ? (
                            <>
                              <span className={`text-bronze font-medium ${numFontStyle}`}>
                                {t.passport.badgeUnlockedPrefix}:{' '}
                                {formatEditorialDate(badge.unlockedAt, activeLocale)}
                              </span>
                              <span className="px-1.5 py-0.5 rounded-xs border border-gold/60 bg-cream text-[10px] font-semibold uppercase tracking-[0.08em] text-bronze">
                                {t.passport.sealedTag}
                              </span>
                            </>
                          ) : (
                            <span className="text-ash leading-snug">
                              <strong className="font-semibold text-charcoal/80">
                                {t.passport.badgeLockedPrefix}:
                              </strong>{' '}
                              {localizedBadge.requirementText}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Demo Reset Control */}
              {(totalEarnedPoints > 0 || redeemedRewards.length > 0) && (
                <div className="pt-3 border-t border-stone/60 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleResetPassport}
                    className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-xs border text-[11px] font-semibold uppercase tracking-[0.10em] transition-colors duration-300 ${
                      confirmingReset
                        ? 'border-lacquer bg-lacquer text-cream'
                        : 'border-stone bg-transparent text-ash hover:border-bronze hover:text-charcoal'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>
                      {confirmingReset ? t.passport.resetConfirmCta : t.passport.resetCta}
                    </span>
                  </button>
                  {confirmingReset && (
                    <button
                      type="button"
                      onClick={() => setConfirmingReset(false)}
                      className="min-h-[40px] px-3 py-1.5 font-body text-caption text-ash underline hover:text-charcoal"
                    >
                      {t.passport.cancelEditCta}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (7 cols): Interactive Cultural Heritage Quiz */}
          <div className="lg:col-span-7 bg-cream border border-stone rounded-sm p-6 sm:p-7 space-y-6">
            {/* Quiz Section Header & Question Selector */}
            <div className="space-y-4 border-b border-stone pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionLabel>{t.passport.quizSectionLabel}</SectionLabel>
                {isCurrentQuestionCompleted ? (
                  <TagBadge variant="gold">{t.passport.quizCompletedTag}</TagBadge>
                ) : (
                  <TagBadge variant="stone">{t.passport.quizFirstTimeRewardTag}</TagBadge>
                )}
              </div>

              {/* Question Number Tabs (44x44px touch targets) */}
              <div className="flex flex-wrap items-center gap-2" role="tablist">
                {questions.map((qItem, idx) => {
                  const completed = profile.completedQuizIds.includes(qItem.id);
                  const isActive = idx === currentQuizIndex;
                  return (
                    <button
                      key={qItem.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleSelectQuestion(idx)}
                      className={`min-w-[44px] min-h-[44px] px-3 rounded-sm border font-body text-xs font-semibold uppercase tracking-[0.10em] transition-colors duration-300 flex items-center justify-center gap-1.5 ${numFontStyle} ${
                        isActive
                          ? 'bg-charcoal text-cream border-charcoal'
                          : completed
                            ? 'bg-gold-20 text-charcoal border-gold/60 hover:border-bronze'
                            : 'bg-parchment text-ink border-stone hover:border-bronze'
                      }`}
                    >
                      <span>{String(idx + 1).padStart(2, '0')}</span>
                      {completed && <Check className="w-3.5 h-3.5 text-gold shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {currentQuestion && (
              <div className="space-y-6">
                {/* Interactive Craft Scene + Village Photography */}
                <QuizCraftScene
                  key={currentQuestion.id}
                  place={linkedPlace}
                  meta={currentSceneMeta}
                  locale={activeLocale}
                  isAnswered={answered}
                  onSelectPlace={handleOpenPlace}
                />

                {/* Asymmetric Question Heading with Lining Numeral */}
                <div className="flex items-start gap-4 pt-1">
                  <span
                    aria-hidden="true"
                    className={`hidden sm:inline-block font-display text-5xl leading-none text-stone select-none pt-0.5 ${numFontStyle}`}
                  >
                    {String(currentQuizIndex + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-display-md text-charcoal">
                    {currentQuestion.question}
                  </h3>
                </div>

                {/* 4 Answer Options */}
                <div className="space-y-3" role="radiogroup" aria-label={currentQuestion.question}>
                  {currentQuestion.options.map((optionText, idx) => {
                    const isSelected = selectedOption === idx;
                    const isRightOption = idx === currentQuestion.correctOptionIndex;

                    let optionStyle =
                      'border-stone bg-parchment text-ink hover:border-bronze hover:bg-cream';

                    if (!answered && isSelected) {
                      optionStyle = 'border-lacquer bg-lacquer-15 text-charcoal font-medium';
                    } else if (answered) {
                      if (isRightOption) {
                        optionStyle = 'border-gold/60 bg-gold-20 text-ink font-medium';
                      } else if (isSelected && !isRightOption) {
                        optionStyle = 'border-lacquer/50 bg-lacquer-15 text-ink';
                      } else {
                        optionStyle = 'border-stone/60 bg-parchment/60 text-ash';
                      }
                    }

                    const optionPrefix = String.fromCharCode(65 + idx);

                    return (
                      <button
                        key={`${currentQuestion.id}-opt-${idx}`}
                        type="button"
                        disabled={answered}
                        onClick={() => setSelectedOption(idx)}
                        className={`w-full min-h-[52px] text-left px-[18px] py-[14px] rounded-sm border font-body text-body-md transition-colors duration-300 flex items-start justify-between gap-3 ${optionStyle}`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 w-6 h-6 shrink-0 rounded-xs border text-[11px] font-semibold uppercase flex items-center justify-center ${
                              answered && isRightOption
                                ? 'border-gold bg-gold text-cream'
                                : !answered && isSelected
                                  ? 'border-lacquer bg-lacquer text-cream'
                                  : 'border-stone bg-cream text-charcoal'
                            }`}
                          >
                            {optionPrefix}
                          </span>
                          <span>{optionText}</span>
                        </div>

                        {answered && isRightOption && (
                          <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                        )}
                        {answered && isSelected && !isRightOption && (
                          <X className="w-5 h-5 text-lacquer shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Action Bar & Explanation Feedback */}
                {!answered ? (
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <Button
                      type="button"
                      variant="primary"
                      disabled={selectedOption === null}
                      onClick={handleConfirmAnswer}
                    >
                      {t.passport.quizSubmitCta}
                    </Button>
                    <span className={`font-body text-caption text-ash ${numFontStyle}`}>
                      {t.passport.quizProgressLabel} {currentQuizIndex + 1} / {questions.length}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2 animate-fade-up">
                    {/* Answer Status Box */}
                    <div
                      className={`p-5 rounded-sm border space-y-2 ${
                        isCorrect
                          ? 'border-gold/60 bg-gold-20 text-ink'
                          : 'border-lacquer/50 bg-lacquer-15 text-ink'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-body text-body-sm font-semibold text-charcoal">
                        {isCorrect ? (
                          <Check className="w-4 h-4 text-gold shrink-0" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-lacquer shrink-0" />
                        )}
                        <span>
                          {isCorrect
                            ? wasAlreadyCompletedOnSubmit
                              ? t.passport.quizCorrectRepeatHeading
                              : t.passport.quizCorrectHeading
                            : t.passport.quizIncorrectHeading}
                        </span>
                      </div>

                      <p className="font-body text-body-sm text-ink/90">
                        {currentQuestion.explanation}
                      </p>
                    </div>

                    {/* Cultural Fun Fact Quote Box */}
                    <blockquote className="p-5 rounded-sm bg-parchment border border-stone border-l-2 border-l-gold space-y-1.5">
                      <div className="flex items-center gap-2 font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t.passport.quizFunFactLabel}</span>
                      </div>
                      <p className="font-display italic text-[20px] leading-[1.45] text-charcoal">
                        “{currentQuestion.culturalFunFact}”
                      </p>
                    </blockquote>

                    {/* Newly Unlocked Badge Notification */}
                    {newlyUnlockedBadges.length > 0 && (
                      <div className="p-4 rounded-sm border border-gold bg-cream flex items-center gap-3">
                        <Award className="w-5 h-5 text-gold shrink-0" />
                        <div className="font-body text-body-sm text-charcoal">
                          <span className="font-semibold text-gold uppercase tracking-wider text-xs block">
                            {t.passport.badgeUnlockedPrefix}
                          </span>
                          <span>
                            {newlyUnlockedBadges.map((b) => getBadgeText(b).name).join(', ')}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Quiz Navigation Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <Button type="button" variant="primary" onClick={handleNextQuestion}>
                        {currentQuizIndex + 1 < questions.length
                          ? t.passport.quizNextCta
                          : t.passport.quizRestartCta}
                      </Button>
                      {!isCorrect && (
                        <Button type="button" variant="ghost" onClick={handleRetryQuestion}>
                          {t.passport.quizRetryCta}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Classical HoaLang Ornament Divider ◆ ─────── ◆ */}
        <OrnamentDivider />

        {/* NEW SECTION: Redeem Points for Craft Souvenirs & Workshop Passes */}
        <section className="bg-cream border border-stone rounded-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone pb-5">
            <div className="space-y-2 max-w-2xl">
              <SectionLabel>{t.passport.rewardsSectionLabel}</SectionLabel>
              <h2 className="font-display text-display-lg text-charcoal">
                {t.passport.rewardsHeading}
              </h2>
              <p className="font-body text-body-sm text-ash">{t.passport.rewardsSubtitle}</p>
            </div>

            <div className="px-4 py-3 rounded-sm bg-parchment border border-stone flex items-center gap-3">
              <Gift className="w-5 h-5 text-lacquer shrink-0" />
              <div>
                <span className="block text-[10px] uppercase tracking-[0.12em] text-ash">
                  {t.passport.pointsLabel}
                </span>
                <span className={`font-display text-2xl font-semibold text-charcoal ${numFontStyle}`}>
                  {profile.points} {t.passport.pointsUnit}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CULTURAL_REWARDS_CATALOG.map((reward) => {
              const redeemedRecord = redeemedMap.get(reward.id);
              const canAfford = profile.points >= reward.costPoints;
              const missingPoints = Math.max(0, reward.costPoints - profile.points);

              const title = activeLocale === 'en' ? reward.nameEn : reward.nameVi;
              const desc = activeLocale === 'en' ? reward.descEn : reward.descVi;
              const pickup = activeLocale === 'en' ? reward.pickupNoteEn : reward.pickupNoteVi;

              return (
                <article
                  key={reward.id}
                  className="group bg-parchment border border-stone rounded-sm overflow-hidden flex flex-col justify-between transition-transform transition-shadow duration-300 ease-out-expo hover:-translate-y-[4px] hover:shadow-hover"
                >
                  <div>
                    <div className="aspect-[4/3] w-full overflow-hidden bg-cream relative">
                      <img
                        src={reward.imageUrl}
                        alt={title}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.endsWith(FALLBACK_PLACE_IMAGE_URL)) {
                            target.src = FALLBACK_PLACE_IMAGE_URL;
                          }
                        }}
                        className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
                      />
                      <div className="absolute top-2.5 right-2.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-xs border bg-cream shadow-subtle font-body text-[11px] font-semibold uppercase tracking-[0.08em] ${numFontStyle} ${
                            redeemedRecord
                              ? 'border-gold text-bronze'
                              : 'border-lacquer/45 text-lacquer'
                          }`}
                        >
                          {reward.costPoints} {t.passport.pointsUnit}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-display text-[20px] font-semibold leading-snug text-charcoal">
                        {title}
                      </h3>
                      <p className="font-body text-caption text-ink/85 leading-relaxed">{desc}</p>
                      <p className="inline-flex items-center gap-1.5 font-body text-[11px] text-ash pt-1">
                        <MapPin className="w-3.5 h-3.5 text-bronze shrink-0" />
                        <span>{pickup}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    {redeemedRecord ? (
                      <div className="p-3 rounded-xs bg-gold-20 border border-gold space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.10em] text-bronze">
                          <span className="inline-flex items-center gap-1">
                            <Ticket className="w-3.5 h-3.5 text-gold" />
                            <span>{t.passport.redeemedTag}</span>
                          </span>
                          <Check className="w-3.5 h-3.5 text-gold" />
                        </div>
                        <div className={`font-body text-xs font-semibold text-charcoal ${numFontStyle}`}>
                          {t.passport.voucherCodeLabel}: {redeemedRecord.voucherCode}
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant={canAfford ? 'primary' : 'ghost'}
                        disabled={!canAfford}
                        onClick={() => handleRedeemReward(reward.id)}
                        className={`w-full px-4 py-2.5 ${numFontStyle}`}
                      >
                        {canAfford
                          ? t.passport.redeemCta
                          : `${t.passport.notEnoughPointsPrefix} ${missingPoints} ${t.passport.pointsUnit}`}
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <OrnamentDivider />

        {/* Lower Section: Saved Journeys (from TV2) & Explored Villages Stamp Book */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Saved Cultural Journeys (Read-only integration with TV2 journeyStorage) */}
          <div className="lg:col-span-6 bg-cream border border-stone rounded-sm p-6 sm:p-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <SectionLabel>{t.passport.savedJourneysSectionLabel}</SectionLabel>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-display-md text-charcoal">
                  {t.passport.savedJourneysHeading}
                </h3>
                <TagBadge
                  variant={savedJourneys.length > 0 ? 'gold' : 'stone'}
                  className={numFontStyle}
                >
                  {savedJourneys.length}
                </TagBadge>
              </div>

              {savedJourneys.length === 0 ? (
                <p className="font-body text-body-sm text-ink/80 leading-relaxed py-2">
                  {t.passport.savedJourneysEmpty}
                </p>
              ) : (
                <div className="space-y-3">
                  {savedJourneys.slice(0, 4).map((journey) => (
                    <article
                      key={journey.id}
                      className="p-4 rounded-sm bg-parchment border border-stone space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-display text-xl text-charcoal font-semibold">
                          {journey.title}
                        </h4>
                        <TagBadge
                          variant={journey.isFallback ? 'stone' : 'gold'}
                          className={numFontStyle}
                        >
                          {journey.durationHours}h · {journey.stops?.length || 0}{' '}
                          {t.passport.stopsUnit}
                        </TagBadge>
                      </div>
                      <p className="font-body text-body-sm text-ink/85">{journey.summary}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone/60 space-y-2.5">
              <Button
                type="button"
                variant="ghost"
                onClick={handleGoToJourney}
                className="inline-flex items-center gap-2 px-5 py-2.5"
              >
                <span>{t.passport.goToJourneyCta}</span>
                <ArrowRight className="w-3.5 h-3.5 text-bronze" />
              </Button>
              {showJourneyHint && (
                <p className="font-body text-caption text-bronze bg-parchment border border-stone rounded-xs p-3 animate-fade-up">
                  {t.passport.journeyPendingNote}
                </p>
              )}
            </div>
          </div>

          {/* Explored Craft Villages Stamp Book */}
          <div className="lg:col-span-6 bg-cream border border-stone rounded-sm p-6 sm:p-7 space-y-4">
            <SectionLabel>{t.passport.dossierLabel}</SectionLabel>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-display-md text-charcoal">
                {t.passport.visitedVillagesHeading}
              </h3>
              <TagBadge
                variant={decodedPlaces.length > 0 ? 'gold' : 'stone'}
                className={numFontStyle}
              >
                {decodedPlaces.length}
              </TagBadge>
            </div>

            {decodedPlaces.length === 0 ? (
              <p className="font-body text-body-sm text-ash leading-relaxed py-2">
                {t.passport.visitedVillagesEmpty}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {decodedPlaces.map((place) => (
                  <article
                    key={place.id}
                    onClick={() => handleOpenPlace(place.id)}
                    className="group bg-parchment border border-stone rounded-sm overflow-hidden flex items-center gap-3 p-2.5 cursor-pointer hover:border-bronze transition-colors duration-300"
                  >
                    <div className="w-16 aspect-[4/3] shrink-0 overflow-hidden rounded-xs bg-cream border border-stone/60">
                      <img
                        src={place.imageUrl}
                        alt={activeLocale === 'en' ? place.name : place.vietnameseName}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.endsWith(FALLBACK_PLACE_IMAGE_URL)) {
                            target.src = FALLBACK_PLACE_IMAGE_URL;
                          }
                        }}
                        className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display text-lg text-charcoal font-semibold truncate">
                        {activeLocale === 'en' ? place.name : place.vietnameseName}
                      </h4>
                      <p className="font-body text-[11px] text-ash truncate">
                        {place.categoryLabel}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

interface PassportBoundaryState {
  hasError: boolean;
}

class PassportErrorBoundary extends React.Component<
  { children: React.ReactNode },
  PassportBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): PassportBoundaryState {
    return { hasError: true };
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] bg-parchment text-ink flex items-center justify-center px-5 py-16 font-body">
          <div className="max-w-lg w-full bg-cream border border-stone rounded-sm p-8 text-center space-y-4">
            <h2 className="font-display text-display-md text-charcoal">
              Đang đồng bộ lại Hộ chiếu Văn hóa
            </h2>
            <p className="text-body-sm text-ash">
              Trình duyệt vừa giữ phiên bản bộ nhớ tạm cũ. Hãy bấm nút bên dưới để tải lại trang mới nhất.
            </p>
            <Button
              type="button"
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Tải Lại Trang Ngay
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const PassportPage: React.FC<PassportPageProps> = (props) => (
  <PassportErrorBoundary>
    <PassportPageContent {...props} />
  </PassportErrorBoundary>
);

export default PassportPage;
