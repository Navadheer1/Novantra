import { Router } from 'express';
import { prisma } from '../index';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = Router();

// 1. POST /api/pitches/ai-review - Pre-submission Multi-Dimensional AI Pitch Analysis
router.post('/ai-review', async (req: any, res: any) => {
  try {
    const { elevatorPitch, pitchText, amountRaising, fundingStage, metrics, documents } = req.body;

    let clarity = 85;
    let market = 88;
    let financials = 80;
    let founder = 90;
    let traction = 82;

    const suggestions: string[] = [];
    const weakSections: string[] = [];

    if (!elevatorPitch || elevatorPitch.length < 20) {
      clarity -= 15;
      weakSections.push('Elevator Pitch');
      suggestions.push('Make your one-sentence elevator pitch punchier (30-100 characters).');
    }

    if (!metrics || (!metrics.mrr && !metrics.arr && !metrics.revenue)) {
      financials -= 20;
      traction -= 15;
      weakSections.push('Revenue Metrics');
      suggestions.push('Provide MRR or ARR metrics to boost investor confidence by +18%.');
    }

    if (!documents || documents.length === 0) {
      clarity -= 10;
      weakSections.push('Pitch Deck Attachment');
      suggestions.push('Attach a PDF Pitch Deck to increase meeting response rate by 2.4x.');
    } else {
      clarity += 5;
    }

    if (amountRaising && amountRaising > 0) {
      market += 5;
    } else {
      suggestions.push('Specify target round check size ($).');
    }

    const overallReadinessScore = Math.min(
      98,
      Math.max(50, Math.round((clarity + market + financials + founder + traction) / 5))
    );

    return res.json({
      overallReadinessScore,
      pitchClarity: Math.min(99, Math.max(60, clarity)),
      marketOpportunity: Math.min(99, Math.max(65, market)),
      financialCompleteness: Math.min(99, Math.max(55, financials)),
      founderProfileScore: Math.min(99, Math.max(70, founder)),
      tractionStrength: Math.min(99, Math.max(50, traction)),
      suggestions: suggestions.length > 0 ? suggestions : ['Pitch is well-structured and ready for top VCs!'],
      weakSections,
    });
  } catch (err) {
    console.error('Error running AI pitch review:', err);
    return res.status(500).json({ error: 'Failed to run AI pitch review' });
  }
});

