import { Router } from 'express';
import { prisma } from '../index';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = Router();

// Get all startups (Discovery page)
router.get('/', async (req, res) => {
  try {
    const startups = await prisma.startup.findMany({
      include: {
        founder: {
          select: { name: true, email: true }
        }
      }
    });
    res.json(startups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch startups' });
  }
});

// Get founder's startups
router.get('/me', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const startups = await prisma.startup.findMany({
      where: {
        founder: {
          clerkId: auth.userId
        }
      },
      include: {
        teamMembers: {
          include: { user: true }
        },
        requests: {
          where: { status: 'PENDING' }
        }
      }
    });
    res.json(startups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your startups' });
  }
});

// Create startup
router.post('/', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { name, description, industry, stage, location, requiredRoles, fundingNeeded, logo } = req.body;
    
    // Find the user from our DB
    const user = await prisma.user.findUnique({
      where: { clerkId: auth.userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found in DB' });
    }

    if (user.role !== 'FOUNDER') {
      return res.status(403).json({ error: 'Only founders can create startups' });
    }

    const startup = await prisma.startup.create({
      data: {
        name,
        description,
        industry,
        stage,
        location,
        requiredRoles: requiredRoles || [],
        fundingNeeded,
        logo,
        founderId: user.id
      }
    });

    res.status(201).json(startup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create startup' });
  }
});

// Get single startup by ID
router.get('/:id', async (req, res) => {
  try {
    const startup = await prisma.startup.findUnique({
      where: { id: req.params.id },
      include: {
        founder: {
          select: { id: true, name: true, email: true, role: true, avatarUrl: true }
        },
        teamMembers: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } }
          }
        },
        connectedVCs: true
      }
    });
    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    // Resolve connected VC user profiles
    const connectedInvestors = await prisma.user.findMany({
      where: {
        id: { in: startup.connectedVCs.map(vc => vc.vcId) }
      },
      select: { id: true, name: true, email: true, avatarUrl: true, role: true }
    });

    res.json({
      ...startup,
      connectedInvestors
    });
  } catch (error) {
    console.error('[Startups Detail] Error:', error);
    res.status(500).json({ error: 'Failed to fetch startup details' });
  }
});

// Submit request to startup
router.post('/:startupId/requests', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { startupId } = req.params;
    const { type, message, roleTitle } = req.body;

    const sender = await prisma.user.findUnique({
      where: { clerkId: auth.userId }
    });

    if (!sender) {
      return res.status(404).json({ error: 'Sender not found in database' });
    }

    const startup = await prisma.startup.findUnique({
      where: { id: startupId }
    });

    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    // Owner must never be allowed to send request to own startup
    if (sender.id === startup.founderId) {
      return res.status(400).json({ error: 'You are the owner of this startup and cannot submit requests to it.' });
    }

    // Map incoming type string to DB RequestType enum values
    let dbType: 'INVESTMENT' | 'JOB' | 'INTERN' | 'CO_FOUNDER';
    if (type === 'INVESTMENT') {
      dbType = 'INVESTMENT';
    } else if (type === 'JOB') {
      dbType = 'JOB';
    } else if (type === 'INTERNSHIP' || type === 'INTERN') {
      dbType = 'INTERN';
    } else if (type === 'ROLE') {
      dbType = 'JOB';
    } else if (type === 'COFOUNDER' || type === 'CO_FOUNDER') {
      dbType = 'CO_FOUNDER';
    } else {
      return res.status(400).json({ error: 'Invalid request type' });
    }

    // Prevent duplicate pending requests from same user for same startup & type
    const existing = await prisma.request.findFirst({
      where: {
        senderId: sender.id,
        startupId,
        requestType: dbType,
        status: 'PENDING'
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'You already have a pending request of this type for this startup.' });
    }

    const request = await prisma.request.create({
      data: {
        senderId: sender.id,
        receiverFounderId: startup.founderId,
        startupId: startup.id,
        requestType: dbType,
        message: message || (roleTitle ? `Interested in role: ${roleTitle}` : ''),
        status: 'PENDING'
      }
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('[Submit Request] Error:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

export default router;
