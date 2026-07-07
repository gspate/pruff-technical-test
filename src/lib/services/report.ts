import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { format, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { describeSearch, parseJson } from '@/lib/formatters';

// Inicializar Resend. Si no hay API KEY, no fallará al instanciar, pero sí al enviar.
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

// Extraer correos de destino desde variable de entorno, con fallback a los del requerimiento.
const DESTINATION_EMAILS = process.env.REPORT_DESTINATION_EMAIL
  ? process.env.REPORT_DESTINATION_EMAIL.split(',')
  : ['juanjose@pruff.com', 'ramiro.galvez@pruff.com', 'gustavo.gspate@gmail.com'];

interface ReportUser {
  name?: string | null;
  email: string;
}

interface ReportSearch {
  filters: unknown;
  queryText: string | null;
  createdAt: Date;
  resultsCount: number;
}

export interface DailyReportResult {
  userId: string;
  email: string;
  status: 'sent' | 'skipped' | 'error';
  reason?: string;
  error?: string;
}

export function buildReportHtml(user: ReportUser, today: Date, searches: ReportSearch[]): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #000000ff;">Reporte Diario de Búsquedas</h2>
      <p><strong>Usuario:</strong> ${user.name || 'Sin nombre'} (${user.email})</p>
      <p><strong>Fecha del reporte:</strong> ${format(today, "d 'de' MMMM yyyy", { locale: es })}</p>
      <p><strong>Total de Búsquedas de AYER:</strong> ${searches.length}</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <ul style="padding-left: 20px;">
        ${searches
          .map((s) => {
            const filters = parseJson<{ operation?: string; propertyType?: string; comuna?: string }>(s.filters);
            const { operation, propertyType, location } = describeSearch(filters, s.queryText);
            const time = format(new Date(s.createdAt), 'HH:mm', { locale: es });
            return `<li style="margin-bottom: 10px;">[${time}] ${operation} de ${propertyType} en <strong>${location}</strong> (${s.resultsCount} resultados)</li>`;
          })
          .join('')}
      </ul>
      <p style="font-size: 12px; color: #888; margin-top: 30px;">
        Este es un correo automático generado por PropertyFinder para prueba técnica Pruff  .
      </p>
    </div>
  `;
}

export async function runDailyReport(): Promise<{ message: string; results?: DailyReportResult[] }> {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const start = startOfDay(yesterday);
  const end = endOfDay(yesterday);

  // Generar la fecha truncada (00:00:00) para usar como llave única de idempotencia
  // Mantenemos "today" como llave porque el reporte se envía "hoy" en la mañana.
  const reportDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  const yesterdaySearches = await prisma.searchHistory.findMany({
    where: {
      createdAt: { gte: start, lte: end },
    },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });

  if (yesterdaySearches.length === 0) {
    return { message: 'No hay búsquedas registradas en el día de ayer. No se enviarán reportes.' };
  }

  const searchesByUser: Record<string, { user: ReportUser; searches: typeof yesterdaySearches }> = {};
  for (const search of yesterdaySearches) {
    if (!searchesByUser[search.userId]) {
      searchesByUser[search.userId] = { user: search.user, searches: [] };
    }
    searchesByUser[search.userId].searches.push(search);
  }

  const results: DailyReportResult[] = [];

  for (const userId in searchesByUser) {
    const { user, searches } = searchesByUser[userId];

    try {
      // Bloqueo de Idempotencia: Intentar insertar el registro en DB.
      // Si el usuario ya fue procesado hoy, esto lanzará un error P2002 (Unique Constraint Failed)
      const log = await prisma.dailyReportLog.create({
        data: {
          userId,
          reportDate,
          status: 'PENDING',
        },
      });

      const htmlContent = buildReportHtml(user, today, searches);

      if (!process.env.RESEND_API_KEY) {
        console.warn('Simulando envío de correo (Falta RESEND_API_KEY en .env)');
      } else {
        await resend.emails.send({
          from: 'Gustavo Gonzalez <gustavo.gonzalez@rentario.cl>',
          to: DESTINATION_EMAILS,
          subject: `[PropertyFinder] Reporte de Actividad: ${user.name || user.email}`,
          html: htmlContent,
        });
      }

      await prisma.dailyReportLog.update({
        where: { id: log.id },
        data: { status: 'SENT', sentAt: new Date() },
      });

      results.push({ userId, email: user.email, status: 'sent' });
    } catch (error: any) {
      if (error.code === 'P2002') {
        results.push({ userId, email: user.email, status: 'skipped', reason: 'already sent today' });
      } else {
        console.error(`Error procesando reporte para el usuario ${userId}:`, error);
        results.push({ userId, email: user.email, status: 'error', error: error.message });
      }
    }
  }

  return { message: 'Procesamiento de reportes finalizado', results };
}
