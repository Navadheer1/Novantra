export type ViewMode = "masonry" | "grid" | "launchpad" | "videos" | "radar" | "map";

export type CategoryType = 
  | "trending"
  | "startups"
  | "developers"
  | "investors"
  | "foundertv"
  | "jobs"
  | "learning"
  | "ai"
  | "podcasts"
  | "hackathons"
  | "news"
  | "fundraising"
  | "global"
  | "following"
  | "bookmarks";

export interface StartupItem {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  industry: string;
  stage: string;
  mrr?: string;
  fundingRaised?: string;
  followersCount: number;
  raisingStatus: string;
  founderName: string;
  founderAvatar: string;
  upvotesCount?: number;
  launchRank?: number;
}

export interface FounderItem {
  id: string;
  name: string;
  avatarUrl: string;
  headline: string;
  startupName: string;
  role: string;
  followersCount: number;
  mutualCount: number;
  verified: boolean;
}

export interface InvestorItem {
  id: string;
  name: string;
  avatarUrl: string;
  firmName: string;
  ticketSize: string;
  thesis: string;
  industries: string[];
  portfolioCount: number;
}

export interface DeveloperItem {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  stack: string[];
  githubStars: number;
  openToWork: boolean;
  topRepo: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  githubUrl: string;
  demoUrl: string;
  stars: number;
  views: number;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  creatorName: string;
  creatorAvatar: string;
  videoUrl?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  summary: string;
  authorName: string;
  authorAvatar: string;
  readTime: string;
  tags: string[];
  publishedAt: string;
}

export interface JobItem {
  id: string;
  roleTitle: string;
  companyName: string;
  companyLogo: string;
  salaryRange: string;
  location: string;
  remote: boolean;
  jobType: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  attendeesCount: number;
  organizer: string;
  isHackathon?: boolean;
}

export interface BuildInPublicItem {
  id: string;
  founderName: string;
  founderAvatar: string;
  startupName: string;
  milestoneTitle: string;
  updateText: string;
  metricBadge: string;
  timestamp: string;
}

export interface ExploreCard {
  id: string;
  type: 
    | "startup"
    | "founder"
    | "investor"
    | "developer"
    | "project"
    | "video"
    | "article"
    | "job"
    | "event"
    | "build_in_public";
  data: any;
}
