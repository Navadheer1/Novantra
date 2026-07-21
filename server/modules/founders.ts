import { prisma } from '../index';

export async function getDiscoverFounders(locationFilter?: string) {
  const where: any = { role: 'FOUNDER' };

  if (locationFilter) {
    where.location = { contains: locationFilter, mode: 'insensitive' };
  }

  const founders = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      bio: true,
      skills: true,
      location: true,
      startups: { select: { id: true, name: true, logo: true, stage: true } },
      followers: { select: { followerId: true } }
    },
    take: 6,
    orderBy: { createdAt: 'desc' }
  });

  return founders.map(f => ({
    ...f,
    followersCount: f.followers.length,
    followers: undefined
  }));
}
