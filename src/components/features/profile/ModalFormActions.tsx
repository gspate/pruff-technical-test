import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ModalFormActionsProps {
  onCancel: () => void;
  submitLabel: string;
  loading: boolean;
  disabled: boolean;
}

export function ModalFormActions({ onCancel, submitLabel, loading, disabled }: ModalFormActionsProps) {
  return (
    <div className="pt-2 flex justify-end gap-3">
      <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      <Button type="submit" disabled={disabled}>
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {submitLabel}
      </Button>
    </div>
  );
}
