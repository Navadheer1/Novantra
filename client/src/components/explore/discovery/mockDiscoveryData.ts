import { Video, Channel, Short, Podcast, LearningPath, Comment, LiveStream, Startup, UserProfile, InvestorProfile, CommunityPost, Event, Job, Opportunity, StartupMilestone, StartupReview, StartupRoadmap, StartupEmployee } from './types';

// Deterministic Seeded Random Generator (LCG)
function createSeededRandom(seed: number) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rnd = createSeededRandom(205);

// Arrays of realistic strings for mock data generation
const FIRST_NAMES = ["Nayud", "Jari", "Sarah", "Patrick", "Alex", "Lee", "Guillermo", "Arvid", "Pieter", "Cory", "Dan", "Sophie", "Michael", "Emily", "David", "Jessica", "James", "Olivia", "Daniel", "Sophia", "Robert", "Isabella", "William", "Mia", "John", "Charlotte", "Joseph", "Amelia", "Thomas", "Harper", "Charles", "Evelyn", "Christopher", "Abigail", "Matthew", "Emily", "Andrew", "Elizabeth", "Richard", "Sofia", "Mark", "Avery", "Paul", "Ella", "Steven", "Madison", "Kenneth", "Scarlett", "George", "Victoria", "Edward", "Aria", "Brian", "Grace", "Ronald", "Chloe", "Anthony", "Camila", "Kevin", "Penelope", "Jason", "Layla", "Gary", "Zoey", "Timothy", "Nora", "Jose", "Lily", "Larry", "Eleanor", "Jeffrey", "Hannah", "Frank", "Lillian", "Justin", "Natalie", "Brandon", "Grace", "Benjamin", "Samuel", "Gregory", "Zoe", "Walter", "Albert", "Audrey", "Jeremy", "Claire", "Philip", "Bella"];
const LAST_NAMES = ["Nayudu", "Vance", "Chen", "Collison", "Rivera", "Robinson", "Rauch", "Kahl", "Levels", "House", "Abramov", "Alpert", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee", "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Perez", "Hall", "Young", "Allen", "Sanchez", "Wright", "King", "Scott", "Green", "Baker", "Adams", "Nelson", "Hill", "Ramirez", "Campbell", "Mitchell", "Roberts", "Carter", "Phillips", "Evans", "Turner", "Torres", "Parker", "Collins", "Edwards", "Stewart", "Flores", "Morris", "Nguyen", "Murphy", "Cook", "Rogers", "Morgan", "Peterson", "Cooper", "Reed", "Bailey", "Bell", "Gomez", "Ward", "Watson", "Brooks", "Kelly", "Sanders", "Price"];

const STARTUP_PREFIXES = ["Nova", "Sync", "Flow", "Zentry", "Apex", "Kortex", "Velo", "Aura", "Helix", "Scribe", "Logix", "Quant", "Cypher", "Zenith", "Breeze", "Cogni", "Optima", "Veritas", "Nexus", "Pulse", "Zeta", "Modus", "Omni", "Lumina", "Hyper", "Vortex", "Aether", "Sentry", "Aero", "Draft", "Swift", "Spectra", "Byte", "Vector", "Code", "Web", "Signal", "Core", "Cloud", "Grid"];
const STARTUP_SUFFIXES = ["AI", "SaaS", "Labs", "Tech", "Flow", "Link", "Scale", "Grid", "Base", "Core", "Engine", "Network", "Systems", "Hub", "Space", "Studio", "Compute", "Security", "Graph", "Metrics"];

const INDUSTRIES = ["AI SaaS", "FinTech", "Healthcare", "Robotics", "EdTech", "Climate", "Cybersecurity", "Developer Tools"];
const LOCATIONS = ["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Remote", "London, UK", "Berlin, Germany", "Amsterdam, Netherlands", "Singapore", "Tokyo, Japan", "Bengaluru, India"];
const SKILLS = ["System Design", "UI/UX Design", "Full Stack Dev", "Machine Learning", "Database Scaling", "Product Management", "Growth Marketing", "Fundraising", "API Development", "Cloud Architecture", "DevOps", "Cybersecurity", "React", "Next.js", "Rust", "Node.js", "Python", "Go", "Kubernetes", "Docker", "PyTorch", "OpenAI", "Supabase", "PostgreSQL"];
const COMPANIES = ["Google", "Meta", "Stripe", "Vercel", "Linear", "Airbnb", "Uber", "Netflix", "Microsoft", "OpenAI", "Supabase", "GitLab"];
const ACHIEVEMENTS_LIST = [
  "Founder", "Top Creator", "Top Mentor", "Investor", "Hackathon Winner",
  "AI Expert", "Open Source Contributor", "Verified Startup", "Early Adopter"
];

const UNSPLASH_IDS = [
  "1558494949-ef010cbdcc31", "1507238691740-187a5b1d37b8", "1633356122544-f134324a6cee", "1542744094-2ab25be78b90",
  "1618005182384-a83a8bd57fbe", "1620121692029-d088224ddc74", "1618005198143-d3667c2d28a8", "1579546929518-9e396f3cc809",
  "1634017839464-5c339ebe3cb4", "1478737270239-2f02b77fc618", "1590602847861-f357a9332bbc", "1494790108377-be9c29b29330",
  "1507003211169-0a1dd7228f2d", "1500648767791-00dcc994a43e", "1472099645785-5658abf4ff4e", "1519085360753-af0119f7cbe7",
  "1534528741775-53994a69daeb", "1580489944761-15a19d654956", "1539571696357-5a69c17a67c6", "1506794778202-cad84cf45f1d",
  "1573164713714-d95e436ab8d6", "1531403009284-440f080d1e12", "1517694712202-14dd9538aa97", "1522071820081-009f0129c71c",
  "1531297484001-80022131f5a1", "1550751827-4bd374c3f58b", "1451187580459-43490279c0fa", "1488590528505-98d2b5aba04b",
  "1518770660439-4636190af475", "1526374965328-7f61d4dc18c5", "1535378917042-10a22c95931a", "1581092921461-eab62e97a780",
  "1516321318423-f06f85e504b3", "1501504905252-473c47e087f8", "1473116763269-25541579ffb7", "1466611653911-95081537e5b7",
  "1563986768609-322da13575f3", "1559526324-4b87b5e36e44", "1576091160550-2173dba999ef", "1530026405186-ed1ea46073e5",
  "1516321497487-e2b196923624", "1515378791036-0648a3ef77b2", "1607799279861-4dd421887fb3", "1614064641938-3bbee52942c7",
  "1600132806370-bf17e65e942f", "1551288049-bebda4e38f71", "1551836022-d5d88e9218df", "1523240795612-9a054b0db644"
];

// Helper to choose item
function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

function makeFullName(index: number): string {
  if (index === 0) return "Nayud Nayudu";
  if (index === 1) return "Jari Vance";
  if (index === 2) return "Sarah Chen";
  if (index === 3) return "Patrick Collison";
  return `${pick(FIRST_NAMES, index)} ${pick(LAST_NAMES, index + 3)}`;
}

// 1. GENERATE FOUNDERS (100) & INVESTORS (40)
export const mockFounders: UserProfile[] = [];
export const mockInvestors: InvestorProfile[] = [];
export const mockChannels: Channel[] = [];

// Founders
for (let i = 0; i < 100; i++) {
  const name = makeFullName(i);
  const handle = name.toLowerCase().replace(/\s+/g, "");
  const industry = pick(INDUSTRIES, i);
  const score = 78 + (i % 18);
  const achievements = [pick(ACHIEVEMENTS_LIST, i), pick(ACHIEVEMENTS_LIST, i + 3)];
  if (i === 0) achievements.push("AI Expert", "Verified Startup");

  mockFounders.push({
    id: `founder-${i}`,
    name,
    avatarUrl: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i + 12)}?w=150&auto=format&fit=crop&q=80`,
    bannerUrl: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i + 7)}?w=1200&auto=format&fit=crop&q=80`,
    headline: i === 0 ? "Founder, Noventra | Building YouTube for Builders" : `Founder & CEO at a stealth ${industry} venture`,
    bio: `Passionate builder. Focused on solving complex scale problems in ${industry}. Ex-engineering manager, open-source maintainer.`,
    location: pick(LOCATIONS, i),
    followersCount: Math.floor(1200 + (i * 453)),
    followingCount: Math.floor(100 + (i * 9)),
    skills: [pick(SKILLS, i * 2), pick(SKILLS, i * 2 + 1), "API Design", "Next.js"],
    experience: [
      { role: "Senior Software Engineer", company: pick(COMPANIES, i), duration: "3 years" },
      { role: "Engineering Lead", company: pick(COMPANIES, i + 1), duration: "2 years" }
    ],
    socialLinks: { twitter: `${handle}_x`, linkedin: `${handle}_lnk`, github: handle },
    recentActivity: [
      `Just launched our new product updates today! Check it out.`,
      `API response times dropped by 45% after swapping queries to batch modes.`
    ],
    role: "founder",
    channelId: `ch-founder-${i}`,
    discoveryScore: score,
    achievements
  });

  mockChannels.push({
    id: `ch-founder-${i}`,
    name: i === 0 ? "Noventra HQ" : `${name} Logs`,
    avatarUrl: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i + 12)}?w=150&auto=format&fit=crop&q=80`,
    bannerUrl: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i + 7)}?w=1200&auto=format&fit=crop&q=80`,
    about: `Official coding logs, startup design updates, and architectural walkthroughs by ${name}.`,
    subscribersCount: Math.floor(800 + (i * 382)),
    followersCount: Math.floor(1200 + (i * 453)),
    userId: `founder-${i}`,
    createdAt: `2024-0${1 + (i % 9)}-${10 + (i % 18)}`,
    discoveryScore: score,
    achievements
  });
}

