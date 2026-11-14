import type { JourneyItinerary, JourneyPreference } from '../types/journey';

/**
 * Gửi yêu cầu khởi tạo hành trình văn hóa cá nhân hóa tới POST /api/itinerary.
 * Do TV2 tiếp quản và mở rộng sau tín hiệu READY.
 */
export async function generateAIJourney(preference: JourneyPreference): Promise<JourneyItinerary> {
  const response = await fetch('/api/itinerary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preference),
  });

  const payload = (await response.json()) as JourneyItinerary & {
    error?: { code?: string; message?: string };
    message?: string;
  };

  if (!response.ok) {
    const errorMessage =
      payload?.error?.message ||
      payload?.message ||
      `Yêu cầu tạo hành trình thất bại (HTTP ${response.status}).`;
    throw new Error(errorMessage);
  }

  return payload;
}
