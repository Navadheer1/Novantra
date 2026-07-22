import { Router } from 'express';
import { prisma } from '../index';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = Router();

// Helper to check mutual follow
async function checkMutualFollow(userAId: string, userBId: string): Promise<boolean> {
  const follow1 = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: userAId,
        followingId: userBId
      }
    }
  });

  const follow2 = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: userBId,
        followingId: userAId
      }
    }
  });

  return !!(follow1 && follow2);
}

// Get conversations list (all mutual follows)
router.get('/conversations', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const user = await prisma.user.findUnique({
      where: { clerkId: auth.userId },
      include: {
        followers: {
          select: { followerId: true }
        },
        following: {
          select: { followingId: true }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found in DB' });

    // Find user IDs that are in BOTH followers and following (mutual follows)
    const followerIds = user.followers.map(f => f.followerId);
    const followingIds = user.following.map(f => f.followingId);
    const mutualIds = followerIds.filter(id => followingIds.includes(id));

    // Fetch details of mutual follow users and their last message
    const conversations = await Promise.all(mutualIds.map(async (otherId) => {
      const otherUser = await prisma.user.findUnique({
        where: { id: otherId },
        select: { id: true, name: true, role: true, avatarUrl: true }
      });

      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: user.id, receiverId: otherId },
            { senderId: otherId, receiverId: user.id }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });

      return {
        user: otherUser,
        lastMessage
      };
    }));

    // Sort by last message date, newest first
    conversations.sort((a, b) => {
      const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    res.json(conversations);
  } catch (error) {
    console.error('[Messages Route] Failed to fetch conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages for a specific conversation
router.get('/:otherUserId', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { otherUserId } = req.params;

    const user = await prisma.user.findUnique({
      where: { clerkId: auth.userId }
    });

    if (!user) return res.status(404).json({ error: 'User not found in DB' });

    // In dev/demo environment, we allow chats if both users exist
    const otherUserExists = await prisma.user.findUnique({ where: { id: otherUserId } });
    if (!otherUserExists) {
      return res.status(404).json({ error: 'Recipient user not found' });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: user.id }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(messages);
  } catch (error) {
    console.error('[Messages Route] Failed to fetch messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { receiverId, content } = req.body;

    if (!content) return res.status(400).json({ error: 'Content is required' });

    const user = await prisma.user.findUnique({
      where: { clerkId: auth.userId }
    });

    if (!user) return res.status(404).json({ error: 'User not found in DB' });

    const otherUserExists = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!otherUserExists) {
      return res.status(404).json({ error: 'Recipient user not found' });
    }

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('[Messages Route] Failed to send message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
