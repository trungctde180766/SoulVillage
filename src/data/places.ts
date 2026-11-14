import placesJson from '../../public/data/places.json';
import type { CulturalCategory, CulturalPlace, PlaceFilterOptions } from '../types/place';

export const FALLBACK_PLACE_IMAGE_URL = '/images/places/fallback-place.svg';

export const VALID_CULTURAL_CATEGORIES: readonly CulturalCategory[] = [
  'craft',
  'monument',
  'cuisine',
  'spiritual',
  'nature',
];

/**
 * Danh sách địa điểm văn hóa đọc đồng bộ từ Single Source of Truth public/data/places.json.
 */
export const CULTURAL_PLACES: CulturalPlace[] = placesJson as CulturalPlace[];

export const places: CulturalPlace[] = CULTURAL_PLACES;

/**
 * Chuẩn hóa chuỗi tiếng Việt không dấu để hỗ trợ tìm kiếm thông minh.
 */
export function normalizeVietnameseText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Trả về danh sách toàn bộ địa điểm văn hóa.
 */
export function getPlacesSync(): CulturalPlace[] {
  return CULTURAL_PLACES;
}

/**
 * Tìm một địa điểm văn hóa theo ID slug.
 */
export function getPlaceById(id: string): CulturalPlace | undefined {
  return CULTURAL_PLACES.find((place) => place.id === id);
}

/**
 * Lọc danh sách địa điểm theo danh mục và từ khóa tìm kiếm (hỗ trợ cả có dấu & không dấu).
 */
export function filterCulturalPlaces(options?: PlaceFilterOptions): CulturalPlace[] {
  const category = options?.category;
  const searchQuery = options?.searchQuery?.trim() ?? '';

  return CULTURAL_PLACES.filter((place) => {
    if (category && category !== 'all' && place.category !== category) {
      return false;
    }

    if (!searchQuery) {
      return true;
    }

    const q = normalizeVietnameseText(searchQuery);
    const searchableFields = [
      place.id,
      place.name,
      place.vietnameseName,
      place.categoryLabel,
      place.location,
      place.shortDescription,
      place.story,
      place.craftDetails ?? '',
      place.historicalSignificance ?? '',
      ...place.tags,
    ];

    return searchableFields.some((field) => normalizeVietnameseText(field).includes(q));
  });
}

export default CULTURAL_PLACES;
