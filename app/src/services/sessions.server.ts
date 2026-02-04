import 'server-only';

import crypto from 'crypto';
import pool from '@/lib/db/pool';

const SESSION_TTL_HOURS = 24;

export async function createSession(userId: number) {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(
    Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000
  );

  await pool.query(
    `INSERT INTO sessions (id, user_id, expires_at)
     VALUES ($1, $2, $3)`,
    [sessionId, userId, expiresAt]
  );

  return { sessionId, expiresAt };
}

export async function getSession(sessionId: string) {
  const { rows } = await pool.query(
    `SELECT *
     FROM sessions
     WHERE id = $1 AND expires_at > now()`,
    [sessionId]
  );

  return rows[0] ?? null;
}

export async function deleteSession(sessionId: string) {
  await pool.query(
    'DELETE FROM sessions WHERE id = $1',
    [sessionId]
  );
}

export async function deleteSessionsForUser(userId: number) {
  await pool.query(
    'DELETE FROM sessions WHERE user_id = $1',
    [userId]
  );
}
