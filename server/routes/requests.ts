import { Router } from 'express';
import { prisma } from '../index';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { RequestStatus, RequestType, TeamRole } from '@prisma/client';

const router = Router();

// Send request
router.post('/', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { receiverFounderId, startupId, requestType, message } = req.body;
    
    const sender = await prisma.user.findUnique({
      where: { clerkId: auth.userId }
    });

    if (!sender) return res.status(404).json({ error: 'Sender not found' });

    // Prevent duplicate pending requests for same startup & type
    const existing = await prisma.request.findFirst({
      where: {
        senderId: sender.id,
        startupId,
        requestType,
        status: 'PENDING'
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'You already have a pending request of this type for this startup.' });
    }

    const request = await prisma.request.create({
      data: {
        senderId: sender.id,
        receiverFounderId,
        startupId,
        requestType,
        message,
        status: 'PENDING'
      }
    });

    // Note: Emit Socket.io event here for real-time update in a real scenario
    
    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send request' });
  }
});

// Get requests sent by the current user
router.get('/sent', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const user = await prisma.user.findUnique({ where: { clerkId: auth.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const requests = await prisma.request.findMany({
      where: { senderId: user.id },
      include: {
        receiverFounder: { select: { name: true, email: true } },
        startup: { select: { name: true, logo: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(requests);
  } catch (error) {
    console.error('[Requests Route] Failed to fetch sent requests:', error);
    res.status(500).json({ error: 'Failed to fetch sent requests' });
  }
});

// Get founder's incoming requests (Mailbox)
router.get('/incoming', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const user = await prisma.user.findUnique({ where: { clerkId: auth.userId } });
    
    if (!user || user.role !== 'FOUNDER') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const requests = await prisma.request.findMany({
      where: { receiverFounderId: user.id },
      include: {
        sender: { select: { name: true, email: true, role: true } },
        startup: { select: { name: true, logo: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch incoming requests' });
  }
});

// Accept or Reject Request
router.put('/:id', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { status } = req.body; // 'ACCEPTED' | 'REJECTED'
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { clerkId: auth.userId } });
    if (!user || user.role !== 'FOUNDER') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const request = await prisma.request.findUnique({ where: { id } });
    if (!request || request.receiverFounderId !== user.id) {
      return res.status(404).json({ error: 'Request not found or not owned by you' });
    }

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: { status }
    });

    // If accepted, add to team or connected VCs
    if (status === 'ACCEPTED') {
      if (request.requestType === 'INVESTMENT') {
        await prisma.connectedVC.create({
          data: {
            startupId: request.startupId,
            vcId: request.senderId
          }
        });
      } else {
        // Map request type to team role
        let role: TeamRole = 'EMPLOYEE';
        if (request.requestType === 'INTERN') role = 'INTERN';
        if (request.requestType === 'CO_FOUNDER') role = 'CO_FOUNDER';

        await prisma.teamMember.create({
          data: {
            startupId: request.startupId,
            userId: request.senderId,
            role
          }
        });
      }
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// Accept or Reject Request Status (PATCH)
router.patch('/:id/status', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { status } = req.body; // 'ACCEPTED' | 'REJECTED'
    const { id } = req.params;

    if (status !== 'ACCEPTED' && status !== 'REJECTED') {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: auth.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const request = await prisma.request.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Only the startup owner can accept/reject requests
    if (request.receiverFounderId !== user.id) {
      return res.status(403).json({ error: 'Only the startup founder owner can accept/reject requests.' });
    }

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: { status }
    });

    // If accepted, add to team or connected VCs
    if (status === 'ACCEPTED') {
      if (request.requestType === 'INVESTMENT') {
        // Avoid duplicate connected VC entries
        const existingVC = await prisma.connectedVC.findFirst({
          where: {
            startupId: request.startupId,
            vcId: request.senderId
          }
        });
        if (!existingVC) {
          await prisma.connectedVC.create({
            data: {
              startupId: request.startupId,
              vcId: request.senderId
            }
          });
        }
      } else {
        // Map request type to team role
        let role: TeamRole = 'EMPLOYEE';
        if (request.requestType === 'INTERN') role = 'INTERN';
        if (request.requestType === 'CO_FOUNDER') role = 'CO_FOUNDER';

        // Avoid duplicate team entries
        const existingTeam = await prisma.teamMember.findFirst({
          where: {
            startupId: request.startupId,
            userId: request.senderId
          }
        });
        if (!existingTeam) {
          await prisma.teamMember.create({
            data: {
              startupId: request.startupId,
              userId: request.senderId,
              role
            }
          });
        }
      }
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error('[Update Request Status] Error:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

export default router;
