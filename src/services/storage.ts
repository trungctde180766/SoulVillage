import type { CulturalBadge, UserPassportProfile } from '../types/passport';
import { loadSavedJourneys } from './journeyStorage';

export const PASSPORT_STORAGE_KEY = 'soulvillage.passport.v1';
const AUTH_SESSION_STORAGE_KEY = 'soulvillage.auth.v1';
export const QUIZ_CORRECT_POINTS = 50;
export const MAX_REDEMPTIONS_PER_REWARD = 1;

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

interface AccountPassportRecord extends UserPassportProfile {
  attemptedQuizIds: string[];
  firstTryCorrectQuizIds: string[];
  redeemedRewards: RedeemedRewardRecord[];
}

interface StoredPassportRoot extends UserPassportProfile {
  attemptedQuizIds?: string[];
  firstTryCorrectQuizIds?: string[];
  redeemedRewards?: RedeemedRewardRecord[];
  accounts?: Record<string, AccountPassportRecord>;
}

interface StoredAuthSessionShape {
  user?: {
    id?: unknown;
    fullName?: unknown;
  };
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
    requirementText: 'Đạt 100 điểm tích lũy (2 câu đúng ngay lần đầu)',
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
    requirementText: 'Đạt 150 điểm tích lũy (3 câu đúng ngay lần đầu)',
  },
  {
    id: 'badge-imperial-master',
    name: 'Bậc thầy cố đô',
    description: 'Hoàn thành xuất sắc toàn bộ 6 câu đố di sản Huế ngay lần đầu.',
    icon: 'award',
    category: 'gourmet',
    requirementText: 'Đạt 300 điểm tích lũy (6 câu đúng ngay lần đầu)',
  },
];

function getActiveAccountIdentity(): { accountKey: string; defaultDisplayName: string } {
  if (typeof window === 'undefined') {
    return { accountKey: 'guest', defaultDisplayName: 'Bạn Yêu Văn Hóa Huế' };
  }
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) {
      return { accountKey: 'guest', defaultDisplayName: 'Bạn Yêu Văn Hóa Huế' };
    }
    const parsed = JSON.parse(raw) as StoredAuthSessionShape;
    const id = typeof parsed?.user?.id === 'string' ? parsed.user.id.trim() : '';
    const fullName =
      typeof parsed?.user?.fullName === 'string' && parsed.user.fullName.trim().length > 0
        ? parsed.user.fullName.trim().slice(0, 60)
        : 'Bạn Yêu Văn Hóa Huế';

    if (id.length > 0) {
      return { accountKey: id, defaultDisplayName: fullName };
    }
    return { accountKey: 'guest', defaultDisplayName: 'Bạn Yêu Văn Hóa Huế' };
  } catch {
    return { accountKey: 'guest', defaultDisplayName: 'Bạn Yêu Văn Hóa Huế' };
  }
}

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

/**
 * Chuẩn hóa danh sách quà đã đổi và đảm bảo cứng quy tắc:
 * Mỗi người chỉ có tối đa 1 lượt đổi cho mỗi món quà tương ứng (chống trùng rewardId).
 */
function sanitizeRedeemedRewards(raw: unknown): RedeemedRewardRecord[] {
  if (!Array.isArray(raw)) return [];
  const seenRewardIds = new Set<string>();
  const result: RedeemedRewardRecord[] = [];

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const r = item as Partial<RedeemedRewardRecord>;
    if (
      typeof r.rewardId === 'string' &&
      typeof r.voucherCode === 'string' &&
      typeof r.costPoints === 'number' &&
      typeof r.redeemedAt === 'string' &&
      !seenRewardIds.has(r.rewardId)
    ) {
      seenRewardIds.add(r.rewardId);
      result.push({
        rewardId: r.rewardId,
        voucherCode: r.voucherCode,
        costPoints: r.costPoints,
        redeemedAt: r.redeemedAt,
      });
    }
  }

  return result;
}

