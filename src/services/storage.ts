import type { CulturalBadge, UserPassportProfile } from '../types/passport';
import { loadSavedJourneys } from './journeyStorage';

export const PASSPORT_STORAGE_KEY = 'soulvillage.passport.v1';
export const QUIZ_CORRECT_POINTS = 50;

export interface CulturalRewardItem {
  id: string;
  placeId: string;
  costPoints: number;
  imageUrl: string;
  nameVi: string;
  nameEn: string;
  descVi: string;
  descEn: string;
  pickupNoteVi: string;
  pickupNoteEn: string;
}

export interface RedeemedRewardRecord {
  rewardId: string;
  voucherCode: string;
  costPoints: number;
  redeemedAt: string;
}

interface StoredPassportPayload extends UserPassportProfile {
  redeemedRewards?: RedeemedRewardRecord[];
}

export const CULTURAL_REWARDS_CATALOG: readonly CulturalRewardItem[] = [
  {
    id: 'reward-non-bookmark',
    placeId: 'lang-non-tay-ho',
    costPoints: 100,
    imageUrl: '/images/places/lang-non-tay-ho.jpg',
    nameVi: 'Thẻ Đánh Dấu Sách Lá Nón Bài Thơ',
    nameEn: 'Poem Conical Hat Leaf Bookmark',
    descVi: 'Ép thủ công hai lớp lá nón non lồng hoa văn cầu Trường Tiền từ nghệ nhân Tây Hồ.',
    descEn: 'Hand-pressed translucent palm leaf bookmark with Truong Tien silhouette.',
    pickupNoteVi: 'Đổi tại Không gian trưng bày Làng Nón Tây Hồ',
    pickupNoteEn: 'Redeem at Tay Ho Conical Hat Village Gallery',
  },
  {
    id: 'reward-incense-box',
    placeId: 'lang-huong-thuy-xuan',
    costPoints: 100,
    imageUrl: '/images/places/lang-huong-thuy-xuan.jpg',
    nameVi: 'Hộp Nụ Trầm Thảo Mộc Thủy Xuân',
    nameEn: 'Thuy Xuan Herbal Incense Cones Box',
    descVi: 'Hộp 12 nụ trầm quế chi và thảo quả tự nhiên se bằng keo vỏ cây bời lời.',
    descEn: 'Box of 12 natural cinnamon & cardamom incense cones bound with Litsea bark.',
    pickupNoteVi: 'Đổi tại Xưởng hương truyền thống Thủy Xuân',
    pickupNoteEn: 'Redeem at Thuy Xuan Traditional Incense Workshop',
  },
  {
    id: 'reward-pottery-workshop',
    placeId: 'lang-gom-phuoc-tich',
    costPoints: 150,
    imageUrl: '/images/places/lang-gom-phuoc-tich.jpg',
    nameVi: 'Vé Trải Nghiệm Chuốt Gốm & Làm Hoa Giấy',
    nameEn: 'Pottery Wheel & Paper Lotus Workshop Pass',
    descVi: 'Ưu đãi trải nghiệm tự tay chuốt gốm đất sét sông Ô Lâu hoặc gấp hoa sen giấy Thanh Tiên.',
    descEn: 'Hands-on session shaping O Lau clay pottery or folding Thanh Tien paper lotus.',
    pickupNoteVi: 'Áp dụng tại Làng cổ Phước Tích & Làng Thanh Tiên',
    pickupNoteEn: 'Valid at Phuoc Tich & Thanh Tien Craft Villages',
  },
  {
    id: 'reward-sinh-woodblock-print',
    placeId: 'tranh-lang-sinh',
    costPoints: 200,
    imageUrl: '/images/places/tranh-lang-sinh.jpg',
    nameVi: 'Bản In Tranh Mộc Bản Giấy Dó Quét Điệp',
    nameEn: 'Sinh Village Woodblock Print on Do Paper',
    descVi: 'Tranh dân gian in từ ván khắc gỗ mít trên nền giấy dó ánh vỏ sò điệp tự nhiên.',
    descEn: 'Authentic folk woodblock print on scallop-shell coated Do bark paper.',
    pickupNoteVi: 'Đổi tại Nhà trưng bày Tranh dân gian Làng Sình',
    pickupNoteEn: 'Redeem at Sinh Folk Painting Exhibition House',
  },
];

