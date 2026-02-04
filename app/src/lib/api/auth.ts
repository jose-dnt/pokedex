import { User } from "@/types";

export async function authRegister(username: string, password: string): Promise<User | null> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  console.log(data)
  return data;
}

export async function authLogin(username: string, password: string): Promise<User | null> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function authLogout(): Promise<boolean> {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) return false;
  return true;
}

