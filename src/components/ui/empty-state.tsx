import * as React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  tone?: 'neutral' | 'danger';
  children?: React.ReactNode;
}

const TONE_CLASSES: Record<NonNullable<EmptyStateProps['tone']>, string> = {
  neutral: 'bg-muted/30 border-border/50',
  danger: 'bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30',
};

export function EmptyState({ icon, title, description, tone = 'neutral', children }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-24 px-4 rounded-[var(--radius)] border',
        TONE_CLASSES[tone]
      )}
    >
      {icon}
      <h2 className="text-[20px] font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md text-[14px] leading-relaxed mb-6">{description}</p>
      {children}
    </div>
  );
}

export interface DashedEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  size?: 'md' | 'lg';
  children?: React.ReactNode;
}

export function DashedEmptyState({ icon, title, description, size = 'md', children }: DashedEmptyStateProps) {
  return (
    <div
      className={cn(
        'bg-muted/30 border border-border/50 border-dashed rounded-xl text-center flex flex-col items-center',
        size === 'lg' ? 'p-16' : 'p-12'
      )}
    >
      {icon}
      <h3 className={cn('font-medium text-foreground', size === 'lg' ? 'text-xl mb-2' : 'text-lg mb-1')}>{title}</h3>
      <p className={cn('text-muted-foreground max-w-md mx-auto', size === 'lg' ? 'mb-8' : 'text-sm mb-6')}>
        {description}
      </p>
      {children}
    </div>
  );
}