export const DEFAULT_CULTURAL_BADGES: readonly CulturalBadge[] = [
  {
    id: 'badge-heritage-scholar',
    name: 'Học giả di sản',
    description: 'Nắm vững câu chuyện lịch sử và nét đẹp của các làng nghề Huế.',
    icon: 'scroll',
    category: 'scholar',
    requirementText: 'Trả lời đúng 2 câu đố văn hóa (100 điểm tích lũy)',
  },
  {
    id: 'badge-journey-planner',
    name: 'Người lập hành trình',
    description: 'Đã tạo và lưu lịch trình khám phá Huế từ mục Hành Trình AI.',
    icon: 'compass',
    category: 'explorer',
    requirementText: 'Lưu ít nhất 1 lịch trình tại trang Hành Trình AI',
  },
  {
    id: 'badge-craft-connoisseur',
    name: 'Bạn đồng hành làng nghề',
    description: 'Hiểu rõ nguyên liệu và kỹ thuật làm nghề thủ công truyền thống.',
    icon: 'hammer',
    category: 'craftsman',
    requirementText: 'Trả lời đúng 3 câu đố văn hóa (150 điểm tích lũy)',
  },
  {
    id: 'badge-imperial-master',
    name: 'Bậc thầy cố đô',
    description: 'Hoàn thành xuất sắc toàn bộ 6 câu đố di sản Huế.',
    icon: 'award',
    category: 'gourmet',
    requirementText: 'Trả lời đúng cả 6 câu đố văn hóa (300 điểm tích lũy)',
  },
];

function generatePassportUserId(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  const timeFragment = Date.now().toString(36).slice(-4).toUpperCase();
  return `HL-HUE-${timeFragment}-${randomSuffix}`;
}

function generateVoucherCode(): string {
  const code = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `QUA-HUE-${code}`;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function sanitizeRedeemedRewards(raw: unknown): RedeemedRewardRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is RedeemedRewardRecord => {
      if (!item || typeof item !== 'object') return false;
      const r = item as Partial<RedeemedRewardRecord>;
      return (
        typeof r.rewardId === 'string' &&
        typeof r.voucherCode === 'string' &&
        typeof r.costPoints === 'number' &&
        typeof r.redeemedAt === 'string'
      );
    });
}

/**
 * Tính tổng điểm đã từng kiếm được từ các câu đố đã giải (không bị giảm khi đổi quà).
 */
export function getTotalEarnedPoints(profile: Pick<UserPassportProfile, 'completedQuizIds'>): number {
  return profile.completedQuizIds.length * QUIZ_CORRECT_POINTS;
}

/**
 * Đánh giá điều kiện mở khóa huy hiệu dựa trên tổng số câu đã giải & hành trình đã lưu.
 * Khi người dùng dùng điểm để đổi quà, huy hiệu đã mở khóa vẫn được giữ nguyên vĩnh viễn.
 */
