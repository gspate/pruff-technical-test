import { prisma } from '@/lib/prisma';
import type { PropertyData } from '@/types/domain';

export function findFavorite(userId: string, externalId: string) {
  return prisma.favorite.findFirst({
    where: { userId, externalId },
  });
}

export function addFavorite(userId: string, property: PropertyData) {
  const externalId = property.externalId || property.url;
  return prisma.favorite.create({
    data: {
      userId,
      portal: 'portalinmobiliario',
      externalId,
      url: property.url,
      snapshot: property as any,
    },
  });
}

export function removeFavorite(favoriteId: string) {
  return prisma.favorite.delete({
    where: { id: favoriteId },
  });
}

export async function listFavoriteIds(userId: string): Promise<string[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { externalId: true },
  });
  return favorites.map((f) => f.externalId);
}

export function listFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}
