import type { CulturalPlace, PlaceFilterOptions } from '../types/place';

/**
 * Tải danh sách địa điểm văn hóa từ GET /api/places.
 * Thuộc quyền sở hữu của TV1.
 */
export async function fetchCulturalPlaces(
  options?: PlaceFilterOptions,
  signal?: AbortSignal
): Promise<CulturalPlace[]> {
  const params = new URLSearchParams();
  if (options?.category && options.category !== 'all') {
    params.set('category', options.category);
  }
  if (options?.searchQuery && options.searchQuery.trim()) {
    params.set('search', options.searchQuery.trim());
  }

  const queryString = params.toString();
  const url = queryString ? `/api/places?${queryString}` : '/api/places';

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Không thể tải danh mục địa điểm di sản (HTTP ${response.status}).`);
  }

  const data: unknown = await response.json();
  if (Array.isArray(data)) {
    return data as CulturalPlace[];
  }
  if (data && typeof data === 'object' && 'places' in data && Array.isArray((data as { places: unknown }).places)) {
    return (data as { places: CulturalPlace[] }).places;
  }
  return [];
}