/**
 * Tính tổng điểm đã tích lũy của người dùng hiện tại (chỉ tính các câu đúng ở lần làm đầu tiên,
 * không bị giảm khi dùng điểm đổi quà).
 */
export function getTotalEarnedPoints(
  profile?: Pick<UserPassportProfile, 'points' | 'completedQuizIds'>
): number {
  const active = readActiveAccountRecord();
  if (active) {
    return active.firstTryCorrectQuizIds.length * QUIZ_CORRECT_POINTS;
  }
  if (!profile) return 0;
  return profile.completedQuizIds.length * QUIZ_CORRECT_POINTS;
}

/**
 * Lấy danh sách ID các câu hỏi mà người dùng hiện tại đã từng nộp đáp án (dù đúng hay sai).
 * Mọi câu nằm trong danh sách này khi làm lại sẽ KHÔNG được cộng thêm điểm.
 */
export function getAttemptedQuizIds(): string[] {
  return readActiveAccountRecord().attemptedQuizIds;
}

/**
 * Lấy danh sách ID các câu hỏi người dùng trả lời đúng ngay ở lần thử đầu tiên (+50 điểm/câu).
 */
export function getFirstTryCorrectQuizIds(): string[] {
  return readActiveAccountRecord().firstTryCorrectQuizIds;
}

/**
 * Đánh giá điều kiện mở khóa huy hiệu dựa trên tổng điểm tích lũy & hành trình đã lưu.
 * Khi người dùng dùng điểm để đổi quà, huy hiệu đã mở khóa vẫn được giữ nguyên vĩnh viễn.
 */
export function evaluatePassportBadges(
  profile: Pick<UserPassportProfile, 'points' | 'completedQuizIds' | 'savedItinerariesCount' | 'badges'>,
  explicitEarnedPoints?: number
): CulturalBadge[] {
  const existingMap = new Map<string, CulturalBadge>();
  if (Array.isArray(profile.badges)) {
    for (const badge of profile.badges) {
      if (badge && typeof badge.id === 'string') {
        existingMap.set(badge.id, badge);
      }
    }
  }

  const earnedPoints =
    typeof explicitEarnedPoints === 'number'
      ? explicitEarnedPoints
      : Math.max(profile.points, profile.completedQuizIds.length * QUIZ_CORRECT_POINTS);

  const nowIso = new Date().toISOString();

  return DEFAULT_CULTURAL_BADGES.map((template) => {
    const prev = existingMap.get(template.id);
    let shouldUnlock = Boolean(prev?.unlockedAt);

    if (!shouldUnlock) {
      switch (template.id) {
        case 'badge-heritage-scholar':
          shouldUnlock = earnedPoints >= 100;
          break;
        case 'badge-journey-planner':
          shouldUnlock = profile.savedItinerariesCount >= 1;
          break;
        case 'badge-craft-connoisseur':
          shouldUnlock = earnedPoints >= 150;
          break;
        case 'badge-imperial-master':
          shouldUnlock = earnedPoints >= 300;
          break;
        default:
          break;
      }
    }

    if (
      template.id === 'badge-journey-planner' &&
      profile.savedItinerariesCount < 1 &&
      !prev?.unlockedAt
    ) {
      shouldUnlock = false;
    }

    return {
      ...template,
      unlockedAt: shouldUnlock ? prev?.unlockedAt || nowIso : undefined,
    };
  });
}

function createDefaultAccountRecord(
  savedItinerariesCount: number,
  defaultDisplayName: string
): AccountPassportRecord {
  const base: AccountPassportRecord = {
    userId: generatePassportUserId(),
    displayName: defaultDisplayName,
    joinedAt: new Date().toISOString(),
    points: 0,
    visitedPlaceIds: [],
    completedQuizIds: [],
    attemptedQuizIds: [],
    firstTryCorrectQuizIds: [],
    badges: [],
    savedItinerariesCount,
    redeemedRewards: [],
  };

  base.badges = evaluatePassportBadges(base, 0);
  return base;
}

