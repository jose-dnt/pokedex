import 'server-only';

import pool from "@/lib/db/pool";

export async function getMostFav(topNumber: number) {
  return await pool.query(`
    SELECT * FROM pkmn_fav_stats
    ORDER BY fav_count DESC
    LIMIT $1;
    `, [topNumber]
  )
}

export async function increaseFavCount(pokemonId: string, pokemonName: string) {
  await pool.query(
    `INSERT INTO pkmn_fav_stats (pkmn_id, pkmn_name, fav_count)
VALUES($1, $2, 1)
ON CONFLICT(pkmn_id)
DO UPDATE SET fav_count = pkmn_fav_stats.fav_count + 1
  `,
    [pokemonId, pokemonName]
  );
};

export async function decreaseFavCount(pokemonId: string) {
  await pool.query(`
    UPDATE pkmn_fav_stats
SET fav_count = fav_count - 1
WHERE pkmn_id = $1;
`, [pokemonId])
};


