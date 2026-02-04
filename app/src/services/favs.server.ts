import 'server-only';

import pool from "@/lib/db/pool";

export async function getFavs(userId: string) {
  return pool.query('SELECT pkmn_id, pkmn_name FROM favs WHERE user_id=$1',
    [userId]
  );
};

export async function addFav(userId: string, pokemonId: string, pokemonName: string) {
  const { rows } = await pool.query(
    'INSERT INTO favs (user_id, pkmn_id, pkmn_name) VALUES ($1, $2, $3) RETURNING pkmn_id, pkmn_name',
    [userId, pokemonId, pokemonName]
  );
  return rows[0] ?? null;
};

export async function removeFav(userId: string, pokemonId: string) {
  return pool.query(
    'DELETE FROM favs WHERE user_id=$1 AND pkmn_id=$2',
    [userId, pokemonId]
  );
};


