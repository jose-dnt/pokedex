"use client";

import { createContext, useContext, useState } from "react";
import { SpriteType } from "@/types";

interface OptionsProviderType {
    showShiny: boolean,
    toggleShowShiny: () => void;
    spriteType: SpriteType;
    setSpriteType: (spriteType : SpriteType) => void;
};

const OptionsContext = createContext<OptionsProviderType | null>(null);

export function OptionsProvider({ children }: { children: React.ReactNode }) {

    const [showShiny, setShowShiny] = useState(false);
    const [spriteType, setSpriteType] = useState<SpriteType>("sprite");

    function toggleShowShiny() {
        setShowShiny(!showShiny)
    }

    return (
        <OptionsContext.Provider
            value={{ showShiny, toggleShowShiny, spriteType, setSpriteType }}
        >
            {children}
        </OptionsContext.Provider>
    );
}

export function useOptions() {
    const ctx = useContext(OptionsContext);
    if (!ctx) throw new Error("useOptions must be used inside OptionsProvider");
    return ctx;
}
