'use server';

import { requireUserId } from '@/lib/auth-context';
import { listSearchHistory } from '@/lib/services/search-history';
import { Resend } from 'resend';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { describeSearch, parseJson } from '@/lib/formatters';
import { buildReportHtml } from '@/lib/services/report';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function sendHistoryEmail() {
  try {
    const session = await requireUserId();
    const history = await listSearchHistory(session.userId);

    if (history.length === 0) {
      return { success: false, error: 'No tienes historial para enviar.' };
    }

    // Build exactly the same HTML that the daily cron job sends
    const htmlContent = buildReportHtml(
      { name: session.name, email: session.email },
      new Date(),
      history
    );

    if (!process.env.RESEND_API_KEY) {
      console.warn('Simulando envío de correo (Falta RESEND_API_KEY)');
      return { success: true, message: 'Correo simulado (Falta RESEND_API_KEY en .env)' };
    }

    const result = await resend.emails.send({
      from: 'Gustavo Gonzalez <gustavo.gonzalez@rentario.cl>',
      to: session.email,
      subject: 'Tu Historial de Búsquedas - Pruff',
      html: htmlContent,
    });

    if (result.error) {
      console.error('Error enviando correo Resend:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Excepción enviando correo:', error);
    return { success: false, error: error.message || 'Error interno al enviar el correo' };
  }
}
