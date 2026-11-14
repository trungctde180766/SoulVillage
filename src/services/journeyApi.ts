import type { JourneyItinerary, JourneyPreference } from '../types/journey';

export type JourneyErrorCode =
  | 'INVALID_REQUEST'
  | 'DATA_NOT_READY'
  | 'AI_NOT_CONFIGURED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export class JourneyApiError extends Error {
  readonly code: JourneyErrorCode;
  readonly status: number;

  constructor(message: string, code: JourneyErrorCode, status: number) {
    super(message);
    this.name = 'JourneyApiError';
    this.code = code;
    this.status = status;
  }
}

const KNOWN_ERROR_CODES = new Set<JourneyErrorCode>([
  'INVALID_REQUEST',
  'DATA_NOT_READY',
  'AI_NOT_CONFIGURED',
  'NETWORK_ERROR',
  'UNKNOWN_ERROR',
]);

function normalizeErrorCode(rawCode?: string): JourneyErrorCode {
  if (rawCode && KNOWN_ERROR_CODES.has(rawCode as JourneyErrorCode)) {
    return rawCode as JourneyErrorCode;
  }
  return 'UNKNOWN_ERROR';
}

/** Server caps the Gemini chain at 20s, then answers with the local fallback; leave headroom. */
export const CLIENT_TIMEOUT_MS = 25_000;

/**
 * Gửi yêu cầu khởi tạo hành trình văn hóa cá nhân hóa tới POST /api/itinerary (Contract v1 — TV2).
 * Caller aborts rethrow the AbortError; the client-side timeout surfaces as NETWORK_ERROR.
 */
export async function generateAIJourney(
  preference: JourneyPreference,
  signal?: AbortSignal,
): Promise<JourneyItinerary> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, CLIENT_TIMEOUT_MS);
  const forwardAbort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', forwardAbort, { once: true });

  let response: Response;
  try {
    response = await fetch('/api/itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
      signal: controller.signal,
    });
  } catch (err) {
    if (timedOut) {
      throw new JourneyApiError(
        'Máy chủ phản hồi quá lâu. Vui lòng thử lại sau giây lát.',
        'NETWORK_ERROR',
        0,
      );
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    throw new JourneyApiError(
      'Không thể kết nối máy chủ hành trình. Vui lòng kiểm tra mạng và thử lại.',
      'NETWORK_ERROR',
      0,
    );
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const errorObj =
      payload && typeof payload === 'object'
        ? (payload as {
            error?: { code?: string; message?: string };
            message?: string;
          })
        : null;

    const code = normalizeErrorCode(errorObj?.error?.code);
    const errorMessage =
      errorObj?.error?.message ||
      errorObj?.message ||
      `Yêu cầu tạo hành trình thất bại (HTTP ${response.status}).`;

    throw new JourneyApiError(errorMessage, code, response.status);
  }

  return payload as JourneyItinerary;
}