// Special channels
mockChannels.unshift({
  id: 'ch-linear',
  name: 'Linear Labs',
  avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80',
  about: 'Engineering beautiful software. Tips, design guidelines, and system architecture deep dives by the creators of Linear.',
  subscribersCount: 24500,
  followersCount: 12400,
  userId: 'founder-1',
  createdAt: '2023-01-15',
  discoveryScore: 94,
  achievements: ["Founder", "Top Creator"]
}, {
  id: 'ch-stripe',
  name: 'Stripe Devs',
  avatarUrl: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=100&auto=format&fit=crop&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  about: 'Payment integrations, API designs, and global financial infrastructure. Build in public with the Stripe Developer Relations team.',
  subscribersCount: 48900,
  followersCount: 31000,
  userId: 'founder-3',
  createdAt: '2022-06-20',
  discoveryScore: 97,
  achievements: ["Verified Startup", "OS Contributor"]
}, {
  id: 'ch-vercel',
  name: 'Vercel TV',
  avatarUrl: 'https://images.unsplash.com/photo-1618005198143-d3667c2d28a8?w=100&auto=format&fit=crop&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80',
  about: 'Frontend Cloud infrastructure, Next.js releases, and developer experience breakdowns. Optimize for Web Vitals with us.',
  subscribersCount: 95400,
  followersCount: 62000,
  userId: 'founder-5',
  createdAt: '2021-02-10',
  discoveryScore: 98,
  achievements: ["Verified Startup", "Top Creator"]
});

