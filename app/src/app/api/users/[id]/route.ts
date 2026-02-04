import { findUserById } from '@/services/users.server';


export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const userId = Number(id);

  if (!Number.isInteger(userId)) {
    return Response.json(
      { error: 'Invalid user id' },
      { status: 400 }
    );
  }

  const user = await findUserById(userId);

  return Response.json(user);
}