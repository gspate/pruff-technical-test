import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
  onChangeClick: () => void;
}

export function SettingRow({ icon, label, value, valueClassName, onChangeClick }: SettingRowProps) {
  return (
    <div className="w-full flex items-center justify-between p-4 md:px-6 transition-colors text-left">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-colors">
          {icon}
        </div>
        <div>
          <p className="font-medium text-foreground">{label}</p>
          <p className={cn('text-sm text-muted-foreground mt-0.5', valueClassName)}>{value}</p>
        </div>
      </div>
      <button
        onClick={onChangeClick}
        className="text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
      >
        Cambiar
      </button>
    </div>
  );
}
