import type { JourneyItinerary } from '../types/journey';

export const JOURNEY_STORAGE_KEY = 'soulvillage.itineraries.v1';
export const MAX_SAVED_JOURNEYS = 20;

function isValidStoredItinerary(item: unknown): item is JourneyItinerary {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Partial<JourneyItinerary>;
  return (
    typeof candidate.id === 'string' &&
    candidate.id.length > 0 &&
    typeof candidate.title === 'string' &&
    Array.isArray(candidate.stops)
  );
}

/**
 * Đọc danh sách hành trình đã lưu trên thiết bị từ khóa soulvillage.itineraries.v1.
 * TV3 import hàm này để đếm số lượng hành trình cho huy hiệu Hộ chiếu.
 */
export function loadSavedJourneys(): JourneyItinerary[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidStoredItinerary).slice(0, MAX_SAVED_JOURNEYS);
  } catch {
    return [];
  }
}

/**
 * Lưu một hành trình vào bộ nhớ cục bộ: chống trùng lặp id, giới hạn tối đa 20 hành trình gần nhất.
 */
export function saveJourney(itinerary: JourneyItinerary): void {
  if (typeof window === 'undefined') return;
  if (!isValidStoredItinerary(itinerary)) return;
  try {
    const existing = loadSavedJourneys().filter((item) => item.id !== itinerary.id);
    const updated = [itinerary, ...existing].slice(0, MAX_SAVED_JOURNEYS);
    window.localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Bỏ qua lỗi vượt quota hoặc Safari Private Mode không cho ghi localStorage
  }
}

/**
 * Kiểm tra một hành trình đã được lưu trên thiết bị hay chưa.
 */
export function isJourneySaved(itineraryId: string): boolean {
  if (!itineraryId) return false;
  return loadSavedJourneys().some((item) => item.id === itineraryId);
}

/**
 * Xóa một hành trình đã lưu theo id và trả về danh sách còn lại.
 */
export function removeSavedJourney(itineraryId: string): JourneyItinerary[] {
  if (typeof window === 'undefined') return [];
  const next = loadSavedJourneys().filter((item) => item.id !== itineraryId);
  try {
    window.localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage write error
  }
  return next;
}
