'use server'

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import type { EventType } from '@/types/domain';

interface EventContext {
  userId: string;
  sessionId?: string;
}

export async function logUserEvent(eventType: EventType, metadata: any = {}, context?: EventContext) {
  try {
    let ctx = context;
    if (!ctx) {
      const session = await getSession();
      if (!session?.userId) return;
      ctx = { userId: session.userId, sessionId: session.sessionId };
    }

    await prisma.event.create({
      data: {
        userId: ctx.userId,
        sessionId: ctx.sessionId,
        eventType,
        metadata,
      }
    });
  } catch (err) {
    // Silently fail, logging shouldn't crash the app
    console.error('Failed to log event:', err);
  }
}
