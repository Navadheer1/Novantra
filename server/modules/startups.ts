import { prisma } from '../index';

export async function getFeaturedStartups(filters?: { industry?: string; stage?: string; location?: string }) {
  const where: any = {};

  if (filters?.industry) where.industry = { contains: filters.industry, mode: 'insensitive' };
  if (filters?.stage) where.stage = { contains: filters.stage, mode: 'insensitive' };
  if (filters?.location) where.location = { contains: filters.location, mode: 'insensitive' };

  return await prisma.startup.findMany({
    where,
    include: {
      founder: { select: { id: true, name: true, email: true, avatarUrl: true } }
    },
    take: 6,
    orderBy: { createdAt: 'desc' }
  });
}
