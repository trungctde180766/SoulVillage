import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  AuthSessionResponse,
  AuthUser,
  CulturalMemberRole,
  LoginCredentials,
  RegisterPayload,
  UpdateProfilePayload,
} from '../types/auth';

export const AUTH_SESSION_STORAGE_KEY = 'soulvillage.auth.v1';
export const AUTH_LOCAL_USERS_STORAGE_KEY = 'soulvillage.auth.users.v1';

interface StoredLocalAccount extends AuthUser {
  passwordPlain: string;
}

export const DEFAULT_DEMO_ACCOUNTS: StoredLocalAccount[] = [
  {
    id: 'user-tv1-lead',
    fullName: 'Thành Trung (TV1)',
    email: 'tv1@soulvillage.vn',
    role: 'tv1_lead',
    title: 'Trưởng Nhóm · Kiến Trúc Sư Di Sản',
    avatarInitials: 'TT',
    bio: 'Phụ trách tích hợp hệ thống, kiến trúc HoaLang UI, trang Khám phá & Chi tiết và triển khai Google Cloud Run.',
    joinedAt: '2026-11-14T08:00:00.000Z',
    passwordPlain: 'hoalang2026',
  },
  {
    id: 'user-tv2-gemini',
    fullName: 'Thành Viên 02 (TV2)',
    email: 'tv2@soulvillage.vn',
    role: 'tv2_ai',
    title: 'Điều Phối Hành Trình Gemini AI',
    avatarInitials: 'T2',
    bio: 'Phụ trách thuật toán cá nhân hóa hành trình di sản với Google Gemini 2.5 Flash và cơ chế dự phòng minh bạch.',
    joinedAt: '2026-11-14T08:05:00.000Z',
    passwordPlain: 'hoalang2026',
  },
  {
    id: 'user-tv3-curator',
    fullName: 'Thành Viên 03 (TV3)',
    email: 'tv3@soulvillage.vn',
    role: 'tv3_curator',
    title: 'Học Giả Văn Hóa & Hộ Chiếu Di Sản',
    avatarInitials: 'T3',
    bio: 'Phụ trách biên khảo danh mục làng nghề truyền thống Huế, hệ thống thử thách Quiz và ấn triện di sản.',
    joinedAt: '2026-11-14T08:10:00.000Z',
    passwordPlain: 'hoalang2026',
  },
];

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'SV';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getLocalAccounts(): StoredLocalAccount[] {
  if (typeof window === 'undefined') return DEFAULT_DEMO_ACCOUNTS;
  try {
    const raw = window.localStorage.getItem(AUTH_LOCAL_USERS_STORAGE_KEY);
    if (!raw) return DEFAULT_DEMO_ACCOUNTS;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_DEMO_ACCOUNTS;
    const customList = parsed as StoredLocalAccount[];
    const mergedMap = new Map<string, StoredLocalAccount>();
    for (const demo of DEFAULT_DEMO_ACCOUNTS) {
      mergedMap.set(demo.email.toLowerCase(), demo);
    }
    for (const item of customList) {
      if (item && typeof item.email === 'string') {
        mergedMap.set(item.email.toLowerCase(), item);
      }
    }
    return Array.from(mergedMap.values());
  } catch {
    return DEFAULT_DEMO_ACCOUNTS;
  }
}

function saveLocalAccounts(accounts: StoredLocalAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AUTH_LOCAL_USERS_STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // Bỏ qua lỗi quota
  }
}

function stripPassword(acc: StoredLocalAccount): AuthUser {
  return {
    id: acc.id,
    fullName: acc.fullName,
    email: acc.email,
    role: acc.role,
    title: acc.title,
    avatarInitials: acc.avatarInitials,
    bio: acc.bio,
    joinedAt: acc.joinedAt,
  };
}

