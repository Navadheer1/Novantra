/**
 * Universal Relevance Ranking Engine for Noventra Search System
 * Computes multi-factor relevance scores considering text matches, social proof, recency, and activity.
 */

export interface RankableUser {
  id: string;
  name: string;
  email: string;
  role: string | null;
  bio: string | null;
  skills: string[];
  interests: string[];
  location: string | null;
  openToInvest?: boolean;
  ticketSize?: string | null;
  followersCount?: number;
  isMutual?: boolean;
}

export interface RankableStartup {
  id: string;
  name: string;
  description: string;
  industry: string;
  stage: string;
  location: string;
  requiredRoles: string[];
  fundingNeeded?: string | null;
  teamSize?: number;
}

export interface RankablePost {
  id: string;
  content: string;
  postType: string;
  createdAt: Date | string;
  likesCount?: number;
  commentsCount?: number;
}

/**
 * Calculates a relevance score for a User record
 */
export function rankUser(user: RankableUser, query: string, targetRoleFilter?: string): number {
  let score = 0;
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const nameLower = user.name.toLowerCase();
  const emailLower = user.email.toLowerCase();
  const bioLower = (user.bio || '').toLowerCase();
  const locationLower = (user.location || '').toLowerCase();

  // 1. Text Match Scores
  if (nameLower === q || emailLower === q) {
    score += 100;
  } else if (nameLower.startsWith(q)) {
    score += 60;
  } else if (nameLower.includes(q)) {
    score += 35;
  }

  if (bioLower.includes(q)) score += 20;
  if (locationLower.includes(q)) score += 15;

  // Skills & Interests Match
  const skillMatch = user.skills.some(s => s.toLowerCase().includes(q));
  if (skillMatch) score += 25;

  const interestMatch = user.interests.some(i => i.toLowerCase().includes(q));
  if (interestMatch) score += 15;

  // 2. Role Alignment Boost
  if (targetRoleFilter && user.role) {
    if (user.role.toLowerCase() === targetRoleFilter.toLowerCase()) {
      score += 30;
    }
  }

  // 3. Social & Availability Signals
  if (user.followersCount) {
    score += Math.min(user.followersCount * 2, 40);
  }
  if (user.isMutual) {
    score += 50; // High boost for mutual network connections
  }
  if (user.openToInvest) {
    score += 20; // Investor availability boost
  }

  return score;
}

/**
 * Calculates a relevance score for a Startup record
 */
export function rankStartup(startup: RankableStartup, query: string): number {
  let score = 0;
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const nameLower = startup.name.toLowerCase();
  const descLower = startup.description.toLowerCase();
  const industryLower = startup.industry.toLowerCase();
  const stageLower = startup.stage.toLowerCase();
  const locationLower = startup.location.toLowerCase();

  // 1. Text Match Scores
  if (nameLower === q) {
    score += 100;
  } else if (nameLower.startsWith(q)) {
    score += 60;
  } else if (nameLower.includes(q)) {
    score += 40;
  }

  if (industryLower.includes(q)) score += 35;
  if (stageLower.includes(q)) score += 25;
  if (descLower.includes(q)) score += 20;
  if (locationLower.includes(q)) score += 15;

  // Required roles match
  const roleMatch = startup.requiredRoles.some(r => r.toLowerCase().includes(q));
  if (roleMatch) score += 25;

  // 2. Growth & Activity Signals
  if (startup.teamSize) {
    score += Math.min(startup.teamSize * 3, 30);
  }
  if (startup.fundingNeeded && Number(startup.fundingNeeded) > 0) {
    score += 15;
  }

  return score;
}

/**
 * Calculates a relevance score for a Post record
 */
export function rankPost(post: RankablePost, query: string): number {
  let score = 0;
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const contentLower = post.content.toLowerCase();

  // 1. Hashtag / Term Match
  if (contentLower.includes(`#${q}`)) {
    score += 80;
  } else if (contentLower.includes(q)) {
    score += 40;
  }

  // 2. Engagement Signals
  if (post.likesCount) score += Math.min(post.likesCount * 3, 30);
  if (post.commentsCount) score += Math.min(post.commentsCount * 4, 30);

  // 3. Recency Boost
  const created = new Date(post.createdAt).getTime();
  const now = Date.now();
  const hoursOld = (now - created) / (1000 * 60 * 60);
  if (hoursOld < 24) score += 25;
  else if (hoursOld < 72) score += 15;

  return score;
}
