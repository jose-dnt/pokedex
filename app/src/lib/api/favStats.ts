export async function getTopFavs(topNumber: number) {
    const res = await fetch(`/api/fav_stats/${topNumber}`);
    if (!res.ok) return null;

    const data = res.json();
    if (!data) return null;

    return data;
}