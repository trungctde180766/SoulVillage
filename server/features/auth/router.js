import express from 'express';
import crypto from 'node:crypto';

const TOKEN_SECRET =
  process.env.AUTH_TOKEN_SECRET || 'soulvillage-hoalang-editorial-secret-2026';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 ngày

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const candidateHash = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(originalHash, 'hex');
  const b = Buffer.from(candidateHash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function getInitials(fullName) {
  const parts = String(fullName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'HL';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function signToken(user) {
  const payload = {
    sub: user.id,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      title: user.title,
      avatarInitials: user.avatarInitials,
      bio: user.bio || '',
      joinedAt: user.joinedAt,
    },
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return null;
  }
  const [encodedPayload, signature] = token.split('.');
  const expectedSig = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (!parsed || typeof parsed.exp !== 'number' || parsed.exp < Date.now()) {
      return null;
    }
    return parsed.user || null;
  } catch {
    return null;
  }
}

const usersByEmail = new Map();
const usersById = new Map();

function toPublicUser(record) {
  return {
    id: record.id,
    fullName: record.fullName,
    email: record.email,
    role: record.role,
    title: record.title,
    avatarInitials: record.avatarInitials,
    bio: record.bio || '',
    joinedAt: record.joinedAt,
  };
}

function extractBearerToken(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return null;
}

export function createAuthRouter() {
  const router = express.Router();

  // POST /api/auth/register — Đăng ký tài khoản mới
  router.post('/register', (req, res) => {
    const { fullName, email, password, role, title } = req.body || {};

    const cleanName = typeof fullName === 'string' ? fullName.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const rawPassword = typeof password === 'string' ? password : '';

    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({
        error: {
          code: 'INVALID_NAME',
          message: 'Họ và tên phải có độ dài từ 2 đến 80 ký tự.',
        },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_EMAIL',
          message: 'Địa chỉ email không đúng định dạng.',
        },
      });
    }

    if (rawPassword.length < 6 || rawPassword.length > 128) {
      return res.status(400).json({
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Mật khẩu phải có ít nhất 6 ký tự.',
        },
      });
    }

    if (usersByEmail.has(cleanEmail)) {
      return res.status(409).json({
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.',
        },
      });
    }

    const allowedRoles = ['visitor', 'artisan', 'scholar', 'collector'];
    const resolvedRole = allowedRoles.includes(role) ? role : 'visitor';
    const defaultTitles = {
      visitor: 'Lữ Khách Văn Hóa Cố Đô',
      artisan: 'Nghệ Nhân Làng Nghề Truyền Thống',
      scholar: 'Học Giả Nghiên Cứu Di Sản',
      collector: 'Nhà Sưu Tầm Thủ Công Mỹ Nghệ',
    };

    const resolvedTitle =
      typeof title === 'string' && title.trim()
        ? title.trim().slice(0, 80)
        : defaultTitles[resolvedRole];

    const newRecord = {
      id: `user-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      fullName: cleanName,
      email: cleanEmail,
      role: resolvedRole,
      title: resolvedTitle,
      avatarInitials: getInitials(cleanName),
      bio: 'Thành viên yêu mến và đồng hành gìn giữ bản đồ văn hóa sống Hồn Làng.',
      joinedAt: new Date().toISOString(),
      passwordHash: hashPassword(rawPassword),
    };

    usersByEmail.set(cleanEmail, newRecord);
    usersById.set(newRecord.id, newRecord);

    const publicUser = toPublicUser(newRecord);
    const token = signToken(publicUser);

    return res.status(201).json({
      user: publicUser,
      token,
    });
  });

  // POST /api/auth/login — Đăng nhập bằng email & mật khẩu
  router.post('/login', (req, res) => {
    const { email, password } = req.body || {};
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const rawPassword = typeof password === 'string' ? password : '';

    if (!cleanEmail || !rawPassword) {
      return res.status(400).json({
        error: {
          code: 'MISSING_CREDENTIALS',
          message: 'Vui lòng nhập đầy đủ email và mật khẩu.',
        },
      });
    }

    const record = usersByEmail.get(cleanEmail);
    if (!record || !verifyPassword(rawPassword, record.passwordHash)) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email hoặc mật khẩu không chính xác.',
        },
      });
    }

    const publicUser = toPublicUser(record);
    const token = signToken(publicUser);

    return res.status(200).json({
      user: publicUser,
      token,
    });
  });

  // GET /api/auth/me — Xác thực phiên đăng nhập hiện tại từ Bearer token
  router.get('/me', (req, res) => {
    const token = extractBearerToken(req);
    const tokenUser = verifyToken(token);

    if (!tokenUser) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.',
        },
      });
    }

    const latestRecord = usersById.get(tokenUser.id);
    const user = latestRecord ? toPublicUser(latestRecord) : tokenUser;

    return res.status(200).json({ user });
  });

  // PUT /api/auth/profile — Cập nhật thông tin định danh cá nhân
  router.put('/profile', (req, res) => {
    const token = extractBearerToken(req);
    const tokenUser = verifyToken(token);

    if (!tokenUser) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Vui lòng đăng nhập để cập nhật hồ sơ.',
        },
      });
    }

    const { fullName, title, bio } = req.body || {};
    const updatedName =
      typeof fullName === 'string' && fullName.trim().length >= 2
        ? fullName.trim().slice(0, 80)
        : tokenUser.fullName;
    const updatedTitle =
      typeof title === 'string' && title.trim().length >= 2
        ? title.trim().slice(0, 80)
        : tokenUser.title;
    const updatedBio =
      typeof bio === 'string' ? bio.trim().slice(0, 300) : tokenUser.bio || '';

    const existingRecord = usersById.get(tokenUser.id);
    let updatedPublicUser;

    if (existingRecord) {
      existingRecord.fullName = updatedName;
      existingRecord.title = updatedTitle;
      existingRecord.bio = updatedBio;
      existingRecord.avatarInitials = getInitials(updatedName);
      updatedPublicUser = toPublicUser(existingRecord);
    } else {
      updatedPublicUser = {
        ...tokenUser,
        fullName: updatedName,
        title: updatedTitle,
        bio: updatedBio,
        avatarInitials: getInitials(updatedName),
      };
    }

    const newToken = signToken(updatedPublicUser);
    return res.status(200).json({
      user: updatedPublicUser,
      token: newToken,
    });
  });

  // POST /api/auth/logout — Đăng xuất
  router.post('/logout', (_req, res) => {
    return res.status(200).json({
      status: 'logged_out',
    });
  });

  return router;
}
