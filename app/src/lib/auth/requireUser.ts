import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export class UnauthorizedError extends Error {
  status = 401;
};

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
};