import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps {
  initial: string;
  size?: 'sm' | 'lg';
  variant?: 'solid' | 'subtle';
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'w-8 h-8 rounded-full text-sm font-semibold',
  lg: 'w-16 h-16 rounded-2xl shrink-0 text-2xl font-bold',
};

const VARIANT_CLASSES: Record<NonNullable<AvatarProps['variant']>, string> = {
  solid: 'bg-primary text-primary-foreground',
  subtle: 'bg-primary/10 text-primary',
};

export function Avatar({ initial, size = 'sm', variant = 'solid' }: AvatarProps) {
  return (
    <div className={cn('flex items-center justify-center', SIZE_CLASSES[size], VARIANT_CLASSES[variant])}>
      {initial}
    </div>
  );
}