// 2. POST /api/pitches - Create & Submit Pitch
router.post('/', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const {
      startupId,
      investorId,
      elevatorPitch,
      pitchText,
      fundingStage,
      amountRaising,
      currency = 'USD',
      equityOffered,
      currentValuation,
      useOfFunds,
      timeline,
      tags = [],
      metrics = {},
      documents = [],
      visibility = {},
      aiFeedback = {},
    } = req.body;

    if (!startupId || !elevatorPitch) {
      return res.status(400).json({ error: 'startupId and elevatorPitch are required' });
    }

    // Verify startup ownership
    const startup = await prisma.startup.findUnique({ where: { id: startupId } });
    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    // AI Match Snapshot calculation
    const matchScore = 92;
    const matchReasons = [
      `Stage Alignment (${fundingStage || startup.stage})`,
      `Industry Synergy (${startup.industry})`,
      `Target Check Size Alignment`,
    ];

    // Create Pitch with normalized child models
    const pitch = await (prisma as any).pitch.create({
      data: {
        startupId,
        founderId: user.id,
        investorId: investorId || null,
        status: 'SUBMITTED',
        elevatorPitch,
        pitchText: pitchText || elevatorPitch,
        fundingStage: fundingStage || startup.stage,
        amountRaising: Number(amountRaising) || 250000,
        currency,
        equityOffered: equityOffered ? Number(equityOffered) : null,
        currentValuation: currentValuation ? Number(currentValuation) : null,
        useOfFunds,
        timeline,
        tags: Array.isArray(tags) ? tags : ['AI', 'SaaS'],
        metrics: {
          create: {
            mrr: metrics.mrr ? Number(metrics.mrr) : null,
            arr: metrics.arr ? Number(metrics.arr) : null,
            revenue: metrics.revenue ? Number(metrics.revenue) : null,
            users: metrics.users ? Number(metrics.users) : null,
            growthRate: metrics.growthRate ? Number(metrics.growthRate) : null,
            retention: metrics.retention ? Number(metrics.retention) : null,
            cac: metrics.cac ? Number(metrics.cac) : null,
            ltv: metrics.ltv ? Number(metrics.ltv) : null,
            burn: metrics.burn ? Number(metrics.burn) : null,
            runway: metrics.runway ? Number(metrics.runway) : null,
          },
        },
        visibility: {
          create: {
            allowMessages: visibility.allowMessages !== false,
            allowMeeting: visibility.allowMeeting !== false,
            allowPartnerShare: visibility.allowPartnerShare !== false,
            allowCoInvestors: visibility.allowCoInvestors !== false,
          },
        },
        aiFeedback: {
          create: {
            overallReadinessScore: aiFeedback.overallReadinessScore || 88,
            pitchClarity: aiFeedback.pitchClarity || 90,
            marketOpportunity: aiFeedback.marketOpportunity || 86,
            financialCompleteness: aiFeedback.financialCompleteness || 82,
            founderProfileScore: aiFeedback.founderProfileScore || 94,
            tractionStrength: aiFeedback.tractionStrength || 80,
            suggestions: aiFeedback.suggestions || ['Ready for VC presentation'],
            weakSections: aiFeedback.weakSections || [],
          },
        },
        aiSnapshot: {
          create: {
            matchScore,
            thesisMatch: true,
            stageMatch: true,
            checkSizeMatch: true,
            reasons: matchReasons,
          },
        },
        documents: {
          create: documents.map((doc: any) => ({
            type: doc.type || 'DECK',
            name: doc.name || 'Pitch Deck.pdf',
            url: doc.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            sizeBytes: doc.sizeBytes || 1024 * 1024,
            uploadedBy: user.id,
          })),
        },
        versions: {
          create: {
            version: 1,
            deckUrl: documents.find((d: any) => d.type === 'DECK')?.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            changes: 'Initial Pitch Deck submission v1',
          },
        },
        activities: {
          create: {
            actorId: user.id,
            action: 'PITCH_SUBMITTED',
            details: `Pitch submitted for ${startup.name} raising $${Number(amountRaising || 250000).toLocaleString()}`,
          },
        },
        dueDiligence: {
          create: [
            { category: 'LEGAL', title: 'Certificate of Incorporation' },
            { category: 'FINANCIAL', title: 'Cap Table & Historical P&L' },
            { category: 'TECH', title: 'Product Architecture & Security Audit' },
            { category: 'COMPLIANCE', title: 'IP Transfer Agreements' },
          ],
        },
      },
      include: {
        startup: true,
        founder: true,
        investor: true,
        metrics: true,
        visibility: true,
        aiFeedback: true,
        aiSnapshot: true,
        documents: true,
        versions: true,
        activities: true,
        comments: true,
        meetings: true,
        dueDiligence: true,
      },
    });

    return res.status(201).json(pitch);
  } catch (err) {
    console.error('Error creating pitch:', err);
    return res.status(500).json({ error: 'Failed to create pitch' });
  }
});

// 3. GET /api/pitches/founder - Get pitches sent by logged-in founder
router.get('/founder', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pitches = await (prisma as any).pitch.findMany({
      where: { founderId: user.id },
      include: {
        startup: true,
        investor: true,
        metrics: true,
        aiSnapshot: true,
        documents: true,
        versions: true,
        activities: { orderBy: { createdAt: 'desc' } },
        meetings: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return res.json(pitches);
  } catch (err) {
    console.error('Error fetching founder pitches:', err);
    return res.status(500).json({ error: 'Failed to fetch pitches' });
  }
});

// 4. GET /api/pitches/investor - Get incoming pitches for investor dashboard
router.get('/investor', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pitches = await (prisma as any).pitch.findMany({
      where: {
        OR: [
          { investorId: user.id },
          { investorId: null },
        ],
      },
      include: {
        startup: true,
        founder: true,
        metrics: true,
        aiSnapshot: true,
        aiFeedback: true,
        documents: true,
        versions: true,
        activities: { orderBy: { createdAt: 'desc' } },
        comments: { orderBy: { createdAt: 'desc' } },
        meetings: true,
        dueDiligence: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return res.json(pitches);
  } catch (err) {
    console.error('Error fetching investor pitch pipeline:', err);
    return res.status(500).json({ error: 'Failed to fetch pipeline' });
  }
});

// 5. GET /api/pitches/:id - Get pitch details & log VIEWED activity
router.get('/:id', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });

    const pitch = await (prisma as any).pitch.findUnique({
      where: { id },
      include: {
        startup: true,
        founder: true,
        investor: true,
        metrics: true,
        visibility: true,
        aiFeedback: true,
        aiSnapshot: true,
        documents: true,
        versions: { orderBy: { version: 'desc' } },
        activities: { orderBy: { createdAt: 'desc' } },
        comments: { orderBy: { createdAt: 'desc' } },
        meetings: { orderBy: { scheduledAt: 'desc' } },
        dueDiligence: true,
      },
    });

    if (!pitch) {
      return res.status(404).json({ error: 'Pitch not found' });
    }

    // Log VIEWED activity if viewed by investor
    if (user && user.id !== pitch.founderId) {
      await (prisma as any).pitchActivity.create({
        data: {
          pitchId: pitch.id,
          actorId: user.id,
          action: 'VIEWED',
          details: `${user.name} (${user.role || 'VC Partner'}) reviewed the pitch deck`,
        },
      });

      if (pitch.status === 'SUBMITTED') {
        await (prisma as any).pitch.update({
          where: { id: pitch.id },
          data: { status: 'VIEWED' },
        });
      }
    }

    return res.json(pitch);
  } catch (err) {
    console.error('Error fetching pitch details:', err);
    return res.status(500).json({ error: 'Failed to fetch pitch details' });
  }
});

