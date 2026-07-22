export interface Channel {
  id: string;
  name: string;
  avatarUrl: string;
  bannerUrl?: string;
  about?: string;
  subscribersCount: number;
  followersCount: number;
  userId: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  createdAt: string;
  discoveryScore?: number;
  achievements?: string[];
}

export interface VideoChapter {
  time: number; // in seconds
  title: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  views: number;
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  isLive: boolean;
  liveBadge: boolean;
  channelId: string;
  channel: Channel;
  createdAt: string;
  
  // AI content
  aiSummary?: string;
  keyTakeaways?: string[];
  chapters?: VideoChapter[];
  transcript?: string;
  
  categoryId?: string;
  tags?: string[];

  // Rich connection fields
  recommendationReason?: string;
  startupId?: string;
  founderId?: string;
  investorId?: string;
  learningPathId?: string;
  relatedShortIds?: string[];
  relatedPodcastIds?: string[];
  relatedJobIds?: string[];
  relatedEventIds?: string[];
  industry?: string;
  technology?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';

  // AI Knowledge Panel
  glossary?: { term: string; definition: string }[];
  githubRepo?: string;
  documentationLink?: string;
  quotes?: { quote: string; speaker: string; time: number }[];
}

export interface Short {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  views: number;
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  channelId: string;
  channel: Channel;
  createdAt: string;
  
  // Custom links
  relatedStartupId?: string;
  relatedStartupName?: string;
  relatedFounderId?: string;
  relatedFounderName?: string;
  aiSummary?: string;

  // Rich connection fields
  recommendationReason?: string;
  industry?: string;
  technology?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface PodcastGuest {
  name: string;
  role: string;
  avatar: string;
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  artworkUrl: string;
  duration: number; // in seconds
  views: number;
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  channelId: string;
  channel: Channel;
  createdAt: string;
  
  guestProfiles?: PodcastGuest[];
  relatedStartups?: { name: string; logo: string }[];
  aiSummary?: string;
  transcript?: string;
  chapters?: VideoChapter[];

  // Rich connection fields
  recommendationReason?: string;
  industry?: string;
  technology?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  relatedFounderId?: string;
  relatedStartupId?: string;
}

export interface PlaylistItem {
  id: string;
  playlistId: string;
  videoId?: string;
  video?: Video;
  shortId?: string;
  podcastId?: string;
  position: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  channelId: string;
  items: PlaylistItem[];
  createdAt: string;
}

export interface LearningLesson {
  id: string;
  title: string;
  duration: number; // in seconds
  videoId: string;
  completed: boolean;
  position: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: LearningLesson[];
  progress: number; // 0-100 percentage
  completed: boolean;
  instructor: {
    name: string;
    avatar: string;
    title: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userBadge?: 'founder' | 'investor' | 'developer' | 'creator';
  likesCount: number;
  createdAt: string;
  replies?: Comment[];
  parentId?: string;
}

export interface LiveStream {
  id: string;
  title: string;
  channel: Channel;
  description: string;
  liveBadge: boolean;
  viewerCount?: number;
  startsAt?: string; // ISO string if upcoming
  notificationSubscribed?: boolean;
}

export interface StartupMilestone {
  day: string;
  stage: string;
  title: string;
  description: string;
}

export interface StartupReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
}

export interface StartupRoadmap {
  title: string;
  target: string;
  status: 'completed' | 'in_progress' | 'planned';
}

export interface StartupEmployee {
  name: string;
  avatar: string;
  role: string;
}

export interface Startup {
  id: string;
  name: string;
  logo: string;
  banner: string;
  description: string;
  fundingStage: 'Pre-seed' | 'Seed' | 'Series A' | 'Series B' | 'Bootstrapped' | 'IPO';
  employeesCount: number;
  hiringStatus: 'Hiring' | 'Not Hiring';
  founderId: string;
  founderName: string;
  website: string;
  techStack: string[];
  metrics: {
    arr?: string;
    growth?: string;
    dau?: string;
    customers?: string;
  };
  industry: string;

  // Startup Launch Mode
  launchDay?: boolean;
  upvotesCount?: number;
  visitorsToday?: number;
  buildInPublicTimeline?: StartupMilestone[];
  reviews?: StartupReview[];
  launchVideoId?: string;
  launchPitch?: string;
  trendingRank?: number;

  // Final Immersive Details
  roadmap?: StartupRoadmap[];
  employees?: StartupEmployee[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  bannerUrl?: string;
  headline: string;
  bio: string;
  location: string;
  followersCount: number;
  followingCount: number;
  skills: string[];
  experience: {
    role: string;
    company: string;
    duration: string;
  }[];
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  recentActivity: string[];
  role: 'student' | 'founder' | 'developer' | 'investor' | 'mentor' | 'recruiter' | 'designer' | 'product_manager';
  channelId: string;
  discoveryScore?: number;
  achievements?: string[];
}

export interface InvestorProfile extends UserProfile {
  ticketSize: string;
  investmentFocus: string[];
  portfolioCount: number;
  investmentThesis?: string;
  followedStartupIds?: string[];
  portfolioStartupIds?: string[];
}

export interface CommunityPost {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  createdAt: string;
  content: string;
  likesCount: number;
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    totalVotes: number;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'virtual' | 'in_person';
  attendeeCount: number;
  thumbnail: string;
  tags: string[];
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyId: string;
  location: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
  salary: string;
  tags: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: 'Job' | 'Hackathon' | 'Co-Founder' | 'VC Seeking Startups' | 'Beta Testing' | 'Mentorship' | 'Accelerator' | 'Competition' | 'Open Source';
  organization: string;
  skillsRequired: string[];
  actionLink: string;
  metric?: string;
  deadline?: string;
}
