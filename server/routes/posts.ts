import { Router } from 'express';
import { prisma } from '../index';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = Router();

// Create a new post
router.post('/', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { content, postType, mediaUrl, startupId } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: auth.userId }
    });

    if (!user) return res.status(404).json({ error: 'User not found in DB' });

    const post = await prisma.post.create({
      data: {
        content,
        postType: postType || 'text',
        mediaUrl,
        startupId: startupId || null,
        authorId: user.id
      },
      include: {
        author: {
          select: { id: true, name: true, role: true, avatarUrl: true }
        },
        startup: {
          select: { id: true, name: true, logo: true }
        }
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('[Posts Route] Failed to create post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get feed posts (Public with optional user-specific flags)
router.get('/', async (req, res) => {
  try {
    let currentUserId: string | null = null;

    // Optional auth token verification
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const { verifyToken } = require('@clerk/clerk-sdk-node');
        const decoded = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY
        });
        if (decoded && decoded.sub) {
          const user = await prisma.user.findUnique({
            where: { clerkId: decoded.sub }
          });
          if (user) {
            currentUserId = user.id;
          }
        }
      } catch (e) {
        // Optional token decode failed or expired, proceed gracefully
      }
    }

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { id: true, name: true, role: true, avatarUrl: true }
        },
        startup: {
          select: { id: true, name: true, logo: true }
        },
        likes: {
          select: { userId: true }
        },
        bookmarks: {
          select: { userId: true }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map likes/bookmarks flags
    const postsWithFlags = posts.map(post => {
      const isLiked = currentUserId ? post.likes.some(like => like.userId === currentUserId) : false;
      const isBookmarked = currentUserId ? post.bookmarks.some(bm => bm.userId === currentUserId) : false;
      return {
        ...post,
        likesCount: post.likes.length,
        commentsCount: post._count.comments,
        isLiked,
        isBookmarked,
        likes: undefined, 
        bookmarks: undefined,
        _count: undefined
      };
    });

    res.json(postsWithFlags);
  } catch (error) {
    console.error('[Posts Route] Failed to fetch posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Like / Unlike post
router.post('/:id/like', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { id: postId } = req.params;

    const user = await prisma.user.findUnique({
      where: { clerkId: auth.userId }
    });

    if (!user) return res.status(404).json({ error: 'User not found in DB' });

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      return res.json({ liked: false });
    } else {
      await prisma.like.create({
        data: {
          userId: user.id,
          postId
        }
      });
      return res.json({ liked: true });
    }
  } catch (error) {
    console.error('[Posts Route] Failed to toggle like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// Bookmark / Unbookmark post
router.post('/:id/bookmark', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { id: postId } = req.params;

    const user = await prisma.user.findUnique({
      where: { clerkId: auth.userId }
    });

    if (!user) return res.status(404).json({ error: 'User not found in DB' });

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId
        }
      }
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id }
      });
      return res.json({ bookmarked: false });
    } else {
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          postId
        }
      });
      return res.json({ bookmarked: true });
    }
  } catch (error) {
    console.error('[Posts Route] Failed to toggle bookmark:', error);
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
});

// Add comment
router.post('/:id/comment', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { id: postId } = req.params;
    const { content } = req.body;

    if (!content) return res.status(400).json({ error: 'Comment content is required' });

    const user = await prisma.user.findUnique({
      where: { clerkId: auth.userId }
    });

    if (!user) return res.status(404).json({ error: 'User not found in DB' });

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: user.id,
        postId
      },
      include: {
        user: {
          select: { id: true, name: true, role: true, avatarUrl: true }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('[Posts Route] Failed to add comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get comments for a post
router.get('/:id/comments', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const { id: postId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: { id: true, name: true, role: true, avatarUrl: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(comments);
  } catch (error) {
    console.error('[Posts Route] Failed to fetch comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

export default router;
