import { prisma } from '../index';
import { rankUser, rankStartup, rankPost } from '../utils/ranking';
import { extractSnippet } from '../utils/highlighting';

export interface SearchFilterParams {
  query?: string;
  category?: 'all' | 'people' | 'founders' | 'investors' | 'startups' | 'posts' | 'hashtags';
  industry?: string;
  stage?: string;
  location?: string;
  role?: string;
  skill?: string;
  ticketSize?: string;
  openToInvestOnly?: boolean;
  limit?: number;
  cursor?: string;
  currentUserId?: string | null;
}

export interface SearchResultItem {
  id: string;
  type: 'user' | 'founder' | 'investor' | 'startup' | 'post' | 'hashtag';
  title: string;
  subtitle: string;
  avatarOrLogo: string | null;
  description: string;
  meta: Record<string, any>;
  relevanceScore: number;
  highlightSnippet?: string;
}

export interface SearchResponse {
  results: SearchResultItem[];
  categoriesCount: {
    people: number;
    founders: number;
    investors: number;
    startups: number;
    posts: number;
    hashtags: number;
  };
  nextCursor: string | null;
  hasMore: boolean;
  parsedQueryFilter?: {
    rawQuery: string;
    extractedLocation?: string;
    extractedStage?: string;
    extractedIndustry?: string;
  };
}

/**
 * Natural Language AI-Ready Query Parser
 * Automatically parses location, stage, and industry keywords from natural language prompts.
 */
function parseNaturalLanguageQuery(rawQuery: string) {
  let cleaned = rawQuery.trim();
  let extractedLocation: string | undefined;
  let extractedStage: string | undefined;
  let extractedIndustry: string | undefined;

  // Stages
  const stages = ['Idea', 'Pre-Seed', 'Seed', 'Series A', 'Series B'];
  for (const st of stages) {
    const reg = new RegExp(`\\b${st}\\b`, 'i');
    if (reg.test(cleaned)) {
      extractedStage = st;
      cleaned = cleaned.replace(reg, '').trim();
    }
  }

  // Common Industries
  const industries = ['AI', 'Fintech', 'HealthTech', 'SaaS', 'EdTech', 'CleanTech', 'Crypto', 'Web3', 'E-commerce', 'Robotics'];
  for (const ind of industries) {
    const reg = new RegExp(`\\b${ind}\\b`, 'i');
    if (reg.test(cleaned)) {
      extractedIndustry = ind;
      cleaned = cleaned.replace(reg, '').trim();
    }
  }

  // Location indicator "in [City]"
  const locMatch = cleaned.match(/\bin\s+([A-Za-z\s]+)/i);
  if (locMatch && locMatch[1]) {
    extractedLocation = locMatch[1].trim();
    cleaned = cleaned.replace(locMatch[0], '').trim();
  }

  return {
    cleanQuery: cleaned.replace(/\s+/g, ' '),
    extractedLocation,
    extractedStage,
    extractedIndustry
  };
}

