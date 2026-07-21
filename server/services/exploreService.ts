import { getWeeklySpotlight } from '../modules/spotlight';
import { getFeaturedStartups } from '../modules/startups';
import { getDiscoverFounders } from '../modules/founders';
import { getDiscoverInvestors } from '../modules/investors';
import { getFundingActivity } from '../modules/funding';
import { getStartupsHiringNow } from '../modules/hiring';
import { getTrendingModule } from '../modules/trends';
import { getStartupNews } from '../modules/news';
import { getRecommendations } from '../modules/recommendations';

export interface ExploreFilterParams {
  goal?: string;
  industry?: string;
  stage?: string;
  location?: string;
  hiringOnly?: boolean;
  openToInvestOnly?: boolean;
  remoteOnly?: boolean;
  currentUserId?: string | null;
}

export class ExploreService {
  /**
   * Aggregates all 14 discovery modules into a unified Explore payload.
   */
  static async getExploreHub(params: ExploreFilterParams) {
    const [
      spotlight,
      featuredStartups,
      discoverFounders,
      discoverInvestors,
      fundingActivity,
      hiringStartups,
      trending,
      news,
      recommendations
    ] = await Promise.all([
      getWeeklySpotlight(),
      getFeaturedStartups({ industry: params.industry, stage: params.stage, location: params.location }),
      getDiscoverFounders(params.location),
      getDiscoverInvestors({ openToInvestOnly: params.openToInvestOnly, location: params.location }),
      getFundingActivity(),
      getStartupsHiringNow(params.location),
      getTrendingModule(),
      getStartupNews(),
      getRecommendations(params.currentUserId)
    ]);

    // Categories Breakdown
    const startupCategories = [
      { name: 'AI & Machine Learning', count: 48, icon: 'Sparkles', tag: 'AI' },
      { name: 'SaaS & Enterprise', count: 34, icon: 'Building2', tag: 'SaaS' },
      { name: 'Fintech & Capital', count: 29, icon: 'DollarSign', tag: 'FinTech' },
      { name: 'HealthTech & Bio', count: 18, icon: 'Heart', tag: 'HealthTech' },
      { name: 'Web3 & Decentralized', count: 15, icon: 'Hash', tag: 'Web3' },
      { name: 'Robotics & Hardware', count: 12, icon: 'Cpu', tag: 'Robotics' }
    ];

    return {
      spotlight,
      featuredStartups,
      discoverFounders,
      discoverInvestors,
      fundingActivity,
      hiringStartups,
      trendingPosts: trending.trendingPosts,
      trendingHashtags: trending.trendingHashtags,
      trendingTopics: trending.trendingTopics,
      news,
      recommendations,
      startupCategories,
      activeFilters: {
        goal: params.goal || 'all',
        industry: params.industry || null,
        stage: params.stage || null,
        location: params.location || null,
        hiringOnly: !!params.hiringOnly,
        openToInvestOnly: !!params.openToInvestOnly
      }
    };
  }
}
