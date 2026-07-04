import { prisma } from '@/lib/prisma';
import type { SearchFilters } from '@/types/domain';

export function recordSearch(userId: string, params: SearchFilters, resultsCount: number) {
  return prisma.searchHistory.create({
    data: {
      userId,
      queryText: `Búsqueda en ${params.comuna || params.code}`,
      filters: params as any,
      resultsCount,
    },
  });
}

export function listSearchHistory(userId: string) {
  return prisma.searchHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}
