import { PrismaClient, Role, RequestType, RequestStatus, TeamRole, MeetingStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedUser {
  clerkId: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl: string;
  bio: string;
  location: string;
  skills?: string[];
  interests?: string[];
  openToInvest?: boolean;
  ticketSize?: string;
  investmentInterests?: string[];
  portfolioCount?: number;
}

async function main() {
  console.log('🚀 Starting Noventra Database Seeding...');

  // 1. Clean existing records in dependency order
  await prisma.message.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.connectedVC.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.request.deleteMany();
  await prisma.startup.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Database cleaned.');

  // 2. Seed Users
  // Founders (15)
  const foundersData: SeedUser[] = [
    {
      clerkId: 'user_3ErbxPahcsVtgTEy2m8661B8w6x', // Current logged-in user
      email: 'nayudu.nava2007@gmail.com',
      name: 'Navadheer Nayudu',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Building Noventra & Mediquick. Passionate about AI infrastructure, healthcare automation, and founder-investor ecosystems.',
      location: 'San Francisco, CA',
      skills: ['React', 'TypeScript', 'Node.js', 'PyTorch', 'System Architecture'],
      interests: ['AI Infrastructure', 'HealthTech', 'Venture Capital']
    },
    {
      clerkId: 'clerk_founder_2',
      email: 'elena.rostova@quantumscale.ai',
      name: 'Elena Rostova',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      bio: 'Founder & CEO @ QuantumScale AI. Ex-DeepMind researcher building next-gen distributed LLM inference systems.',
      location: 'Palo Alto, CA',
      skills: ['Distributed Systems', 'CUDA', 'Python', 'LLMs'],
      interests: ['Generative AI', 'High Performance Computing']
    },
    {
      clerkId: 'clerk_founder_3',
      email: 'marcus.vance@payflow.io',
      name: 'Marcus Vance',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Co-Founder @ PayFlow Systems. Simplifying cross-border B2B payments with automated compliance pipelines.',
      location: 'New York, NY',
      skills: ['FinTech', 'Stripe API', 'Go', 'Kubernetes'],
      interests: ['Global Banking', 'API Economy', 'Web3']
    },
    {
      clerkId: 'clerk_founder_4',
      email: 'sarah.chen@neurahealth.com',
      name: 'Dr. Sarah Chen',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      bio: 'CEO @ NeuraHealth. Stanford Bio-X alum building AI diagnostic copilots for radiologists.',
      location: 'Boston, MA',
      skills: ['Computer Vision', 'Medical Imaging', 'Python', 'FDA Compliance'],
      interests: ['BioTech', 'MedTech', 'Machine Learning']
    },
    {
      clerkId: 'clerk_founder_5',
      email: 'alex.dev@cloudforge.dev',
      name: 'Alex Rivera',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Founder @ CloudForge. Building zero-config infrastructure orchestration for microservice architectures.',
      location: 'Seattle, WA',
      skills: ['Rust', 'DevOps', 'Terraform', 'AWS'],
      interests: ['Developer Tools', 'Serverless', 'Cloud Security']
    },
    {
      clerkId: 'clerk_founder_6',
      email: 'david.kim@cybershield.sec',
      name: 'David Kim',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      bio: 'Co-Founder @ CyberShield. Ex-NSA engineer automating threat detection for cloud native apps.',
      location: 'Austin, TX',
      skills: ['Cybersecurity', 'Zero Trust', 'C++', 'Python'],
      interests: ['SecOps', 'Threat Intelligence']
    },
    {
      clerkId: 'clerk_founder_7',
      email: 'maya.patel@ecopower.energy',
      name: 'Maya Patel',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
      bio: 'CEO @ EcoPower Energy. Scaling smart grid optimization software for commercial microgrids.',
      location: 'Denver, CO',
      skills: ['CleanTech', 'IoT', 'Data Science', 'Energy Policy'],
      interests: ['Sustainability', 'Renewable Energy']
    },
    {
      clerkId: 'clerk_founder_8',
      email: 'liam.space@orbitx.space',
      name: 'Liam Spacey',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      bio: 'Founder @ OrbitX Aerospace. Autonomous satellite constellation management software.',
      location: 'Los Angeles, CA',
      skills: ['Aerospace', 'Orbital Mechanics', 'C++', 'ROS'],
      interests: ['SpaceTech', 'Autonomous Systems']
    },
    {
      clerkId: 'clerk_founder_9',
      email: 'chloe.game@gamecraft.io',
      name: 'Chloe Zhang',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      bio: 'Co-Founder @ GameCraft Studios. Generative AI asset creation pipelines for 3D game developers.',
      location: 'Vancouver, BC',
      skills: ['Unreal Engine', 'C#', '3D Graphics', 'AI Pipelines'],
      interests: ['Gaming', 'Metaverse', 'Spatial Computing']
    },
    {
      clerkId: 'clerk_founder_10',
      email: 'trent.edu@learnsphere.co',
      name: 'Trent Sterling',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
      bio: 'CEO @ LearnSphere. Personalized adaptive AI tutors for K-12 STEM education.',
      location: 'Chicago, IL',
      skills: ['EdTech', 'Product Design', 'Next.js', 'NLP'],
      interests: ['Future of Work', 'Education']
    },
    {
      clerkId: 'clerk_founder_11',
      email: 'hannah.bio@biosynth.org',
      name: 'Hannah Abbott',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80',
      bio: 'Co-Founder @ BioSynth Dynamics. Synthetic biology platform accelerating enzyme discovery.',
      location: 'Cambridge, MA',
      skills: ['BioInformatics', 'CRISPR', 'Machine Learning'],
      interests: ['Life Sciences', 'DeepTech']
    },
    {
      clerkId: 'clerk_founder_12',
      email: 'vikram.vr@omnivr.com',
      name: 'Vikram Mehta',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      bio: 'Founder @ OmniVR Labs. Enterprise immersive training simulations for industrial manufacturing.',
      location: 'San Jose, CA',
      skills: ['WebXR', 'Unity', 'Spatial Audio', 'React Three Fiber'],
      interests: ['AR/VR', 'Industrial Tech']
    },
    {
      clerkId: 'clerk_founder_13',
      email: 'zack.block@blockvault.net',
      name: 'Zack Thorne',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      bio: 'Co-Founder @ BlockVault. Institutional self-custody MPC wallet infrastructure.',
      location: 'Miami, FL',
      skills: ['Cryptography', 'Solidity', 'Go', 'Security Auditing'],
      interests: ['DeFi', 'Web3 Infrastructure']
    },
    {
      clerkId: 'clerk_founder_14',
      email: 'olivia.robot@robomotion.ai',
      name: 'Olivia Martinez',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      bio: 'CEO @ RoboMotion. Vision-guided robotic arms for automated warehouse sorting.',
      location: 'Pittsburgh, PA',
      skills: ['Robotics', 'ROS2', 'Computer Vision', 'Embedded C++'],
      interests: ['Hardware', 'Supply Chain']
    },
    {
      clerkId: 'clerk_founder_15',
      email: 'ethan.agri@agrigrowth.tech',
      name: 'Ethan Hunt',
      role: Role.FOUNDER,
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
      bio: 'Founder @ AgriGrowth Tech. Drone autonomous crop yield forecasting & precision soil analytics.',
      location: 'Des Moines, IA',
      skills: ['AgTech', 'Satellite Data', 'GIS', 'Python'],
      interests: ['Agriculture', 'Climate Tech']
    }
  ];

  // Investors (10)
  const investorsData: SeedUser[] = [
    {
      clerkId: 'clerk_investor_1',
      email: 'jason.vc@sequoia.com',
      name: 'Jason Sterling',
      role: Role.INVESTOR,
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      bio: 'General Partner @ Apex Ventures. Investing in Seed to Series A AI infrastructure & DeepTech startups.',
      location: 'Menlo Park, CA',
      openToInvest: true,
      ticketSize: '$500k - $2.5M',
      investmentInterests: ['AI/ML', 'Developer Tools', 'Enterprise SaaS'],
      portfolioCount: 18
    },
    {
      clerkId: 'clerk_investor_2',
      email: 'rachel.angel@foundersfund.com',
      name: 'Rachel Vance',
      role: Role.INVESTOR,
      avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
      bio: 'Angel Investor & Ex-VP Product @ Stripe. Writing $50k-$150k checks for early stage FinTech and API startups.',
      location: 'San Francisco, CA',
      openToInvest: true,
      ticketSize: '$50k - $150k',
      investmentInterests: ['FinTech', 'API Infrastructure', 'B2B SaaS'],
      portfolioCount: 24
    },
    {
      clerkId: 'clerk_investor_3',
      email: 'michael.vc@benchmark.com',
      name: 'Michael Chang',
      role: Role.INVESTOR,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      bio: 'Partner @ Velocity Capital. Leading Series A investments in HealthTech and BioTech diagnostics.',
      location: 'Boston, MA',
      openToInvest: true,
      ticketSize: '$1M - $5M',
      investmentInterests: ['HealthTech', 'MedTech', 'BioInformatics'],
      portfolioCount: 14
    },
    {
      clerkId: 'clerk_investor_4',
      email: 'sophia.angel@syndicate.co',
      name: 'Sophia Rossi',
      role: Role.INVESTOR,
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      bio: 'Syndicate Lead @ Horizon Angels. Pre-Seed & Seed investor focused on Climate Tech & Clean Energy.',
      location: 'New York, NY',
      openToInvest: true,
      ticketSize: '$100k - $300k',
      investmentInterests: ['CleanTech', 'Climate Tech', 'Sustainability'],
      portfolioCount: 11
    },
    {
      clerkId: 'clerk_investor_5',
      email: 'carter.vc@accel.com',
      name: 'Carter Wright',
      role: Role.INVESTOR,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Managing Director @ Nexus Capital. Backing resilient CyberSecurity, Cloud, and SecOps founders.',
      location: 'Austin, TX',
      openToInvest: true,
      ticketSize: '$750k - $3M',
      investmentInterests: ['CyberSecurity', 'Cloud Infrastructure', 'DevOps'],
      portfolioCount: 20
    },
    {
      clerkId: 'clerk_investor_6',
      email: 'priya.angel@techstars.com',
      name: 'Priya Nambiar',
      role: Role.INVESTOR,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Scout @ Techstars & Angel Investor. Supporting underrepresented founders in EdTech & Future of Work.',
      location: 'Seattle, WA',
      openToInvest: true,
      ticketSize: '$25k - $100k',
      investmentInterests: ['EdTech', 'Consumer AI', 'Community Platforms'],
      portfolioCount: 9
    },
    {
      clerkId: 'clerk_investor_7',
      email: 'greg.vc@a16z.com',
      name: 'Greg Kowalski',
      role: Role.INVESTOR,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      bio: 'Partner @ Quantum VC Fund. DeepTech, Robotics, and Frontier Technology investments.',
      location: 'San Jose, CA',
      openToInvest: true,
      ticketSize: '$1M - $4M',
      investmentInterests: ['Robotics', 'SpaceTech', 'Hardware'],
      portfolioCount: 15
    },
    {
      clerkId: 'clerk_investor_8',
      email: 'lauren.vc@insight.com',
      name: 'Lauren Bishop',
      role: Role.INVESTOR,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      bio: 'Principal @ Elevate Capital. Specializing in Gaming, AR/VR, and Spatial Media software.',
      location: 'Los Angeles, CA',
      openToInvest: true,
      ticketSize: '$250k - $1M',
      investmentInterests: ['Gaming', 'AR/VR', 'MediaTech'],
      portfolioCount: 12
    },
    {
      clerkId: 'clerk_investor_9',
      email: 'tom.angel@ycombinator.com',
      name: 'Thomas Drake',
      role: Role.INVESTOR,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Ex-Y Combinator Partner. Angel investor backing technical founders building autonomous AI agents.',
      location: 'San Francisco, CA',
      openToInvest: true,
      ticketSize: '$100k - $500k',
      investmentInterests: ['AI Agents', 'Open Source', 'Dev Tools'],
      portfolioCount: 32
    },
    {
      clerkId: 'clerk_investor_10',
      email: 'emily.vc@bessemer.com',
      name: 'Emily Thornton',
      role: Role.INVESTOR,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      bio: 'Investment Director @ Vantage Fund. Focused on SupplyChain AI, E-Commerce Infrastructure & Logistics.',
      location: 'Chicago, IL',
      openToInvest: true,
      ticketSize: '$500k - $2M',
      investmentInterests: ['SupplyChain', 'E-Commerce', 'Logistics AI'],
      portfolioCount: 16
    }
  ];

  // General Users / Talent (15)
  const usersData: SeedUser[] = [
    {
      clerkId: 'clerk_user_1',
      email: 'daniel.eng@gmail.com',
      name: 'Daniel Brooks',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      bio: 'Senior Fullstack Engineer (React, Node, Go). Passionate about early-stage AI startups.',
      location: 'San Francisco, CA',
      skills: ['Fullstack', 'TypeScript', 'Go', 'React'],
      interests: ['AI Infrastructure', 'Startups']
    },
    {
      clerkId: 'clerk_user_2',
      email: 'aria.ml@stanford.edu',
      name: 'Aria Takahashi',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      bio: 'PhD candidate in Computer Vision & Diffusion Models @ Stanford. Looking for co-founder roles.',
      location: 'Palo Alto, CA',
      skills: ['PyTorch', 'Computer Vision', 'Python', 'Diffusion Models'],
      interests: ['Generative AI', 'Deep Learning']
    },
    {
      clerkId: 'clerk_user_3',
      email: 'lucas.ux@design.io',
      name: 'Lucas Dupont',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      bio: 'Lead Product Designer. Crafting sleek UI/UX for developer tools and complex SaaS platforms.',
      location: 'New York, NY',
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping'],
      interests: ['Developer Experience', 'Product Design']
    },
    {
      clerkId: 'clerk_user_4',
      email: 'jessica.growth@growth.co',
      name: 'Jessica Vance',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80',
      bio: 'Growth Marketer & Demand Gen Lead. Scaled two SaaS startups from $0 to $5M ARR.',
      location: 'Austin, TX',
      skills: ['Growth Marketing', 'SEO', 'Product-Led Growth', 'Analytics'],
      interests: ['Marketing', 'SaaS Growth']
    },
    {
      clerkId: 'clerk_user_5',
      email: 'kevin.devops@kube.io',
      name: 'Kevin O\'Connor',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
      bio: 'DevOps Architect & Kubernetes specialist. Building resilient CI/CD and multi-cloud environments.',
      location: 'Seattle, WA',
      skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS'],
      interests: ['Cloud Architecture', 'DevOps']
    },
    {
      clerkId: 'clerk_user_6',
      email: 'natalie.sec@cyber.io',
      name: 'Natalie Foster',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
      bio: 'Security Researcher & Penetration Tester. Open to joining early stage cybersecurity startups.',
      location: 'Washington, DC',
      skills: ['Pentesting', 'Python', 'Threat Analysis', 'Network Security'],
      interests: ['Cybersecurity', 'Zero Trust']
    },
    {
      clerkId: 'clerk_user_7',
      email: 'sam.mobile@flutter.dev',
      name: 'Sam Miller',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
      bio: 'Lead iOS & Flutter Developer. Published 10+ high rating apps on App Store.',
      location: 'Los Angeles, CA',
      skills: ['Swift', 'Flutter', 'React Native', 'GraphQL'],
      interests: ['Mobile Apps', 'FinTech']
    },
    {
      clerkId: 'clerk_user_8',
      email: 'rachel.student@berkeley.edu',
      name: 'Rachel Green',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      bio: 'UC Berkeley CS Senior. Co-organizer of CalHacks. Looking for internship opportunities.',
      location: 'Berkeley, CA',
      skills: ['Python', 'React', 'Node.js', 'Machine Learning'],
      interests: ['AI Research', 'Hackathons']
    },
    {
      clerkId: 'clerk_user_9',
      email: 'brandon.ai@mit.edu',
      name: 'Brandon Lee',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'MIT AI Lab research assistant working on multi-agent reinforcement learning systems.',
      location: 'Cambridge, MA',
      skills: ['Reinforcement Learning', 'PyTorch', 'C++', 'Python'],
      interests: ['Autonomous AI', 'Robotics']
    },
    {
      clerkId: 'clerk_user_10',
      email: 'emily.bio@harvard.edu',
      name: 'Emily Davis',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      bio: 'BioInformatics Scientist analyzing single-cell RNA sequencing datasets.',
      location: 'Boston, MA',
      skills: ['R', 'Python', 'Genomics', 'BioConductor'],
      interests: ['Life Sciences', 'HealthTech']
    },
    {
      clerkId: 'clerk_user_11',
      email: 'nathan.fin@nyu.edu',
      name: 'Nathan Patel',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Quantitative Analyst & Financial Modeling Specialist. Ex-Goldman Sachs.',
      location: 'New York, NY',
      skills: ['Financial Modeling', 'Python', 'SQL', 'Risk Analysis'],
      interests: ['FinTech', 'DeFi']
    },
    {
      clerkId: 'clerk_user_12',
      email: 'grace.content@saas.com',
      name: 'Grace Kim',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      bio: 'Technical Writer & Developer Relations Lead. Creating documentation developers love.',
      location: 'Denver, CO',
      skills: ['DevRel', 'Technical Writing', 'Open Source', 'Markdown'],
      interests: ['Developer Tools', 'Open Source']
    },
    {
      clerkId: 'clerk_user_13',
      email: 'tyler.hardware@cmu.edu',
      name: 'Tyler Wood',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      bio: 'CMU Robotics Master student. PCB design, embedded firmware, and motor control.',
      location: 'Pittsburgh, PA',
      skills: ['C++', 'Embedded Systems', 'KiCad', 'ROS'],
      interests: ['Robotics', 'Hardware']
    },
    {
      clerkId: 'clerk_user_14',
      email: 'isabella.3d@blender.art',
      name: 'Isabella Rossi',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: '3D Technical Artist & Shading Engineer. Specialist in real-time Unity & Unreal rendering.',
      location: 'Vancouver, BC',
      skills: ['Blender', 'HLSL', 'Unity', 'Unreal Engine'],
      interests: ['Gaming', '3D Graphics']
    },
    {
      clerkId: 'clerk_user_15',
      email: 'jordan.agri@drones.io',
      name: 'Jordan Bell',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      bio: 'Drone Hardware Engineer & Autonomous Flight System Tester.',
      location: 'Des Moines, IA',
      skills: ['ArduPilot', 'PX4', 'SolidWorks', 'Python'],
      interests: ['AgTech', 'Drones']
    }
  ];

  const allUsersData: SeedUser[] = [...foundersData, ...investorsData, ...usersData];
  const seededUsersMap = new Map<string, any>();

  for (const u of allUsersData) {
    const createdUser = await prisma.user.upsert({
      where: { clerkId: u.clerkId },
      update: {
        email: u.email,
        name: u.name,
        role: u.role,
        avatarUrl: u.avatarUrl,
        bio: u.bio,
        location: u.location,
        skills: u.skills || [],
        interests: u.interests || [],
        openToInvest: u.openToInvest ?? false,
        ticketSize: u.ticketSize ?? null,
        investmentInterests: u.investmentInterests ?? [],
        portfolioCount: u.portfolioCount ?? 0
      },
      create: {
        clerkId: u.clerkId,
        email: u.email,
        name: u.name,
        role: u.role,
        avatarUrl: u.avatarUrl,
        bio: u.bio,
        location: u.location,
        skills: u.skills || [],
        interests: u.interests || [],
        openToInvest: u.openToInvest ?? false,
        ticketSize: u.ticketSize ?? null,
        investmentInterests: u.investmentInterests ?? [],
        portfolioCount: u.portfolioCount ?? 0
      }
    });
    seededUsersMap.set(u.clerkId, createdUser);
  }

  console.log(`👤 Seeded ${allUsersData.length} Users successfully.`);

  // 3. Seed Startups (25)
  const navadheerUser = seededUsersMap.get('user_3ErbxPahcsVtgTEy2m8661B8w6x');
  const elenaUser = seededUsersMap.get('clerk_founder_2');
  const marcusUser = seededUsersMap.get('clerk_founder_3');
  const sarahUser = seededUsersMap.get('clerk_founder_4');
  const alexUser = seededUsersMap.get('clerk_founder_5');
  const davidUser = seededUsersMap.get('clerk_founder_6');
  const mayaUser = seededUsersMap.get('clerk_founder_7');
  const liamUser = seededUsersMap.get('clerk_founder_8');
  const chloeUser = seededUsersMap.get('clerk_founder_9');
  const trentUser = seededUsersMap.get('clerk_founder_10');
  const hannahUser = seededUsersMap.get('clerk_founder_11');
  const vikramUser = seededUsersMap.get('clerk_founder_12');
  const zackUser = seededUsersMap.get('clerk_founder_13');
  const oliviaUser = seededUsersMap.get('clerk_founder_14');
  const ethanUser = seededUsersMap.get('clerk_founder_15');

  const rawStartups = [
    {
      name: 'Mediquick',
      logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&q=80',
      description: 'AI-driven tele-triage and instant doctor booking platform connecting patients with specialist care in under 60 seconds.',
      industry: 'HealthTech',
      stage: 'Seed',
      location: 'San Francisco, CA',
      tagline: 'Instant Healthcare Access Powered by AI',
      fundingNeeded: '1500000',
      requiredRoles: ['Lead Mobile Dev', 'Health Data Scientist', 'Fullstack Engineer'],
      founderId: navadheerUser.id
    },
    {
      name: 'Noventra Ecosystem',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      description: 'The Next-Gen Operating System for Startup Founders, VCs, and High-Skilled Talent to pitch, fund, and build together.',
      industry: 'SaaS',
      stage: 'Seed',
      location: 'San Francisco, CA',
      tagline: 'Where Founders & Capital Connect',
      fundingNeeded: '2500000',
      requiredRoles: ['Lead AI Engineer', 'Growth Partner', 'DevOps Lead'],
      founderId: navadheerUser.id
    },
    {
      name: 'QuantumScale AI',
      logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=200&q=80',
      description: 'Ultra-low latency inference engine for foundation models, reducing token latency by 4x using customized CUDA kernels.',
      industry: 'Artificial Intelligence',
      stage: 'Seed',
      location: 'Palo Alto, CA',
      tagline: 'Sub-millisecond LLM Inference',
      fundingNeeded: '3000000',
      requiredRoles: ['CUDA Kernel Engineer', 'Distributed Systems Specialist'],
      founderId: elenaUser.id
    },
    {
      name: 'PayFlow Systems',
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80',
      description: 'Instant multi-currency clearing network for global B2B supply chains using smart contracts and automated KYC.',
      industry: 'FinTech',
      stage: 'Pre-Seed',
      location: 'New York, NY',
      tagline: 'Frictionless B2B Global Payments',
      fundingNeeded: '1200000',
      requiredRoles: ['Senior Go Engineer', 'Compliance Manager'],
      founderId: marcusUser.id
    },
    {
      name: 'NeuraHealth AI',
      logo: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=200&q=80',
      description: 'Real-time diagnostic copilot assisting radiologists in early detection of neurological disorders.',
      industry: 'HealthTech',
      stage: 'Series A',
      location: 'Boston, MA',
      tagline: 'Diagnostic Precision at Scale',
      fundingNeeded: '5000000',
      requiredRoles: ['Computer Vision Scientist', 'Regulatory Affairs Lead'],
      founderId: sarahUser.id
    },
    {
      name: 'CloudForge Systems',
      logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80',
      description: 'Zero-code infrastructure orchestration platform that automatically provisions Kubernetes clusters based on code analysis.',
      industry: 'Developer Tools',
      stage: 'Seed',
      location: 'Seattle, WA',
      tagline: 'Instant Production Environments',
      fundingNeeded: '2000000',
      requiredRoles: ['Rust Core Engineer', 'Product Designer'],
      founderId: alexUser.id
    },
    {
      name: 'CyberShield Sec',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
      description: 'Autonomous zero-trust runtime protection for cloud microservices using eBPF and kernel-level tracing.',
      industry: 'CyberSecurity',
      stage: 'Pre-Seed',
      location: 'Austin, TX',
      tagline: 'Kernel-Level Threat Prevention',
      fundingNeeded: '1500000',
      requiredRoles: ['eBPF Kernel Dev', 'Security Researcher'],
      founderId: davidUser.id
    },
    {
      name: 'EcoPower Energy',
      logo: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=200&q=80',
      description: 'AI software optimizing battery storage dispatch for commercial solar & wind microgrids.',
      industry: 'CleanTech',
      stage: 'Seed',
      location: 'Denver, CO',
      tagline: 'Maximizing Microgrid Battery ROI',
      fundingNeeded: '2200000',
      requiredRoles: ['IoT Firmware Engineer', 'Grid Data Analyst'],
      founderId: mayaUser.id
    },
    {
      name: 'OrbitX Aerospace',
      logo: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=200&q=80',
      description: 'Autonomous collision avoidance and trajectory planning software for low Earth orbit satellite constellations.',
      industry: 'SpaceTech',
      stage: 'Series A',
      location: 'Los Angeles, CA',
      tagline: 'Safeguarding Orbital Highways',
      fundingNeeded: '6000000',
      requiredRoles: ['Orbital Dynamics Specialist', 'C++ Realtime Dev'],
      founderId: liamUser.id
    },
    {
      name: 'GameCraft Studios',
      logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80',
      description: 'Generative AI pipeline generating rigged 3D models and textures directly inside Unreal Engine 5.',
      industry: 'Gaming',
      stage: 'Seed',
      location: 'Vancouver, BC',
      tagline: 'AI Pipelines for 3D Developers',
      fundingNeeded: '1800000',
      requiredRoles: ['Unreal Engine Plugin Dev', 'Graphics Programmer'],
      founderId: chloeUser.id
    },
    {
      name: 'LearnSphere AI',
      logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=200&q=80',
      description: 'Socratic AI tutor platform tailoring STEM learning paths to student comprehension speeds.',
      industry: 'EdTech',
      stage: 'Idea',
      location: 'Chicago, IL',
      tagline: 'Personalized AI Tutors for STEM',
      fundingNeeded: '800000',
      requiredRoles: ['Fullstack Engineer', 'Educational Designer'],
      founderId: trentUser.id
    },
    {
      name: 'BioSynth Dynamics',
      logo: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=200&q=80',
      description: 'Machine learning model predicting protein folding and stability for novel industrial enzyme engineering.',
      industry: 'BioTech',
      stage: 'Seed',
      location: 'Cambridge, MA',
      tagline: 'Designing Custom Industrial Enzymes',
      fundingNeeded: '3500000',
      requiredRoles: ['Computational Biologist', 'PyTorch Engineer'],
      founderId: hannahUser.id
    },
    {
      name: 'OmniVR Labs',
      logo: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=200&q=80',
      description: 'Photorealistic WebXR training environments for high-hazard industrial manufacturing workers.',
      industry: 'AR/VR',
      stage: 'Pre-Seed',
      location: 'San Jose, CA',
      tagline: 'Photorealistic XR Safety Training',
      fundingNeeded: '1100000',
      requiredRoles: ['WebXR Engineer', '3D Technical Artist'],
      founderId: vikramUser.id
    },
    {
      name: 'BlockVault Sec',
      logo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=200&q=80',
      description: 'Institutional non-custodial multi-party computation (MPC) wallet infrastructure for digital asset funds.',
      industry: 'Web3',
      stage: 'Series A',
      location: 'Miami, FL',
      tagline: 'Enterprise MPC Crypto Custody',
      fundingNeeded: '4000000',
      requiredRoles: ['Cryptographer', 'Go Systems Dev'],
      founderId: zackUser.id
    },
    {
      name: 'RoboMotion AI',
      logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=200&q=80',
      description: 'Plug-and-play visual perception kits turning standard robotic arms into adaptive warehouse item sorters.',
      industry: 'Robotics',
      stage: 'Seed',
      location: 'Pittsburgh, PA',
      tagline: 'Adaptive Perception for Robotic Arms',
      fundingNeeded: '2800000',
      requiredRoles: ['ROS2 Controls Lead', 'Robotics Systems Dev'],
      founderId: oliviaUser.id
    },
    {
      name: 'AgriGrowth Tech',
      logo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=200&q=80',
      description: 'Multi-spectral satellite & drone imaging for real-time soil nitrogen and moisture mapping.',
      industry: 'AgTech',
      stage: 'Pre-Seed',
      location: 'Des Moines, IA',
      tagline: 'Precision Satellite Soil Analytics',
      fundingNeeded: '950000',
      requiredRoles: ['GIS Engineer', 'Python Backend Lead'],
      founderId: ethanUser.id
    },
    {
      name: 'HyperData Labs',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80',
      description: 'Real-time streaming analytics engine processing millions of events per second with sub-10ms latency.',
      industry: 'SaaS',
      stage: 'Seed',
      location: 'San Francisco, CA',
      tagline: 'Sub-10ms Streaming Analytics',
      fundingNeeded: '2100000',
      requiredRoles: ['Scala Engineer', 'Backend Lead'],
      founderId: alexUser.id
    },
    {
      name: 'SupplyChain AI',
      logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=200&q=80',
      description: 'Predictive inventory routing software reducing port congestion delays for maritime shipping fleets.',
      industry: 'SupplyChain',
      stage: 'Seed',
      location: 'Chicago, IL',
      tagline: 'Predictive Fleet Route Optimization',
      fundingNeeded: '1900000',
      requiredRoles: ['Operations Researcher', 'Fullstack Dev'],
      founderId: marcusUser.id
    },
    {
      name: 'CleanWater Energy',
      logo: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=200&q=80',
      description: 'Electrochemical desalination membranes operating at 50% lower energy expenditure than traditional RO.',
      industry: 'CleanTech',
      stage: 'Series A',
      location: 'Denver, CO',
      tagline: 'Low Energy Desalination Technology',
      fundingNeeded: '4500000',
      requiredRoles: ['Chemical Engineer', 'Plant Ops Manager'],
      founderId: mayaUser.id
    },
    {
      name: 'MindCare Health',
      logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=200&q=80',
      description: 'Continuous digital biomarker tracking for clinical trial mental health outcomes.',
      industry: 'HealthTech',
      stage: 'Seed',
      location: 'Boston, MA',
      tagline: 'Digital Biomarkers for Mental Health',
      fundingNeeded: '1600000',
      requiredRoles: ['Clinical Trial Lead', 'iOS Dev'],
      founderId: sarahUser.id
    },
    {
      name: 'DevFlow Systems',
      logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=200&q=80',
      description: 'Automated pull request code review agent running static security analysis and unit test generation.',
      industry: 'Developer Tools',
      stage: 'Pre-Seed',
      location: 'Seattle, WA',
      tagline: 'AI Code Reviewer for Enterprise',
      fundingNeeded: '1300000',
      requiredRoles: ['TypeScript Compiler Lead', 'NLP Dev'],
      founderId: alexUser.id
    },
    {
      name: 'SmartFleet Mobility',
      logo: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=200&q=80',
      description: 'Telematics and predictive maintenance software for electric vehicle delivery fleets.',
      industry: 'Automotive Tech',
      stage: 'Seed',
      location: 'Austin, TX',
      tagline: 'EV Fleet Telematics & AI Maintenance',
      fundingNeeded: '2400000',
      requiredRoles: ['Embedded C Engineer', 'Backend Lead'],
      founderId: davidUser.id
    },
    {
      name: 'RetailEdge AI',
      logo: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=200&q=80',
      description: 'In-store edge camera analytics detecting checkout queue lengths and stockout events.',
      industry: 'E-Commerce',
      stage: 'Idea',
      location: 'Chicago, IL',
      tagline: 'In-Store Edge Computer Vision',
      fundingNeeded: '700000',
      requiredRoles: ['OpenCV Specialist', 'React Engineer'],
      founderId: trentUser.id
    },
    {
      name: 'SoundWave Audio',
      logo: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=200&q=80',
      description: 'AI spatial audio isolation removing background noise in real-time video conferences.',
      industry: 'SaaS',
      stage: 'Seed',
      location: 'Los Angeles, CA',
      tagline: 'Realtime Spatial Audio Isolation',
      fundingNeeded: '1700000',
      requiredRoles: ['DSP Specialist', 'C++ Audio Dev'],
      founderId: liamUser.id
    },
    {
      name: 'SolarGrid Tech',
      logo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=200&q=80',
      description: 'Peer-to-peer neighborhood solar energy trading protocol on high throughput L2.',
      industry: 'CleanTech',
      stage: 'Pre-Seed',
      location: 'Denver, CO',
      tagline: 'P2P Solar Trading Networks',
      fundingNeeded: '1000000',
      requiredRoles: ['Solidity Engineer', 'Fullstack Dev'],
      founderId: mayaUser.id
    }
  ];

  const seededStartups: any[] = [];
  for (const s of rawStartups) {
    const createdStartup = await prisma.startup.create({
      data: {
        name: s.name,
        logo: s.logo,
        description: s.description,
        industry: s.industry,
        stage: s.stage,
        location: s.location,
        tagline: s.tagline,
        fundingNeeded: s.fundingNeeded,
        requiredRoles: s.requiredRoles,
        founderId: s.founderId
      }
    });
    seededStartups.push(createdStartup);
  }

  console.log(`🏢 Seeded ${seededStartups.length} Startups successfully.`);

  // 4. Seed Team Members & Connected VCs
  const user1 = seededUsersMap.get('clerk_user_1');
  const user2 = seededUsersMap.get('clerk_user_2');
  const user3 = seededUsersMap.get('clerk_user_3');
  const user5 = seededUsersMap.get('clerk_user_5');
  const investor1 = seededUsersMap.get('clerk_investor_1');
  const investor2 = seededUsersMap.get('clerk_investor_2');

  // Assign team members
  await prisma.teamMember.create({
    data: { startupId: seededStartups[0].id, userId: user1.id, role: TeamRole.CO_FOUNDER }
  });
  await prisma.teamMember.create({
    data: { startupId: seededStartups[1].id, userId: user2.id, role: TeamRole.EMPLOYEE }
  });
  await prisma.teamMember.create({
    data: { startupId: seededStartups[2].id, userId: user3.id, role: TeamRole.EMPLOYEE }
  });
  await prisma.teamMember.create({
    data: { startupId: seededStartups[3].id, userId: user5.id, role: TeamRole.EMPLOYEE }
  });

  // Assign Connected VCs
  await prisma.connectedVC.create({
    data: { startupId: seededStartups[0].id, vcId: investor1.id }
  });
  await prisma.connectedVC.create({
    data: { startupId: seededStartups[2].id, vcId: investor2.id }
  });

  // 5. Seed Posts (60+ Posts)
  const postsTemplates = [
    {
      authorKey: 'user_3ErbxPahcsVtgTEy2m8661B8w6x',
      content: '🚀 Huge milestone! We just pushed our v2.0 release for Mediquick. Patients can now get matched with verified specialists in under 45 seconds using our new triage model.',
      postType: 'startup_update',
      mediaUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      startupIdx: 0
    },
    {
      authorKey: 'clerk_founder_2',
      content: '⚡ We just open-sourced our custom CUDA kernels for Llama 3 inference! Benchmarks show a 3.8x throughput increase on H100s. Github link in bio.',
      postType: 'startup_update',
      mediaUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
      startupIdx: 2
    },
    {
      authorKey: 'clerk_investor_1',
      content: '💡 What we look for in Seed-stage AI founders:\n1. Obsessive domain understanding\n2. Speed of execution > perfect code\n3. Clear distribution moat from day one.',
      postType: 'text'
    },
    {
      authorKey: 'clerk_founder_3',
      content: '📢 We are hiring a Senior Go & Distributed Systems Engineer @ PayFlow Systems! Help us build frictionless cross-border settlement rails.',
      postType: 'hiring',
      startupIdx: 3
    },
    {
      authorKey: 'clerk_founder_4',
      content: '🎉 Thrilled to announce NeuraHealth has closed a $5M Series A led by Velocity Capital! We will be expanding our clinical radiologist partnerships to 50+ hospital networks.',
      postType: 'funding',
      mediaUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80',
      startupIdx: 4
    },
    {
      authorKey: 'clerk_user_2',
      content: 'Submitting our paper on Diffusion Transformers for zero-shot 3D asset reconstruction to NeurIPS today! Amazing collaboration with the Stanford AI lab team.',
      postType: 'text'
    },
    {
      authorKey: 'clerk_founder_5',
      content: '🛠️ CloudForge v1.0 is live! Spin up multi-region Kubernetes clusters with automatic zero-trust network policies straight from your git commits.',
      postType: 'startup_update',
      mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      startupIdx: 5
    },
    {
      authorKey: 'clerk_investor_2',
      content: 'FinTech isn’t dead—it’s shifting from consumer neo-banks to embedded infrastructure & cross-border B2B settlement rails. Excited for what’s ahead.',
      postType: 'text'
    },
    {
      authorKey: 'clerk_founder_6',
      content: '🛡️ CyberShield just blocked its 10,000th kernel-level zero-day exploit attempt in production! eBPF is revolutionary for runtime security.',
      postType: 'startup_update',
      startupIdx: 6
    },
    {
      authorKey: 'clerk_founder_7',
      content: '☀️ EcoPower Energy is growing! Looking for an IoT Firmware Engineer in Denver to build our battery management controllers.',
      postType: 'hiring',
      startupIdx: 7
    },
    {
      authorKey: 'clerk_investor_3',
      content: 'DeepTech founders: Don’t pitch technology, pitch the economic transformation your technology unlocks. Investors buy outcomes, not raw specs.',
      postType: 'text'
    },
    {
      authorKey: 'clerk_founder_8',
      content: '🛰️ OrbitX satellite constellation simulator passed 100,000 automated collision avoidance tests today without a single simulated anomaly.',
      postType: 'startup_update',
      mediaUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=800&q=80',
      startupIdx: 8
    },
    {
      authorKey: 'clerk_user_1',
      content: 'Shipped a fast fulltext search engine in Rust & WebAssembly over the weekend. Check out the demo and live playground link!',
      postType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
    },
    {
      authorKey: 'clerk_founder_9',
      content: '🎮 GameCraft Studio plugin for Unreal Engine 5 is now in closed beta. Create 4k textured 3D assets from text prompts in under 15 seconds.',
      postType: 'startup_update',
      startupIdx: 9
    },
    {
      authorKey: 'clerk_investor_9',
      content: 'AI Agents will replace 80% of manual repetitive back-office tasks by 2028. The founders building reliable agent verification layers will win massive markets.',
      postType: 'text'
    },
    {
      authorKey: 'clerk_founder_10',
      content: '📚 LearnSphere AI crossed 25,000 active students! High school STEM test scores improved by an average of 22% among active users.',
      postType: 'startup_update',
      startupIdx: 10
    },
    {
      authorKey: 'clerk_founder_11',
      content: '🧪 BioSynth Dynamics discovered a novel PET plastic degrading enzyme in silico using our transformer protein folding model.',
      postType: 'startup_update',
      startupIdx: 11
    },
    {
      authorKey: 'clerk_founder_12',
      content: '🥽 OmniVR Labs is hiring WebXR Engineers and 3D Technical Artists! Help us build photorealistic industrial training simulators.',
      postType: 'hiring',
      startupIdx: 12
    },
    {
      authorKey: 'clerk_founder_13',
      content: '🔐 BlockVault Sec secured $4M Series A funding to scale our institutional MPC crypto custody infrastructure.',
      postType: 'funding',
      startupIdx: 13
    },
    {
      authorKey: 'clerk_founder_14',
      content: '🤖 RoboMotion autonomous sorters deployed in 3 major logistics hubs! Our vision perception kit increased pick speed by 35%.',
      postType: 'startup_update',
      startupIdx: 14
    },
    {
      authorKey: 'clerk_founder_15',
      content: '🌾 AgriGrowth drone mapping now active over 50,000 acres of farmland. Farmers saved 18% on fertilizer costs this season.',
      postType: 'startup_update',
      startupIdx: 15
    },
    {
      authorKey: 'clerk_investor_5',
      content: 'Zero-trust architecture is no longer optional. Every modern cloud startup needs security baked into the foundation from day 1.',
      postType: 'text'
    },
    {
      authorKey: 'clerk_user_3',
      content: 'Just finished redesigning the Noventra pitch dashboard interface! Focusing on high contrast dark mode ergonomics and clear metric visualization.',
      postType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    },
    {
      authorKey: 'user_3ErbxPahcsVtgTEy2m8661B8w6x',
      content: 'Building in public update: Noventra now connects founders directly to verified VCs and angel investors for real-time video pitch rooms.',
      postType: 'startup_update',
      startupIdx: 1
    },
    {
      authorKey: 'clerk_investor_7',
      content: 'Hardware is hard, but robotics + vision AI is the most high-upside market of this decade. Looking for ambitious robotics founders.',
      postType: 'text'
    }
  ];

  // Repeat & generate additional high quality posts to exceed 60
  const createdPosts: any[] = [];
  
  for (let i = 0; i < 3; i++) {
    for (const t of postsTemplates) {
      const author = seededUsersMap.get(t.authorKey) || navadheerUser;
      const startup = t.startupIdx !== undefined ? seededStartups[t.startupIdx] : null;
      
      const createdPost = await prisma.post.create({
        data: {
          content: i === 0 ? t.content : `${t.content} [Update #${i + 1}]`,
          postType: t.postType,
          mediaUrl: t.mediaUrl || null,
          startupId: startup ? startup.id : null,
          authorId: author.id,
          createdAt: new Date(Date.now() - (i * 86400000 * 4 + Math.random() * 86400000))
        }
      });
      createdPosts.push(createdPost);
    }
  }

  console.log(`📝 Seeded ${createdPosts.length} Posts successfully.`);

  // 6. Seed Social Graph (Likes & Comments & Follows)
  const likesToCreate: { userId: string; postId: string }[] = [];
  for (const post of createdPosts.slice(0, 40)) {
    const randomUsers = Array.from(seededUsersMap.values()).slice(0, 8);
    for (const u of randomUsers) {
      likesToCreate.push({ userId: u.id, postId: post.id });
    }
  }
  await prisma.like.createMany({
    data: likesToCreate,
    skipDuplicates: true
  });

  const commentTexts = [
    'Impressive progress! Would love to chat about synergies.',
    'Congratulations on the milestone! Huge news.',
    'This is a major breakthrough. Great work team!',
    'Interested in learning more about your technical architecture.',
    'Just sent you a connection request! Looking forward to discussing.'
  ];

  const commentsToCreate: { content: string; userId: string; postId: string }[] = [];
  for (const post of createdPosts.slice(0, 30)) {
    const commenter = Array.from(seededUsersMap.values())[Math.floor(Math.random() * seededUsersMap.size)];
    commentsToCreate.push({
      content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
      userId: commenter.id,
      postId: post.id
    });
  }
  await prisma.comment.createMany({
    data: commentsToCreate
  });

  const usersList = Array.from(seededUsersMap.values());
  const followsToCreate: { followerId: string; followingId: string }[] = [];
  for (let i = 0; i < usersList.length; i++) {
    for (let j = 0; j < usersList.length; j++) {
      if (i !== j && (i + j) % 3 === 0) {
        followsToCreate.push({
          followerId: usersList[i].id,
          followingId: usersList[j].id
        });
      }
    }
  }
  await prisma.follow.createMany({
    data: followsToCreate,
    skipDuplicates: true
  });

  console.log('❤️ Seeded Social Graph (Likes, Comments, Follows).');

  // 7. Seed Messages & Conversations
  const investorJason = seededUsersMap.get('clerk_investor_1');
  const investorRachel = seededUsersMap.get('clerk_investor_2');

  await prisma.message.create({
    data: {
      senderId: investorJason.id,
      receiverId: navadheerUser.id,
      content: 'Hi Navadheer, loved your pitch update on Mediquick and Noventra! Would love to schedule a 20-min intro call this week.'
    }
  });

  await prisma.message.create({
    data: {
      senderId: navadheerUser.id,
      receiverId: investorJason.id,
      content: 'Thanks Jason! I would be glad to demo Noventra video pitch rooms. Let me know what time works best.'
    }
  });

  await prisma.message.create({
    data: {
      senderId: investorRachel.id,
      receiverId: elenaUser.id,
      content: 'Elena, the CUDA kernel benchmarks for QuantumScale are impressive. Is your Seed round still open for participation?'
    }
  });

  console.log('💬 Seeded Direct Messages & Conversations.');

  // 8. Seed Requests (Job, Internship, Investment)
  await prisma.request.create({
    data: {
      senderId: user1.id,
      receiverFounderId: navadheerUser.id,
      startupId: seededStartups[0].id,
      requestType: RequestType.JOB,
      message: 'Hi Navadheer, I have 5 years of React & Node experience and would love to join Mediquick as a Lead Dev.',
      status: RequestStatus.PENDING
    }
  });

  await prisma.request.create({
    data: {
      senderId: investorJason.id,
      receiverFounderId: elenaUser.id,
      startupId: seededStartups[2].id,
      requestType: RequestType.INVESTMENT,
      message: 'Apex Ventures interested in participating in QuantumScale AI Seed round.',
      status: RequestStatus.ACCEPTED
    }
  });

  console.log('📥 Seeded Requests.');

  // 9. Seed Active WebRTC Meeting
  await prisma.meeting.create({
    data: {
      startupId: seededStartups[0].id,
      hostFounderId: navadheerUser.id,
      meetingCode: 'MED-PITCH-8821',
      status: MeetingStatus.ACTIVE
    }
  });

  console.log('📹 Seeded Active WebRTC Meeting.');
  console.log('✨ Noventra Database Seeding Completed Successfully!');
}

async function runSeed() {
  try {
    await main();
  } catch (e) {
    console.error('❌ Seeding failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

runSeed();
