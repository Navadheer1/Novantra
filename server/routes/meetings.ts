import { Router } from 'express';
import { prisma } from '../index';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = Router();

function generateMeetingCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${part1}-${part2}-${part3}`;
}

// Helper to sanitize title to slug
function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

/**
 * 1. POST /api/meetings/instant
 * Creates instant meeting room, stores creator & participant in DB, returns 201 with joinUrl
 */
router.post('/instant', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { title, meetingType, isPrivate, password, waitingRoom, maxParticipants } = req.body;

    console.log(`[Meetings API] POST /api/meetings/instant requested by Clerk User: ${auth.userId}`);

    const user = await prisma.user.findUnique({ where: { clerkId: auth.userId } });
    if (!user) {
      console.error(`[Meetings API] User not synchronized for Clerk ID: ${auth.userId}`);
      return res.status(401).json({ success: false, error: 'User profile not synchronized in database.' });
    }

    const startup = await prisma.startup.findFirst({ where: { founderId: user.id } });

    let meetingCode = generateMeetingCode();
    let exists = await prisma.meeting.findUnique({ where: { meetingCode } });
    while (exists) {
      meetingCode = generateMeetingCode();
      exists = await prisma.meeting.findUnique({ where: { meetingCode } });
    }

    const limit = Number(maxParticipants) || 10;
    const roomTitle = title?.trim() || `${user.name}'s Collaboration Room`;
    const meetingSlug = slugify(roomTitle);

    const meeting = await prisma.meeting.create({
      data: {
        title: roomTitle,
        description: 'Instant startup collaboration workspace room',
        meetingType: meetingType || 'GENERAL',
        startupId: startup?.id || null,
        hostFounderId: user.id,
        creatorId: user.id,
        meetingCode,
        meetingSlug,
        status: 'ACTIVE',
        isPrivate: isPrivate === true,
        password: password || null,
        waitingRoom: waitingRoom !== false,
        maxParticipants: limit,
        participantLimit: limit,
        participants: {
          create: {
            userId: user.id,
            role: 'HOST',
            micEnabled: true,
            cameraEnabled: true,
            screenSharing: false
          }
        }
      },
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true, role: true } },
        startup: { select: { id: true, name: true, logo: true } },
        participants: { include: { user: { select: { id: true, name: true, avatarUrl: true, role: true } } } }
      }
    });

    const joinUrl = `/communications/meeting/${meetingCode}`;
    console.log(`[Meetings API] Created instant meeting ID: ${meeting.id} Code: ${meetingCode}`);

    return res.status(201).json({
      success: true,
      meeting,
      meetingCode,
      joinUrl
    });
  } catch (error) {
    console.error('[Meetings API Fatal Error] POST /api/meetings/instant:', error);
    return res.status(500).json({ success: false, error: 'Failed to create instant meeting room' });
  }
});

/**
 * 2. POST /api/meetings
 * Standard meeting creation endpoint
 */
router.post('/', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { title, description, meetingType, startupId, isPrivate, password, waitingRoom, maxParticipants } = req.body;

    const user = await prisma.user.findUnique({ where: { clerkId: auth.userId } });
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

    let meetingCode = generateMeetingCode();
    let exists = await prisma.meeting.findUnique({ where: { meetingCode } });
    while (exists) {
      meetingCode = generateMeetingCode();
      exists = await prisma.meeting.findUnique({ where: { meetingCode } });
    }

    const limit = Number(maxParticipants) || 10;
    const roomTitle = title?.trim() || `${user.name}'s Meeting`;

    const meeting = await prisma.meeting.create({
      data: {
        title: roomTitle,
        description: description || '',
        meetingType: meetingType || 'GENERAL',
        startupId: startupId || null,
        hostFounderId: user.id,
        creatorId: user.id,
        meetingCode,
        meetingSlug: slugify(roomTitle),
        status: 'ACTIVE',
        isPrivate: isPrivate === true,
        password: password || null,
        waitingRoom: waitingRoom !== false,
        maxParticipants: limit,
        participantLimit: limit,
        participants: {
          create: {
            userId: user.id,
            role: 'HOST',
            micEnabled: true,
            cameraEnabled: true
          }
        }
      },
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true, role: true } },
        startup: { select: { id: true, name: true, logo: true } },
        participants: { include: { user: { select: { id: true, name: true, avatarUrl: true, role: true } } } }
      }
    });

    const joinUrl = `/communications/meeting/${meetingCode}`;

    return res.status(201).json({
      success: true,
      meeting,
      meetingCode,
      joinUrl
    });
  } catch (error) {
    console.error('[Meetings API Error] POST /api/meetings:', error);
    return res.status(500).json({ success: false, error: 'Failed to create meeting' });
  }
});

/**
 * 3. GET /api/meetings/user/recent
 * Returns recent meetings for current user
 */
