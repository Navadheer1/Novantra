import { Router } from 'express';
import { ExploreService } from '../services/exploreService';
import { getWeeklySpotlight } from '../modules/spotlight';
import { getTrendingModule } from '../modules/trends';
import { getRecommendations } from '../modules/recommendations';

const router = Router();

// Master Explore Endpoint
router.get('/', async (req, res) => {
  try {
    const { goal, industry, stage, location, hiringOnly, openToInvestOnly, remoteOnly } = req.query;

    let currentUserId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const { verifyToken } = require('@clerk/clerk-sdk-node');
        const decoded = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY
        });
        if (decoded && decoded.sub) {
          currentUserId = decoded.sub;
        }
      } catch (e) {}
    }

    const payload = await ExploreService.getExploreHub({
      goal: goal as string,
      industry: industry as string,
      stage: stage as string,
      location: location as string,
      hiringOnly: hiringOnly === 'true',
      openToInvestOnly: openToInvestOnly === 'true',
      remoteOnly: remoteOnly === 'true',
      currentUserId
    });

    res.json(payload);
  } catch (error) {
    console.error('[Explore Route Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve Explore hub data.' });
  }
});

// Spotlight Endpoint
router.get('/spotlight', async (req, res) => {
  try {
    const spotlight = await getWeeklySpotlight();
    res.json(spotlight);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spotlight.' });
  }
});

// Trending Endpoint
router.get('/trending', async (req, res) => {
  try {
    const trending = await getTrendingModule();
    res.json(trending);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending modules.' });
  }
});

// Recommendations Endpoint
router.get('/recommendations', async (req, res) => {
  try {
    let currentUserId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const { verifyToken } = require('@clerk/clerk-sdk-node');
        const decoded = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY
        });
        if (decoded && decoded.sub) currentUserId = decoded.sub;
      } catch (e) {}
    }

    const recs = await getRecommendations(currentUserId);
    res.json(recs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations.' });
  }
});

export default router;
