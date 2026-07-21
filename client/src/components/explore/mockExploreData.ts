import { ExploreCard, StartupItem, FounderItem, InvestorItem, DeveloperItem, ProjectItem, VideoItem, ArticleItem, JobItem, EventItem, BuildInPublicItem } from "./types";

export const mockStartups: StartupItem[] = [
  {
    id: "st-1",
    name: "DevMatrix AI",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    tagline: "Autonomous DevOps & Kubernetes Cloud Agents",
    industry: "DevTools",
    stage: "Seed",
    mrr: "$42,000 MRR",
    fundingRaised: "$2.4M",
    followersCount: 412,
    raisingStatus: "Raising $3.5M Seed",
    founderName: "Rohan Varma",
    founderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    upvotesCount: 384,
    launchRank: 1
  },
  {
    id: "st-2",
    name: "PayPulse Rails",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=150&auto=format&fit=crop&q=80",
    tagline: "Instant Global USDC & Fiat Payout API",
    industry: "FinTech",
    stage: "Pre-Seed",
    mrr: "$18,500 MRR",
    fundingRaised: "$750K",
    followersCount: 328,
    raisingStatus: "Closing Pre-Seed",
    founderName: "Elena Rostova",
    founderAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    upvotesCount: 295,
    launchRank: 2
  },
  {
    id: "st-3",
    name: "HyperScale DB",
    logo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=150&auto=format&fit=crop&q=80",
    tagline: "Distributed Sub-millisecond Vector Database for LLMs",
    industry: "AI & Data",
    stage: "Series A",
    mrr: "$120,000 MRR",
    fundingRaised: "$8.5M",
    followersCount: 890,
    raisingStatus: "Post Series A",
    founderName: "Alexander Vance",
    founderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    upvotesCount: 512,
    launchRank: 3
  }
];

export const mockFounders: FounderItem[] = [
  {
    id: "f-1",
    name: "Navadheer Nayudu",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    headline: "Co-Founder & CTO @ Noventra Core | Building Ecosystem OS",
    startupName: "Noventra Core",
    role: "FOUNDER",
    followersCount: 142,
    mutualCount: 18,
    verified: true
  },
  {
    id: "f-2",
    name: "Sarah Chen",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    headline: "Ex-Stripe | Building Autonomous BioTech Workflows",
    startupName: "BioSynth Labs",
    role: "FOUNDER",
    followersCount: 530,
    mutualCount: 24,
    verified: true
  }
];

export const mockInvestors: InvestorItem[] = [
  {
    id: "inv-1",
    name: "Marcus Aurelius Vance",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    firmName: "Apex Capital Syndicate",
    ticketSize: "$50k - $250k",
    thesis: "Backing early-stage AI Infrastructure, B2B SaaS & DevTools founders.",
    industries: ["AI", "DevTools", "SaaS", "FinTech"],
    portfolioCount: 28
  },
  {
    id: "inv-2",
    name: "Jessica Albright",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    firmName: "Sequoia Partner Syndicate",
    ticketSize: "$100k - $1M",
    thesis: "Seed & Series A in DeepTech, Quantum Computing & Robotics.",
    industries: ["DeepTech", "Robotics", "AI"],
    portfolioCount: 42
  }
];

export const mockDevelopers: DeveloperItem[] = [
  {
    id: "dev-1",
    name: "Leo Zhang",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    role: "Staff AI Infrastructure Engineer",
    stack: ["TypeScript", "Rust", "Next.js", "PyTorch"],
    githubStars: 1420,
    openToWork: true,
    topRepo: "vector-mesh-node"
  }
];

export const mockProjects: ProjectItem[] = [
  {
    id: "proj-1",
    title: "Noventra Realtime Signaling Mesh",
    description: "Ultra-low latency WebRTC mesh protocol for collaborative code editing.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    techStack: ["TypeScript", "WebRTC", "Socket.io", "Redis"],
    githubUrl: "https://github.com/noventra/mesh",
    demoUrl: "https://mesh.noventra.io",
    stars: 840,
    views: 3400
  }
];

export const mockVideos: VideoItem[] = [
  {
    id: "vid-1",
    title: "How We Scaled Noventra AI to 10k Active Users in 30 Days",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    duration: "14:20",
    views: 12400,
    creatorName: "Navadheer Nayudu",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  }
];

export const mockArticles: ArticleItem[] = [
  {
    id: "art-1",
    title: "The 2026 Guide to Raising Pre-Seed Capital Without a Pitch Deck",
    summary: "Why proof of execution, customer traction metrics, and live product demos beat 30-slide pitch decks every single time.",
    authorName: "Sarah Chen",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    readTime: "6 min read",
    tags: ["Fundraising", "Pre-Seed", "GTM"],
    publishedAt: "2 days ago"
  }
];

export const mockJobs: JobItem[] = [
  {
    id: "job-1",
    roleTitle: "Lead AI Engineer (Autonomous Agents)",
    companyName: "DevMatrix AI",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    salaryRange: "$160,000 - $220,000 + 1.5% Equity",
    location: "San Francisco, CA",
    remote: true,
    jobType: "Full-Time"
  }
];

export const mockEvents: EventItem[] = [
  {
    id: "evt-1",
    title: "Noventra Global AI Pitch Night #14",
    date: "Tomorrow, 6:00 PM PST",
    location: "Online / SF Hub",
    attendeesCount: 380,
    organizer: "Noventra Syndicate",
    isHackathon: false
  },
  {
    id: "evt-2",
    title: "Autonomous Agent Hackathon 2026",
    date: "Jul 28 - Jul 30",
    location: "Global Virtual",
    attendeesCount: 840,
    organizer: "DevMatrix AI",
    isHackathon: true
  }
];

export const mockBuildInPublic: BuildInPublicItem[] = [
  {
    id: "bip-1",
    founderName: "Rohan Varma",
    founderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    startupName: "DevMatrix AI",
    milestoneTitle: "Hit $42,000 MRR Milestone! 🚀",
    updateText: "Just crossed 120 paying enterprise teams using our autonomous Kubernetes agents. Scaling up server instances today.",
    metricBadge: "+28.4% MRR YoY",
    timestamp: "3 hours ago"
  }
];

export const mockExploreFeed: ExploreCard[] = [
  { id: "c-1", type: "startup", data: mockStartups[0] },
  { id: "c-2", type: "founder", data: mockFounders[0] },
  { id: "c-3", type: "investor", data: mockInvestors[0] },
  { id: "c-4", type: "video", data: mockVideos[0] },
  { id: "c-5", type: "project", data: mockProjects[0] },
  { id: "c-6", type: "startup", data: mockStartups[1] },
  { id: "c-7", type: "article", data: mockArticles[0] },
  { id: "c-8", type: "job", data: mockJobs[0] },
  { id: "c-9", type: "event", data: mockEvents[0] },
  { id: "c-10", type: "build_in_public", data: mockBuildInPublic[0] },
  { id: "c-11", type: "startup", data: mockStartups[2] },
  { id: "c-12", type: "investor", data: mockInvestors[1] }
];
