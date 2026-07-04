'use server'

import { requireUserId } from '@/lib/auth-context';
import { logUserEvent } from './events';
import { findFavorite, addFavorite, removeFavorite } from '@/lib/services/favorites';
import type { PropertyData } from '@/types/domain';

export async function toggleFavorite(property: PropertyData) {
  const { userId, sessionId } = await requireUserId();
  const externalId = property.externalId || property.url; // Fallback to URL if no ID

  const existing = await findFavorite(userId, externalId);

  if (existing) {
    await removeFavorite(existing.id);

    await logUserEvent('FAVORITE_REMOVE', { externalId, title: property.title }, { userId, sessionId });
    return { status: 'removed' };
  } else {
    await addFavorite(userId, property);

    await logUserEvent('FAVORITE_ADD', { externalId, title: property.title }, { userId, sessionId });
    return { status: 'added' };
  }
}
