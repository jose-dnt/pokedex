import { getFavs, addFav } from '@/services/favs.server';
import { increaseFavCount } from '@/services/favStats.server';
import { handleApiError } from '@/lib/api/errors';
import { requireUser } from '@/lib/auth/requireUser';

export async function GET(
    _req: Request,
) {
    try {
        const user = await requireUser();

        const { rows } = await getFavs(user.id);
        return Response.json(rows);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(
    req: Request,
) {
    try {
        const user = await requireUser();

        const { pokemonId, pokemonName } = await req.json();

        if (!pokemonId || !pokemonName) {
            return Response.json(
                { error: 'Missing fields' },
                { status: 400 }
            );
        };

        const fav = await addFav(user.id, pokemonId, pokemonName);
        await increaseFavCount(pokemonId, pokemonName)

        return Response.json(fav, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}

