"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Fav } from '@/types';
import { getFavs, addFav, removeFav } from '@/lib/api/favs';
import { authLogin, authRegister, authLogout } from '@/lib/api/auth';

interface UserContextType {
    user: User | null;
    favorites: Fav[];
    login: (username: string, password: string) => void;
    register: (username: string, password: string) => void;
    logout: () => void;
    toggleFavorite: (fav: { pkmn_id: number, pkmn_name: string }) => void;
    isFavorite: (id: number) => boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [favorites, setFavorites] = useState<Fav[]>([]);

    useEffect(() => {
        async function loadUser() {

            const res = await fetch("/api/me");
            if (!res.ok) return;

            const user = await res.json();
            if (!user) return;

            setUser(user);
            setFavorites(await getFavs() ?? []);
        }
        loadUser();
    }, []);

    async function login(username: string, password: string) {
        const user = await authLogin(username, password);
        if (!user) {
            alert("This account doesn't exist!");
            return;
        };
        setUser(user);
        setFavorites(await getFavs() ?? []);
    }

    async function register(username: string, password: string) {
        const user = await authRegister(username, password);
        if (!user) {
            alert("An account with that username already exists!");
            return;
        };
        setUser(user);
        setFavorites(await getFavs() ?? []);
    }

    async function logout() {
        authLogout();
        setUser(null);
        setFavorites([]);
    }

    async function toggleFavorite(fav: Fav) {
        if (!user) return
        if (favorites.some(f => f.pkmn_id === fav.pkmn_id)) {
            setFavorites(favorites.filter(f => f.pkmn_id !== fav.pkmn_id))
            await removeFav(fav.pkmn_id)
        } else {
            setFavorites([...favorites, { pkmn_id: fav.pkmn_id, pkmn_name: fav.pkmn_name }])
            await addFav(fav.pkmn_id, fav.pkmn_name)
        }
    }

    function isFavorite(id: number) {
        return favorites.some((f) => f.pkmn_id === id);
    }

    return (
        <UserContext.Provider
            value={{ user, favorites, login, register, logout, toggleFavorite, isFavorite }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used inside UserProvider");
    return ctx;
}