// Investors
for (let i = 0; i < 40; i++) {
  const name = makeFullName(i + 105);
  const handle = name.toLowerCase().replace(/\s+/g, "");
  const focuses = [pick(INDUSTRIES, i * 2), pick(INDUSTRIES, i * 2 + 1)];
  const score = 80 + (i % 18);
  const achievements = ["Investor", pick(ACHIEVEMENTS_LIST, i + 2)];

  mockInvestors.push({
    id: `investor-${i}`,
    name,
    avatarUrl: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i + 15)}?w=150&auto=format&fit=crop&q=80`,
    bannerUrl: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i + 1)}?w=1200&auto=format&fit=crop&q=80`,
    headline: i % 2 === 0 ? `Managing Partner at Sequoia Capital` : `General Partner, A16z Tech Fund`,
    bio: `Investing in early-stage pre-seed and seed founders building the next decade of infrastructure. Focus: ${focuses.join(", ")}.`,
    location: pick(LOCATIONS, i + 2),
    followersCount: Math.floor(5000 + (i * 1234)),
    followingCount: Math.floor(200 + (i * 11)),
    skills: ["Seed Funding", "Cap Table Roast", "Series A scaling", "B2B SaaS GTM"],
    experience: [
      { role: "Principal Investor", company: "A16Z", duration: "4 years" },
      { role: "Venture Partner", company: "Sequoia", duration: "3 years" }
    ],
    socialLinks: { twitter: `${handle}_vc`, linkedin: `${handle}_capital`, website: `https://${handle}invest.com` },
    recentActivity: [
      `Delighted to announce our co-investment in a new healthcare automation tool!`,
      `We review pitch decks live every Friday on FounderTV.`
    ],
    role: "investor",
    channelId: `ch-investor-${i}`,
    ticketSize: i % 3 === 0 ? "$50k - $250k" : i % 3 === 1 ? "$250k - $1M" : "$1M - $5M",
    investmentFocus: focuses,
    portfolioCount: 8 + (i * 2),
    discoveryScore: score,
    achievements,
    investmentThesis: `Backing developer-first utility suites and AI core nodes that prove product market fit early.`,
    followedStartupIds: [`startup-${i % 10}`, `startup-${(i + 1) % 10}`],
    portfolioStartupIds: [`startup-${(i + 2) % 10}`, `startup-${(i + 3) % 10}`]
  });

  mockChannels.push({
    id: `ch-investor-${i}`,
    name: `${name} VC Insights`,
    avatarUrl: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i + 15)}?w=150&auto=format&fit=crop&q=80`,
    bannerUrl: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i + 1)}?w=1200&auto=format&fit=crop&q=80`,
    about: `Valuable fundraising advice, pitch deck breakdowns, and market analyses by veteran venture capitalist ${name}.`,
    subscribersCount: Math.floor(2000 + (i * 592)),
    followersCount: Math.floor(5000 + (i * 1234)),
    userId: `investor-${i}`,
    createdAt: `2023-11-${10 + (i % 18)}`,
    discoveryScore: score,
    achievements
  });
}