function sanitizeAccountRecord(
  raw: unknown,
  savedItinerariesCount: number,
  defaultDisplayName: string
): AccountPassportRecord {
  if (!raw || typeof raw !== 'object') {
    return createDefaultAccountRecord(savedItinerariesCount, defaultDisplayName);
  }

  const candidate = raw as Partial<AccountPassportRecord>;

  const userId =
    typeof candidate.userId === 'string' && candidate.userId.trim().length > 0
      ? candidate.userId.trim()
      : generatePassportUserId();

  const displayName =
    typeof candidate.displayName === 'string' && candidate.displayName.trim().length > 0
      ? candidate.displayName.trim().slice(0, 60)
      : defaultDisplayName;

  const joinedAt =
    typeof candidate.joinedAt === 'string' && !Number.isNaN(Date.parse(candidate.joinedAt))
      ? candidate.joinedAt
      : new Date().toISOString();

  const completedQuizIds = isStringArray(candidate.completedQuizIds)
    ? Array.from(new Set(candidate.completedQuizIds))
    : [];

  // Tương thích dữ liệu cũ: nếu chưa có firstTryCorrectQuizIds thì kế thừa từ completedQuizIds cũ
  const firstTryCorrectQuizIds = isStringArray(candidate.firstTryCorrectQuizIds)
    ? Array.from(new Set(candidate.firstTryCorrectQuizIds))
    : [...completedQuizIds];

  // Mọi câu đã làm đúng hoặc đã thử đều phải nằm trong attemptedQuizIds
  const rawAttempted = isStringArray(candidate.attemptedQuizIds) ? candidate.attemptedQuizIds : [];
  const attemptedQuizIds = Array.from(
    new Set([...rawAttempted, ...completedQuizIds, ...firstTryCorrectQuizIds])
  );

  const visitedPlaceIds = isStringArray(candidate.visitedPlaceIds)
    ? Array.from(new Set(candidate.visitedPlaceIds))
    : [];

  const redeemedRewards = sanitizeRedeemedRewards(candidate.redeemedRewards);
  const totalEarned = firstTryCorrectQuizIds.length * QUIZ_CORRECT_POINTS;
  const totalSpent = redeemedRewards.reduce((sum, item) => sum + item.costPoints, 0);
  const expectedAvailablePoints = Math.max(0, totalEarned - totalSpent);

  const points =
    typeof candidate.points === 'number' &&
    Number.isFinite(candidate.points) &&
    candidate.points >= 0
      ? Math.min(Math.floor(candidate.points), expectedAvailablePoints)
      : expectedAvailablePoints;

  const normalized: AccountPassportRecord = {
    userId,
    displayName,
    avatarUrl: typeof candidate.avatarUrl === 'string' ? candidate.avatarUrl : undefined,
    joinedAt,
    points,
    visitedPlaceIds,
    completedQuizIds,
    attemptedQuizIds,
    firstTryCorrectQuizIds,
    badges: Array.isArray(candidate.badges) ? (candidate.badges as CulturalBadge[]) : [],
    savedItinerariesCount,
    redeemedRewards,
  };

  normalized.badges = evaluatePassportBadges(normalized, totalEarned);
  return normalized;
}