export class SearchService {
  /**
   * Main Unified Search Function supporting Cursor Pagination & Dynamic Filtering
   */
  static async search(params: SearchFilterParams): Promise<SearchResponse> {
    const rawQ = (params.query || '').trim();
    const category = params.category || 'all';
    const limit = Math.min(params.limit || 20, 50);

    // AI Natural Language pre-parser
    const { cleanQuery, extractedLocation, extractedStage, extractedIndustry } = parseNaturalLanguageQuery(rawQ);
    const searchQuery = cleanQuery || rawQ;

    const locationFilter = params.location || extractedLocation;
    const stageFilter = params.stage || extractedStage;
    const industryFilter = params.industry || extractedIndustry;

    // Current DB user for mutual follow checking
    let currentDbUser: any = null;
    if (params.currentUserId) {
      currentDbUser = await prisma.user.findUnique({
        where: { clerkId: params.currentUserId },
        include: { followers: true, following: true }
      });
    }

    const results: SearchResultItem[] = [];

    // Category Counters
    let peopleCount = 0;
    let foundersCount = 0;
    let investorsCount = 0;
    let startupsCount = 0;
    let postsCount = 0;
    let hashtagsCount = 0;

    // --- 1. SEARCH USERS / PEOPLE / FOUNDERS / INVESTORS ---
    if (['all', 'people', 'founders', 'investors'].includes(category)) {
      const userWhere: any = {};

      if (category === 'founders') userWhere.role = 'FOUNDER';
      else if (category === 'investors') userWhere.role = 'INVESTOR';
      else if (params.role) {
        const rUpper = params.role.toUpperCase();
        if (['FOUNDER', 'INVESTOR', 'USER'].includes(rUpper)) userWhere.role = rUpper;
      }

      if (params.openToInvestOnly) {
        userWhere.openToInvest = true;
      }
      if (params.ticketSize) {
        userWhere.ticketSize = { contains: params.ticketSize, mode: 'insensitive' };
      }
      if (locationFilter) {
        userWhere.location = { contains: locationFilter, mode: 'insensitive' };
      }

      if (searchQuery) {
        userWhere.OR = [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { email: { contains: searchQuery, mode: 'insensitive' } },
          { bio: { contains: searchQuery, mode: 'insensitive' } },
          { skills: { hasSome: [searchQuery] } },
          { interests: { hasSome: [searchQuery] } }
        ];
      }

      const users = await prisma.user.findMany({
        where: userWhere,
        include: {
          followers: { select: { followerId: true } },
          following: { select: { followingId: true } },
          startups: { select: { id: true, name: true } }
        },
        take: 30
      });

      for (const u of users) {
        const followersCount = u.followers.length;
        const isFollowing = currentDbUser ? u.followers.some(f => f.followerId === currentDbUser.id) : false;
        const followsMe = currentDbUser ? u.following.some(f => f.followingId === currentDbUser.id) : false;
        const isMutual = isFollowing && followsMe;

        const roleDisplay = u.role ? u.role : 'USER';
        let itemType: 'user' | 'founder' | 'investor' = 'user';
        if (u.role === 'FOUNDER') {
          itemType = 'founder';
          foundersCount++;
        } else if (u.role === 'INVESTOR') {
          itemType = 'investor';
          investorsCount++;
        } else {
          peopleCount++;
        }

        const score = searchQuery
          ? rankUser(
              {
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                bio: u.bio,
                skills: u.skills,
                interests: u.interests,
                location: u.location,
                openToInvest: u.openToInvest,
                ticketSize: u.ticketSize,
                followersCount,
                isMutual
              },
              searchQuery,
              params.role
            )
          : followersCount * 2 + (isMutual ? 30 : 0);

        results.push({
          id: u.id,
          type: itemType,
          title: u.name,
          subtitle: `${roleDisplay} ${u.location ? '• ' + u.location : ''}`,
          avatarOrLogo: u.avatarUrl,
          description: u.bio || (u.skills.length > 0 ? `Skills: ${u.skills.join(', ')}` : 'Noventra Ecosystem Member'),
          meta: {
            role: u.role,
            email: u.email,
            location: u.location,
            skills: u.skills,
            interests: u.interests,
            openToInvest: u.openToInvest,
            ticketSize: u.ticketSize,
            followersCount,
            isMutual,
            isFollowing,
            startups: u.startups
          },
          relevanceScore: score,
          highlightSnippet: extractSnippet(u.bio || u.name, searchQuery)
        });
      }
    }

    // --- 2. SEARCH STARTUPS / ORGANIZATIONS ---
    if (['all', 'startups'].includes(category)) {
      const startupWhere: any = {};

      if (industryFilter) startupWhere.industry = { contains: industryFilter, mode: 'insensitive' };
      if (stageFilter) startupWhere.stage = { contains: stageFilter, mode: 'insensitive' };
      if (locationFilter) startupWhere.location = { contains: locationFilter, mode: 'insensitive' };

      if (searchQuery) {
        startupWhere.OR = [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { industry: { contains: searchQuery, mode: 'insensitive' } },
          { tagline: { contains: searchQuery, mode: 'insensitive' } },
          { requiredRoles: { hasSome: [searchQuery] } }
        ];
      }

      const startups = await prisma.startup.findMany({
        where: startupWhere,
        include: {
          founder: { select: { id: true, name: true, email: true, avatarUrl: true } },
          teamMembers: { select: { id: true } }
        },
        take: 30
      });

      startupsCount = startups.length;

      for (const s of startups) {
        const score = searchQuery
          ? rankStartup(
              {
                id: s.id,
                name: s.name,
                description: s.description,
                industry: s.industry,
                stage: s.stage,
                location: s.location,
                requiredRoles: s.requiredRoles,
                fundingNeeded: s.fundingNeeded,
                teamSize: s.teamSize
              },
              searchQuery
            )
          : s.teamSize * 5;

        results.push({
          id: s.id,
          type: 'startup',
          title: s.name,
          subtitle: `${s.stage} Stage • ${s.industry} • ${s.location}`,
          avatarOrLogo: s.logo,
          description: s.description,
          meta: {
            industry: s.industry,
            stage: s.stage,
            location: s.location,
            requiredRoles: s.requiredRoles,
            fundingNeeded: s.fundingNeeded,
            teamSize: s.teamSize,
            founder: s.founder
          },
          relevanceScore: score,
          highlightSnippet: extractSnippet(s.description, searchQuery)
        });
      }
    }

    // --- 3. SEARCH POSTS & HASHTAGS ---
    if (['all', 'posts', 'hashtags'].includes(category)) {
      const postWhere: any = {};
      if (searchQuery) {
        postWhere.content = { contains: searchQuery, mode: 'insensitive' };
      }

      const posts = await prisma.post.findMany({
        where: postWhere,
        include: {
          author: { select: { id: true, name: true, role: true, avatarUrl: true } },
          startup: { select: { id: true, name: true, logo: true } },
          likes: { select: { userId: true } },
          comments: { select: { id: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 30
      });

      postsCount = posts.length;

      for (const p of posts) {
        const likesCount = p.likes.length;
        const commentsCount = p.comments.length;

        const score = searchQuery
          ? rankPost(
              {
                id: p.id,
                content: p.content,
                postType: p.postType,
                createdAt: p.createdAt,
                likesCount,
                commentsCount
              },
              searchQuery
            )
          : likesCount * 3 + commentsCount * 4;

        const isHashtagMatch = searchQuery.startsWith('#') || p.content.toLowerCase().includes(`#${searchQuery.toLowerCase()}`);
        if (isHashtagMatch) hashtagsCount++;

        results.push({
          id: p.id,
          type: isHashtagMatch && category === 'hashtags' ? 'hashtag' : 'post',
          title: p.author ? p.author.name : 'Community Post',
          subtitle: `Posted on ${new Date(p.createdAt).toLocaleDateString()} ${p.startup ? '• ' + p.startup.name : ''}`,
          avatarOrLogo: p.author ? p.author.avatarUrl : null,
          description: p.content,
          meta: {
            postType: p.postType,
            mediaUrl: p.mediaUrl,
            likesCount,
            commentsCount,
            author: p.author,
            startup: p.startup
          },
          relevanceScore: score,
          highlightSnippet: extractSnippet(p.content, searchQuery)
        });
      }
    }

    // Sort combined results by relevance score descending
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Apply cursor-based slicing
    let startIndex = 0;
    if (params.cursor) {
      const idx = results.findIndex(item => item.id === params.cursor);
      if (idx !== -1) {
        startIndex = idx + 1;
      }
    }

    const paginatedResults = results.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < results.length;
    const nextCursor = hasMore && paginatedResults.length > 0 ? paginatedResults[paginatedResults.length - 1].id : null;

    return {
      results: paginatedResults,
      categoriesCount: {
        people: peopleCount,
        founders: foundersCount,
        investors: investorsCount,
        startups: startupsCount,
        posts: postsCount,
        hashtags: hashtagsCount
      },
      nextCursor,
      hasMore,
      parsedQueryFilter: {
        rawQuery: rawQ,
        extractedLocation,
        extractedStage,
        extractedIndustry
      }
    };
  }

  /**
   * Zero-Query Suggestions Endpoint
   * Returns Suggested Founders, Suggested Investors, Trending Startups, and Popular Topics.
   */
  static async getSuggestions(currentUserId?: string | null) {
    // 1. Recommended Founders
    const founders = await prisma.user.findMany({
      where: { role: 'FOUNDER' },
      select: { id: true, name: true, avatarUrl: true, location: true, role: true },
      take: 4
    });

    // 2. Recommended Investors
    const investors = await prisma.user.findMany({
      where: { role: 'INVESTOR', openToInvest: true },
      select: { id: true, name: true, avatarUrl: true, location: true, ticketSize: true, role: true },
      take: 4
    });

    // 3. Trending Startups
    const startups = await prisma.startup.findMany({
      select: { id: true, name: true, logo: true, stage: true, industry: true, teamSize: true },
      orderBy: { teamSize: 'desc' },
      take: 4
    });

    // 4. Popular Topics / Industries
    const topics = ['#AI', '#SaaS', '#Fintech', '#PreSeed', '#Web3', '#Hiring', '#FundingAlert'];

    return {
      suggestedFounders: founders,
      suggestedInvestors: investors,
      trendingStartups: startups,
      trendingTopics: topics
    };
  }

  /**
   * Trending Topics & Stats Endpoint
   */
  static async getTrending() {
    const startups = await prisma.startup.findMany({
      select: { industry: true, stage: true }
    });

    const industryCounts: Record<string, number> = {};
    startups.forEach(s => {
      if (s.industry) {
        industryCounts[s.industry] = (industryCounts[s.industry] || 0) + 1;
      }
    });

    const sortedIndustries = Object.entries(industryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([industry]) => industry);

    const posts = await prisma.post.findMany({
      select: { content: true },
      take: 100
    });

    const hashtagsMap: Record<string, number> = {};
    posts.forEach(p => {
      const tags = p.content.match(/#[a-zA-Z0-9_]+/g);
      if (tags) {
        tags.forEach(t => {
          const lower = t.toLowerCase();
          hashtagsMap[lower] = (hashtagsMap[lower] || 0) + 1;
        });
      }
    });

    const trendingHashtags = Object.entries(hashtagsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);

    return {
      trendingIndustries: sortedIndustries,
      trendingHashtags: trendingHashtags.length > 0 ? trendingHashtags : ['#AI', '#SaaS', '#Fintech', '#Hiring', '#Funding']
    };
  }
}
