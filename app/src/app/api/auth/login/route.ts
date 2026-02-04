import { newSession } from '@/lib/sessions';
import { authLogin } from '@/services/auth.server'

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = await authLogin(username, password);
  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  await newSession(user.id);

  return Response.json({
    id: user.id,
    username: user.username,
  });
}
