"use client";

import { createContext, useContext, useState } from "react";
import { PokemonData } from "@/types";


interface PokemonProviderType {
    pokemon: PokemonData | null;
    goToPokemon: (pokemon : number | string) => void;
};

const PokemonContext = createContext<PokemonProviderType | null>(null);

export function PokemonProvider({ children }: { children: React.ReactNode }) {
    const [pokemon, setPokemon] = useState<PokemonData | null>(null);

    async function goToPokemon(toPokemon : number | string) {

        toPokemon = String(toPokemon).toLowerCase();
        if (!toPokemon.trim() || toPokemon === pokemon?.name || toPokemon === String(pokemon?.id)) return;

        const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${toPokemon}`
        );
        const data: PokemonData = await res.json();
        setPokemon(data);
    }

    return (
        <PokemonContext.Provider
            value={{ pokemon, goToPokemon }}
        >
            {children}
        </PokemonContext.Provider>
    );
}

export function usePokemon() {
    const ctx = useContext(PokemonContext);
    if (!ctx) throw new Error("usePokemon must be used inside PokemonProvider");
    return ctx;
}
