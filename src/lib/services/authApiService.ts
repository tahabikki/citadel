import { createToken, hashPassword, verifyPassword, type JWTPayload, type UserRole } from '@/lib/auth';
import { userService, type UserRecord } from './userService';

function toPublicUser(user: UserRecord) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
  };
}

async function createSessionResponse(user: UserRecord) {
  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: toPublicUser(user),
    token,
  };
}

export async function registerUser(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}) {
  const users = await userService.getAll();
  const existingUser = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const now = new Date().toISOString();
  const user = await userService.create({
    email: input.email,
    password: hashPassword(input.password),
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    role: 'GUEST' as UserRole,
    createdAt: now,
    updatedAt: now,
  });

  return createSessionResponse(user);
}

export async function loginUser(input: { email: string; password: string }) {
  const users = await userService.getAll();
  const user = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());

  if (!user || !verifyPassword(input.password, user.password)) {
    throw new Error('Invalid credentials');
  }

  return createSessionResponse(user);
}

export function buildAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function getCurrentUser(session: JWTPayload) {
  const user = await userService.getById(session.userId);
  if (!user) return null;
  return toPublicUser(user);
}
