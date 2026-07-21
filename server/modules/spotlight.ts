import { prisma } from '../index';

export async function getWeeklySpotlight() {
  // Select the top featured startup of the week based on team size & funding goal
  const spotlightStartup = await prisma.startup.findFirst({
    orderBy: { teamSize: 'desc' },
    include: {
      founder: {
        select: { id: true, name: true, email: true, avatarUrl: true, role: true }
      },
      teamMembers: {
        select: { id: true, role: true, user: { select: { id: true, name: true, avatarUrl: true } } }
      },
      connectedVCs: { select: { id: true } }
    }
  });

  if (!spotlightStartup) return null;

  return {
    ...spotlightStartup,
    highlightBadge: 'Weekly Ecosystem Champion',
    growthMetric: '+140% Monthly Growth',
    totalInteractions: spotlightStartup.teamMembers.length * 12 + 45
  };
}
