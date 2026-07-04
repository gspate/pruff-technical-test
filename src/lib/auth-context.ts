import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import type { SessionPayload } from '@/types/domain';

// Para server actions que deben abortar con throw si no hay sesión (ej. favorites, search).
export async function requireUserId(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session?.userId) throw new Error('No autorizado');
  return session;
}

// Para server components (páginas) que deben redirigir a /login si no hay sesión.
export async function requirePageSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session?.userId) redirect('/login');
  return session;
}

// Para server actions que devuelven {success,error} en vez de lanzar (ej. profile).
export async function getAuthenticatedSession(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session?.userId) return null;
  return session;
}
