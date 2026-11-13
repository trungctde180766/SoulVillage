import type { JourneyItinerary, JourneyPreference } from '../types/journey';
import type { UserPassportProfile } from '../types/passport';
import type { CulturalPlace } from '../types/place';
import { PLACES } from '../data/places';
import { getLocalPassport } from './storage';

// TODO (Hackathon Day): Kết nối API serverless hoàn chỉnh trong thời gian thi

export async function fetchCulturalPlaces(_category?: string, _search?: string): Promise<CulturalPlace[]> {
  try {
    const res = await fetch('/api/places');
    if (res.ok) {
      const data = await res.json();
      return data.places || [];
    }
  } catch {
    // API chưa triển khai (501)
  }
  return PLACES;
}

export async function generateAIJourney(_preference: JourneyPreference): Promise<JourneyItinerary> {
  const res = await fetch('/api/itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(_preference)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `API trả về mã lỗi ${res.status}`);
  }

  return await res.json();
}

export async function fetchPassportProfile(_userId: string): Promise<UserPassportProfile> {
  try {
    const res = await fetch(`/api/passport?userId=${encodeURIComponent(_userId)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  return getLocalPassport();
}

export async function updatePassportPoints(_userId: string, _pointsToAdd: number, _quizId?: string): Promise<void> {
  // TODO (Hackathon Day): Đồng bộ điểm số lên database trong thời gian thi
}