export function evaluatePassportBadges(
  profile: Pick<UserPassportProfile, 'points' | 'completedQuizIds' | 'savedItinerariesCount' | 'badges'>
): CulturalBadge[] {
  const existingMap = new Map<string, CulturalBadge>();
  if (Array.isArray(profile.badges)) {
    for (const badge of profile.badges) {
      if (badge && typeof badge.id === 'string') {
        existingMap.set(badge.id, badge);
      }
    }
  }

  const totalEarned = getTotalEarnedPoints(profile);
  const effectivePoints = Math.max(profile.points, totalEarned);
  const nowIso = new Date().toISOString();

  return DEFAULT_CULTURAL_BADGES.map((template) => {
    const prev = existingMap.get(template.id);
    let shouldUnlock = Boolean(prev?.unlockedAt);

    if (!shouldUnlock) {
      switch (template.id) {
        case 'badge-heritage-scholar':
          shouldUnlock = profile.completedQuizIds.length >= 2 || effectivePoints >= 100;
          break;
        case 'badge-journey-planner':
          shouldUnlock = profile.savedItinerariesCount >= 1;
          break;
        case 'badge-craft-connoisseur':
          shouldUnlock = profile.completedQuizIds.length >= 3 || effectivePoints >= 150;
          break;
        case 'badge-imperial-master':
          shouldUnlock = profile.completedQuizIds.length >= 6 || effectivePoints >= 300;
          break;
        default:
          break;
      }
    }

    // Nếu huy hiệu 'badge-journey-planner' cần đồng bộ khi chưa có hành trình lúc reset
    if (template.id === 'badge-journey-planner' && profile.savedItinerariesCount < 1 && !prev?.unlockedAt) {
      shouldUnlock = false;
    }

    return {
      ...template,
      unlockedAt: shouldUnlock ? prev?.unlockedAt || nowIso : undefined,
    };
  });
}

function createDefaultPayload(savedItinerariesCount: number): StoredPassportPayload {
  const baseProfile: StoredPassportPayload = {
    userId: generatePassportUserId(),
    displayName: 'Bạn Yêu Văn Hóa Huế',
    joinedAt: new Date().toISOString(),
    points: 0,
    visitedPlaceIds: [],
    completedQuizIds: [],
    badges: [],
    savedItinerariesCount,
    redeemedRewards: [],
  };

  baseProfile.badges = evaluatePassportBadges(baseProfile);
  return baseProfile;
}

function sanitizePayload(raw: unknown, savedItinerariesCount: number): StoredPassportPayload {
  if (!raw || typeof raw !== 'object') {
    return createDefaultPayload(savedItinerariesCount);
  }

  const candidate = raw as Partial<StoredPassportPayload>;

  const userId =
    typeof candidate.userId === 'string' && candidate.userId.trim().length > 0
      ? candidate.userId.trim()
      : generatePassportUserId();

  const displayName =
    typeof candidate.displayName === 'string' && candidate.displayName.trim().length > 0
      ? candidate.displayName.trim().slice(0, 60)
      : 'Bạn Yêu Văn Hóa Huế';

  const joinedAt =
    typeof candidate.joinedAt === 'string' && !Number.isNaN(Date.parse(candidate.joinedAt))
      ? candidate.joinedAt
      : new Date().toISOString();

  const completedQuizIds = isStringArray(candidate.completedQuizIds)
    ? Array.from(new Set(candidate.completedQuizIds))
    : [];

  const visitedPlaceIds = isStringArray(candidate.visitedPlaceIds)
    ? Array.from(new Set(candidate.visitedPlaceIds))
    : [];

  const redeemedRewards = sanitizeRedeemedRewards(candidate.redeemedRewards);
  const totalSpent = redeemedRewards.reduce((sum, item) => sum + item.costPoints, 0);
  const expectedAvailablePoints = Math.max(0, completedQuizIds.length * QUIZ_CORRECT_POINTS - totalSpent);

  const points =
    typeof candidate.points === 'number' && Number.isFinite(candidate.points) && candidate.points >= 0
      ? Math.floor(candidate.points)
      : expectedAvailablePoints;

  const normalized: StoredPassportPayload = {
    userId,
    displayName,
    avatarUrl: typeof candidate.avatarUrl === 'string' ? candidate.avatarUrl : undefined,
    joinedAt,
    points,
    visitedPlaceIds,
    completedQuizIds,
    badges: Array.isArray(candidate.badges) ? (candidate.badges as CulturalBadge[]) : [],
    savedItinerariesCount,
    redeemedRewards,
  };

  normalized.badges = evaluatePassportBadges(normalized);
  return normalized;
}

