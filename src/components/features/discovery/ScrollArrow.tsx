import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ScrollArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

export function ScrollArrow({ direction, onClick }: ScrollArrowProps) {
  const isLeft = direction === 'left';
  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute top-0 bottom-0 w-16 z-10 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity cursor-pointer disabled:opacity-0',
        isLeft
          ? 'left-0 bg-gradient-to-r from-background via-background/80 to-transparent'
          : 'right-0 bg-gradient-to-l from-background via-background/80 to-transparent'
      )}
      aria-label={isLeft ? 'Scroll left' : 'Scroll right'}
    >
      <div className="bg-background border border-border shadow-md rounded-full p-2 text-foreground hover:bg-muted transition-colors">
        {isLeft ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
      </div>
    </button>
  );
}
