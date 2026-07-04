'use client';

import * as React from 'react';
import { Heart, History } from 'lucide-react';
import Link from 'next/link';
import { UserDropdown } from './UserDropdown';
import { cn } from '@/lib/utils';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import type { SessionUser } from '@/types/domain';

interface NavbarProps {
  session: SessionUser | null;
}

export function Navbar({ session }: NavbarProps) {
  const isVisible = useScrollDirection();

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm transition-transform duration-300",
      isVisible ? "translate-y-0" : "-translate-y-full"
    )}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg?v=13" alt="PropertyFinder" className="h-16 md:h-16 w-auto object-contain" />
        </Link>

        {session?.email ? (
          <div className="flex items-center gap-1 md:gap-2">
            <Link href="/history" className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-full" title="Historial">
              <History className="w-5 h-5" />
            </Link>
            <Link href="/favorites" className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-full" title="Mis Favoritos">
              <Heart className="w-5 h-5" />
            </Link>
            <div className="ml-2 border-l border-border pl-2 md:pl-4">
              <UserDropdown email={session.email} name={session.name} />
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <a href="/login" className="text-sm font-medium hover:underline">Ingresar</a>
          </div>
        )}
      </div>
    </header>
  );
}
