import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL || 
  (process.env.DB_PASSWORD && process.env.DB_ENDPOINT 
    ? `postgresql://postgres:${process.env.DB_PASSWORD}@${process.env.DB_ENDPOINT}:5432/postgres?schema=public`
    : undefined);

// Configuramos explícitamente el Pool de Postgres para soportar AWS RDS
const pool = new Pool({ 
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
})
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