// 2. GENERATE STARTUPS (60)
export const mockStartups: Startup[] = [];
for (let i = 0; i < 60; i++) {
  const prefix = pick(STARTUP_PREFIXES, i);
  const suffix = pick(STARTUP_SUFFIXES, i + 5);
  const name = i === 0 ? "Noventra" : i === 1 ? "Linear" : i === 2 ? "Stripe" : i === 3 ? "Vercel" : `${prefix}${suffix}`;
  
  const founderIndex = i % mockFounders.length;
  const founder = mockFounders[founderIndex];
  const industry = pick(INDUSTRIES, i * 3);
  const stage = i % 5 === 0 ? "Pre-seed" : i % 5 === 1 ? "Seed" : i % 5 === 2 ? "Series A" : i % 5 === 3 ? "Series B" : "Bootstrapped";
  
  const stackCount = 4 + (i % 3);
  const startupStack: string[] = [];
  for (let k = 0; k < stackCount; k++) {
    startupStack.push(pick(SKILLS, i * 4 + k + 10));
  }

  // Startup Launch Mode Data (Product Hunt Style)
  const isLaunch = i < 15;
  const upvotes = isLaunch ? 150 + (i * 45) : 0;
  const visitors = isLaunch ? 450 + (i * 210) : 0;
  
  const milestones: StartupMilestone[] = [
    { day: "Day 1", stage: "Prototype", title: "Core Repository Created", description: `Initialized the Next.js workspace and declared state models.` },
    { day: "Day 15", stage: "Beta Testing", title: "Beta Invites Sent", description: `Shared access with 100 beta builders and configured logging.` },
    { day: "Day 30", stage: "Production Launch", title: "Official Noventra Launch", description: `Officially launched today to the wider ecosystem!` },
    { day: "Day 60", stage: "100 Users", title: "Milestone: 100 active customers", description: `Reverberated growth milestones through B2B channels.` }
  ];

  const roadmap: StartupRoadmap[] = [
    { title: "Swapping Postgres mode to serverless Neon layers", target: "Q3 2026", status: "in_progress" },
    { title: "Swapping standard web sockets for RPC mode", target: "Q4 2026", status: "planned" },
    { title: "Build in Public prototype dashboard integration", target: "Q2 2026", status: "completed" }
  ];

  const employees: StartupEmployee[] = [
    { name: makeFullName((i + 1) * 3), avatar: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i + 3)}?w=100&q=80`, role: "Staff Frontend Architect" },
    { name: makeFullName((i + 2) * 3), avatar: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i + 8)}?w=100&q=80`, role: "Developer Relations Advocate" }
  ];

  const reviews: StartupReview[] = [
    { id: `rev-1-${i}`, userName: "David Dev", userAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80", rating: 5, comment: "Incredibly fast load speeds. Keyboard shortcuts are life-changing." },
    { id: `rev-2-${i}`, userName: "Sarah VC", userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", rating: 4, comment: "Massive market size, and the product is so polished. Outstanding execution!" }
  ];

  mockStartups.push({
    id: `startup-${i}`,
    name,
    logo: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i + 20)}?w=100&auto=format&fit=crop&q=80`,
    banner: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i + 2)}?w=1200&auto=format&fit=crop&q=80`,
    description: `A state-of-the-art ${industry} platform solving data pipelines and developer workflows at scale. Built for modern high-growth infrastructure.`,
    fundingStage: stage as any,
    employeesCount: 5 + (i * 4),
    hiringStatus: i % 3 === 0 ? "Hiring" : "Not Hiring",
    founderId: founder.id,
    founderName: founder.name,
    website: `https://${name.toLowerCase()}.io`,
    techStack: Array.from(new Set(startupStack)),
    metrics: {
      arr: i % 4 === 0 ? `$${200 + (i * 30)}K` : `$${1 + (i * 0.2)}M`,
      growth: `${15 + (i % 20)}% MoM`,
      dau: `${Math.floor(1200 + i * 943)} active users`,
      customers: `${20 + i * 5} Enterprise deals`
    },
    industry,
    launchDay: isLaunch,
    upvotesCount: upvotes,
    visitorsToday: visitors,
    buildInPublicTimeline: milestones,
    reviews,
    launchVideoId: `vid-${(i % 10) + 1}`,
    launchPitch: `We are building a highly fast, resilient client shell to query ${industry} stacks. Our core compiler is written in Rust to absorb heavy JSON processing.`,
    trendingRank: isLaunch ? (i % 5) + 1 : undefined,
    roadmap,
    employees
  });
}

