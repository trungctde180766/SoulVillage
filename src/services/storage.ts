import type { UserPassportProfile } from '../types/passport';
import type { JourneyItinerary } from '../types/journey';

const PASSPORT_KEY = 'soulvillage_passport_profile';
const ITINERARY_KEY = 'soulvillage_saved_itineraries';

export function getLocalPassport(): UserPassportProfile {
  try {
    const raw = localStorage.getItem(PASSPORT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading localStorage passport:', err);
  }

  // Initial starter profile
  const initialProfile: UserPassportProfile = {
    userId: 'guest-' + Math.random().toString(36).substring(2, 9),
    displayName: 'Lữ Khách Văn Hóa',
    points: 150,
    visitedPlaceIds: ['lang-huong-thuy-xuan'],
    completedQuizIds: [],
    badges: [
      {
        id: 'badge-starter',
        name: 'Hạt Mầm Di Sản',
        description: 'Bắt đầu hành trình tìm về cội nguồn văn hóa Việt Nam.',
        icon: '🌱',
        category: 'explorer',
        requirementText: 'Gia nhập Hồn Làng',
        unlockedAt: new Date().toISOString()
      }
    ],
    savedItinerariesCount: 0,
    joinedAt: new Date().toISOString()
  };

  saveLocalPassport(initialProfile);
  return initialProfile;
}

export function saveLocalPassport(profile: UserPassportProfile): void {
  try {
    localStorage.setItem(PASSPORT_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving localStorage passport:', err);
  }
}

export function getLocalItineraries(): JourneyItinerary[] {
  try {
    const raw = localStorage.getItem(ITINERARY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
}

export function saveLocalItinerary(itinerary: JourneyItinerary): void {
  try {
    const current = getLocalItineraries();
    const updated = [itinerary, ...current.filter(i => i.id !== itinerary.id)];
    localStorage.setItem(ITINERARY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving itinerary to localStorage:', err);
  }
}
