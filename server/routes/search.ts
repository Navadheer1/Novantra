import { Router } from 'express';
import { SearchService } from '../services/searchService';

const router = Router();

// Main Unified Search Endpoint with Cursor Pagination
router.get('/', async (req, res) => {
  try {
    const { 
      q, 
      type, 
      industry, 
      stage, 
      location, 
      role, 
      skill, 
      ticketSize, 
      openToInvestOnly, 
      limit, 
      cursor 
    } = req.query;

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
      } catch (e) {
        // Optional token verify failure fallback
      }
    }

    const response = await SearchService.search({
      query: q as string,
      category: type as any,
      industry: industry as string,
      stage: stage as string,
      location: location as string,
      role: role as string,
      skill: skill as string,
      ticketSize: ticketSize as string,
      openToInvestOnly: openToInvestOnly === 'true',
      limit: limit ? parseInt(limit as string, 10) : 20,
      cursor: cursor as string,
      currentUserId
    });

    res.json(response);
  } catch (error) {
    console.error('[Search Route Error]:', error);
    res.status(500).json({ error: 'Internal server error during search execution.' });
  }
});

// Zero-Query Suggestions Endpoint
router.get('/suggestions', async (req, res) => {
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
        if (decoded && decoded.sub) {
          currentUserId = decoded.sub;
        }
      } catch (e) {}
    }

    const suggestions = await SearchService.getSuggestions(currentUserId);
    res.json(suggestions);
  } catch (error) {
    console.error('[Search Suggestions Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve search suggestions.' });
  }
});

// Trending Topics & Industries Endpoint
router.get('/trending', async (req, res) => {
  try {
    const trending = await SearchService.getTrending();
    res.json(trending);
  } catch (error) {
    console.error('[Search Trending Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve trending topics.' });
  }
});

export default router;
