export type CulturalMemberRole = 'tv1_lead' | 'tv2_ai' | 'tv3_curator' | 'visitor' | 'artisan' | 'scholar';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: CulturalMemberRole;
  title: string;
  avatarInitials: string;
  bio?: string;
  joinedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role?: CulturalMemberRole;
  title?: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  title?: string;
  bio?: string;
}

export interface AuthSessionResponse {
  user: AuthUser;
  token: string;
}
