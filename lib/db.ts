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
 * Não é preciso correr nenhum SQL manualmente — a tabela é criada
 * automaticamente (se ainda não existir) da primeira vez que alguém tenta
 * criar conta ou entrar.
 */

let tableReady: Promise<unknown> | null = null;

export function ensureUsersTable() {
  if (!tableReady) {
    tableReady = sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
  }
  return tableReady;
}

export type DbUser = {
  id: number;
  email: string;
  password_hash: string;
};

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  await ensureUsersTable();
  const { rows } = await sql<DbUser>`
    SELECT id, email, password_hash FROM users WHERE email = ${email} LIMIT 1;
  `;
  return rows[0] ?? null;
}

export async function createUser(email: string, passwordHash: string): Promise<DbUser> {
  await ensureUsersTable();
  const { rows } = await sql<DbUser>`
    INSERT INTO users (email, password_hash)
    VALUES (${email}, ${passwordHash})
    RETURNING id, email, password_hash;
  `;
  return rows[0];
}