// 3. GENERATE EVENTS (25)
export const mockEvents: Event[] = [];
const EVENT_TOPICS = ["Pitch Deck Roast LIVE", "Next.js Edge Caching Webinar", "AI Agents Integration Workshop", "Pre-seed VC Matchmaking", "Founder AMA session", "Global Builder Hackathon", "Postgres Scaling deep-dive"];
for (let i = 0; i < 25; i++) {
  const topic = pick(EVENT_TOPICS, i);
  mockEvents.push({
    id: `event-${i}`,
    title: `${topic} #${i + 1}`,
    description: `Join us for an interactive session addressing critical concepts, deployment benchmarks, and active developer Q&As regarding ${topic}.`,
    date: new Date(Date.now() + (i - 1) * 24 * 60 * 60 * 1000).toISOString(),
    location: i % 2 === 0 ? "Virtual Stream" : `San Francisco Hub`,
    type: i % 2 === 0 ? 'virtual' : 'in_person',
    attendeeCount: 45 + (i * 12),
    thumbnail: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i + 2)}?w=400&auto=format&fit=crop&q=80`,
    tags: [pick(SKILLS, i), pick(SKILLS, i + 2)]
  });
}

// 4. GENERATE JOBS (30)
export const mockJobs: Job[] = [];
const JOB_ROLES = ["Senior Next.js Developer", "Staff AI Architect", "Backend Systems Engineer", "Product UI/UX Lead", "Growth Marketing Lead", "DevOps Engineer (Kubernetes)", "Fullstack Rust Engineer"];
for (let i = 0; i < 30; i++) {
  const startup = pick(mockStartups, i);
  const role = pick(JOB_ROLES, i);
  mockJobs.push({
    id: `job-${i}`,
    title: role,
    companyName: startup.name,
    companyId: startup.id,
    location: i % 3 === 0 ? "Remote (US/EU)" : startup.name === "Noventra" ? "Hybrid - SF" : "On-site",
    type: i % 4 === 3 ? "Internship" : "Full-Time",
    salary: i % 2 === 0 ? "$120,000 - $150,000" : "$160,000 - $210,000",
    tags: [pick(SKILLS, i), pick(SKILLS, i + 1), "Startup Equity"]
  });
}

// 5. GENERATE VIDEOS (75)
export const mockVideos: Video[] = [];

const VIDEO_TEMPLATES = [
  "How We Scaled Our API to 10B Requests Per Day",
  "Designing a Keyboard-First Startup Dashboard",
  "Next.js App Router & React Server Component Patterns",
  "Pitching Noventra: The YouTube for Builders Platform",
  "Swapping Postgres for Neon Serverless database layers",
  "Deploying multi-agentic system structures locally",
  "Swapping Redis cache engines for high throughput layers",
  "Building a beautiful calendar component in React",
  "How to raise a pre-seed round with no revenue",
  "Micro-animations guide using framer-motion library",
  "Debugging database deadlocks under high write volumes",
  "Swapping webhooks for realtime event driven sockets",
  "Why we moved from Tailwind to CSS modules",
  "The clean architecture design we use for Next.js",
  "Testing production systems using mock databases"
];

for (let i = 0; i < 75; i++) {
  const channelIndex = i % mockChannels.length;
  const channel = mockChannels[channelIndex];
  
  const template = pick(VIDEO_TEMPLATES, i);
  const title = `${template} (Ep. ${Math.floor(i / 15) + 1})`;
  const industry = pick(INDUSTRIES, i * 2);
  const tech = pick(SKILLS, i * 3);
  const diff = i % 3 === 0 ? 'Beginner' : i % 3 === 1 ? 'Intermediate' : 'Advanced';
  
  const views = Math.floor(520 + (i * 2432) + (i % 2 === 0 ? 50000 : 0));
  const likes = Math.floor(views * 0.08);
  const bookmarks = Math.floor(views * 0.03);
  
  const uploadDaysAgo = 1 + (i % 28);
  const uploadDate = new Date(Date.now() - uploadDaysAgo * 24 * 60 * 60 * 1000).toISOString();

  // Pick video file
  const videoUrls = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
  ];
  
  const startMinutes = 5 + (i % 15);
  const duration = startMinutes * 60 + (i % 60);

  const startup = pick(mockStartups, i);
  const founder = pick(mockFounders, i + 2);
  const investor = pick(mockInvestors, i);

  mockVideos.push({
    id: `vid-${i + 1}`,
    title,
    description: `A comprehensive session discussing design tokens, optimizations, and deployment pathways. We outline how we handle scaling targets and resolve performance blockages inside production.`,
    thumbnailUrl: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i)}?w=600&auto=format&fit=crop&q=80`,
    videoUrl: pick(videoUrls, i),
    duration,
    views,
    likesCount: likes,
    commentsCount: 5 + (i % 8),
    bookmarksCount: bookmarks,
    isLive: false,
    liveBadge: false,
    channelId: channel.id,
    channel,
    createdAt: uploadDate,
    categoryId: i % 4 === 0 ? "pitch" : i % 4 === 1 ? "tech" : i % 4 === 2 ? "design" : "stories",
    tags: [tech, industry.split(" ")[0], "Scaling", "Tutorial"],
    
    // AI Content
    aiSummary: `AI-generated summary: This video demonstrates technical design frameworks, specifically focusing on building and optimizing workflows using ${tech}. The developer walks through standard caching setups and scaling paths.`,
    keyTakeaways: [
      `Swapped local connections for PgBouncer connection pools to support 10k sockets.`,
      `Applied custom Framer-motion hooks to trigger CSS animation layers.`,
      `Created isolated layout boundaries to prevent hydration flashes on Next.js.`
    ],
    chapters: [
      { time: 0, title: 'Introduction & Core Concept' },
      { time: Math.floor(duration * 0.25), title: 'Initial Code Layout' },
      { time: Math.floor(duration * 0.5), title: 'Database Optimization Path' },
      { time: Math.floor(duration * 0.75), title: 'Benchmarks & Q&A' }
    ],
    transcript: `[0:00] Hi everyone, welcome to this session. [1:15] Let's analyze our components layout. [3:00] Moving on to database optimization layers. [7:00] Swapping queries to async endpoints saved 40% network latency. [10:00] Hope you enjoy it, drop comments below!`,

    // Connections
    recommendationReason: i % 5 === 0 ? "Because you watched React videos" : i % 5 === 1 ? "Because you follow AI founders" : i % 5 === 2 ? "Popular among developers" : i % 5 === 3 ? "Trending in SaaS" : "Recommended by investors",
    startupId: startup.id,
    founderId: founder.id,
    investorId: investor.id,
    learningPathId: `lp-${(i % 6) + 1}`,
    relatedShortIds: [`sh-${(i % 20) + 1}`, `sh-${((i + 1) % 20) + 1}`],
    relatedPodcastIds: [`pod-${(i % 10) + 1}`],
    relatedJobIds: [`job-${(i % 10) + 1}`, `job-${((i + 2) % 10) + 1}`],
    relatedEventIds: [`event-${(i % 8) + 1}`],
    industry,
    technology: tech,
    difficulty: diff,

    // AI Knowledge Panel
    glossary: [
      { term: tech, definition: `A key technology stack item used for micro-actions management.` },
      { term: "Hydration", definition: "The process of mapping server-rendered HTML nodes to client-side react listeners." },
      { term: "PgBouncer", definition: "A lightweight connection pooler for PostgreSQL databases." }
    ],
    githubRepo: `https://github.com/${startup.name.toLowerCase()}/${tech.toLowerCase()}-core`,
    documentationLink: `https://docs.${startup.name.toLowerCase()}.io`,
    quotes: [
      { quote: `Optimizing db socket pipelines is the single biggest unlock for edge compute frameworks.`, speaker: founder.name, time: Math.floor(duration * 0.5) + 10 },
      { quote: `Never declare environment variables on client boundaries without explicit origin filters.`, speaker: founder.name, time: Math.floor(duration * 0.75) - 30 }
    ]
  });
}

mockVideos[0].title = 'How We Scaled Our API to 10B Requests Per Day';
mockVideos[0].channel = mockChannels[4];
mockVideos[0].channelId = mockChannels[4].id;

