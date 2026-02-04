export async function getFavs() {
    const res = await fetch(`/api/favs`);
    if (!res.ok) {
        throw new Error('Failed to get favorites');
    }
    const data = await res.json();
    return data;
};

export async function addFav(pokemonId: number, pokemonName: string) {
    const res = await fetch(`/api/favs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pokemonId, pokemonName }),
    });

    if (!res.ok) {
        throw new Error('Failed to add favorite');
    }

    return true;
};

export async function removeFav(pokemonId: number) {
    const res = await fetch(
        `/api/favs/${pokemonId}`,
        {
            method: 'DELETE',
        }
    );

    if (!res.ok) {
        throw new Error('Failed to delete favorite');
    }

    return true;
};

