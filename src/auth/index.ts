import { cookies } from "next/headers";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, sessions, profiles } from "@/db/schema";
import type { SessionUser, AuthSession } from "./types";

const SESSION_COOKIE = "subflix_session";
const SESSION_DAYS = 30;

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const result = await db
    .select({
      sessionId: sessions.id,
      expiresAt: sessions.expiresAt,
      userId: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      isActive: users.isActive,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (result.length === 0) {
    await clearSessionCookie();
    return null;
  }

  const row = result[0];
  if (!row.isActive) {
    await destroySession(token);
    return null;
  }

  return {
    user: {
      id: row.userId,
      email: row.email,
      name: row.name,
      role: row.role as "user" | "admin",
    },
    expires: row.expiresAt.toISOString(),
  };
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAdmin(): Promise<AuthSession> {
  const session = await requireAuth();
  if (session.user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function destroySession(token?: string): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = token ?? cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionToken) {
    await db.delete(sessions).where(eq(sessions.token, sessionToken));
  }

  await clearSessionCookie();
}

async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function registerUser(data: {
  email: string;
  password: string;
  name?: string;
}): Promise<{ user: SessionUser } | { error: string }> {
  const email = data.email.toLowerCase().trim();

  if (!email || !data.password) {
    return { error: "Email and password are required" };
  }

  if (data.password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await hashPassword(data.password);

  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      name: data.name?.trim() || null,
      role: "user",
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    });

  // Create default profile
  await db.insert(profiles).values({
    userId: user.id,
    name: data.name?.trim() || email.split("@")[0],
  });

  await createSession(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "user" | "admin",
    },
  };
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<{ user: SessionUser } | { error: string }> {
  const email = data.email.toLowerCase().trim();

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (result.length === 0) {
    return { error: "Invalid email or password" };
  }

  const user = result[0];

  if (!user.isActive) {
    return { error: "This account has been suspended" };
  }

  const valid = await verifyPassword(data.password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  await createSession(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "user" | "admin",
    },
  };
}

export type { SessionUser, AuthSession };