mockVideos[1].title = 'Designing the Next-Gen Product Release flow';
mockVideos[1].channel = mockChannels[3];
mockVideos[1].channelId = mockChannels[3].id;

mockVideos[2].title = 'Next.js 16 App Router & React Server Component Patterns';
mockVideos[2].channel = mockChannels[5];
mockVideos[2].channelId = mockChannels[5].id;

mockVideos[3].title = 'Pitching Noventra: The YouTube for Builders Platform';
mockVideos[3].channel = mockChannels[0];
mockVideos[3].channelId = mockChannels[0].id;


// 6. GENERATE SHORTS (60)
export const mockShorts: Short[] = [];
for (let i = 0; i < 60; i++) {
  const channelIndex = (i + 5) % mockChannels.length;
  const channel = mockChannels[channelIndex];
  const tech = pick(SKILLS, i * 2);
  const title = i === 0 ? 'Why we built Noventra in Next.js 16' : i === 1 ? 'Linear UI Secret: Keyboard Listeners' : i === 2 ? 'Instant payments integration in 3 lines' : `Unbelievable ${tech} trick you didn't know`;
  
  const views = Math.floor(1200 + (i * 980));
  const likes = Math.floor(views * 0.12);
  const bookmarks = Math.floor(views * 0.05);

  const startup = pick(mockStartups, i);
  const founder = pick(mockFounders, i + 3);

  mockShorts.push({
    id: `sh-${i + 1}`,
    title,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    views,
    likesCount: likes,
    commentsCount: 2 + (i % 5),
    bookmarksCount: bookmarks,
    channelId: channel.id,
    channel,
    createdAt: new Date(Date.now() - (i % 7) * 24 * 60 * 60 * 1000).toISOString(),
    relatedStartupId: startup.id,
    relatedStartupName: startup.name,
    relatedFounderId: founder.id,
    relatedFounderName: founder.name,
    aiSummary: `Quick breakdown detailing how developer tools optimize their code using ${tech}.`,
    recommendationReason: "Trending in SaaS",
    industry: startup.industry,
    technology: tech,
    difficulty: i % 2 === 0 ? 'Beginner' : 'Intermediate'
  });
}

// 7. GENERATE PODCASTS (30)
export const mockPodcasts: Podcast[] = [];
for (let i = 0; i < 30; i++) {
  const channelIndex = (i + 10) % mockChannels.length;
  const channel = mockChannels[channelIndex];
  const founder = pick(mockFounders, i + 1);
  const startup = pick(mockStartups, i);
  
  const title = i === 0 ? 'The Future of Developer Tools with Patrick Collison' : i === 1 ? 'Next.js 16: Dynamic Rendering & Hosting Mechanics' : `Episode ${i + 1}: Scaling ${startup.name} in 2026`;
  const tech = pick(SKILLS, i * 4);
  const industry = pick(INDUSTRIES, i);

  mockPodcasts.push({
    id: `pod-${i + 1}`,
    title,
    description: `We sit down with builders and partners to explore GTM strategies, product design tokens, and technical infrastructures utilizing ${tech}.`,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    artworkUrl: `https://images.unsplash.com/photo-${pick(UNSPLASH_IDS, i + 8)}?w=600&auto=format&fit=crop&q=80`,
    duration: 1200 + (i * 90),
    views: Math.floor(950 + i * 782),
    likesCount: Math.floor(100 + i * 84),
    commentsCount: 1 + (i % 4),
    bookmarksCount: Math.floor(50 + i * 23),
    channelId: channel.id,
    channel,
    createdAt: new Date(Date.now() - (i % 14) * 24 * 60 * 60 * 1000).toISOString(),
    guestProfiles: [
      { name: founder.name, role: founder.headline, avatar: founder.avatarUrl }
    ],
    relatedStartups: [{ name: startup.name, logo: startup.logo }],
    aiSummary: `This podcast episode covers core scaling, monetization pipelines, and developer UX for ${startup.name}.`,
    transcript: `[0:00] Host: Welcome back. Today we are talking to ${founder.name}. [3:00] We optimized caching and solved our early scaling issues.`,
    chapters: [
      { time: 0, title: 'Intro & Guest bio' },
      { time: 300, title: 'How we started' },
      { time: 900, title: 'Engineering and Future plans' }
    ],
    recommendationReason: "Trending in SaaS",
    industry,
    technology: tech,
    difficulty: i % 3 === 0 ? 'Beginner' : i % 3 === 1 ? 'Intermediate' : 'Advanced',
    relatedFounderId: founder.id,
    relatedStartupId: startup.id
  });
}

