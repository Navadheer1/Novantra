import { prisma } from '../index';

export async function getFundingActivity() {
  // Fetch accepted investment requests and startups seeking funding
  const acceptedInvestments = await prisma.request.findMany({
    where: { requestType: 'INVESTMENT', status: 'ACCEPTED' },
    include: {
      sender: { select: { id: true, name: true, avatarUrl: true, ticketSize: true } },
      startup: { select: { id: true, name: true, logo: true, stage: true, fundingNeeded: true } }
    },
    take: 6,
    orderBy: { updatedAt: 'desc' }
  });

  const activeSeekingStartups = await prisma.startup.findMany({
    where: {
      fundingNeeded: { not: null }
    },
    include: {
      founder: { select: { id: true, name: true, avatarUrl: true } }
    },
    take: 6,
    orderBy: { createdAt: 'desc' }
  });

  return {
    recentDeals: acceptedInvestments.map(inv => ({
      id: inv.id,
      startupName: inv.startup.name,
      startupLogo: inv.startup.logo,
      stage: inv.startup.stage,
      amount: inv.sender.ticketSize || inv.startup.fundingNeeded || '$250,000',
      investorName: inv.sender.name,
      investorAvatar: inv.sender.avatarUrl,
      date: inv.updatedAt
    })),
    raisingStartups: activeSeekingStartups.map(s => ({
      id: s.id,
      name: s.name,
      logo: s.logo,
      stage: s.stage,
      fundingNeeded: s.fundingNeeded,
      founderName: s.founder.name,
      founderAvatar: s.founder.avatarUrl
    }))
  };
}