function readRootAndActive(): {
  accountKey: string;
  active: AccountPassportRecord;
  accounts: Record<string, AccountPassportRecord>;
} {
  const savedJourneysCount = loadSavedJourneys().length;
  const { accountKey, defaultDisplayName } = getActiveAccountIdentity();

  if (typeof window === 'undefined') {
    const fallback = createDefaultAccountRecord(savedJourneysCount, defaultDisplayName);
    return { accountKey, active: fallback, accounts: { [accountKey]: fallback } };
  }

  try {
    const raw = window.localStorage.getItem(PASSPORT_STORAGE_KEY);
    if (!raw) {
      const initial = createDefaultAccountRecord(savedJourneysCount, defaultDisplayName);
      const accounts = { [accountKey]: initial };
      persistRoot(activeToRoot(initial, accounts));
      return { accountKey, active: initial, accounts };
    }

    const parsed = JSON.parse(raw) as Partial<StoredPassportRoot>;
    const rawAccounts =
      parsed && typeof parsed === 'object' && parsed.accounts && typeof parsed.accounts === 'object'
        ? parsed.accounts
        : {};

    const accounts: Record<string, AccountPassportRecord> = {};
    for (const [k, val] of Object.entries(rawAccounts)) {
      accounts[k] = sanitizeAccountRecord(val, savedJourneysCount, defaultDisplayName);
    }

    // Di chuyển dữ liệu legacy ở cấp root sang tài khoản guest nếu chưa có bản ghi accounts
    if (Object.keys(accounts).length === 0 && parsed && typeof parsed === 'object' && parsed.userId) {
      accounts.guest = sanitizeAccountRecord(parsed, savedJourneysCount, 'Bạn Yêu Văn Hóa Huế');
    }

    const active = accounts[accountKey]
      ? sanitizeAccountRecord(accounts[accountKey], savedJourneysCount, defaultDisplayName)
      : createDefaultAccountRecord(savedJourneysCount, defaultDisplayName);

    accounts[accountKey] = active;
    persistRoot(activeToRoot(active, accounts));

    return { accountKey, active, accounts };
  } catch {
    const fallback = createDefaultAccountRecord(savedJourneysCount, defaultDisplayName);
    return { accountKey, active: fallback, accounts: { [accountKey]: fallback } };
  }
}

function activeToRoot(
  active: AccountPassportRecord,
  accounts: Record<string, AccountPassportRecord>
): StoredPassportRoot {
  return {
    userId: active.userId,
    displayName: active.displayName,
    avatarUrl: active.avatarUrl,
    joinedAt: active.joinedAt,
    points: active.points,
    visitedPlaceIds: active.visitedPlaceIds,
    completedQuizIds: active.completedQuizIds,
    attemptedQuizIds: active.attemptedQuizIds,
    firstTryCorrectQuizIds: active.firstTryCorrectQuizIds,
    badges: active.badges,
    savedItinerariesCount: active.savedItinerariesCount,
    redeemedRewards: active.redeemedRewards,
    accounts,
  };
}

function persistRoot(root: StoredPassportRoot): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(root));
  } catch {
    // Bỏ qua lỗi quota trong chế độ duyệt riêng tư
  }
}

function readActiveAccountRecord(): AccountPassportRecord {
  return readRootAndActive().active;
}

function writeActiveAccountRecord(nextActive: AccountPassportRecord): AccountPassportRecord {
  const savedJourneysCount = loadSavedJourneys().length;
  const { accountKey, defaultDisplayName } = getActiveAccountIdentity();
  const { accounts } = readRootAndActive();

  const validated = sanitizeAccountRecord(
    {
      ...nextActive,
      savedItinerariesCount: savedJourneysCount,
    },
    savedJourneysCount,
    defaultDisplayName
  );

  const nextAccounts: Record<string, AccountPassportRecord> = {
    ...accounts,
    [accountKey]: validated,
  };

  persistRoot(activeToRoot(validated, nextAccounts));
  return validated;
}

function stripToPublicProfile(record: AccountPassportRecord): UserPassportProfile {
  return {
    userId: record.userId,
    displayName: record.displayName,
    avatarUrl: record.avatarUrl,
    joinedAt: record.joinedAt,
    points: record.points,
    visitedPlaceIds: record.visitedPlaceIds,
    completedQuizIds: record.completedQuizIds,
    badges: record.badges,
    savedItinerariesCount: record.savedItinerariesCount,
  };
}

/**
 * Đọc hồ sơ Hộ chiếu văn hóa của người dùng hiện tại từ localStorage (key: soulvillage.passport.v1)
 * và tự động đồng bộ số lượng hành trình đã lưu từ module của TV2 (loadSavedJourneys).
 */