// 8. GENERATE LEARNING PATHS (6 tracks with 50 total lessons)
export const mockLearningPaths: LearningPath[] = [
  {
    id: 'lp-1',
    title: 'Startup Fundraising Masterclass',
    description: 'Learn the core principles of structural validation, cap table setup, customer interviews, product metrics, and compiling high-converting investor pitch decks.',
    category: 'Startup Business',
    difficulty: 'Beginner',
    progress: 75,
    completed: false,
    instructor: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      title: 'Partner, Noventra Capital'
    },
    lessons: []
  },
  {
    id: 'lp-2',
    title: 'Next.js 16 Production Architectures',
    description: 'Master asynchronous layouts, partial prerendering, concurrency routes, and database optimization layers in Next.js.',
    category: 'Frontend Engineering',
    difficulty: 'Advanced',
    progress: 25,
    completed: false,
    instructor: {
      name: 'Lee Robinson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      title: 'VP Developer Experience, Vercel'
    },
    lessons: []
  },
  {
    id: 'lp-3',
    title: 'AI Agents & LLM Systems',
    description: 'Build agentic loop architectures, set up vector databases, manage RAG caching layers, and optimize model performance.',
    category: 'AI Engineering',
    difficulty: 'Advanced',
    progress: 10,
    completed: false,
    instructor: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      title: 'Lead Architect, Linear AI'
    },
    lessons: []
  },
  {
    id: 'lp-4',
    title: 'System Design & Caching at Scale',
    description: 'Deep dive into microservices, distributed messaging, Redis caching nodes, and connection pooling strategies.',
    category: 'Systems Engineering',
    difficulty: 'Intermediate',
    progress: 0,
    completed: false,
    instructor: {
      name: 'Patrick Collison',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      title: 'CEO, Stripe'
    },
    lessons: []
  },
  {
    id: 'lp-5',
    title: 'Modern Product Design & Motion',
    description: 'Understand keyboard-first layouts, design tokens, Framer-motion curve tables, and user interaction mechanics.',
    category: 'Product Design',
    difficulty: 'Intermediate',
    progress: 0,
    completed: false,
    instructor: {
      name: 'Jari Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      title: 'Founder, Linear'
    },
    lessons: []
  },
  {
    id: 'lp-6',
    title: 'Developer Tools Growth Guide',
    description: 'How to build in public, generate early community traction, market API endpoints, and structure hiring.',
    category: 'Developer Growth',
    difficulty: 'Beginner',
    progress: 0,
    completed: false,
    instructor: {
      name: 'Arvid Kahl',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
      title: 'Author, Bootstrapped Founder'
    },
    lessons: []
  }
];

// Populate 50 lessons across the paths
let lessonCount = 0;
for (let pIndex = 0; pIndex < mockLearningPaths.length; pIndex++) {
  const lessonsInPath = pIndex === 0 ? 9 : pIndex === 1 ? 9 : pIndex === 2 ? 8 : pIndex === 3 ? 8 : pIndex === 4 ? 8 : 8;
  const path = mockLearningPaths[pIndex];
  for (let l = 1; l <= lessonsInPath; l++) {
    lessonCount++;
    const vidIndex = (lessonCount * 3) % mockVideos.length;
    path.lessons.push({
      id: `les-${pIndex}-${l}`,
      title: `Lesson ${l}: ${mockVideos[vidIndex].title.split(" (Ep.")[0]}`,
      duration: 300 + (l * 45),
      videoId: mockVideos[vidIndex].id,
      completed: pIndex === 0 && l < 6 ? true : pIndex === 1 && l < 3 ? true : false,
      position: l
    });
  }
  // Recalculate progress
  const completed = path.lessons.filter(les => les.completed).length;
  path.progress = Math.round((completed / path.lessons.length) * 100);
  path.completed = path.progress === 100;
}

// 9. GENERATE LIVE STREAMS (3)
export const mockLiveStreams: LiveStream[] = [
  {
    id: 'live-1',
    title: 'Next.js 16 Launch Q&A: Ask the Core Team Anything',
    channel: mockChannels[5],
    description: 'The Vercel core engineering team is live answering your questions about Next.js 16, RSC performance, server actions, and cold-starts reduction.',
    liveBadge: true,
    viewerCount: 1450,
    notificationSubscribed: false
  },
  {
    id: 'live-2',
    title: 'Stripe Dev Live: Deploying Billing Subscriptions',
    channel: mockChannels[4],
    description: 'Building in public: watch us configure multi-tier customer billing models and handle payment webhooks live.',
    liveBadge: false,
    startsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    notificationSubscribed: true
  },
  {
    id: 'live-3',
    title: 'FounderTV: Pitch Deck Roast Live',
    channel: mockChannels[0],
    description: 'Submit your startup pitch deck and get real-time brutal feedback from partners and active venture investors.',
    liveBadge: false,
    startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    notificationSubscribed: false
  }
];

// 10. GENERATE COMMENTS (100)
export const mockComments: Comment[] = [];
const COMMENT_PHRASES = [
  "This database caching architecture is exactly what we needed. Swapping to Redis cluster saved us 80% DB load.",
  "Did you consider security parameters for clients side environment variables under Next.js server actions?",
  "We configured PgBouncer connection pooling last week. Highly recommend setting it up before spikes hit.",
  "The UI tokens alignment here is pure poetry. Linear design always inspires.",
  "Are these edge rendering components stable under Next.js partial pre-rendering modes?",
  "Excellent presentation on term sheets. Very valuable for early pre-seed founders seeking capital.",
  "What model is used under the AI Workspace agentic logic? Is it locally hosted or closed APIs?",
  "We saw a similar performance boost when we swapped HTTP endpoints for protocol buffers.",
  "Is the codebase for the calendar scheduler open-sourced? I would love to check the keyboard triggers code.",
  "Amazing explanation of customer metric frameworks. Founders often ignore Arr tracking early."
];

const REPLY_PHRASES = [
  "Yes! Short TTL caching is crucial to avoid data synchronization mismatch issues.",
  "We ran into a similar problem. Adding client-side verification solved most of the threat leaks.",
  "What was the exact connection socket limit you configured in pgBouncer?",
  "Yes, we use standard cubic-bezier curves for micro actions easing.",
  "Partial hydration is indeed experimental, but Next.js 16 stabilizes it on server layouts."
];

