import { handleApiError } from "@/lib/api/errors";
import { requireUser } from "@/lib/auth/requireUser";
import { removeFav } from "@/services/favs.server";
import { decreaseFavCount } from "@/services/favStats.server";

export async function DELETE(
    _req: Request,
    context: { params: Promise<{ pokemonId: string }> }
) {

    try {
        const user = await requireUser()

        const { pokemonId } = await context.params;

        await removeFav(user.id, pokemonId);
        await decreaseFavCount(pokemonId)

        return Response.json({ ok: true });
    } catch (error) {
        return handleApiError(error);
    }
}