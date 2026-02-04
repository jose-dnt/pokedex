import { createSession, deleteSession, deleteSessionsForUser } from "@/services/sessions.server";
import { cookies } from "next/headers";

export async function newSession(userId: number) {

  await deleteSessionsForUser(userId);
  
  const { sessionId, expiresAt } = await createSession(userId);

  const cookieStore = await cookies();
  cookieStore.set('session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

export async function endSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (sessionId) {
    await deleteSession(sessionId);
  }

  cookieStore.delete('session');
}