export function getLocalPassport(): UserPassportProfile {
  return stripToPublicProfile(readActiveAccountRecord());
}

/**
 * Lưu hồ sơ Hộ chiếu văn hóa của người dùng hiện tại vào localStorage (key: soulvillage.passport.v1).
 */
export function saveLocalPassport(profile: UserPassportProfile): UserPassportProfile {
  const current = readActiveAccountRecord();
  const saved = writeActiveAccountRecord({
    ...current,
    ...profile,
    attemptedQuizIds: current.attemptedQuizIds,
    firstTryCorrectQuizIds: current.firstTryCorrectQuizIds,
    redeemedRewards: current.redeemedRewards,
  });
  return stripToPublicProfile(saved);
}

/**
 * Lấy danh sách phiếu quà tặng đã đổi của người dùng hiện tại.
 */
export function getRedeemedRewards(): RedeemedRewardRecord[] {
  return readActiveAccountRecord().redeemedRewards;
}

/**
 * Đổi điểm hiện có lấy quà tặng / voucher trải nghiệm làng nghề.
 * Quy tắc bắt buộc:
 * 1. Mỗi người chỉ có duy nhất 1 lượt đổi với mỗi món quà tương ứng (ALREADY_REDEEMED nếu đã đổi).
 * 2. Đổi quà không làm mất các huy hiệu văn hóa đã mở khóa.
 */
export function redeemPassportReward(rewardId: string): {
  success: boolean;
  profile: UserPassportProfile;
  redeemedRewards: RedeemedRewardRecord[];
  newRecord?: RedeemedRewardRecord;
  errorReason?: 'NOT_FOUND' | 'ALREADY_REDEEMED' | 'INSUFFICIENT_POINTS';
} {
  const current = readActiveAccountRecord();
  const reward = CULTURAL_REWARDS_CATALOG.find((item) => item.id === rewardId);

  if (!reward) {
    return {
      success: false,
      profile: stripToPublicProfile(current),
      redeemedRewards: current.redeemedRewards,
      errorReason: 'NOT_FOUND',
    };
  }

  const redeemedCountForGift = current.redeemedRewards.filter(
    (r) => r.rewardId === rewardId
  ).length;

  if (redeemedCountForGift >= MAX_REDEMPTIONS_PER_REWARD) {
    return {
      success: false,
      profile: stripToPublicProfile(current),
      redeemedRewards: current.redeemedRewards,
      errorReason: 'ALREADY_REDEEMED',
    };
  }

  if (current.points < reward.costPoints) {
    return {
      success: false,
      profile: stripToPublicProfile(current),
      redeemedRewards: current.redeemedRewards,
      errorReason: 'INSUFFICIENT_POINTS',
    };
  }

  const newRecord: RedeemedRewardRecord = {
    rewardId: reward.id,
    voucherCode: generateVoucherCode(),
    costPoints: reward.costPoints,
    redeemedAt: new Date().toISOString(),
  };

  const nextRecord = writeActiveAccountRecord({
    ...current,
    points: current.points - reward.costPoints,
    redeemedRewards: [newRecord, ...current.redeemedRewards],
  });

  return {
    success: true,
    profile: stripToPublicProfile(nextRecord),
    redeemedRewards: nextRecord.redeemedRewards,
    newRecord,
  };
}

/**
 * Ghi nhận kết quả trả lời câu hỏi Quiz di sản.
 * Quy tắc bắt buộc:
 * - Chỉ cộng +50 điểm khi trả lời ĐÚNG ngay ở lần làm ĐẦU TIÊN của câu hỏi đó.
 * - Nếu câu hỏi đã từng được nộp đáp án trước đó (dù đúng hay sai), mọi lần làm lại đều tính 0 điểm.
 */
