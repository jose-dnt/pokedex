import { newSession } from '@/lib/sessions';
import { authRegister } from '@/services/auth.server'

export async function POST(
  req: Request
) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return Response.json(
      { error: 'Missing fields' },
      { status: 400 }
    );
  }

  const user = await authRegister(username, password)
  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  await newSession(user.id);

  return Response.json(user, { status: 201 });
}