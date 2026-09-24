import { getSql } from "@/lib/db";
import { env } from "@/lib/env.server";
import { ForbiddenError } from "./errors";

function adminEmailAllowlist(): string[] {
  const raw = env("ADMIN_EMAIL_ALLOWLIST") ?? env("ADMIN_EMAILS") ?? "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Admin gate for school-application PII.
 *
 * Production: set ADMIN_EMAIL_ALLOWLIST (comma-separated) so only those
 * accounts can enter. Preview / first deploy without the env: the first
 * signed-in user is bootstrapped as the sole admin.
 */
export async function requireAdmin(userId: string): Promise<void> {
  const sql = await getSql();
  const allowed = adminEmailAllowlist();

  if (allowed.length > 0) {
    const users = await sql<{ email: string }>`
      select email from "user" where id = ${userId}
    `;
    const email = (users[0]?.email ?? "").trim().toLowerCase();
    if (!email || !allowed.includes(email)) {
      throw new ForbiddenError();
    }
    await sql`
      insert into admins (user_id)
      values (${userId})
      on conflict (user_id) do nothing
    `;
    return;
  }

  await sql`
    insert into admins (user_id)
    select ${userId}
    where not exists (select 1 from admins)
  `;
  const mine = await sql<{ user_id: string }>`
    select user_id from admins where user_id = ${userId}
  `;
  if (mine.length === 0) {
    throw new ForbiddenError();
  }
}