function readRawPayload(): StoredPassportPayload {
  const savedJourneysCount = loadSavedJourneys().length;

  if (typeof window === 'undefined') {
    return createDefaultPayload(savedJourneysCount);
  }

  try {
    const raw = window.localStorage.getItem(PASSPORT_STORAGE_KEY);
    if (!raw) {
      const initial = createDefaultPayload(savedJourneysCount);
      window.localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed: unknown = JSON.parse(raw);
    const validated = sanitizePayload(parsed, savedJourneysCount);
    window.localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(validated));
    return validated;
  } catch {
    return createDefaultPayload(savedJourneysCount);
  }
}

function writeRawPayload(payload: StoredPassportPayload): StoredPassportPayload {
  const savedJourneysCount = loadSavedJourneys().length;
  const validated = sanitizePayload(
    {
      ...payload,
      savedItinerariesCount: savedJourneysCount,
    },
    savedJourneysCount
  );

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(validated));
    } catch {
      // Bỏ qua lỗi quota trong chế độ duyệt riêng tư
    }
  }

  return validated;
}

function stripToPublicProfile(payload: StoredPassportPayload): UserPassportProfile {
  const { redeemedRewards: _omit, ...profile } = payload;
  void _omit;
  return profile;
}

/**
 * Đọc hồ sơ Hộ chiếu văn hóa từ localStorage (key: soulvillage.passport.v1)
 * và tự động đồng bộ số lượng hành trình đã lưu từ module của TV2 (loadSavedJourneys).
 */
export function getLocalPassport(): UserPassportProfile {
  return stripToPublicProfile(readRawPayload());
}

/**
 * Lưu hồ sơ Hộ chiếu văn hóa vào localStorage (key: soulvillage.passport.v1).
 */
export function saveLocalPassport(profile: UserPassportProfile): UserPassportProfile {
  const current = readRawPayload();
  const saved = writeRawPayload({
    ...profile,
    redeemedRewards: current.redeemedRewards ?? [],
  });
  return stripToPublicProfile(saved);
}

/**
 * Lấy danh sách phiếu quà tặng đã đổi trên thiết bị.
 */
export function getRedeemedRewards(): RedeemedRewardRecord[] {
  return readRawPayload().redeemedRewards ?? [];
}

/**
 * Đổi điểm hiện có lấy quà tặng / voucher trải nghiệm làng nghề.
 * Huy hiệu đã mở khóa vẫn được giữ nguyên 100%.
 */
export function redeemPassportReward(rewardId: string): {
  success: boolean;
  profile: UserPassportProfile;
  redeemedRewards: RedeemedRewardRecord[];
  newRecord?: RedeemedRewardRecord;
  errorReason?: 'NOT_FOUND' | 'ALREADY_REDEEMED' | 'INSUFFICIENT_POINTS';
} {
  const current = readRawPayload();
  const reward = CULTURAL_REWARDS_CATALOG.find((item) => item.id === rewardId);

  if (!reward) {
    return {
      success: false,
      profile: stripToPublicProfile(current),
      redeemedRewards: current.redeemedRewards ?? [],
      errorReason: 'NOT_FOUND',
    };
  }

  const existingList = current.redeemedRewards ?? [];
  if (existingList.some((r) => r.rewardId === rewardId)) {
    return {
      success: false,
      profile: stripToPublicProfile(current),
      redeemedRewards: existingList,
      errorReason: 'ALREADY_REDEEMED',
    };
  }

  if (current.points < reward.costPoints) {
    return {
      success: false,
      profile: stripToPublicProfile(current),
      redeemedRewards: existingList,
      errorReason: 'INSUFFICIENT_POINTS',
    };
  }

  const newRecord: RedeemedRewardRecord = {
    rewardId: reward.id,
    voucherCode: generateVoucherCode(),
    costPoints: reward.costPoints,
    redeemedAt: new Date().toISOString(),
  };

  const nextPayload = writeRawPayload({
    ...current,
    points: current.points - reward.costPoints,
    redeemedRewards: [newRecord, ...existingList],
  });

  return {
    success: true,
    profile: stripToPublicProfile(nextPayload),
    redeemedRewards: nextPayload.redeemedRewards ?? [],
    newRecord,
  };
}

