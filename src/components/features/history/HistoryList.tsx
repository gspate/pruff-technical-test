'use client';

import * as React from 'react';
import { HistoryItemCard, type HistoryItemCardProps } from './HistoryItemCard';
import { isToday, isAfter, subDays } from 'date-fns';
import { Mail, Loader2, Check } from 'lucide-react';
import { sendHistoryEmail } from '@/app/actions/history';

type FilterType = 'today' | '7days' | '30days' | 'all';

interface HistoryListProps {
  history: HistoryItemCardProps['item'][];
}

export function HistoryList({ history }: HistoryListProps) {
  const [filter, setFilter] = React.useState<FilterType>('all');
  const [isSending, setIsSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      const res = await sendHistoryEmail();
      if (res.success) {
        setSent(true);
        setTimeout(() => setSent(false), 3000);
      } else {
        alert(res.error || 'Error enviando correo');
      }
    } catch {
      alert('Error enviando correo');
    } finally {
      setIsSending(false);
    }
  };

  const filteredHistory = React.useMemo(() => {
    const now = new Date();
    return history.filter((item) => {
      const date = new Date(item.createdAt);
      if (filter === 'today') return isToday(date);
      if (filter === '7days') return isAfter(date, subDays(now, 7));
      if (filter === '30days') return isAfter(date, subDays(now, 30));
      return true;
    });
  }, [history, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <FilterButton active={filter === 'today'} onClick={() => setFilter('today')}>Hoy</FilterButton>
        <FilterButton active={filter === '7days'} onClick={() => setFilter('7days')}>Últimos 7 días</FilterButton>
        <FilterButton active={filter === '30days'} onClick={() => setFilter('30days')}>Últimos 30 días</FilterButton>
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>Todas</FilterButton>

        <div className="flex-1" />
        <button 
          onClick={handleSendEmail} 
          disabled={isSending || sent}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all ml-auto disabled:opacity-50"
        >
          {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : sent ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
          {isSending ? 'Enviando...' : sent ? 'Enviado' : 'Enviar a mi correo'}
        </button>
      </div>

      <div className="bg-muted/30 border border-border/50 rounded-xl p-4 md:p-6 shadow-sm transition-all">
        {filteredHistory.length > 0 ? (
          <div className="space-y-4 max-h-[720px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
            {filteredHistory.map((item) => (
              <HistoryItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-[15px] font-medium">No hay búsquedas para este período.</p>
            <p className="text-sm opacity-70 mt-1">Intenta seleccionar un filtro más amplio.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active 
          ? 'bg-primary text-primary-foreground shadow-sm ring-1 ring-primary' 
          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
      }`}
    >
      {children}
    </button>
  );
}
