/**
 * SUBFLIX Authentication Foundation
 *
 * This module prepares the architecture for session-based auth.
 * Full implementation (registration, login, logout, protected routes)
 * will be completed in the next phase.
 *
 * Planned:
 * - Secure password hashing (bcrypt/argon2)
 * - HTTP-only session cookies
 * - CSRF protection
 * - Role-based access (user / admin)
 * - Profile selection support
 */

export type { SessionUser, AuthSession } from "./types";

// Placeholder exports — will be implemented next
export async function getSession(): Promise<null> {
  // TODO: Read session cookie and validate
  return null;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAdmin() {
  // Will check role === "admin"
  return requireAuth();
}
