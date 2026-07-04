'use client';

import * as React from 'react';
import { LogOut, ChevronDown, User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { useClickOutside } from '@/hooks/useClickOutside';
import { getDisplayName, getInitial } from '@/lib/formatters';

interface UserDropdownProps {
  email: string;
  name?: string | null;
}

export function UserDropdown({ email, name }: UserDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const displayName = getDisplayName({ name, email });
  const initial = getInitial(displayName);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-muted p-1 pr-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer border border-transparent hover:border-border"
      >
        <Avatar initial={initial} />
        <span className="text-sm font-semibold hidden md:block text-foreground truncate max-w-[150px]">
          {displayName}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-[var(--radius)] shadow-[var(--shadow-hover)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3 border-b border-border md:hidden">
            <p className="text-sm font-medium truncate">Bienvenido, {displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
          <div className="p-1 flex flex-col">
            <a href="/profile" className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
              <User className="w-4 h-4 mr-2" />
              Mi Perfil
            </a>
            <button 
              type="button" 
              onClick={async () => {
                setIsOpen(false);
                await fetch('/api/logout', { method: 'POST' });
                window.location.href = '/login';
              }}
              className="flex items-center w-full mt-1 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
