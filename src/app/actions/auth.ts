'use server'

import { prisma } from '@/lib/prisma';
import { createSession, setSessionCookie, clearSessionCookie } from '@/lib/session';
import { logUserEvent } from './events';
import { isValidEmail } from '@/lib/validators';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Debes ingresar tu correo electrónico y tu contraseña.' };
  }

  if (!isValidEmail(email)) {
    return { error: 'El formato del correo electrónico no es válido.' };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: 'El correo electrónico o la contraseña son incorrectos.' };
  }

  const sessionId = crypto.randomUUID();
  const sessionData = { userId: user.id, email: user.email, name: user.name, sessionId };
  const token = await createSession(sessionData);

  await setSessionCookie(token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  await logUserEvent('LOGIN', { method: 'credentials' }, { userId: user.id, sessionId });

  redirect('/');
}

export async function register(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password || !name) {
    return { error: 'Debes ingresar tu nombre, correo electrónico y contraseña.' };
  }

  if (!isValidEmail(email)) {
    return { error: 'El formato del correo electrónico no es válido.' };
  }

  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'Ya existe una cuenta con este correo electrónico.' };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  });

  const sessionId = crypto.randomUUID();
  const sessionData = { userId: user.id, email: user.email, name: user.name, sessionId };
  const token = await createSession(sessionData);

  await setSessionCookie(token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  await logUserEvent('LOGIN', { method: 'register' }, { userId: user.id, sessionId });

  redirect('/');
}

export async function logout() {
  await clearSessionCookie();
  redirect('/login');
}
