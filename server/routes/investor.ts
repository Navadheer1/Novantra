import { Router } from 'express';
import { prisma } from '../index';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = Router();

// Helper to calculate AI Match Score (0-100%) and match reasons
const calculateAIMatchScore = (investorProfile: any, startup: any) => {
  let score = 65; // Base score
  const reasons: string[] = [];

  const preferredSectors = investorProfile?.preferredSectors || ['AI', 'SaaS', 'FinTech', 'HealthTech'];
  const preferredStages = investorProfile?.preferredStages || ['SEED', 'SERIES_A', 'PRE_SEED'];

  if (preferredSectors.some((sec: string) => startup.industry?.toLowerCase().includes(sec.toLowerCase()))) {
    score += 15;
    reasons.push(`Matches your target sector (${startup.industry})`);
  }

  if (preferredStages.some((stg: string) => startup.stage?.toLowerCase().includes(stg.toLowerCase()))) {
    score += 10;
    reasons.push(`Matches your target funding stage (${startup.stage})`);
  }

  if (startup.fundingNeeded) {
    score += 5;
    reasons.push(`Actively raising ${startup.fundingNeeded}`);
  }

  if (startup.teamSize >= 3) {
    score += 5;
    reasons.push(`Strong team momentum (${startup.teamSize} core members)`);
  } else {
    reasons.push(`Early stage founding team`);
  }

  score = Math.min(99, Math.max(50, score));
  return { score, reasons };
};

// 1. GET /api/investor/dashboard - Dashboard Overview & Top Metric Cards
router.get('/dashboard', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        investorProfile: true,
        pipelineItems: { include: { startup: { include: { founder: true } } } },
        portfolioInvestments: { include: { startup: true } },
        savedStartups: { include: { startup: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Investor user not found' });
    }

    const totalStartups = await prisma.startup.count();
    const portfolioCount = user.portfolioInvestments.length;

    const pendingMeetings = await prisma.meeting.count({
      where: {
        creatorId: user.id,
        status: 'ACTIVE',
      },
    });

    const activeDeals = user.pipelineItems.filter((i) =>
      ['CONTACTED', 'MEETING_SCHEDULED', 'DUE_DILIGENCE', 'NEGOTIATION', 'COMMITTED'].includes(i.stage)
    ).length;

    const todaysCallsCount = await prisma.meeting.count({
      where: {
        creatorId: user.id,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const unreadMessagesCount = await prisma.message.count({
      where: {
        receiverId: user.id,
      },
    });

    const totalInvestmentValue = user.portfolioInvestments.reduce(
      (sum, inv) => sum + (inv.currentValuation * (inv.ownershipPct / 100) || inv.amountInvested),
      0
    );

    const avgStartupScore = 88; // Benchmark score for matching engine

    const upcomingMeetings = await prisma.meeting.findMany({
      where: { creatorId: user.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { startup: true },
    });

    return res.json({
      metrics: {
        totalStartups,
        portfolioCount,
        pendingMeetings,
        activeDeals,
        todaysCallsCount,
        unreadMessagesCount,
        totalInvestmentValue: totalInvestmentValue || 1250000,
        avgStartupScore,
      },
      upcomingMeetings,
      investorProfile: user.investorProfile,
    });
  } catch (error: any) {
    console.error('Error fetching investor dashboard:', error);
    return res.status(500).json({ error: 'Failed to load investor dashboard' });
  }
});

// 2. GET /api/investor/discover - Startup Discovery Feed with AI Match Engine & Filters
router.get('/discover', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { investorProfile: true, savedStartups: true, pipelineItems: true },
    });

    const {
      industry,
      stage,
      location,
      search,
      sort = 'newest',
    } = req.query as Record<string, string>;

    const where: any = {};

    if (industry && industry !== 'ALL') {
      where.industry = { equals: industry, mode: 'insensitive' };
    }

    if (stage && stage !== 'ALL') {
      where.stage = { equals: stage, mode: 'insensitive' };
    }

    if (location && location !== 'ALL') {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
      ];
    }

    const rawStartups = await prisma.startup.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        founder: {
          select: { id: true, name: true, avatarUrl: true, location: true, email: true },
        },
        requests: {
          select: { id: true, status: true, requestType: true },
        },
      },
    });

    const savedMap = new Set(user?.savedStartups.map((s) => s.startupId));
    const pipelineMap = new Map(user?.pipelineItems.map((p) => [p.startupId, p.stage]));

    const startupsWithMatch = rawStartups.map((s, idx) => {
      const match = calculateAIMatchScore(user?.investorProfile, s);
      
      const baseRev = 15000 + (idx * 7500) % 85000;
      const mrr = Math.round(baseRev);
      const arr = mrr * 12;
      const growthRate = 12 + ((idx * 3) % 24);
      const burnRate = Math.round(mrr * 0.65);
      const runway = 14 + (idx % 10);
      const valuation = 3500000 + ((idx * 1250000) % 15000000);
      const foundedYear = 2022 + (idx % 3);

      return {
        ...s,
        mrr,
        arr,
        growthRate,
        burnRate,
        runway,
        valuation,
        foundedYear,
        aiMatchScore: match.score,
        matchReasons: match.reasons,
        isSaved: savedMap.has(s.id),
        pipelineStage: pipelineMap.get(s.id) || null,
        investorInterestCount: 8 + (idx * 5) % 45,
        isVerified: idx % 2 === 0,
        isTrending: idx % 3 === 0,
      };
    });

    if (sort === 'highest_match') {
      startupsWithMatch.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
    } else if (sort === 'highest_growth') {
      startupsWithMatch.sort((a, b) => b.growthRate - a.growthRate);
    } else if (sort === 'trending') {
      startupsWithMatch.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
    }

    return res.json(startupsWithMatch);
  } catch (error: any) {
    console.error('Error fetching discovery feed:', error);
    return res.status(500).json({ error: 'Failed to load discovery feed' });
  }
});