function loadStoredSession(): AuthSessionResponse | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      'user' in parsed &&
      'token' in parsed &&
      (parsed as AuthSessionResponse).user?.id
    ) {
      return parsed as AuthSessionResponse;
    }
    return null;
  } catch {
    return null;
  }
}

function persistSession(session: AuthSessionResponse | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!session) {
      window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    } else {
      window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  } catch {
    // Bỏ qua lỗi quota
  }
}

const DEFAULT_TITLES_BY_ROLE: Record<CulturalMemberRole, string> = {
  tv1_lead: 'Trưởng Nhóm · Kiến Trúc Sư Di Sản',
  tv2_ai: 'Điều Phối Hành Trình Gemini AI',
  tv3_curator: 'Học Giả Văn Hóa & Hộ Chiếu Di Sản',
  visitor: 'Lữ Khách Văn Hóa Cố Đô',
  artisan: 'Nghệ Nhân Làng Nghề Truyền Thống',
  scholar: 'Nhà Nghiên Cứu Di Sản Huế',
};

export async function apiLogin(credentials: LoginCredentials): Promise<AuthSessionResponse> {
  const email = credentials.email.trim().toLowerCase();
  const password = credentials.password;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = (await response.json()) as AuthSessionResponse;
      return data;
    }

    if (response.status === 400 || response.status === 401) {
      const errBody = (await response.json()) as { error?: { message?: string } };
      throw new Error(errBody?.error?.message || 'Email hoặc mật khẩu không chính xác.');
    }
  } catch (err) {
    if (err instanceof Error && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }

  // Fallback cục bộ khi chạy Vite dev riêng lẻ chưa bật server Express
  const accounts = getLocalAccounts();
  const matched = accounts.find((a) => a.email.toLowerCase() === email);
  if (!matched || matched.passwordPlain !== password) {
    throw new Error('Email hoặc mật khẩu không chính xác.');
  }

  const user = stripPassword(matched);
  return {
    user,
    token: `local-token-${user.id}-${Date.now()}`,
  };
}

export async function apiRegister(payload: RegisterPayload): Promise<AuthSessionResponse> {
  const fullName = payload.fullName.trim();
  const email = payload.email.trim().toLowerCase();
  const password = payload.password;
  const role: CulturalMemberRole = payload.role || 'visitor';
  const title = payload.title?.trim() || DEFAULT_TITLES_BY_ROLE[role];

  if (fullName.length < 2) {
    throw new Error('Họ và tên phải có ít nhất 2 ký tự.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Địa chỉ email không đúng định dạng.');
  }
  if (password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự.');
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, role, title }),
    });

    if (response.ok) {
      const data = (await response.json()) as AuthSessionResponse;
      // Lưu đồng bộ vào danh sách local để dự phòng
      const accounts = getLocalAccounts();
      saveLocalAccounts([...accounts, { ...data.user, passwordPlain: password }]);
      return data;
    }

    if (response.status === 400 || response.status === 409) {
      const errBody = (await response.json()) as { error?: { message?: string } };
      throw new Error(errBody?.error?.message || 'Không thể đăng ký tài khoản.');
    }
  } catch (err) {
    if (err instanceof Error && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }

  // Fallback cục bộ khi chạy Vite dev riêng lẻ
  const accounts = getLocalAccounts();
  if (accounts.some((a) => a.email.toLowerCase() === email)) {
    throw new Error('Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.');
  }

  const newAccount: StoredLocalAccount = {
    id: `user-${Date.now()}`,
    fullName,
    email,
    role,
    title,
    avatarInitials: computeInitials(fullName),
    bio: 'Thành viên cộng đồng gìn giữ và du khảo bản đồ văn hóa sống Hồn Làng (SoulVillage × HoaLang).',
    joinedAt: new Date().toISOString(),
    passwordPlain: password,
  };

  saveLocalAccounts([...accounts, newAccount]);
  const user = stripPassword(newAccount);
  return {
    user,
    token: `local-token-${user.id}-${Date.now()}`,
  };
}