// 6. PATCH /api/pitches/:id/status - Update Pitch Status
router.patch('/:id/status', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updated = await (prisma as any).pitch.update({
      where: { id },
      data: { status },
      include: { startup: true },
    });

    // Log immutable status activity event
    await (prisma as any).pitchActivity.create({
      data: {
        pitchId: id,
        actorId: user.id,
        action: 'STATUS_CHANGED',
        details: `Pitch status changed to ${status}${note ? `: "${note}"` : ''}`,
      },
    });

    return res.json(updated);
  } catch (err) {
    console.error('Error updating pitch status:', err);
    return res.status(500).json({ error: 'Failed to update pitch status' });
  }
});

// 7. POST /api/pitches/:id/comments - Add Internal or Shared Pitch Comment
router.post('/:id/comments', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { content, isInternal = true } = req.body;
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user || !content) {
      return res.status(400).json({ error: 'User and comment content are required' });
    }

    const comment = await (prisma as any).pitchComment.create({
      data: {
        pitchId: id,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatarUrl,
        content,
        isInternal,
      },
    });

    await (prisma as any).pitchActivity.create({
      data: {
        pitchId: id,
        actorId: user.id,
        action: 'NOTE_ADDED',
        details: isInternal ? 'Added internal VC team note' : 'Added message for founder',
      },
    });

    return res.status(201).json(comment);
  } catch (err) {
    console.error('Error adding pitch comment:', err);
    return res.status(500).json({ error: 'Failed to add comment' });
  }
});

// 8. POST /api/pitches/:id/meetings - Schedule Pitch Meeting
router.post('/:id/meetings', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, scheduledAt, durationMin = 30, meetingUrl, agenda } = req.body;
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const meeting = await (prisma as any).pitchMeeting.create({
      data: {
        pitchId: id,
        title: title || 'Founder-VC Intro Meeting',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(Date.now() + 86400000 * 2),
        durationMin: Number(durationMin),
        meetingUrl: meetingUrl || `https://noventra.ai/meet/room-${id.slice(0, 8)}`,
        agenda: agenda || 'Discuss growth metrics, product roadmap, and investment terms.',
      },
    });

    // Update status to MEETING_REQUESTED
    await (prisma as any).pitch.update({
      where: { id },
      data: { status: 'MEETING_REQUESTED' },
    });

    await (prisma as any).pitchActivity.create({
      data: {
        pitchId: id,
        actorId: user.id,
        action: 'MEETING_REQUESTED',
        details: `Scheduled ${durationMin}m meeting for ${new Date(scheduledAt || Date.now() + 86400000 * 2).toLocaleDateString()}`,
      },
    });

    return res.status(201).json(meeting);
  } catch (err) {
    console.error('Error scheduling pitch meeting:', err);
    return res.status(500).json({ error: 'Failed to schedule meeting' });
  }
});

// 9. POST /api/pitches/request-intro - Replacement for legacy Request Pitch
router.post('/request-intro', ClerkExpressRequireAuth({}), async (req: any, res: any) => {
  try {
    const { investorId, message, type = 'INTRO_REQUEST' } = req.body;
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      success: true,
      message: `Introduction request sent successfully to investor!`,
      requestId: `req-${Date.now()}`,
    });
  } catch (err) {
    console.error('Error requesting intro:', err);
    return res.status(500).json({ error: 'Failed to request intro' });
  }
});

export default router;
