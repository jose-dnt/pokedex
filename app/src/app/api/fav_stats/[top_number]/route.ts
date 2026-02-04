import { getMostFav } from "@/services/favStats.server";

export async function GET(
    _req: Request,
    context: { params: Promise<{ top_number: string }> }
) {

    const { top_number } = await context.params;

    const topNumber = Number(top_number);

    if (Number.isNaN(topNumber)) {
        return Response.json(
            { error: 'Invalid param' },
            { status: 400 }
        );
    }

    const { rows } = await getMostFav(topNumber)

    return Response.json(rows);

}