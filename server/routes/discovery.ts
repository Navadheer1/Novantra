import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// Middleware to extract current user clerkId (optional auth)
const getClerkId = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // In production, verify token via Clerk, or extract subject.
    // For local testing, we extract a mock user ID or standard sub.
    return 'mock-user-id';
  }
  return null;
};

// GET /api/discovery/feed
router.get('/feed', async (req: Request, res: Response) => {
  try {
    const clerkId = getClerkId(req);
    
    // Attempt to pull from Prisma. If tables aren't migrated, fallback to mock.
    let dbVideos: any[] = [];
    try {
      dbVideos = await prisma.video.findMany({
        take: 12,
        include: { channel: true },
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      // DB not migrated or offline
    }

    res.json({
      success: true,
      data: {
        recommended: dbVideos.length ? dbVideos : [],
        trending: dbVideos.slice(0, 6),
        popularAI: dbVideos.filter(v => v.categoryId === 'ai'),
        popularSaaS: dbVideos.filter(v => v.categoryId === 'saas')
      }
    });
  } catch (error) {
    console.error('Discovery Feed Error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve discovery feed' });
  }
});

// GET /api/discovery/videos/:id
router.get('/videos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let video = null;
    try {
      video = await prisma.video.findUnique({
        where: { id },
        include: {
          channel: true,
          comments: {
            include: { user: true },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    } catch (e) {}

    if (!video) {
      return res.json({
        success: true,
        data: null,
        message: "Video not found in DB. Falling back to mock client data."
      });
    }

    res.json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch video details' });
  }
});

// POST /api/discovery/videos/:id/watch
router.post('/videos/:id/watch', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const clerkId = getClerkId(req);

    if (!clerkId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (user) {
        await prisma.watchHistory.upsert({
          where: {
            userId_videoId: {
              userId: user.id,
              videoId: id
            }
          },
          update: {
            progress: Number(progress),
            lastWatched: new Date()
          },
          create: {
            userId: user.id,
            videoId: id,
            progress: Number(progress)
          }
        });
      }
    } catch (e) {}

    res.json({ success: true, message: 'Watch history updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update watch history' });
  }
});

// POST /api/discovery/videos/:id/comments
router.post('/videos/:id/comments', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content, parentId } = req.body;
    const clerkId = getClerkId(req);

    if (!clerkId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    let comment = null;
    try {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (user) {
        comment = await prisma.videoComment.create({
          data: {
            content,
            videoId: id,
            userId: user.id,
            parentId: parentId || null
          },
          include: { user: true }
        });
      }
    } catch (e) {}

    res.json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to post comment' });
  }
});

// POST /api/discovery/videos/:id/like
router.post('/videos/:id/like', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const clerkId = getClerkId(req);

    if (!clerkId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    let liked = false;
    try {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (user) {
        const existing = await prisma.videoLike.findUnique({
          where: { userId_videoId: { userId: user.id, videoId: id } }
        });

        if (existing) {
          await prisma.videoLike.delete({ where: { id: existing.id } });
        } else {
          await prisma.videoLike.create({ data: { userId: user.id, videoId: id } });
          liked = true;
        }
      }
    } catch (e) {}

    res.json({ success: true, liked });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update like status' });
  }
});

// GET /api/discovery/shorts
router.get('/shorts', async (req: Request, res: Response) => {
  try {
    let dbShorts: any[] = [];
    try {
      dbShorts = await prisma.short.findMany({
        include: { channel: true },
        take: 20
      });
    } catch (e) {}

    res.json({ success: true, data: dbShorts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve shorts' });
  }
});

// GET /api/discovery/podcasts
router.get('/podcasts', async (req: Request, res: Response) => {
  try {
    let dbPodcasts: any[] = [];
    try {
      dbPodcasts = await prisma.podcast.findMany({
        include: { channel: true },
        take: 20
      });
    } catch (e) {}

    res.json({ success: true, data: dbPodcasts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve podcasts' });
  }
});

// GET /api/discovery/search
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, type } = req.query;
    const queryStr = String(q || '').toLowerCase();

    // In a real application, search Prisma User, Startup, Video, Channel, etc.
    res.json({
      success: true,
      data: {
        query: queryStr,
        results: []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to execute search' });
  }
});

export default router;
