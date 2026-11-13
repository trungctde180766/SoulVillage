export interface JourneyPreference {
  durationHours: number;
  interests: string[];
  startLocation: string;
  pace: 'relaxed' | 'moderate' | 'intensive';
  companion: 'solo' | 'couple' | 'family' | 'friends';
}

export interface JourneyStop {
  order: number;
  placeId: string;
  placeName: string;
  timeSlot: string;
  durationMinutes: number;
  activityRecommendation: string;
  culturalInsight: string;
  transportTip?: string;
}

export interface JourneyItinerary {
  id: string;
  title: string;
  summary: string;
  durationHours: number;
  targetInterests: string[];
  stops: JourneyStop[];
  totalEstimatedCostVND: string;
  culturalHighlights: string[];
  isFallback?: boolean;
  generatedAt: string;
}
