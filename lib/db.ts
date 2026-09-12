import { sql } from "@vercel/postgres";

/**
 * Guarda as contas de utilizador (email + palavra-passe encriptada) numa
 * base de dados Vercel Postgres. Para isto funcionar em produção:
 *
 *  1. No dashboard da Vercel, abre o teu projeto -> separador "Storage" ->
 *     "Create Database" -> "Postgres", e liga-a a este projeto.
 *     Isto injeta automaticamente a variável de ambiente POSTGRES_URL
 *     (entre outras) que o `@vercel/postgres` usa sozinho.
 *  2. Define também a variável NEXTAUTH_SECRET (ver lib/auth.ts / README).
 *
 * Não é preciso correr nenhum SQL manualmente — as tabelas são criadas
 * automaticamente (se ainda não existirem) da primeira vez que são usadas.
 */

let tablesReady: Promise<unknown> | null = null;

export function ensureTables() {
  if (!tablesReady) {
    tablesReady = Promise.all([
      sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `,
      sql`
        CREATE TABLE IF NOT EXISTS watch_progress (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          item_slug TEXT NOT NULL,
          episode_key TEXT,
          current_time DECIMAL NOT NULL DEFAULT 0,
          duration DECIMAL NOT NULL DEFAULT 0,
          progress_percent DECIMAL NOT NULL DEFAULT 0,
          last_watched TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (user_id, item_slug, episode_key)
        );
      `,
      sql`
        CREATE TABLE IF NOT EXISTS watchlist (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          item_slug TEXT NOT NULL,
          added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (user_id, item_slug)
        );
      `,
    ]);
  }
  return tablesReady;
}

// ============================================================================
// Users
// ============================================================================

export type DbUser = {
  id: number;
  email: string;
  password_hash: string;
};

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  await ensureTables();
  const { rows } = await sql<DbUser>`
    SELECT id, email, password_hash FROM users WHERE email = ${email} LIMIT 1;
  `;
  return rows[0] ?? null;
}

export async function createUser(email: string, passwordHash: string): Promise<DbUser> {
  await ensureTables();
  const { rows } = await sql<DbUser>`
    INSERT INTO users (email, password_hash)
    VALUES (${email}, ${passwordHash})
    RETURNING id, email, password_hash;
  `;
  return rows[0];
}

// ============================================================================
// Watch Progress
// ============================================================================

export type DbWatchProgress = {
  id: number;
  user_id: number;
  item_slug: string;
  episode_key: string | null;
  current_time: number;
  duration: number;
  progress_percent: number;
  last_watched: Date;
};

export async function saveWatchProgress(
  userId: number,
  itemSlug: string,
  currentTime: number,
  duration: number,
  episodeKey?: string
): Promise<DbWatchProgress> {
  await ensureTables();
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const { rows } = await sql<DbWatchProgress>`
    INSERT INTO watch_progress (user_id, item_slug, episode_key, current_time, duration, progress_percent, last_watched)
    VALUES (${userId}, ${itemSlug}, ${episodeKey ?? null}, ${currentTime}, ${duration}, ${progressPercent}, NOW())
    ON CONFLICT (user_id, item_slug, episode_key) DO UPDATE
    SET current_time = ${currentTime}, duration = ${duration}, progress_percent = ${progressPercent}, last_watched = NOW()
    RETURNING *;
  `;
  return rows[0];
}

export async function getWatchProgress(
  userId: number,
  itemSlug: string,
  episodeKey?: string
): Promise<DbWatchProgress | null> {
  await ensureTables();
  const { rows } = await sql<DbWatchProgress>`
    SELECT * FROM watch_progress
    WHERE user_id = ${userId} AND item_slug = ${itemSlug} AND episode_key = ${episodeKey ?? null}
    LIMIT 1;
  `;
  return rows[0] ?? null;
}

export async function getUserWatchProgress(userId: number): Promise<DbWatchProgress[]> {
  await ensureTables();
  const { rows } = await sql<DbWatchProgress>`
    SELECT * FROM watch_progress
    WHERE user_id = ${userId}
    ORDER BY last_watched DESC;
  `;
  return rows;
}

export async function deleteWatchProgress(
  userId: number,
  itemSlug: string,
  episodeKey?: string
): Promise<void> {
  await ensureTables();
  await sql`
    DELETE FROM watch_progress
    WHERE user_id = ${userId} AND item_slug = ${itemSlug} AND episode_key = ${episodeKey ?? null};
  `;
}

// ============================================================================
// Watchlist ("A Minha Razonne+")
// ============================================================================

export type DbWatchlistItem = {
  id: number;
  user_id: number;
  item_slug: string;
  added_at: Date;
};

export async function addToWatchlist(
  userId: number,
  itemSlug: string
): Promise<DbWatchlistItem> {
  await ensureTables();
  const { rows } = await sql<DbWatchlistItem>`
    INSERT INTO watchlist (user_id, item_slug)
    VALUES (${userId}, ${itemSlug})
    ON CONFLICT (user_id, item_slug) DO UPDATE
    SET added_at = NOW()
    RETURNING *;
  `;
  return rows[0];
}

export async function removeFromWatchlist(userId: number, itemSlug: string): Promise<void> {
  await ensureTables();
  await sql`
    DELETE FROM watchlist
    WHERE user_id = ${userId} AND item_slug = ${itemSlug};
  `;
}

export async function isInWatchlist(userId: number, itemSlug: string): Promise<boolean> {
  await ensureTables();
  const { rows } = await sql`
    SELECT 1 FROM watchlist
    WHERE user_id = ${userId} AND item_slug = ${itemSlug}
    LIMIT 1;
  `;
  return rows.length > 0;
}

export async function getUserWatchlist(userId: number): Promise<DbWatchlistItem[]> {
  await ensureTables();
  const { rows } = await sql<DbWatchlistItem>`
    SELECT * FROM watchlist
    WHERE user_id = ${userId}
    ORDER BY added_at DESC;
  `;
  return rows;
}

// ============================================================================
// Continue Watching (Combina progresso com catálogo)
// ============================================================================

export type ContinueWatchingItem = DbWatchProgress & {
  title?: string;
};

export async function getContinueWatching(userId: number): Promise<ContinueWatchingItem[]> {
  await ensureTables();
  const { rows } = await sql<DbWatchProgress>`
    SELECT * FROM watch_progress
    WHERE user_id = ${userId}
    ORDER BY last_watched DESC
    LIMIT 20;
  `;
  return rows;
}
