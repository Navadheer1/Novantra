import { prisma } from '../index';

export async function getRecommendations(currentClerkUserId?: string | null) {
  let currentUser: any = null;
  if (currentClerkUserId) {
    currentUser = await prisma.user.findUnique({
      where: { clerkId: currentClerkUserId }
    });
  }

  // 1. Recommended People (match skills/interests or non-self users)
  const peopleWhere: any = {};
  if (currentUser) {
    peopleWhere.id = { not: currentUser.id };
    if (currentUser.skills && currentUser.skills.length > 0) {
      peopleWhere.skills = { hasSome: currentUser.skills };
    }
  }

  let recommendedPeople = await prisma.user.findMany({
    where: peopleWhere,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      bio: true,
      skills: true,
      location: true
    },
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  // Fallback if no skill match
  if (recommendedPeople.length === 0) {
    recommendedPeople = await prisma.user.findMany({
      where: currentUser ? { id: { not: currentUser.id } } : {},
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
        skills: true,
        location: true
      },
      take: 4,
      orderBy: { createdAt: 'desc' }
    });
  }

  // 2. Recommended Startups
  const recommendedStartups = await prisma.startup.findMany({
    select: {
      id: true,
      name: true,
      logo: true,
      description: true,
      industry: true,
      stage: true,
      location: true,
      founder: { select: { id: true, name: true, avatarUrl: true } }
    },
    take: 4,
    orderBy: { teamSize: 'desc' }
  });

  // 3. Recommended Investors
  const recommendedInvestors = await prisma.user.findMany({
    where: { role: 'INVESTOR', openToInvest: true },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      bio: true,
      ticketSize: true,
      location: true,
      investmentInterests: true
    },
    take: 4,
    orderBy: { portfolioCount: 'desc' }
  });

  return {
    recommendedPeople,
    recommendedStartups,
    recommendedInvestors
  };
}
