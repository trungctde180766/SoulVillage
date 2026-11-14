import type { JourneyItinerary } from '../types/journey';

export const JOURNEY_STORAGE_KEY = 'soulvillage.itineraries.v1';

/**
 * Đọc danh sách hành trình đã lưu trên thiết bị từ khóa soulvillage.itineraries.v1.
 * Stub an toàn trước tín hiệu READY — do TV2 hoàn thiện, TV3 chỉ import để đọc số lượng.
 */
export function loadSavedJourneys(): JourneyItinerary[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as JourneyItinerary[]) : [];
  } catch {
    return [];
  }
}

/**
 * Lưu một hành trình mới vào bộ nhớ cục bộ (stub an toàn trước READY).
 * Do TV2 tiếp quản sau tín hiệu READY.
 */
export function saveJourney(itinerary: JourneyItinerary): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadSavedJourneys().filter((item) => item.id !== itinerary.id);
    const updated = [itinerary, ...existing].slice(0, 20);
    window.localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Bỏ qua lỗi quota localStorage ở chế độ ẩn danh
  }
}
