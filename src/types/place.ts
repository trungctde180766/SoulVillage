export type CulturalCategory = 'craft' | 'monument' | 'cuisine' | 'spiritual' | 'nature';

export interface CulturalPlace {
  id: string;
  name: string;
  vietnameseName: string;
  category: CulturalCategory;
  categoryLabel: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  shortDescription: string;
  story: string;
  craftDetails?: string;
  historicalSignificance?: string;
  localTips: string[];
  imageUrl: string;
  tags: string[];
  estimatedVisitTimeMinutes: number;
  sources: {
    title: string;
    url?: string;
  }[];
}

export interface PlaceFilterOptions {
  category?: CulturalCategory | 'all';
  searchQuery?: string;
}

