'use server';

import { getAuthenticatedSession } from '@/lib/auth-context';
import { createSession, setSessionCookie } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function updateProfile(data: { name?: string; email?: string }) {
  const session = await getAuthenticatedSession();
  if (!session) {
    return { success: false, error: 'No autorizado' };
  }

  try {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;

    // Si cambia el email, validar que no exista otro usuario con ese email
    if (data.email && data.email !== session.email) {
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser) {
        return { success: false, error: 'El email ya está en uso por otra cuenta' };
      }
      updateData.email = data.email;
    }

    if (Object.keys(updateData).length === 0) {
      return { success: true };
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
    });

    // Si cambió el email o el nombre, necesitamos regenerar la sesión
    if (updateData.email || updateData.name) {
      const sessionData = {
        userId: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
      const token = await createSession(sessionData);

      await setSessionCookie(token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: sessionData.expires,
        path: '/',
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const session = await getAuthenticatedSession();
  if (!session) {
    return { success: false, error: 'No autorizado' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'La contraseña actual es incorrecta' };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating password:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}
