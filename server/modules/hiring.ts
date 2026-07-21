import { prisma } from '../index';

export async function getStartupsHiringNow(locationFilter?: string) {
  const where: any = {};
  if (locationFilter) {
    where.location = { contains: locationFilter, mode: 'insensitive' };
  }

  const startups = await prisma.startup.findMany({
    where,
    include: {
      founder: { select: { id: true, name: true, avatarUrl: true } }
    },
    take: 6,
    orderBy: { createdAt: 'desc' }
  });

  return startups.filter(s => s.requiredRoles && s.requiredRoles.length > 0);
}
