export const VALID_CATEGORIES = new Set([
  'craft',
  'monument',
  'cuisine',
  'spiritual',
  'nature',
]);

export const VALID_PACES = new Set(['relaxed', 'moderate', 'intensive']);
export const VALID_COMPANIONS = new Set(['solo', 'couple', 'family', 'friends']);

/**
 * Sanitize user startLocation to prevent prompt injection and control characters.
 * @param {string} raw
 * @returns {string}
 */
export function sanitizeStartLocation(raw) {
  if (!raw || typeof raw !== 'string') return 'Trung tâm TP. Huế';
  const cleaned = raw
    .replace(/[\r\n\t`]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
  return cleaned || 'Trung tâm TP. Huế';
}

/**
 * Validate incoming POST /api/itinerary request payload.
 * When `catalog` is provided, also validates `selectedPlaceIds` membership.
 *
 * @param {unknown} body
 * @param {Array<{ id: string }> | null} [catalog]
 */
export function validateJourneyPreference(body, catalog = null) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      ok: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Dữ liệu yêu cầu tạo hành trình không hợp lệ.',
      },
    };
  }

  const {
    durationHours,
    interests,
    startLocation,
    pace,
    companion,
    selectedPlaceIds,
  } = body;

  if (
    typeof durationHours !== 'number' ||
    !Number.isInteger(durationHours) ||
    durationHours < 2 ||
    durationHours > 8
  ) {
    return {
      ok: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Thời lượng hành trình (durationHours) phải là số nguyên từ 2 đến 8 giờ.',
      },
    };
  }

  if (!Array.isArray(interests) || interests.length === 0) {
    return {
      ok: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Vui lòng chọn ít nhất một lĩnh vực văn hóa quan tâm (interests).',
      },
    };
  }

  const normalizedInterests = [];
  for (const item of interests) {
    if (typeof item !== 'string' || !VALID_CATEGORIES.has(item)) {
      return {
        ok: false,
        error: {
          code: 'INVALID_REQUEST',
          message: `Lĩnh vực quan tâm không hợp lệ: "${String(item)}".`,
        },
      };
    }
    if (!normalizedInterests.includes(item)) {
      normalizedInterests.push(item);
    }
  }

  if (startLocation !== undefined) {
    if (typeof startLocation !== 'string' || startLocation.length > 200) {
      return {
        ok: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Điểm xuất phát (startLocation) phải là chuỗi tối đa 200 ký tự.',
        },
      };
    }
  }

  const normalizedPace = pace === undefined ? 'moderate' : pace;
  if (typeof normalizedPace !== 'string' || !VALID_PACES.has(normalizedPace)) {
    return {
      ok: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Nhịp độ hành trình (pace) chỉ nhận relaxed, moderate hoặc intensive.',
      },
    };
  }

  const normalizedCompanion = companion === undefined ? 'solo' : companion;
  if (
    typeof normalizedCompanion !== 'string' ||
    !VALID_COMPANIONS.has(normalizedCompanion)
  ) {
    return {
      ok: false,
      error: {
        code: 'INVALID_REQUEST',
        message: ' Nhóm đồng hành (companion) chỉ nhận solo, couple, family hoặc friends.',
      },
    };
  }

  let normalizedSelectedIds;
  if (selectedPlaceIds !== undefined) {
    if (!Array.isArray(selectedPlaceIds) || selectedPlaceIds.length > 3) {
      return {
        ok: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Danh sách địa điểm ưu tiên (selectedPlaceIds) tối đa 3 địa điểm.',
        },
      };
    }

    const catalogIds = Array.isArray(catalog)
      ? new Set(catalog.map((p) => p.id))
      : null;

    normalizedSelectedIds = [];
    for (const id of selectedPlaceIds) {
      if (typeof id !== 'string' || !id.trim()) {
        return {
          ok: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Mã địa điểm ưu tiên (selectedPlaceIds) không hợp lệ.',
          },
        };
      }
      if (catalogIds && !catalogIds.has(id)) {
        return {
          ok: false,
          error: {
            code: 'INVALID_REQUEST',
            message: `Địa điểm ưu tiên "${id}" không tồn tại trong danh mục di sản.`,
          },
        };
      }
      if (!normalizedSelectedIds.includes(id)) {
        normalizedSelectedIds.push(id);
      }
    }
  }

  const value = {
    durationHours,
    interests: normalizedInterests,
    startLocation: sanitizeStartLocation(startLocation),
    pace: normalizedPace,
    companion: normalizedCompanion,
  };

  if (normalizedSelectedIds !== undefined) {
    value.selectedPlaceIds = normalizedSelectedIds;
  }

  return { ok: true, value };
}

/**
 * Strip markdown code fences from raw LLM text before JSON.parse.
 * @param {string} rawText
 * @returns {string}
 */
export function stripMarkdownJson(rawText) {
  if (typeof rawText !== 'string') {
    throw new Error('Gemini response text is empty or not a string');
  }
  let text = rawText.trim();
  const fenceMatch = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(text);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }
  return text;
}

/**
 * Parse a "HH:MM - HH:MM" timeSlot string into start and end minutes.
 * @param {string} timeSlot
 * @returns {{ start: number, end: number } | null}
 */
export function parseTimeSlotRange(timeSlot) {
  if (typeof timeSlot !== 'string') return null;
  const match = /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/.exec(
    timeSlot.trim(),
  );
  if (!match) return null;
  const sh = Number(match[1]);
  const sm = Number(match[2]);
  const eh = Number(match[3]);
  const em = Number(match[4]);
  if (sh > 23 || sm > 59 || eh > 23 || em > 59) return null;
  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  if (end <= start) return null;
  return { start, end };
}

/**
 * Parse and strictly validate Gemini's JSON output against the verified catalog
 * and user time budget. Overwrites placeName from catalog and enforces system fields.
 *
 * @param {string} rawText
 * @param {Array<object>} catalog
 * @param {object} preference
 */
export function parseAndValidateGeminiResponse(rawText, catalog, preference) {
  const cleaned = stripMarkdownJson(rawText);
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Invalid JSON from Gemini: ${err.message}`);
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Gemini output root must be a JSON object');
  }

  if (typeof parsed.title !== 'string' || !parsed.title.trim()) {
    throw new Error('Missing or invalid itinerary title');
  }
  if (typeof parsed.summary !== 'string' || !parsed.summary.trim()) {
    throw new Error('Missing or invalid itinerary summary');
  }
  if (!Array.isArray(parsed.stops) || parsed.stops.length === 0) {
    throw new Error('Itinerary stops must be a non-empty array');
  }

  const placeById = new Map(catalog.map((place) => [place.id, place]));
  const seenPlaceIds = new Set();
  const budgetMinutes = preference.durationHours * 60;

  let totalDurationMinutes = 0;
  let firstSlotStart = null;
  let prevSlotEnd = -1;

  const validatedStops = parsed.stops.map((stop, idx) => {
    if (!stop || typeof stop !== 'object') {
      throw new Error(`Stop at index ${idx} is not an object`);
    }

    const place = placeById.get(stop.placeId);
    if (!place) {
      throw new Error(
        `Hallucinated or unknown placeId "${String(stop.placeId)}" at stop ${idx + 1}`,
      );
    }
    if (seenPlaceIds.has(place.id)) {
      throw new Error(`Duplicate placeId "${place.id}" in stops`);
    }
    seenPlaceIds.add(place.id);

    const durationMinutes = Number(stop.durationMinutes);
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      throw new Error(`Invalid durationMinutes at stop ${idx + 1}`);
    }

    const slotRange = parseTimeSlotRange(stop.timeSlot);
    if (!slotRange) {
      throw new Error(
        `Invalid timeSlot format "${String(stop.timeSlot)}" at stop ${idx + 1}`,
      );
    }
    if (prevSlotEnd !== -1 && slotRange.start < prevSlotEnd) {
      throw new Error(
        `Overlapping timeSlot "${stop.timeSlot}" at stop ${idx + 1}`,
      );
    }
    if (firstSlotStart === null) {
      firstSlotStart = slotRange.start;
    }
    prevSlotEnd = slotRange.end;

    totalDurationMinutes += Math.round(durationMinutes);

    if (
      typeof stop.activityRecommendation !== 'string' ||
      !stop.activityRecommendation.trim()
    ) {
      throw new Error(`Missing activityRecommendation at stop ${idx + 1}`);
    }
    if (
      typeof stop.culturalInsight !== 'string' ||
      !stop.culturalInsight.trim()
    ) {
      throw new Error(`Missing culturalInsight at stop ${idx + 1}`);
    }

    const normalizedStop = {
      order: idx + 1,
      placeId: place.id,
      placeName: place.vietnameseName,
      timeSlot: stop.timeSlot.trim(),
      durationMinutes: Math.round(durationMinutes),
      activityRecommendation: stop.activityRecommendation.trim(),
      culturalInsight: stop.culturalInsight.trim(),
    };

    if (typeof stop.transportTip === 'string' && stop.transportTip.trim()) {
      normalizedStop.transportTip = stop.transportTip.trim();
    }

    return normalizedStop;
  });

  const totalSpanMinutes =
    firstSlotStart !== null && prevSlotEnd !== -1
      ? prevSlotEnd - firstSlotStart
      : totalDurationMinutes;

  if (totalDurationMinutes > budgetMinutes || totalSpanMinutes > budgetMinutes) {
    throw new Error(
      `Itinerary exceeds time budget (${Math.max(totalDurationMinutes, totalSpanMinutes)} > ${budgetMinutes} minutes)`,
    );
  }

  const totalEstimatedCostVND =
    typeof parsed.totalEstimatedCostVND === 'string' &&
    parsed.totalEstimatedCostVND.trim()
      ? parsed.totalEstimatedCostVND.trim()
      : '150.000 - 300.000 VNĐ';

  const culturalHighlights =
    Array.isArray(parsed.culturalHighlights) &&
    parsed.culturalHighlights.some((h) => typeof h === 'string' && h.trim())
      ? parsed.culturalHighlights
          .filter((h) => typeof h === 'string' && h.trim())
          .map((h) => h.trim())
      : validatedStops.map((s) => s.placeName);

  return {
    id: `journey-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: parsed.title.trim(),
    summary: parsed.summary.trim(),
    durationHours: preference.durationHours,
    targetInterests: preference.interests,
    stops: validatedStops,
    totalEstimatedCostVND,
    culturalHighlights,
    isFallback: false,
    generatedAt: new Date().toISOString(),
  };
}
