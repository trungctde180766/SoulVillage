import type { JourneyItinerary, JourneyPreference } from '../types/journey';
import type { UserPassportProfile } from '../types/passport';
import type { CulturalPlace } from '../types/place';
import { SAMPLE_CULTURAL_PLACES } from '../data/places';
import { getLocalPassport } from './storage';

export async function fetchCulturalPlaces(category?: string, search?: string): Promise<CulturalPlace[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`/api/places?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.places && data.places.length > 0) {
        return data.places;
      }
    }
  } catch {
    console.info('Using local sample places fallback.');
  }

  // Local fallback filtering
  let result = SAMPLE_CULTURAL_PLACES;
  if (category && category !== 'all') {
    result = result.filter(p => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p => 
      p.vietnameseName.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  return result;
}

export async function generateAIJourney(preference: JourneyPreference): Promise<JourneyItinerary> {
  const res = await fetch('/api/itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preference)
  });

  if (!res.ok) {
    throw new Error(`Failed to generate itinerary: ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchPassportProfile(userId: string): Promise<UserPassportProfile> {
  try {
    const res = await fetch(`/api/passport?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API passport fetch failed, using local storage:', err);
  }
  // Fallback to local storage if API call fails
  return getLocalPassport();
}

export async function updatePassportPoints(userId: string, pointsToAdd: number, quizId?: string): Promise<void> {
  try {
    await fetch('/api/passport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, pointsToAdd, quizId })
    });
  } catch (err) {
    console.warn('Could not sync points with MongoDB serverless API:', err);
  }
}
