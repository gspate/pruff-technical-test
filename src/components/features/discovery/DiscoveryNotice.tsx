import { MapPin } from 'lucide-react';

export interface DiscoveryNoticeProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function DiscoveryNotice({ message, actionLabel, onAction }: DiscoveryNoticeProps) {
  return (
    <div className="mt-8 text-center text-muted-foreground bg-muted/20 py-8 px-4 rounded-[var(--radius)] border border-border/30 flex flex-col items-center justify-center">
      <MapPin className="w-8 h-8 mb-3 text-primary/60" />
      <p className="text-sm md:text-base font-medium mb-4 max-w-md">{message}</p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="inline-flex items-center justify-center h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-[var(--radius)] text-sm font-semibold transition-all shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
