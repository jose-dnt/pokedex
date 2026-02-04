export type SpriteType = "sprite" | "artwork" | "showdown" | "home";
export type OtherSpriteKey = "official-artwork" | "showdown" | "home";
export type StatType =
  | "hp"
  | "attack"
  | "defense"
  | "special-attack"
  | "special-defense"
  | "speed";

export interface PokemonSpritesOther {
  "official-artwork": PokemonSprites;
  home: PokemonSprites;
  showdown: PokemonSprites;
}

export interface PokemonSprites {
  front_default: string;
  back_default?: string | null;
  front_shiny?: string | null;
  back_shiny?: string | null;
  other?: PokemonSpritesOther;
}

export interface PokemonType {
  slot: number;
  type: { name: string };
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: StatType };
}

export interface PokemonData {
  id: number;
  name: string;
  sprites: PokemonSprites;
  types: PokemonType[];
  stats: PokemonStat[];
}