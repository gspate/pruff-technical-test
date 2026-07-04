import { Skeleton } from '@/components/ui/skeleton';

export interface PropertyCardSkeletonProps {
  variant?: 'grid' | 'slider';
}

export function PropertyCardSkeleton({ variant = 'grid' }: PropertyCardSkeletonProps) {
  if (variant === 'slider') {
    return (
      <div className="min-w-[280px] md:min-w-[320px] flex flex-col bg-background rounded-[var(--radius)] border border-border">
        <Skeleton className="w-full aspect-4/3 rounded-none" />
        <div className="p-4 flex flex-col gap-3">
          <Skeleton className="w-3/4 h-8" />
          <Skeleton className="w-full h-4 mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background rounded-[var(--radius)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
      <Skeleton className="w-full aspect-4/3 rounded-none" />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <Skeleton className="w-3/4 h-8" />
        <Skeleton className="w-full h-4 mt-2" />
        <Skeleton className="w-2/3 h-4" />
        <Skeleton className="w-1/3 h-4 mt-auto pt-2" />
      </div>
    </div>
  );
}
