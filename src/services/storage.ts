import type { UserPassportProfile } from '../types/passport';
import type { JourneyItinerary } from '../types/journey';

const PASSPORT_KEY = 'soulvillage_passport';
const ITINERARY_KEY = 'soulvillage_itineraries';

// TODO (Hackathon Day): Xây dựng cơ chế đồng bộ giữa localStorage và MongoDB Atlas trong thời gian thi

export function getLocalPassport(): UserPassportProfile {
  try {
    const raw = localStorage.getItem(PASSPORT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  // Khung rỗng ban đầu, không có điểm hay huy hiệu điền sẵn
  return {
    userId: 'user-' + Math.random().toString(36).substring(2, 7),
    displayName: 'Khách Tham Quan',
    joinedAt: new Date().toISOString(),
    points: 0,
    visitedPlaceIds: [],
    completedQuizIds: [],
    badges: [],
    savedItinerariesCount: 0
  };
}

export function saveLocalPassport(profile: UserPassportProfile): void {
  try {
    localStorage.setItem(PASSPORT_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function getLocalItineraries(): JourneyItinerary[] {
  try {
    const raw = localStorage.getItem(ITINERARY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

export function saveLocalItinerary(itinerary: JourneyItinerary): void {
  try {
    const current = getLocalItineraries();
    localStorage.setItem(ITINERARY_KEY, JSON.stringify([itinerary, ...current]));
  } catch {
    // ignore
  }
}
