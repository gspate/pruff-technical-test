import { cn } from '@/lib/utils';
import type { SelectOption } from '@/constants/labels';

export interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
}

export function FilterSelect({ value, onChange, options, disabled, className }: FilterSelectProps) {
  return (
    <div className={cn('flex-1 w-full md:border-r border-border', className)}>
      <select
        className="w-full h-12 bg-transparent text-[15px] font-medium text-foreground focus-visible:outline-none cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