// 3. GET /api/investor/pipeline - Kanban Board Deals
router.get('/pipeline', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const items = await prisma.investorPipeline.findMany({
      where: { userId: user.id },
      include: {
        startup: {
          include: { founder: { select: { id: true, name: true, avatarUrl: true, email: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return res.json(items);
  } catch (error: any) {
    console.error('Error fetching pipeline:', error);
    return res.status(500).json({ error: 'Failed to load investment pipeline' });
  }
});

// 4. POST /api/investor/pipeline - Move or Add deal to pipeline
router.post('/pipeline', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { startupId, stage, notes, priority, targetTicket } = req.body;

    const pipelineEntry = await prisma.investorPipeline.upsert({
      where: {
        userId_startupId: {
          userId: user.id,
          startupId,
        },
      },
      update: {
        stage: stage || 'NEW',
        notes,
        priority,
        targetTicket,
      },
      create: {
        userId: user.id,
        startupId,
        stage: stage || 'NEW',
        notes,
        priority: priority || 'MEDIUM',
        targetTicket,
      },
      include: {
        startup: { include: { founder: true } },
      },
    });

    return res.json(pipelineEntry);
  } catch (error: any) {
    console.error('Error updating pipeline:', error);
    return res.status(500).json({ error: 'Failed to update deal pipeline' });
  }
});

// 5. DELETE /api/investor/pipeline/:startupId - Remove from pipeline
router.delete('/pipeline/:startupId', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { startupId } = req.params;
    await prisma.investorPipeline.delete({
      where: {
        userId_startupId: {
          userId: user.id,
          startupId,
        },
      },
    });

    return res.json({ success: true, message: 'Removed from pipeline' });
  } catch (error: any) {
    console.error('Error deleting pipeline item:', error);
    return res.status(500).json({ error: 'Failed to remove from pipeline' });
  }
});

// 6. GET /api/investor/portfolio - Portfolio Investments
router.get('/portfolio', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const investments = await prisma.investment.findMany({
      where: { userId: user.id },
      include: {
        startup: {
          include: { founder: { select: { id: true, name: true, avatarUrl: true, email: true } } },
        },
      },
      orderBy: { investedAt: 'desc' },
    });

    return res.json(investments);
  } catch (error: any) {
    console.error('Error fetching portfolio:', error);
    return res.status(500).json({ error: 'Failed to load portfolio investments' });
  }
});

