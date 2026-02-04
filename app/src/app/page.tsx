"use client";

import { useState, Fragment } from "react";
import { useUser } from "@/context/UserContext";
import { usePokemon } from "@/context/PokemonContext";
import { useOptions } from "@/context/OptionsContext";
import { capitalizeFirstLetter } from "@/lib/utils";
import { StatType, SpriteType, OtherSpriteKey } from "@/types";

function GetPokemonByName() {

  const { goToPokemon } = usePokemon();
  const [name, setName] = useState("");

  function onNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextName = event.target.value;
    setName(nextName);
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-10 w-full max-w-sm px-4">
      <input
        type="text"
        placeholder="Type the pokémon's name here..."
        onChange={onNameChange}
        className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
      />
      <button
        className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={() => goToPokemon(name)}
      >
        Get
      </button>
    </div>
  );
}

function Sprites() {

  const { pokemon } = usePokemon();
  const { spriteType, showShiny } = useOptions();

  if (!pokemon) return

  const spriteTypes: Record<SpriteType, OtherSpriteKey | "sprite"> = {
    sprite: "sprite",
    artwork: "official-artwork",
    showdown: "showdown",
    home: "home",
  };

  const spriteSource =
    spriteTypes[spriteType] === "sprite"
      ? pokemon.sprites
      : pokemon.sprites.other?.[spriteTypes[spriteType]];

  const frontKey = `front_${showShiny ? "shiny" : "default"}` as const;
  const backKey = `back_${showShiny ? "shiny" : "default"}` as const;

  const spriteFront = spriteSource?.[frontKey] ?? undefined;
  const spriteBack = spriteSource?.[backKey] ?? undefined;

  return (
    <div className="mt-5 w-80 h-40 flex items-center justify-center">
      {pokemon && (
        <div className="w-40 h-40 flex items-center justify-center image-rendering-pixelated">
          <img src={spriteFront} alt={capitalizeFirstLetter(pokemon.name)} />
        </div>
      )}
      {pokemon && spriteBack && (
        <div className="w-40 h-40 flex items-center justify-center image-rendering-pixelated">
          <img src={spriteBack} alt={capitalizeFirstLetter(pokemon.name)} />
        </div>
      )}
    </div>
  );
}

function Types() {

  const { pokemon } = usePokemon();

  if (!pokemon) return

  return (
    <div className="mt-5 w-20 h-10 flex items-center justify-center">
      {pokemon.types.map((slot, index) => (
        <div
          key={index}
          className="group relative w-10 h-10 flex flex-col items-center justify-center"
        >
          <img
            width="30"
            src={`/type_icons/${slot.type.name}.png`}
            alt={capitalizeFirstLetter(slot.type.name)}
          />
          <p className="opacity-0 group-hover:opacity-100 mt-1 px-1 bg-gray-600/75 text-sm text-white rounded select-none transition-all duration-1000 ease-in-out">
            {capitalizeFirstLetter(slot.type.name)}
          </p>
        </div>
      ))}
    </div>
  );
}

function Stats() {

  const { pokemon } = usePokemon();

  if (!pokemon) return

  const statNames: Record<StatType, string> = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  };

  const baseTotal = pokemon.stats.reduce(
    (sum, s) => sum + s.base_stat,
    0
  );

  return (
    <div className="w-20 flex flex-col items-center">
      <h2 className="text-lg font-semibold">Stats:</h2>
      <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
        {pokemon.stats.map((slot, index) => (
          <Fragment key={index}>
            <p className="font-semibold">{statNames[slot.stat.name]}</p>
            <p>{slot.base_stat}</p>
          </Fragment>
        ))}
        <p className="font-semibold">Total:</p>
        <p className="font-semibold">{baseTotal}</p>
      </div>
    </div>
  );
}

function FavButton() {

  const { user, toggleFavorite, isFavorite } = useUser();
  const { pokemon } = usePokemon();

  if (!pokemon) return

  const isFav = isFavorite(pokemon.id);

  function handleFav() {
    if (!user) {
      alert("Log in to favorite pokémon!");
      return;
    };

    if (!pokemon) return;

    toggleFavorite({
      pkmn_id: pokemon.id,
      pkmn_name: pokemon.name
    });
  }

  return (
    <div className="mt-5 w-1 h-1 flex items-center justify-center">
      <div className="mt-6 group relative flex flex-col items-center justify-center">
        <button onClick={handleFav}>
          <img width="15" src={`/${isFav ? "" : "un"}fav.png`} />
        </button>
        <p className="opacity-0 w-50 mt-1 px-1 bg-gray-600/75 text-sm text-white rounded select-none pointer-events-none">
          Favorites are only available to people who have logged in!
        </p>
      </div>
    </div>
  );


}

function PokemonInfo() {

  const { pokemon } = usePokemon();

  if (!pokemon) return;

  return (
    <div className="mt-5 me-23 flex items-center">
      <div className="flex flex-col items-center justify-center">
        <div className="flex gap-3 items-center">
          <h2 className="text-xl font-semibold">
            {pokemon.id} – {capitalizeFirstLetter(pokemon.name)}
          </h2>
          <FavButton />
        </div>

        <Sprites/>
        <Types />
      </div>
      <Stats />
    </div>
  );
}

function Options() {

  const { pokemon } = usePokemon();
  const { toggleShowShiny, spriteType, setSpriteType } = useOptions();

  if (!pokemon) return

  return (
    <div>
      {pokemon &&
        (<div className="mt-12 w-30 flex items-center justify-center space-x-2 rounded-md">
          <label htmlFor="shiny" className="text-lg font-semibold text-black dark:text-white text-center">Shiny</label>
          <input type="checkbox" name="shiny" id="shiny" onChange={toggleShowShiny} />
        </div>
        )}
      <div className="mt-5 mb-10 rounded-md">
        <h3 className="mb-3 text-lg font-semibold text-black dark:text-white text-center"> Sprite type: </h3>
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 items-center">
          <input type="radio" id="sprite" name="spriteType" onChange={() => { setSpriteType("sprite") }} checked={spriteType === "sprite"} />
          <label htmlFor="sprite" className="text-sm text-black dark:text-white"> Sprite </label>
          <input type="radio" id="artwork" name="spriteType" onChange={() => { setSpriteType("artwork") }} />
          <label htmlFor="artwork" className="text-sm text-black dark:text-white"> Official artwork </label>
          <input type="radio" id="showdown" name="spriteType" onChange={() => { setSpriteType("showdown") }} />
          <label htmlFor="showdown" className="text-sm text-black dark:text-white"> Showdown </label>
          <input type="radio" id="home" name="spriteType" onChange={() => { setSpriteType("home") }} />
          <label htmlFor="home" className="text-sm text-black dark:text-white"> Home </label>
        </div>
      </div>
    </div>)
}

function Logo() {
  return (
    <div className="mt-10">
      <img width="250px" src="/logo.png"></img>
    </div>
  )
}

export default function Home() {
 

  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-zinc-50 dark:bg-black">
      <Logo />
      <GetPokemonByName />
      <div className="grid grid-cols-[1fr_auto_1fr] w-full">
        <div />
        <div className="flex justify-center">
          <PokemonInfo />
        </div>
        <div className="flex justify-start">
          <Options />
        </div>
      </div>
    </div >);
}