router.get('/user/recent', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const user = await prisma.user.findUnique({ where: { clerkId: auth.userId } });
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const meetings = await prisma.meeting.findMany({
      where: {
        OR: [
          { hostFounderId: user.id },
          { creatorId: user.id },
          { participants: { some: { userId: user.id } } }
        ]
      },
      take: 15,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true } },
        startup: { select: { name: true, logo: true } },
        participants: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true, role: true } }
          }
        }
      }
    });

    const formatted = meetings.map(m => ({
      id: m.id,
      meetingCode: m.meetingCode,
      title: m.title || `Meeting ${m.meetingCode}`,
      date: m.createdAt,
      createdAt: m.createdAt,
      status: m.status,
      meetingType: m.meetingType,
      startup: m.startup,
      creator: m.creator,
      participantsCount: m.participants.length,
      participants: m.participants.map(p => ({
        id: p.id,
        userId: p.userId,
        name: p.user.name,
        avatarUrl: p.user.avatarUrl,
        role: p.role,
        joinedAt: p.joinedAt,
        leftAt: p.leftAt
      }))
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('[Meetings API Error] GET /api/meetings/user/recent:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch user meetings' });
  }
});

/**
 * 4. GET /api/meetings/code/:meetingCode
 * Lookup meeting by unique code
 */
router.get('/code/:meetingCode', async (req, res) => {
  try {
    const { meetingCode } = req.params;
    const meeting = await prisma.meeting.findUnique({
      where: { meetingCode },
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true, role: true } },
        startup: { select: { name: true, logo: true, tagline: true, industry: true } },
        participants: {
          include: { user: { select: { id: true, name: true, avatarUrl: true, role: true } } }
        },
        notes: { orderBy: { createdAt: 'asc' } },
        tasks: { orderBy: { createdAt: 'asc' } },
        documents: { orderBy: { createdAt: 'asc' } }
      }
    });

    if (!meeting) {
      return res.status(404).json({ success: false, error: 'Meeting not found' });
    }

    return res.status(200).json({
      success: true,
      meeting,
      participants: meeting.participants,
      permissions: {
        isPrivate: meeting.isPrivate,
        waitingRoom: meeting.waitingRoom,
        maxParticipants: meeting.maxParticipants
      },
      status: meeting.status
    });
  } catch (error) {
    console.error('[Meetings API Error] GET /api/meetings/code/:meetingCode:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch meeting by code' });
  }
});

/**
 * 5. POST /api/meetings/:meetingId/join
 * Join meeting participant
 */
router.post('/:meetingId/join', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { meetingId } = req.params;

    const user = await prisma.user.findUnique({ where: { clerkId: auth.userId } });
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
    if (!meeting) return res.status(404).json({ success: false, error: 'Meeting not found' });

    const isHost = meeting.hostFounderId === user.id || meeting.creatorId === user.id;

    const participant = await prisma.meetingParticipant.upsert({
      where: {
        meetingId_userId: { meetingId, userId: user.id }
      },
      update: {
        leftAt: null,
        joinedAt: new Date()
      },
      create: {
        meetingId,
        userId: user.id,
        role: isHost ? 'HOST' : 'PARTICIPANT',
        micEnabled: true,
        cameraEnabled: true
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, role: true } }
      }
    });

    return res.status(200).json({ success: true, participant, meetingId });
  } catch (error) {
    console.error('[Meetings API Error] POST /api/meetings/:meetingId/join:', error);
    return res.status(500).json({ success: false, error: 'Failed to join meeting' });
  }
});

/**
 * 6. POST /api/meetings/:meetingId/leave
 * Leave meeting participant
 */
router.post('/:meetingId/leave', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { meetingId } = req.params;

    const user = await prisma.user.findUnique({ where: { clerkId: auth.userId } });
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

    await prisma.meetingParticipant.updateMany({
      where: { meetingId, userId: user.id },
      data: { leftAt: new Date() }
    });

    return res.status(200).json({ success: true, message: 'Left meeting' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to leave meeting' });
  }
});

/**
 * 7. POST /api/meetings/:meetingId/end
 * End meeting
 */
router.post('/:meetingId/end', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { meetingId } = req.params;

    const user = await prisma.user.findUnique({ where: { clerkId: auth.userId } });
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const meeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        status: 'ENDED',
        endedAt: new Date()
      }
    });

    return res.status(200).json({ success: true, meeting });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to end meeting' });
  }
});

/**
 * 8. GET /api/meetings/:meetingId
 * Lookup meeting details by ID
 */
router.get('/:meetingId', async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true, role: true } },
        startup: { select: { name: true, logo: true } },
        participants: { include: { user: { select: { id: true, name: true, avatarUrl: true, role: true } } } },
        notes: true,
        tasks: true,
        documents: true
      }
    });

    if (!meeting) return res.status(404).json({ success: false, error: 'Meeting not found' });

    return res.status(200).json({ success: true, meeting });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch meeting details' });
  }
});

export default router;
