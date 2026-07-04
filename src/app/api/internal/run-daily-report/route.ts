import { NextResponse } from 'next/server';
import { runDailyReport } from '@/lib/services/report';

const INTERNAL_SECRET = process.env.INTERNAL_REPORT_SECRET || 'dev-secret';

export async function POST(request: Request) {
  try {
    // 1. Autenticación del Cron
    const authHeader = request.headers.get('x-internal-secret');
    if (authHeader !== INTERNAL_SECRET) {
      return NextResponse.json({ error: 'No autorizado. Secreto inválido.' }, { status: 401 });
    }

    const result = await runDailyReport();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error crítico en run-daily-report:', error);
    return NextResponse.json({ error: 'Error Interno del Servidor', details: error.message }, { status: 500 });
  }
}
