import { prisma } from '../index';

export async function getDiscoverInvestors(filters?: { openToInvestOnly?: boolean; ticketSize?: string; location?: string }) {
  const where: any = { role: 'INVESTOR' };

  if (filters?.openToInvestOnly) where.openToInvest = true;
  if (filters?.ticketSize) where.ticketSize = { contains: filters.ticketSize, mode: 'insensitive' };
  if (filters?.location) where.location = { contains: filters.location, mode: 'insensitive' };

  return await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      bio: true,
      location: true,
      openToInvest: true,
      ticketSize: true,
      investmentInterests: true,
      portfolioCount: true
    },
    take: 6,
    orderBy: { portfolioCount: 'desc' }
  });
}