/**
 * Ghi nhận kết quả trả lời câu hỏi Quiz di sản.
 * Quy tắc minh bạch: Trả lời đúng lần đầu được +50 điểm (mỗi câu chỉ cộng 1 lần).
 */
export function submitQuizAnswer(
  questionId: string,
  isCorrect: boolean,
  placeId?: string
): {
  profile: UserPassportProfile;
  pointsAdded: number;
  alreadyCompleted: boolean;
  newlyUnlockedBadges: CulturalBadge[];
} {
  const current = readRawPayload();
  const alreadyCompleted = current.completedQuizIds.includes(questionId);

  if (!isCorrect) {
    return {
      profile: stripToPublicProfile(current),
      pointsAdded: 0,
      alreadyCompleted,
      newlyUnlockedBadges: [],
    };
  }

  const previouslyUnlockedIds = new Set(
    current.badges.filter((b) => Boolean(b.unlockedAt)).map((b) => b.id)
  );

  const nextCompletedQuizIds = alreadyCompleted
    ? current.completedQuizIds
    : [...current.completedQuizIds, questionId];

  const nextVisitedPlaceIds =
    placeId && !current.visitedPlaceIds.includes(placeId)
      ? [...current.visitedPlaceIds, placeId]
      : current.visitedPlaceIds;

  const pointsAdded = alreadyCompleted ? 0 : QUIZ_CORRECT_POINTS;
  const nextPoints = current.points + pointsAdded;

  const updated = writeRawPayload({
    ...current,
    points: nextPoints,
    completedQuizIds: nextCompletedQuizIds,
    visitedPlaceIds: nextVisitedPlaceIds,
  });

  const newlyUnlockedBadges = updated.badges.filter(
    (badge) => Boolean(badge.unlockedAt) && !previouslyUnlockedIds.has(badge.id)
  );

  return {
    profile: stripToPublicProfile(updated),
    pointsAdded,
    alreadyCompleted,
    newlyUnlockedBadges,
  };
}

/**
 * Cập nhật tên hiển thị trên Hộ chiếu văn hóa.
 */
export function updatePassportDisplayName(displayName: string): UserPassportProfile {
  const current = readRawPayload();
  const trimmed = displayName.trim().slice(0, 60) || 'Bạn Yêu Văn Hóa Huế';
  const saved = writeRawPayload({
    ...current,
    displayName: trimmed,
  });
  return stripToPublicProfile(saved);
}

/**
 * Đánh dấu một địa điểm văn hóa đã được khám phá trong Hộ chiếu.
 */
export function markPlaceVisitedInPassport(placeId: string): UserPassportProfile {
  const current = readRawPayload();
  if (!placeId || current.visitedPlaceIds.includes(placeId)) {
    return stripToPublicProfile(current);
  }
  const saved = writeRawPayload({
    ...current,
    visitedPlaceIds: [...current.visitedPlaceIds, placeId],
  });
  return stripToPublicProfile(saved);
}

/**
 * Đặt lại tiến độ điểm, huy hiệu và quà thử nghiệm trên thiết bị (vẫn giữ nguyên userId gốc).
 */
export function resetLocalPassport(): UserPassportProfile {
  const current = readRawPayload();
  const saved = writeRawPayload({
    ...current,
    points: 0,
    completedQuizIds: [],
    visitedPlaceIds: [],
    badges: [],
    redeemedRewards: [],
  });
  return stripToPublicProfile(saved);
}
