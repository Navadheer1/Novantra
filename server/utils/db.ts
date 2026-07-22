import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log('[Database] Connected to PostgreSQL via Prisma Client');
  } catch (error) {
    console.error('[Database] Failed to connect to Prisma Database:', error);
    process.exit(1);
  }
};

export const disconnectDb = async () => {
  try {
    await prisma.$disconnect();
    console.log('[Database] Disconnected Prisma Client cleanly');
  } catch (error) {
    console.error('[Database] Error during Prisma disconnect:', error);
  }
};