export function submitQuizAnswer(
  questionId: string,
  isCorrect: boolean,
  placeId?: string
): {
  profile: UserPassportProfile;
  pointsAdded: number;
  alreadyCompleted: boolean;
  isRedo: boolean;
  newlyUnlockedBadges: CulturalBadge[];
} {
  const current = readActiveAccountRecord();
  const alreadyAttempted =
    current.attemptedQuizIds.includes(questionId) ||
    current.completedQuizIds.includes(questionId);

  const nextAttemptedQuizIds = current.attemptedQuizIds.includes(questionId)
    ? current.attemptedQuizIds
    : [...current.attemptedQuizIds, questionId];

  if (!isCorrect) {
    const savedWrongAttempt = writeActiveAccountRecord({
      ...current,
      attemptedQuizIds: nextAttemptedQuizIds,
    });

    return {
      profile: stripToPublicProfile(savedWrongAttempt),
      pointsAdded: 0,
      alreadyCompleted: current.completedQuizIds.includes(questionId),
      isRedo: alreadyAttempted,
      newlyUnlockedBadges: [],
    };
  }

  const previouslyUnlockedIds = new Set(
    current.badges.filter((b) => Boolean(b.unlockedAt)).map((b) => b.id)
  );

  const nextCompletedQuizIds = current.completedQuizIds.includes(questionId)
    ? current.completedQuizIds
    : [...current.completedQuizIds, questionId];

  // Chỉ cộng +50 điểm nếu đây là lần đầu tiên người dùng nộp câu trả lời cho câu hỏi này
  const isFirstAttemptCorrect = !alreadyAttempted;
  const nextFirstTryCorrectQuizIds =
    isFirstAttemptCorrect && !current.firstTryCorrectQuizIds.includes(questionId)
      ? [...current.firstTryCorrectQuizIds, questionId]
      : current.firstTryCorrectQuizIds;

  const nextVisitedPlaceIds =
    placeId && !current.visitedPlaceIds.includes(placeId)
      ? [...current.visitedPlaceIds, placeId]
      : current.visitedPlaceIds;

  const pointsAdded = isFirstAttemptCorrect ? QUIZ_CORRECT_POINTS : 0;
  const nextPoints = current.points + pointsAdded;

  const updated = writeActiveAccountRecord({
    ...current,
    points: nextPoints,
    attemptedQuizIds: nextAttemptedQuizIds,
    completedQuizIds: nextCompletedQuizIds,
    firstTryCorrectQuizIds: nextFirstTryCorrectQuizIds,
    visitedPlaceIds: nextVisitedPlaceIds,
  });

  const newlyUnlockedBadges = updated.badges.filter(
    (badge) => Boolean(badge.unlockedAt) && !previouslyUnlockedIds.has(badge.id)
  );

  return {
    profile: stripToPublicProfile(updated),
    pointsAdded,
    alreadyCompleted: alreadyAttempted,
    isRedo: alreadyAttempted,
    newlyUnlockedBadges,
  };
}

/**
 * Cập nhật tên hiển thị trên Hộ chiếu văn hóa của người dùng hiện tại.
 */
export function updatePassportDisplayName(displayName: string): UserPassportProfile {
  const current = readActiveAccountRecord();
  const trimmed = displayName.trim().slice(0, 60) || 'Bạn Yêu Văn Hóa Huế';
  const saved = writeActiveAccountRecord({
    ...current,
    displayName: trimmed,
  });
  return stripToPublicProfile(saved);
}

/**
 * Đánh dấu một địa điểm văn hóa đã được khám phá trong Hộ chiếu.
 */
export function markPlaceVisitedInPassport(placeId: string): UserPassportProfile {
  const current = readActiveAccountRecord();
  if (!placeId || current.visitedPlaceIds.includes(placeId)) {
    return stripToPublicProfile(current);
  }
  const saved = writeActiveAccountRecord({
    ...current,
    visitedPlaceIds: [...current.visitedPlaceIds, placeId],
  });
  return stripToPublicProfile(saved);
}
