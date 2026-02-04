import { getUsers, findUserByUsername, addUser } from '@/services/users.server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (username) {
    const user = await findUserByUsername(username);
    return Response.json(user);
  }

  const { rows } = await getUsers();
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();

  const { username, password } = body;

  if (!username || !password) {
    return Response.json(
      { error: 'Missing fields' },
      { status: 400 }
    );
  }

  const user = await addUser(username, password);

  return Response.json(user, { status: 201 });
}
