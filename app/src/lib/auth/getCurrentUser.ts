import { cookies } from 'next/headers';
import { getSession, deleteSession } from '@/services/sessions.server';
import { findUserById } from '@/services/users.server';
import { Session } from '@/types';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;
  if (!sessionId) return null;

  const session: Session = await getSession(sessionId);
  if (!session) return null;

  if (session.expires_at < new Date()) {
    await deleteSession(sessionId);
    cookieStore.delete("session");
    return null;
  }

  const user = await (findUserById(session.user_id))

  return user;
}
