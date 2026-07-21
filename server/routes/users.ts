import { Router } from 'express';
import { prisma } from '../index';
import { clerkClient, ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = Router();

// Sync user from frontend after login (WITHOUT forced role update)
router.post('/sync', async (req, res) => {
  try {
    const { clerkId, email, name, role } = req.body;

    console.log(`[Sync Route] Request payload:`, { clerkId, email, name, role });

    if (!clerkId || !email || !name) {
      return res.status(400).json({ error: 'Missing required fields (clerkId, email, name)' });
    }

    // Map frontend roles ("founder", "investor", "user") to backend database enums ("FOUNDER", "INVESTOR", "USER")
    let dbRole: any = null;
    if (role) {
      const normalizedRole = role.toLowerCase();
      if (normalizedRole === 'founder') {
        dbRole = 'FOUNDER';
      } else if (normalizedRole === 'investor' || normalizedRole === 'vc') {
        dbRole = 'INVESTOR';
      } else if (normalizedRole === 'user' || normalizedRole === 'talent') {
        dbRole = 'USER';
      }
    }

    // Sync role with Clerk metadata securely if a role is provided
    if (dbRole) {
      try {
        console.log(`[Sync Route] Updating Clerk metadata for ${clerkId} to: ${dbRole.toLowerCase()}`);
        await clerkClient.users.updateUserMetadata(clerkId, {
          publicMetadata: {
            role: dbRole.toLowerCase() // "founder", "investor", "user"
          }
        });
      } catch (clerkErr) {
        console.error(`[Sync Route] Failed to update Clerk metadata:`, clerkErr);
      }
    }

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {
        email,
        name,
        // Only update role if it is provided
        ...(dbRole ? { role: dbRole } : {})
      },
      create: {
        clerkId,
        email,
        name,
        role: dbRole || null // Nullable initially
      }
    });

    console.log(`[Sync Route] Sync successful. Saved user in DB:`, user);
    res.json(user);
  } catch (error) {
    console.error(`[Sync Route] [FATAL ERROR] /api/users/sync failed:`, error);
    res.status(500).json({ error: 'Internal server error during user sync' });
  }
});

// Update user role securely (Authenticated)
router.post('/role', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { role } = req.body;

    console.log(`[Role Route] Updating role for Clerk user ${auth.userId} to: ${role}`);

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const normalizedRole = role.toLowerCase();
    if (normalizedRole !== 'founder' && normalizedRole !== 'investor' && normalizedRole !== 'user') {
      return res.status(400).json({ error: 'Invalid role value. Must be founder, investor, or user.' });
    }

    // Map to database enum
    let dbRole: 'FOUNDER' | 'INVESTOR' | 'USER' = 'USER';
    if (normalizedRole === 'founder') {
      dbRole = 'FOUNDER';
    } else if (normalizedRole === 'investor') {
      dbRole = 'INVESTOR';
    } else if (normalizedRole === 'user') {
      dbRole = 'USER';
    }

    // Update Clerk metadata securely
    try {
      console.log(`[Role Route] Updating Clerk metadata to: ${normalizedRole}`);
      await clerkClient.users.updateUserMetadata(auth.userId, {
        publicMetadata: {
          role: normalizedRole
        }
      });
    } catch (clerkErr) {
      console.error(`[Role Route] Failed to update Clerk metadata:`, clerkErr);
    }

    // Update role in database
    let user;
    try {
      user = await prisma.user.update({
        where: { clerkId: auth.userId },
        data: { role: dbRole }
      });
    } catch (dbErr) {
      console.log(`[Role Route] User not found in DB during update. Fetching from Clerk and creating user...`);
      try {
        const clerkUser = await clerkClient.users.getUser(auth.userId);
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';

        user = await prisma.user.create({
          data: {
            clerkId: auth.userId,
            email: email || `clerk_${auth.userId}@example.com`,
            name: name || 'User',
            role: dbRole
          }
        });
      } catch (clerkErr) {
        console.error(`[Role Route] Failed to fetch user from Clerk or create in DB:`, clerkErr);
        throw dbErr; // rethrow the original DB error if Clerk fallback fails
      }
    }

    console.log(`[Role Route] Role updated successfully in DB:`, user);
    res.json(user);
  } catch (error) {
    console.error(`[Role Route] Failed to update role:`, error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Get user by clerk ID
router.get('/clerk/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    console.log(`[GET User] Fetching user by clerkId: ${clerkId}`);
    
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      console.log(`[GET User] User not found in DB for clerkId: ${clerkId}`);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log(`[GET User] Retrieved user:`, user);
    res.json(user);
  } catch (error) {
    console.error(`[GET User] Failed to fetch user:`, error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get all active investors (Investors page)
router.get('/investors', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const investors = await prisma.user.findMany({
      where: {
        role: 'INVESTOR',
        openToInvest: true
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        bio: true,
        skills: true,
        interests: true,
        location: true,
        ticketSize: true,
        investmentInterests: true,
        portfolioCount: true
      }
    });
    res.json(investors);
  } catch (error) {
    console.error('[Users Route] Failed to fetch investors:', error);
    res.status(500).json({ error: 'Failed to fetch investors' });
  }
});

// Update user profile
router.put('/profile', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { 
      avatarUrl, 
      bio, 
      skills, 
      interests, 
      location, 
      openToInvest, 
      ticketSize, 
      investmentInterests, 
      portfolioCount 
    } = req.body;

    const user = await prisma.user.update({
      where: { clerkId: auth.userId },
      data: {
        avatarUrl,
        bio,
        skills: Array.isArray(skills) ? skills : [],
        interests: Array.isArray(interests) ? interests : [],
        location,
        openToInvest: openToInvest === true || openToInvest === 'true',
        ticketSize,
        investmentInterests: Array.isArray(investmentInterests) ? investmentInterests : [],
        portfolioCount: Number(portfolioCount) || 0
      }
    });

    res.json(user);
  } catch (error) {
    console.error('[Users Route] Failed to update profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user profile detail by user uuid
router.get('/profile/:id', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { id } = req.params;

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: auth.userId }
    });

    if (!currentUser) return res.status(404).json({ error: 'Current user not found' });

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        startups: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, name: true, role: true, avatarUrl: true } },
            startup: { select: { id: true, name: true, logo: true } }
          }
        },
        followers: true,
        following: true
      }
    });

    if (!user) return res.status(404).json({ error: 'Profile not found' });

    const isFollowing = user.followers.some(f => f.followerId === currentUser.id);
    const followsMe = user.following.some(f => f.followingId === currentUser.id);
    const isMutual = isFollowing && followsMe;

    res.json({
      ...user,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      isFollowing,
      isMutual,
      followers: undefined, 
      following: undefined
    });
  } catch (error) {
    console.error('[Users Route] Failed to fetch profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Follow / Unfollow user
router.post('/:id/follow', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { id: followingId } = req.params;

    const follower = await prisma.user.findUnique({
      where: { clerkId: auth.userId }
    });

    if (!follower) return res.status(404).json({ error: 'Follower user not found' });
    if (follower.id === followingId) return res.status(400).json({ error: 'You cannot follow yourself' });

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: follower.id,
          followingId
        }
      }
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: follower.id,
            followingId
          }
        }
      });
      return res.json({ followed: false });
    } else {
      await prisma.follow.create({
        data: {
          followerId: follower.id,
          followingId
        }
      });
      return res.json({ followed: true });
    }
  } catch (error) {
    console.error('[Users Route] Failed to toggle follow:', error);
    res.status(500).json({ error: 'Failed to toggle follow' });
  }
});

export default router;
