// ...existing code...
import { PrismaClient } from '@prisma/client';

declare global {
  // allow global prisma to avoid multiple instances in dev with hot reload
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ??
  new PrismaClient({
    log: ['query', 'error'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
// ...existing code...