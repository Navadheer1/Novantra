import { prisma } from '../index';

export async function getTrendingModule() {
  const posts = await prisma.post.findMany({
    include: {
      author: { select: { id: true, name: true, role: true, avatarUrl: true } },
      startup: { select: { id: true, name: true, logo: true } },
      likes: { select: { userId: true } },
      comments: { select: { id: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  const trendingHashtags = [
    { tag: '#AI', count: '1.4k posts' },
    { tag: '#SaaS', count: '980 posts' },
    { tag: '#SeedFunding', count: '740 posts' },
    { tag: '#OpenSource', count: '620 posts' },
    { tag: '#Hiring', count: '510 posts' },
    { tag: '#FinTech', count: '430 posts' },
    { tag: '#YC26', count: '390 posts' },
    { tag: '#WebRTC', count: '290 posts' }
  ];

  const trendingTopics = [
    { title: 'AI Agents Scaling in Production', category: 'Tech & AI', volume: '12.4k engagements' },
    { title: 'Pre-Seed Valuations Benchmark 2026', category: 'VC & Capital', volume: '8.2k engagements' },
    { title: 'Remote Work Policies for Founding Engineers', category: 'Talent & Culture', volume: '5.1k engagements' }
  ];

  return {
    trendingPosts: posts.map(p => ({
      ...p,
      likesCount: p.likes.length,
      commentsCount: p.comments.length,
      likes: undefined,
      comments: undefined
    })),
    trendingHashtags,
    trendingTopics
  };
}
