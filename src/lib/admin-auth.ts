import { redirect } from "next/navigation";
import { getSession } from "@/auth";
import type { AuthSession } from "@/auth/types";

/**
 * Server-side admin gate for /admin pages.
 * Unauthenticated → /login
 * Non-admin → / (forbidden for CMS)
 */
export async function requireAdminPage(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/admin");
  }
  if (session.user.role !== "admin") {
    redirect("/");
  }
  return session;
}

export async function getAdminSessionOrNull(): Promise<AuthSession | null> {
  const session = await getSession();
  if (!session || session.user.role !== "admin") return null;
  return session;
}
