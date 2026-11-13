export interface CulturalBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'explorer' | 'craftsman' | 'scholar' | 'gourmet';
  requirementText: string;
}

export interface QuizQuestion {
  id: string;
  placeId?: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  culturalFunFact: string;
}

export interface UserPassportProfile {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  joinedAt: string;
  points: number;
  visitedPlaceIds: string[];
  completedQuizIds: string[];
  badges: CulturalBadge[];
  savedItinerariesCount: number;
}

