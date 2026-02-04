import 'server-only';

import pool from '@/lib/db/pool';

export async function findUserById(id: number) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id=$1',[id]);
  return rows[0] ?? null;
};

export async function findUserByUsername(username: string) {
  const { rows } = await pool.query('SELECT * FROM users WHERE username=$1',[username]);
  return rows[0] ?? null;
}

export async function addUser(username: string, password: string) {
  const { rows } = await pool.query(`
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id, username
    `,
    [username, password]
  );

  return rows[0] ?? null;
}