export async function apiUpdateProfile(
  token: string,
  currentUser: AuthUser,
  updates: UpdateProfilePayload
): Promise<AuthSessionResponse> {
  try {
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      const data = (await response.json()) as AuthSessionResponse;
      return data;
    }
  } catch {
    // Fallback sang cập nhật cục bộ bên dưới
  }

  const nextName =
    updates.fullName && updates.fullName.trim().length >= 2
      ? updates.fullName.trim()
      : currentUser.fullName;
  const nextTitle =
    updates.title && updates.title.trim().length >= 2
      ? updates.title.trim()
      : currentUser.title;
  const nextBio =
    typeof updates.bio === 'string' ? updates.bio.trim() : currentUser.bio || '';

  const updatedUser: AuthUser = {
    ...currentUser,
    fullName: nextName,
    title: nextTitle,
    bio: nextBio,
    avatarInitials: computeInitials(nextName),
  };

  const accounts = getLocalAccounts().map((acc) =>
    acc.email.toLowerCase() === currentUser.email.toLowerCase()
      ? { ...acc, ...updatedUser }
      : acc
  );
  saveLocalAccounts(accounts);

  return {
    user: updatedUser,
    token,
  };
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  demoAccounts: AuthUser[];
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  quickSwitchDemo: (email: string) => Promise<AuthUser>;
  updateProfile: (updates: UpdateProfilePayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isAuthenticated: false,
  demoAccounts: DEFAULT_DEMO_ACCOUNTS.map(stripPassword),
  login: async () => {
    throw new Error('AuthProvider not initialized');
  },
  register: async () => {
    throw new Error('AuthProvider not initialized');
  },
  quickSwitchDemo: async () => {
    throw new Error('AuthProvider not initialized');
  },
  updateProfile: async () => {
    throw new Error('AuthProvider not initialized');
  },
  logout: async () => undefined,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSessionResponse | null>(() => loadStoredSession());

  // Kiểm tra đồng bộ token với backend khi khởi chạy
  useEffect(() => {
    if (!session?.token || session.token.startsWith('local-token-')) {
      return;
    }

    const controller = new AbortController();
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${session.token}` },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.ok) {
          const data = (await res.json()) as { user?: AuthUser };
          if (data?.user) {
            const nextSession = { user: data.user, token: session.token };
            persistSession(nextSession);
            setSession(nextSession);
          }
        } else if (res.status === 401) {
          persistSession(null);
          setSession(null);
        }
      })
      .catch(() => {
        // Giữ phiên local nếu server chưa bật
      });

    return () => controller.abort();
  }, [session?.token]);

  const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
    const nextSession = await apiLogin(credentials);
    persistSession(nextSession);
    setSession(nextSession);
    return nextSession.user;
  };

  const register = async (payload: RegisterPayload): Promise<AuthUser> => {
    const nextSession = await apiRegister(payload);
    persistSession(nextSession);
    setSession(nextSession);
    return nextSession.user;
  };

  const quickSwitchDemo = async (email: string): Promise<AuthUser> => {
    return login({ email, password: 'hoalang2026' });
  };

  const updateProfile = async (updates: UpdateProfilePayload): Promise<AuthUser> => {
    if (!session) {
      throw new Error('Vui lòng đăng nhập trước khi cập nhật hồ sơ.');
    }
    const nextSession = await apiUpdateProfile(session.token, session.user, updates);
    persistSession(nextSession);
    setSession(nextSession);
    return nextSession.user;
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Bỏ qua lỗi mạng khi đăng xuất
    }
    persistSession(null);
    setSession(null);
  };

  const value: AuthContextValue = {
    user: session?.user || null,
    token: session?.token || null,
    isAuthenticated: Boolean(session?.user),
    demoAccounts: DEFAULT_DEMO_ACCOUNTS.map(stripPassword),
    login,
    register,
    quickSwitchDemo,
    updateProfile,
    logout,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
