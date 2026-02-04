"use client"

import "./globals.css";
import { useEffect, useRef, useState } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import { PokemonProvider, usePokemon } from "@/context/PokemonContext"
import { OptionsProvider } from "@/context/OptionsContext";
import { capitalizeFirstLetter } from "@/lib/utils";
import { getTopFavs } from "@/lib/api/favStats";
import { Fav } from "@/types";

function AuthPanel() {

  const [mode, setMode] = useState<"login" | "register" | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { user, login, register, logout } = useUser()

  function onUsername(event: React.ChangeEvent<HTMLInputElement>) {
    const newUsername = event.target.value; setUsername(newUsername);
  }

  function onPassword(event: React.ChangeEvent<HTMLInputElement>) {
    const newPassword = event.target.value; setPassword(newPassword);
  }

  async function handleAuth() {
    if (!username.trim() || !password.trim()) return;

    mode === "login" ? login(username, password) : register(username, password);

  }

  const panelRef = useRef<HTMLDivElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const registerButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if ((panelRef.current && loginButtonRef.current && registerButtonRef.current)
        && (!panelRef.current.contains(target) && !loginButtonRef.current.contains(target) && !registerButtonRef.current.contains(target))) {
        setMode(null)
      }
    } document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    }
  }, [])

  return (
    <div className="w-full h-15 flex px-2 py-2 flex-col items-end">
      {/* Buttons */}
      {!user && <>
        <div className="flex justify-center gap-4">
          <button ref={loginButtonRef}
            onClick={() => setMode(mode === "login" ? null : "login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" >
            Log in
          </button>
          <button
            ref={registerButtonRef}
            onClick={(e) => { e.stopPropagation(); setMode(mode === "register" ? null : "register"); }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition" >
            Register
          </button>
        </div>
        {/* Panel */}
        <div
          ref={panelRef}
          onClick={(e) => e.stopPropagation()}
          className={`mt-4 z-2 transition-all duration-300  ease-out ${mode ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`} >
          {mode &&
            (<div className="bg-white dark:bg-gray-900 border rounded-md p-4 space-y-3 shadow">
              <h3 className="text-lg font-semibold text-center">
                {mode === "login" ? "Log in" : "Register"}
              </h3>
              <input type="text" placeholder="Username" className="w-full p-2 border rounded-md" onChange={onUsername} />
              <input type="password" placeholder="Password" className="w-full p-2 border rounded-md" onChange={onPassword} />
              <button
                className={`w-full py-2 rounded-md text-white transition ${mode === "login" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`}
                onClick={handleAuth} > {mode === "login" ? "Log in" : "Register"}
              </button>
            </div>)}
        </div>
      </>}
      {
        user &&
        <div
          className="flex justify-center items-center gap-5">
          {user.username}
          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition" >
            Log out
          </button>
        </div>
      }
    </div >);
}

function FavPokemon({ fav, index }: { fav: Fav, index?: number }) {

  const { pokemon, goToPokemon } = usePokemon();

  const defaultColor = `${pokemon?.id === fav.pkmn_id
    ? "bg-zinc-700 hover:bg-zinc-800 scale-105"
    : "bg-zinc-500 hover:bg-zinc-600"}`

  const topColors: Record<number, string> = {
    0: `${pokemon?.id === fav.pkmn_id
      ? "bg-yellow-400 hover:bg-yellow-500 scale-105"
      : "bg-yellow-500 hover:bg-yellow-600"}`,
    1: `${pokemon?.id === fav.pkmn_id
      ? "bg-slate-300 hover:bg-slate-400 scale-105"
      : "bg-slate-400 hover:bg-slate-500"}`,
    2: `${pokemon?.id === fav.pkmn_id
      ? "bg-yellow-600 hover:bg-yellow-700 scale-105"
      : "bg-yellow-700 hover:bg-yellow-800"}`,
  };

  let color = defaultColor;

  if (index !== undefined && index >= 0 && index <= 2) {
    color = topColors[index]
  }

  return (
    <button
      className={"text-white px-2 rounded-md transition duration-300 ease-in-out hover:scale-110 " + color}
      onClick={() => goToPokemon(fav.pkmn_id)}
    >
      {index == null ? `${fav.pkmn_id} – ${capitalizeFirstLetter(fav.pkmn_name)}` : `${index + 1}.  ${capitalizeFirstLetter(fav.pkmn_name)} – ${fav.fav_count} ❤︎`}
    </button>
  );
}

function Favs() {

  const { favorites } = useUser();

  return (
    <aside className={`h-screen w-64 p-4`}>
      <h2 className="font-semibold mb-2 mt-5">Favorite Pokémon:</h2>
      {favorites.length > 0 ?
        <ul className={"flex flex-col gap-2 bg-zinc-200 rounded-md p-3"}>
          {
            favorites.map((fav, index) => (
              <li key={index}>
                <FavPokemon fav={fav} />
              </li>
            ))
          }
        </ul>
        : <p>You have no favorited pokémon!</p>}
    </aside>
  );
}

function TopFavs() {

  const [topFavs, setTopFavs] = useState<Fav[] | null>(null);

  const TOP_NUMBER = 10;

  useEffect(() => {
    async function load() {
      const mostFavs: Fav[] = await getTopFavs(TOP_NUMBER);
      setTopFavs(mostFavs);
    };
    load();
  }, [])

  return (
    <aside className={`h-screen w-64 p-4`}>
      <h2 className="font-semibold mb-2 mt-5">Most Favorited Pokémon:</h2>
      {topFavs ?
        <ul className={"flex flex-col gap-2 bg-zinc-200 rounded-md p-3"}>
          {
            topFavs.map((fav, index) => (
              <li key={index}>
                < FavPokemon fav={fav} index={index} />
              </li>
            ))
          }
        </ul>
        : <p>No pokémon found!</p>}
    </aside>
  );
}

export default function ClientLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <UserProvider>
      <PokemonProvider>
        <OptionsProvider>
          <AuthPanel />
          <div className="flex">
            <Favs />
            <main className="flex-1 bg-zinc-50 dark:bg-black">
              {children}
            </main>
            <TopFavs />
          </div>
        </OptionsProvider>
      </PokemonProvider>
    </UserProvider>
  );
}