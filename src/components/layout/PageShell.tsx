import * as React from 'react';
import { Navbar } from './Navbar';
import { cn } from '@/lib/utils';
import type { SessionUser } from '@/types/domain';

export interface PageShellProps {
  session: SessionUser | null;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  as?: 'div' | 'main';
  decoration?: React.ReactNode;
}

export function PageShell({
  session,
  children,
  className,
  contentClassName,
  as: Tag = 'div',
  decoration,
}: PageShellProps) {
  return (
    <div className={cn('min-h-screen bg-background pt-16', className)}>
      <Navbar session={session} />
      {decoration}
      <Tag className={cn('max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12', contentClassName)}>{children}</Tag>
    </div>
  );
}
