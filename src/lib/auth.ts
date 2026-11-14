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

function loadStoredSession(): AuthSessionResponse | null {
  if (typeof window === 'undefined') return null;
  try {
    // Dọn khóa lưu trữ cũ nếu từng tồn tại trên trình duyệt
    window.localStorage.removeItem('soulvillage.auth.users.v1');

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
      const session = parsed as AuthSessionResponse;
      if (
        ['tv1@soulvillage.vn', 'tv2@soulvillage.vn', 'tv3@soulvillage.vn'].includes(
          session.user.email.toLowerCase()
        )
      ) {
        window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        return null;
      }
      return session;
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
  visitor: 'Lữ Khách Văn Hóa Cố Đô',
  artisan: 'Nghệ Nhân Làng Nghề Truyền Thống',
  scholar: 'Học Giả Nghiên Cứu Di Sản',
  collector: 'Nhà Sưu Tầm Thủ Công Mỹ Nghệ',
};

export async function apiLogin(credentials: LoginCredentials): Promise<AuthSessionResponse> {
  const email = credentials.email.trim().toLowerCase();
  const password = credentials.password;

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    return (await response.json()) as AuthSessionResponse;
  }

  const errBody = (await response.json().catch(() => ({}))) as {
    error?: { message?: string };
  };
  throw new Error(errBody?.error?.message || 'Email hoặc mật khẩu không chính xác.');
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

  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password, role, title }),
  });

  if (response.ok) {
    return (await response.json()) as AuthSessionResponse;
  }

  const errBody = (await response.json().catch(() => ({}))) as {
    error?: { message?: string };
  };
  throw new Error(errBody?.error?.message || 'Không thể đăng ký tài khoản.');
}

export async function apiUpdateProfile(
  token: string,
  updates: UpdateProfilePayload
): Promise<AuthSessionResponse> {
  const response = await fetch('/api/auth/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (response.ok) {
    return (await response.json()) as AuthSessionResponse;
  }

  const errBody = (await response.json().catch(() => ({}))) as {
    error?: { message?: string };
  };
  throw new Error(errBody?.error?.message || 'Không thể cập nhật hồ sơ cá nhân.');
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  updateProfile: (updates: UpdateProfilePayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async () => {
    throw new Error('AuthProvider not initialized');
  },
  register: async () => {
    throw new Error('AuthProvider not initialized');
  },
  updateProfile: async () => {
    throw new Error('AuthProvider not initialized');
  },
  logout: async () => undefined,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSessionResponse | null>(() => loadStoredSession());

  useEffect(() => {
    if (!session?.token) {
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
        // Giữ phiên hiện tại nếu mạng tạm thời gián đoạn
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

  const updateProfile = async (updates: UpdateProfilePayload): Promise<AuthUser> => {
    if (!session) {
      throw new Error('Vui lòng đăng nhập trước khi cập nhật hồ sơ.');
    }
    const nextSession = await apiUpdateProfile(session.token, updates);
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
    login,
    register,
    updateProfile,
    logout,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