for (let i = 0; i < 100; i++) {
  const coderIndex = i % mockFounders.length;
  const coder = mockFounders[coderIndex];
  const phrase = pick(COMMENT_PHRASES, i);
  const likes = 2 + (i % 25);
  
  const mainComment: Comment = {
    id: `comment-${i}`,
    content: phrase,
    userId: coder.id,
    userName: coder.name,
    userAvatar: coder.avatarUrl,
    userBadge: i % 4 === 0 ? "founder" : i % 4 === 1 ? "developer" : i % 4 === 2 ? "investor" : "creator",
    likesCount: likes,
    createdAt: new Date(Date.now() - (i % 5) * 60 * 60 * 1000).toISOString(),
    replies: []
  };

  if (i % 2 === 0) {
    const replier = mockFounders[(i + 15) % mockFounders.length];
    const replyPhrase = pick(REPLY_PHRASES, i);
    mainComment.replies?.push({
      id: `comment-reply-${i}`,
      content: replyPhrase,
      userId: replier.id,
      userName: replier.name,
      userAvatar: replier.avatarUrl,
      userBadge: i % 3 === 0 ? "developer" : "founder",
      likesCount: Math.floor(likes / 3),
      createdAt: new Date(Date.now() - (i % 5) * 30 * 60 * 1000).toISOString(),
      parentId: mainComment.id
    });
  }

  mockComments.push(mainComment);
}

// 11. GENERATE COMMUNITY POSTS (40)
export const mockCommunityPosts: CommunityPost[] = [];
for (let i = 0; i < 40; i++) {
  const founder = pick(mockFounders, i);
  const isPoll = i % 2 === 0;

  mockCommunityPosts.push({
    id: `post-${i}`,
    creatorId: founder.id,
    creatorName: founder.name,
    creatorAvatar: founder.avatarUrl,
    createdAt: new Date(Date.now() - (i + 1) * 12 * 60 * 60 * 1000).toISOString(),
    content: isPoll 
      ? `Hey builders, what is your preferred vector database strategy when scaling RAG applications? Vote below and let me know why in the comments!`
      : `Just published our pre-seed design layout logs! We went keyboard-first and streamlined our hotkeys framework. Check out the video!`,
    likesCount: 15 + (i * 3),
    poll: isPoll ? {
      question: "Preferred Vector DB?",
      options: [
        { text: "Pinecone", votes: 45 + (i * 2) },
        { text: "pgvector (Postgres)", votes: 85 + (i * 4) },
        { text: "Qdrant", votes: 30 + i },
        { text: "Chroma", votes: 12 + (i % 5) }
      ],
      totalVotes: 172 + (i * 7)
    } : undefined
  });
}

// 12. GENERATE OPPORTUNITIES (50)
export const mockOpportunities: Opportunity[] = [];
const OPP_TITLES = [
  "Build a local MCP Server for SQLite integrations",
  "Accelerator Cohort Q3 Application Open",
  "Co-Founder Request: Looking for Staff AI Architect",
  "Investors seeking pre-seed FinTech products",
  "Beta Testing: OptimaAI launch roast feedback",
  "Mentorship Request: Scaling Node databases",
  "Global B2B SaaS Hackathon $50k prize",
  "Co-Founder Request: Growth Lead for ClimateTech",
  "Supabase Open Source integration sponsorship",
  "Vercel Startup Competition 2026"
];

const OPP_SKILLS = [
  ["TypeScript", "SQLite", "MCP Protocol"],
  ["Pitch deck", "Cap Table", "MVP demo"],
  ["AI Engineering", "PyTorch", "Rust"],
  ["Fintech", "Security", "compliance"],
  ["Beta test", "UI design", "UX critique"],
  ["System design", "PgBouncer", "Redis"],
  ["Next.js", "Clerk", "database scaling"],
  ["GTM Strategy", "B2B Sales", "marketing"],
  ["Postgres", "Open source", "Prisma"],
  ["React Server", "Edge functions", "Vercel"]
];

const ORGANIZATIONS = ["Noventra Capital", "Sequoia Labs", "Stripe Devs", "Vercel TV", "Linear Labs", "Supabase Community", "Y-Combinator Hub", "A16z Venture Team"];

for (let i = 0; i < 50; i++) {
  const baseIdx = i % OPP_TITLES.length;
  const title = `${OPP_TITLES[baseIdx]} (${pick(LOCATIONS, i).split(",")[0]} Node)`;
  const org = pick(ORGANIZATIONS, i);
  const category = i % 9 === 0 ? "Job" 
                 : i % 9 === 1 ? "Hackathon" 
                 : i % 9 === 2 ? "Co-Founder" 
                 : i % 9 === 3 ? "VC Seeking Startups" 
                 : i % 9 === 4 ? "Beta Testing" 
                 : i % 9 === 5 ? "Mentorship" 
                 : i % 9 === 6 ? "Accelerator" 
                 : i % 9 === 7 ? "Competition" 
                 : "Open Source";

  mockOpportunities.push({
    id: `opp-${i}`,
    title,
    description: `Valuable opportunity to collaborate, pitch, or develop with high-growth teams at ${org}. Focused on building production ready systems.`,
    category,
    organization: org,
    skillsRequired: pick(OPP_SKILLS, i),
    actionLink: "#",
    metric: i % 3 === 0 ? "$5,000 grant" : i % 3 === 1 ? "Seed investment match" : "Equity options available",
    deadline: new Date(Date.now() + (3 + (i % 10)) * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: "short", day: "numeric" })
  });
}
