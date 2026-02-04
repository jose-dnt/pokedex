import { endSession } from '@/lib/sessions';

export async function POST() {

    await endSession();

    return Response.json({ ok: true });
}