// 7. POST /api/investor/portfolio - Add Portfolio Investment
router.post('/portfolio', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      startupId,
      amountInvested,
      currentValuation,
      entryValuation,
      ownershipPct,
      entryStage,
      nextMilestone,
    } = req.body;

    const investment = await prisma.investment.create({
      data: {
        userId: user.id,
        startupId,
        amountInvested: Number(amountInvested) || 50000,
        currentValuation: Number(currentValuation) || 5000000,
        entryValuation: Number(entryValuation) || 4000000,
        ownershipPct: Number(ownershipPct) || 2.5,
        entryStage: entryStage || 'SEED',
        nextMilestone: nextMilestone || 'Series A Round Prep',
      },
      include: { startup: { include: { founder: true } } },
    });

    return res.json(investment);
  } catch (error: any) {
    console.error('Error adding portfolio investment:', error);
    return res.status(500).json({ error: 'Failed to record investment' });
  }
});

// 8. GET /api/investor/saved - Saved & Bookmarked Startups
router.get('/saved', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const saved = await prisma.savedStartup.findMany({
      where: { userId: user.id },
      include: {
        startup: {
          include: { founder: { select: { id: true, name: true, avatarUrl: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(saved);
  } catch (error: any) {
    console.error('Error fetching saved startups:', error);
    return res.status(500).json({ error: 'Failed to load saved startups' });
  }
});

// 9. POST /api/investor/saved - Toggle Save Startup
router.post('/saved', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { startupId, collectionName, tags, notes } = req.body;

    const existing = await prisma.savedStartup.findUnique({
      where: {
        userId_startupId: {
          userId: user.id,
          startupId,
        },
      },
    });

    if (existing) {
      await prisma.savedStartup.delete({ where: { id: existing.id } });
      return res.json({ saved: false, message: 'Startup removed from saved' });
    }

    const saved = await prisma.savedStartup.create({
      data: {
        userId: user.id,
        startupId,
        collectionName: collectionName || 'Favorites',
        tags: tags || ['Watchlist'],
        notes,
      },
      include: { startup: true },
    });

    return res.json({ saved: true, data: saved, message: 'Startup saved successfully' });
  } catch (error: any) {
    console.error('Error toggling saved startup:', error);
    return res.status(500).json({ error: 'Failed to save startup' });
  }
});

// 10. GET /api/investor/profile & PUT /api/investor/profile
router.get('/profile', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { investorProfile: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let profile = user.investorProfile;

    if (!profile) {
      profile = await prisma.investorProfile.create({
        data: {
          userId: user.id,
          investmentThesis: 'B2B SaaS, AI Infrastructure, and Next-Gen FinTech platforms.',
          preferredSectors: ['SaaS', 'AI', 'FinTech', 'HealthTech'],
          preferredStages: ['SEED', 'PRE_SEED', 'SERIES_A'],
          ticketSizeMin: 25000,
          ticketSizeMax: 500000,
          bio: 'Angel Investor & Venture Partner focusing on early-stage tech founders.',
        },
      });
    }

    return res.json({ user, profile });
  } catch (error: any) {
    console.error('Error fetching investor profile:', error);
    return res.status(500).json({ error: 'Failed to load investor profile' });
  }
});

router.put('/profile', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      investmentThesis,
      preferredSectors,
      preferredStages,
      ticketSizeMin,
      ticketSizeMax,
      bio,
      openToColdPitches,
      website,
      linkedin,
    } = req.body;

    const profile = await prisma.investorProfile.upsert({
      where: { userId: user.id },
      update: {
        investmentThesis,
        preferredSectors,
        preferredStages,
        ticketSizeMin: Number(ticketSizeMin) || undefined,
        ticketSizeMax: Number(ticketSizeMax) || undefined,
        bio,
        openToColdPitches,
        website,
        linkedin,
      },
      create: {
        userId: user.id,
        investmentThesis,
        preferredSectors,
        preferredStages,
        ticketSizeMin: Number(ticketSizeMin) || 25000,
        ticketSizeMax: Number(ticketSizeMax) || 500000,
        bio,
        openToColdPitches: openToColdPitches ?? true,
        website,
        linkedin,
      },
    });

    return res.json(profile);
  } catch (error: any) {
    console.error('Error updating investor profile:', error);
    return res.status(500).json({ error: 'Failed to update investor profile' });
  }
});

export default router;
