"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, MessageSquare, ShieldCheck, Loader2, User, Phone, Video,
  MoreVertical, Calendar, Paperclip, Smile, Mic, Search, Filter,
  Clock, Sparkles, Plus, Trash, Edit, Bookmark, ChevronRight,
  ChevronDown, Check, CheckCheck, Globe, Folder, ExternalLink,
  FileText, X, ChevronLeft, BookOpen, Users, CheckCircle, TrendingUp,
  Award, Briefcase, MapPin, Activity, Volume2, Tv, Menu, Maximize2,
  Play, VolumeX, Copy, FileSpreadsheet, PlayCircle, ArrowRight, Lock,
  Settings, AlertCircle, ThumbsUp, Heart, Flame, Rocket, SmilePlus,
  Share2, Eye, Download, Star, Archive, RefreshCw, Layers
} from "lucide-react";

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Types definition
interface MessageV2 {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'VOICENOTE' | 'PITCHDECK' | 'CODE' | 'POLL' | 'EVENT' | 'OPPORTUNITY_CARD' | 'COMMIT' | 'CRM_UPDATE';
  metadata?: {
    // Media / Files
    fileName?: string;
    fileSize?: string;
    fileUrl?: string;
    version?: string;
    duration?: string;
    // Code
    codeLanguage?: string;
    codeSnippet?: string;
    // Polls
    pollQuestion?: string;
    pollOptions?: Array<{ option: string; votes: string[] }>; // array of userIds
    // Opportunities
    oppType?: 'job' | 'investor' | 'startup' | 'video';
    oppTitle?: string;
    oppSubtitle?: string;
    oppCompany?: string;
    oppSalary?: string;
    oppLocation?: string;
    oppSectors?: string[];
    oppStage?: string;
    oppUrl?: string;
    oppDuration?: string;
    oppViews?: string;
    // Calendar events
    meetingDate?: string;
    meetingTime?: string;
    meetingTimezone?: string;
    meetingDuration?: string;
    meetingTitle?: string;
    meetingCode?: string;
    // Commits
    commitBranch?: string;
    commitHash?: string;
    commitMessage?: string;
    commitRepo?: string;
  };
  reactions?: Record<string, string[]>; // emoji -> array of userIds
  replyToId?: string;
  replyToMessage?: {
    senderName: string;
    contentPreview: string;
  };
  readBy?: string[];
  pinned?: boolean;
}

interface ConversationV2 {
  id: string; // other user's ID
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: string; // FOUNDER, INVESTOR, TALENT
    company: string;
    isVerified: boolean;
    onlineStatus: 'ONLINE' | 'AWAY' | 'DND' | 'IDLE' | 'OFFLINE';
    lastSeenText: string;
    mutualConnectionsCount: number;
    bio: string;
    location: string;
    website: string;
    founderScore?: number;
    discoveryScore?: number;
    achievements?: string[];
    portfolio?: Array<{ name: string; stage: string; ticket: string }>;
    investmentThesis?: string;
    averageTicket?: string;
    openPositionsCount?: number;
    recentFounderTV?: Array<{ title: string; views: string; duration: string }>;
  };
  context: {
    type: 'Job Application' | 'Investor Match' | 'FounderTV' | 'Startup Team' | 'Community Discussion';
    title: string;
    subtitle: string;
  };
  crmTimeline: {
    stages: string[];
    currentStageIndex: number;
  };
  messages: MessageV2[];
  sharedWorkspace: {
    tasks: Array<{ id: string; title: string; status: 'todo' | 'inprogress' | 'done'; assignee: string }>;
    documents: Array<{ id: string; title: string; content: string; lastUpdated: string; author: string }>;
    roadmap: Array<{ id: string; title: string; date: string; status: 'completed' | 'in-progress' | 'planned' }>;
    hiring: Array<{ id: string; role: string; department: string; status: string; applicantsCount: number }>;
    investors: Array<{ id: string; name: string; stage: string; interest: string; ticket: string }>;
    files: Array<{ id: string; name: string; size: string; type: string; date: string; version: string }>;
    links: Array<{ id: string; title: string; url: string; date: string }>;
    notes: string;
    meetings: Array<{
      id: string;
      title: string;
      date: string;
      time: string;
      duration: string;
      meetingCode?: string;
      agenda?: string[];
      notes?: string;
      transcript?: string[];
      actionItems?: string[];
      summary?: string;
      followupDraft?: string;
    }>;
  };
  pinnedMessages: string[];
  starred: boolean;
  archived: boolean;
}

export default function MessagesPage() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  // Conversations State
  const [conversations, setConversations] = useState<ConversationV2[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  
  // Filtering & Searching
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'founders' | 'investors' | 'startups' | 'teams'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Composer states
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: string; url: string } | null>(null);
  const [replyingTo, setReplyingTo] = useState<MessageV2 | null>(null);
  
  // Sidebar states
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [rightSidebarTab, setRightSidebarTab] = useState<'info' | 'workspace' | 'files'>('info');
  const [workspaceSubTab, setWorkspaceSubTab] = useState<'chat' | 'tasks' | 'docs' | 'roadmap' | 'hiring' | 'investors' | 'meetings'>('chat');
  const [aiTab, setAiTab] = useState<'summary' | 'suggested' | 'tasks' | 'notes' | 'search'>('summary');
  
  // Loading & network status
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  
  // Interactive Modals
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null); // messageId or 'composer'
  
  // Calling state
  const [activeCall, setActiveCall] = useState<{
    type: 'audio' | 'video';
    status: 'calling' | 'connected' | 'ended';
    roomId: string;
    transcripts: string[];
    notes: string;
    timer: number;
  } | null>(null);
  
  // AI assistant loading overlays
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiSummaryResult, setAiSummaryResult] = useState<{ tldr: string; decisions: string[]; tasks: string[] } | null>(null);

  // References
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recordingTimerRef = useRef<any>(null);
  const callTimerRef = useRef<any>(null);
  const composerInputRef = useRef<HTMLTextAreaElement | null>(null);

  // Hardcoded premium mock seed data
  const getMockConversations = (currentUserId: string): ConversationV2[] => [
    {
      id: "jason-lightspeed",
      user: {
        id: "jason-lightspeed",
        name: "Jason Vance",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        role: "Managing Partner",
        company: "Lightspeed Venture Partners",
        isVerified: true,
        onlineStatus: "ONLINE",
        lastSeenText: "Active now",
        mutualConnectionsCount: 14,
        bio: "Investing in Seed to Series B AI, Enterprise Software and Clean Energy solutions. Ex-founder.",
        location: "San Francisco, CA",
        website: "https://lightspeedvp.com",
        portfolio: [
          { name: "MedQuick AI", stage: "Series A", ticket: "$3.5M" },
          { name: "Noventra", stage: "Seed", ticket: "$500K" },
          { name: "Solari Energy", stage: "Series Seed", ticket: "$1.2M" }
        ],
        investmentThesis: "Backing resilient founders building high-barrier AI engines and deep tech infrastructure.",
        averageTicket: "$1M - $5M",
        recentFounderTV: [
          { title: "VC Expectations in 2026", views: "3.4K", duration: "12:15" },
          { title: "Pitching AI Startups Effectively", views: "8.1K", duration: "08:45" }
        ]
      },
      context: {
        type: "Investor Match",
        title: "Seed Round Funding Match",
        subtitle: "Healthcare AI & Platform Ecosystems"
      },
      crmTimeline: {
        stages: ["Matched", "Profile Viewed", "Deck Shared", "Demo Scheduled", "Term Sheet", "Investment Closed"],
        currentStageIndex: 3
      },
      starred: true,
      archived: false,
      pinnedMessages: ["jason-msg-deck"],
      messages: [
        {
          id: "jason-msg-1",
          senderId: "jason-lightspeed",
          receiverId: currentUserId,
          content: "Hi there! I saw your recent pitch on Noventra Discovery. The AI workflow engine looks robust.",
          createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
          type: "TEXT"
        },
        {
          id: "jason-msg-2",
          senderId: currentUserId,
          receiverId: "jason-lightspeed",
          content: "Thanks Jason! We designed the engine to operate with sub-50ms latency across complex multi-agent flows. Have you had a chance to look at our architecture diagram?",
          createdAt: new Date(Date.now() - 3.8 * 3600000).toISOString(),
          type: "TEXT"
        },
        {
          id: "jason-msg-deck",
          senderId: currentUserId,
          receiverId: "jason-lightspeed",
          content: "Shared Noventra Pitch Deck 2026.pdf",
          createdAt: new Date(Date.now() - 3.5 * 3600000).toISOString(),
          type: "PITCHDECK",
          metadata: {
            fileName: "Noventra Pitch Deck 2026.pdf",
            fileSize: "14.2 MB",
            fileUrl: "#",
            version: "v2.1"
          },
          pinned: true
        },
        {
          id: "jason-msg-3",
          senderId: "jason-lightspeed",
          receiverId: currentUserId,
          content: "This deck is outstanding. I really like the scaling economics. Can we jump on a call tomorrow to walk through the live demo?",
          createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
          type: "TEXT"
        },
        {
          id: "jason-msg-poll",
          senderId: currentUserId,
          receiverId: "jason-lightspeed",
          content: "Poll: Select the best time for our demo tomorrow",
          createdAt: new Date(Date.now() - 2.8 * 3600000).toISOString(),
          type: "POLL",
          metadata: {
            pollQuestion: "Select the best time for our demo tomorrow (EST)",
            pollOptions: [
              { option: "10:00 AM EST", votes: [] },
              { option: "2:30 PM EST", votes: [] },
              { option: "4:00 PM EST", votes: ["jason-lightspeed"] }
            ]
          }
        },
        {
          id: "jason-msg-meeting",
          senderId: currentUserId,
          receiverId: "jason-lightspeed",
          content: "Meeting invitation: Pitch Deck Walkthrough & Demo",
          createdAt: new Date(Date.now() - 2.5 * 3600000).toISOString(),
          type: "EVENT",
          metadata: {
            meetingTitle: "Noventra Tech Demo & Seed Q&A",
            meetingDate: "Tomorrow",
            meetingTime: "4:00 PM",
            meetingTimezone: "EST",
            meetingDuration: "30 Mins",
            meetingCode: "NOV-JAS-DEMO"
          }
        }
      ],
      sharedWorkspace: {
        tasks: [
          { id: "jt-1", title: "Update Cap Table worksheet", status: "todo", assignee: "Founder" },
          { id: "jt-2", title: "Share Technical Architecture PDF", status: "done", assignee: "CTO" }
        ],
        documents: [
          { id: "jd-1", title: "Seed Deal Terms Draft", content: "# Deal Terms Draft\n- Target raise: $2.5M\n- Valuation Cap: $18M\n- Instrument: SAFE", lastUpdated: "Today", author: "Jason Vance" }
        ],
        roadmap: [
          { id: "jr-1", title: "Beta Demo", date: "Jul 23", status: "in-progress" },
          { id: "jr-2", title: "Investment Closure", date: "Aug 15", status: "planned" }
        ],
        hiring: [],
        investors: [
          { id: "ji-1", name: "Lightspeed VP", stage: "Due Diligence", interest: "High", ticket: "$1.5M" }
        ],
        files: [
          { id: "jf-1", name: "Noventra Pitch Deck 2026.pdf", size: "14.2 MB", type: "pdf", date: "2 hours ago", version: "v2.1" },
          { id: "jf-2", name: "Financial Model 3Yr.xlsx", size: "2.4 MB", type: "excel", date: "Yesterday", version: "v1.0" }
        ],
        links: [
          { id: "jl-1", title: "Lightspeed Portfolio Details", url: "https://lightspeedvp.com/portfolio", date: "Yesterday" }
        ],
        notes: "Jason is interested in our API usage telemetry. Be prepared to show the dashboard analytics during the live demo.",
        meetings: [
          {
            id: "jm-1",
            title: "Intro Call",
            date: "Yesterday",
            time: "11:00 AM",
            duration: "20 Mins",
            agenda: ["Intro and vision alignment", "Quick product high-level preview"],
            summary: "Jason was impressed by our initial growth and startup discovery platform. He requested the latest financial spreadsheet and pitch deck.",
            actionItems: ["Send Pitch Deck (Done)", "Schedule Tech Demo (Done)"]
          }
        ]
      }
    },
    {
      id: "elena-dev",
      user: {
        id: "elena-dev",
        name: "Elena Rostova",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        role: "Senior Frontend Architect",
        company: "Ex-Stripe",
        isVerified: true,
        onlineStatus: "AWAY",
        lastSeenText: "Active 15m ago",
        mutualConnectionsCount: 6,
        bio: "Specializing in reactive UI, complex canvas rendering, and high-performance Webpack/Vite custom bundlers.",
        location: "Austin, TX",
        website: "https://elena.dev",
        achievements: ["Top Contributor to React Core", "Framer Motion Expert"],
        openPositionsCount: 0,
        recentFounderTV: []
      },
      context: {
        type: "Job Application",
        title: "Senior Lead Frontend Architect",
        subtitle: "Applied 3 days ago via Noventra Jobs"
      },
      crmTimeline: {
        stages: ["Applied", "Profile Reviewed", "Screening Call", "Technical Assessment", "Final Interview", "Offer Extended"],
        currentStageIndex: 2
      },
      starred: false,
      archived: false,
      pinnedMessages: [],
      messages: [
        {
          id: "elena-msg-1",
          senderId: "elena-dev",
          receiverId: currentUserId,
          content: "Hi! Thanks for reaching out. I'm really excited about the Lead Frontend Architect position at Noventra. Here is my portfolio website and my CV.",
          createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
          type: "TEXT"
        },
        {
          id: "elena-msg-resume",
          senderId: "elena-dev",
          receiverId: currentUserId,
          content: "Shared Elena_Rostova_Resume.pdf",
          createdAt: new Date(Date.now() - 23.9 * 3600000).toISOString(),
          type: "IMAGE", // showing preview of resume
          metadata: {
            fileName: "Elena_Rostova_Resume.pdf",
            fileSize: "1.8 MB",
            fileUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop",
            version: "v1.0"
          }
        },
        {
          id: "elena-msg-code",
          senderId: "elena-dev",
          receiverId: currentUserId,
          content: "```javascript\n// Custom virtualizer hook example\nexport function useVirtualList({ items, itemHeight, containerRef }) {\n  const [startIndex, setStartIndex] = useState(0);\n  const visibleCount = Math.ceil(containerRef.current?.clientHeight / itemHeight);\n  // Render only visible list items\n  return items.slice(startIndex, startIndex + visibleCount);\n}\n```",
          createdAt: new Date(Date.now() - 23.5 * 3600000).toISOString(),
          type: "CODE",
          metadata: {
            codeLanguage: "javascript",
            codeSnippet: "// Custom virtualizer hook example\nexport function useVirtualList({ items, itemHeight, containerRef }) {\n  const [startIndex, setStartIndex] = useState(0);\n  const visibleCount = Math.ceil(containerRef.current?.clientHeight / itemHeight);\n  // Render only visible list items\n  return items.slice(startIndex, startIndex + visibleCount);\n}"
          }
        },
        {
          id: "elena-msg-2",
          senderId: currentUserId,
          receiverId: "elena-dev",
          content: "This is super clean. The viewport virtualization approach matches exactly what we need for our messaging channel list. Let's schedule our screening call.",
          createdAt: new Date(Date.now() - 23 * 3600000).toISOString(),
          type: "TEXT"
        }
      ],
      sharedWorkspace: {
        tasks: [
          { id: "et-1", title: "Complete Frontend take-home test", status: "todo", assignee: "Elena" },
          { id: "et-2", title: "Review Elena's past projects", status: "inprogress", assignee: "CTO" }
        ],
        documents: [
          { id: "ed-1", title: "Take-Home Assignment Specs", content: "# Take-Home Challenge\nBuild a lightweight Canvas diagramming tool using React and HTML5 Canvas.", lastUpdated: "Yesterday", author: "Noventra Team" }
        ],
        roadmap: [
          { id: "er-1", title: "Screening Call", date: "Jul 21", status: "completed" },
          { id: "er-2", title: "Technical Assignment", date: "Jul 25", status: "planned" }
        ],
        hiring: [
          { id: "eh-1", role: "Senior Frontend Lead", department: "Engineering", status: "Under Review", applicantsCount: 42 }
        ],
        investors: [],
        files: [
          { id: "ef-1", name: "Elena_Rostova_Resume.pdf", size: "1.8 MB", type: "pdf", date: "1 day ago", version: "v1.0" }
        ],
        links: [
          { id: "el-1", title: "Elena's GitHub Profile", url: "https://github.com/elena-codes", date: "1 day ago" }
        ],
        notes: "Elena has extensive experience in WebSockets and WebRTC from her time at Stripe. High priority candidate.",
        meetings: []
      }
    },
    {
      id: "marcus-cto",
      user: {
        id: "marcus-cto",
        name: "Marcus Aurelius",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
        role: "Co-Founder & CTO",
        company: "Noventra",
        isVerified: true,
        onlineStatus: "DND",
        lastSeenText: "Do Not Disturb",
        mutualConnectionsCount: 50,
        bio: "Building the next-gen startup infrastructure. Devoted to performance engineering, Prisma/PostgreSQL optimizations, and AI system design.",
        location: "New York, NY",
        website: "https://noventra.com",
        founderScore: 97,
        discoveryScore: 92,
        achievements: ["Forbes 30 Under 30", "Core Tech Architect"],
        openPositionsCount: 4
      },
      context: {
        type: "Startup Team",
        title: "Noventra Co-Founders",
        subtitle: "Core Startup Team Channel"
      },
      crmTimeline: {
        stages: ["Idea", "MVP Built", "Launch", "Beta Growth", "Seed Round", "Series A ready"],
        currentStageIndex: 4
      },
      starred: true,
      archived: false,
      pinnedMessages: [],
      messages: [
        {
          id: "mar-msg-1",
          senderId: "marcus-cto",
          receiverId: currentUserId,
          content: "I pushed the new real-time schema to the PostgreSQL database. Let's make sure the client uses optimistic updates so typing feels instant.",
          createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
          type: "TEXT"
        },
        {
          id: "mar-msg-commit",
          senderId: "marcus-cto",
          receiverId: currentUserId,
          content: "GitHub Commit: feat(db): update message schemas & indexes",
          createdAt: new Date(Date.now() - 0.9 * 3600000).toISOString(),
          type: "COMMIT",
          metadata: {
            commitBranch: "main",
            commitHash: "8c7fa3b",
            commitMessage: "feat(db): update message schemas & indexes to support reactions & rich types",
            commitRepo: "Noventra/backend-core"
          }
        },
        {
          id: "mar-msg-2",
          senderId: currentUserId,
          receiverId: "marcus-cto",
          content: "Awesome, I'm setting up the socket connection right now. We'll listen to typing events and sync statuses.",
          createdAt: new Date(Date.now() - 0.5 * 3600000).toISOString(),
          type: "TEXT"
        }
      ],
      sharedWorkspace: {
        tasks: [
          { id: "mt-1", title: "Integrate clerk user syncing to prisma", status: "done", assignee: "Marcus" },
          { id: "mt-2", title: "Create messaging socket listener server-side", status: "done", assignee: "Marcus" },
          { id: "mt-3", title: "Test optimistic rendering latency", status: "inprogress", assignee: "Founder" },
          { id: "mt-4", title: "Write V2 rollout marketing draft", status: "todo", assignee: "Founder" }
        ],
        documents: [
          { id: "md-1", title: "Noventra Tech Spec V2", content: "# Tech Spec V2\n- Next.js 16 Client\n- Express Socket server\n- Prisma ORM\n- Clerk Auth", lastUpdated: "3 hours ago", author: "Marcus" }
        ],
        roadmap: [
          { id: "mr-1", title: "Database Migration", date: "Jul 20", status: "completed" },
          { id: "mr-2", title: "V2 Messaging Release", date: "Jul 22", status: "in-progress" },
          { id: "mr-3", title: "Syndicate Workspace Rollout", date: "Aug 10", status: "planned" }
        ],
        hiring: [
          { id: "mh-1", role: "Senior Frontend Engineer", department: "Engineering", status: "Open", applicantsCount: 42 },
          { id: "mh-2", role: "Product Designer", department: "Design", status: "Open", applicantsCount: 19 }
        ],
        investors: [
          { id: "mi-1", name: "Lightspeed Venture Partners", stage: "Due Diligence", interest: "High", ticket: "$1.5M" },
          { id: "mi-2", name: "Sequoia Capital", stage: "Initial Intro", interest: "Medium", ticket: "$2.0M" }
        ],
        files: [
          { id: "mf-1", name: "Architecture_V2.png", size: "3.2 MB", type: "image", date: "3 hours ago", version: "v1.2" }
        ],
        links: [
          { id: "ml-1", title: "Socket.io Docs", url: "https://socket.io/docs", date: "2 days ago" }
        ],
        notes: "Noventra messaging database tables are fully optimized. We need to focus on delivering 60fps scrolling performance on mobile clients.",
        meetings: []
      }
    },
    {
      id: "chloe-greentech",
      user: {
        id: "chloe-greentech",
        name: "Chloe Dupont",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
        role: "CEO & Founder",
        company: "GreenTech AI",
        isVerified: true,
        onlineStatus: "ONLINE",
        lastSeenText: "Active now",
        mutualConnectionsCount: 8,
        bio: "Using reinforcement learning models to optimize microgrid battery storage distribution. Winner of GreenTech 2025 Summit.",
        location: "Boston, MA",
        website: "https://greentechai.io",
        founderScore: 94,
        discoveryScore: 89,
        achievements: ["Climate Tech Pioneer", "TEDx Speaker"],
        openPositionsCount: 2,
        recentFounderTV: [
          { title: "Building AI Agents for Grid Optimization", views: "1.2K", duration: "18:40" }
        ]
      },
      context: {
        type: "FounderTV",
        title: "Watched FounderTV Upload",
        subtitle: "\"Building AI Agents for Grid Optimization\" yesterday"
      },
      crmTimeline: {
        stages: ["Watched", "Followed", "Connection Accepted", "Chat Started", "Collaboration Set"],
        currentStageIndex: 3
      },
      starred: false,
      archived: false,
      pinnedMessages: [],
      messages: [
        {
          id: "chloe-msg-1",
          senderId: "chloe-greentech",
          receiverId: currentUserId,
          content: "Hi! Thanks for watching my FounderTV stream. I saw you commented on our multi-agent solar battery pricing model.",
          createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
          type: "TEXT"
        },
        {
          id: "chloe-msg-video",
          senderId: "chloe-greentech",
          receiverId: currentUserId,
          content: "FounderTV Watch link",
          createdAt: new Date(Date.now() - 9.9 * 3600000).toISOString(),
          type: "OPPORTUNITY_CARD",
          metadata: {
            oppType: "video",
            oppTitle: "Building AI Agents for Grid Optimization",
            oppSubtitle: "CEO Chloe Dupont shares how reinforcement learning transforms solar microgrids.",
            oppCompany: "GreenTech AI",
            oppDuration: "18:40",
            oppViews: "1,240 views",
            oppUrl: "#"
          }
        },
        {
          id: "chloe-msg-2",
          senderId: currentUserId,
          receiverId: "chloe-greentech",
          content: "Yes Chloe! I really like how you resolved the charging peak friction with predictive neural nets. We should discuss how you can scale this on AWS SageMaker.",
          createdAt: new Date(Date.now() - 9 * 3600000).toISOString(),
          type: "TEXT"
        }
      ],
      sharedWorkspace: {
        tasks: [],
        documents: [],
        roadmap: [],
        hiring: [],
        investors: [],
        files: [],
        links: [
          { id: "cl-1", title: "GreenTech AI Research Paper", url: "https://arxiv.org/abs/greentech-grid", date: "Yesterday" }
        ],
        notes: "Chloe is looking for an advisor with cloud scaling background. We could connect her with our mentor network.",
        meetings: []
      }
    }
  ];

  // Initialize socket client and fetch initial database data
  useEffect(() => {
    const initDataAndSocket = async () => {
      // 1. Fetch conversations from local storage if existing, or use seed
      const activeUserClerkId = clerkUser?.id || "temp-clerk-user";
      const localKey = `noventra_convs_${activeUserClerkId}`;
      let loadedConvs: ConversationV2[] = [];
      
      const stored = localStorage.getItem(localKey);
      if (stored) {
        try {
          loadedConvs = JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse stored conversations", e);
        }
      }
      
      if (!loadedConvs || loadedConvs.length === 0) {
        loadedConvs = getMockConversations(activeUserClerkId);
        localStorage.setItem(localKey, JSON.stringify(loadedConvs));
      }
      
      // Let's also fetch from DB to merge if available
      try {
        const token = await getToken();
        if (token) {
          const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
          const res = await fetch(`${apiUrl}/api/messages/conversations`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const dbConvs = await res.json();
            // Merge DB conversations into our rich mock system
            dbConvs.forEach((dbc: any) => {
              const existsIndex = loadedConvs.findIndex(c => c.id === dbc.user.id);
              if (existsIndex > -1) {
                // Keep the V2 fields, just update last message or list
                if (dbc.lastMessage) {
                  const hasMsg = loadedConvs[existsIndex].messages.some(m => m.id === dbc.lastMessage.id);
                  if (!hasMsg) {
                    loadedConvs[existsIndex].messages.push({
                      id: dbc.lastMessage.id,
                      senderId: dbc.lastMessage.senderId,
                      receiverId: dbc.lastMessage.receiverId,
                      content: dbc.lastMessage.content,
                      createdAt: dbc.lastMessage.createdAt,
                      type: "TEXT"
                    });
                  }
                }
              } else {
                // Add new conversation from DB
                loadedConvs.push({
                  id: dbc.user.id,
                  user: {
                    id: dbc.user.id,
                    name: dbc.user.name,
                    avatarUrl: dbc.user.avatarUrl,
                    role: dbc.user.role || "TALENT",
                    company: "Company",
                    isVerified: false,
                    onlineStatus: "OFFLINE",
                    lastSeenText: "Last seen recently",
                    mutualConnectionsCount: 0,
                    bio: "Noventra User",
                    location: "Unknown",
                    website: "#"
                  },
                  context: {
                    type: "Community Discussion",
                    title: "Direct Connection",
                    subtitle: "Connected recently"
                  },
                  crmTimeline: {
                    stages: ["Connected"],
                    currentStageIndex: 0
                  },
                  messages: dbc.lastMessage ? [{
                    id: dbc.lastMessage.id,
                    senderId: dbc.lastMessage.senderId,
                    receiverId: dbc.lastMessage.receiverId,
                    content: dbc.lastMessage.content,
                    createdAt: dbc.lastMessage.createdAt,
                    type: "TEXT"
                  }] : [],
                  sharedWorkspace: { tasks: [], documents: [], roadmap: [], hiring: [], investors: [], files: [], links: [], notes: "", meetings: [] },
                  pinnedMessages: [],
                  starred: false,
                  archived: false
                });
              }
            });
          }
        }
      } catch (err) {
        console.warn("DB Conversations fetch failed, running in sandbox offline mode:", err);
      }
      
      setConversations(loadedConvs);
      setLoading(false);

      if (loadedConvs.length > 0 && !selectedConvId) {
        setSelectedConvId(loadedConvs[0].id);
      }

      // Initialize Socket connection
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
      const socket = io(apiUrl, {
        withCredentials: true,
        transports: ["websocket", "polling"]
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        setSocketConnected(true);
        console.log("Connected to messaging socket server");
        socket.emit("join-chat", { userId: activeUserClerkId });
      });

      socket.on("disconnect", () => {
        setSocketConnected(false);
      });

      // Listen for incoming messages
      socket.on("message-received", (newMessage: MessageV2) => {
        setConversations(prev => {
          const updated = prev.map(conv => {
            if (conv.id === newMessage.senderId || conv.id === newMessage.receiverId) {
              const hasMsg = conv.messages.some(m => m.id === newMessage.id);
              if (hasMsg) return conv;
              return {
                ...conv,
                messages: [...conv.messages, newMessage]
              };
            }
            return conv;
          });
          saveConvsToLocalStorage(updated);
          return updated;
        });

        // Trigger native notification
        if (Notification.permission === "granted") {
          new Notification(newMessage.senderId === "jason-lightspeed" ? "Jason Vance" : "Noventra Chat", {
            body: newMessage.content,
            icon: "/favicon.ico"
          });
        }
      });

      // Listen for typing events
      socket.on("typing-start", ({ senderId }: { senderId: string }) => {
        setConversations(prev => prev.map(c => c.id === senderId ? { ...c, user: { ...c.user, onlineStatus: "ONLINE", lastSeenText: "Typing..." } } : c));
      });

      socket.on("typing-stop", ({ senderId }: { senderId: string }) => {
        setConversations(prev => prev.map(c => c.id === senderId ? { ...c, user: { ...c.user, lastSeenText: "Active now" } } : c));
      });

      // Listen for voice recording status
      socket.on("recording-start", ({ senderId }: { senderId: string }) => {
        setConversations(prev => prev.map(c => c.id === senderId ? { ...c, user: { ...c.user, lastSeenText: "Recording audio..." } } : c));
      });

      socket.on("recording-stop", ({ senderId }: { senderId: string }) => {
        setConversations(prev => prev.map(c => c.id === senderId ? { ...c, user: { ...c.user, lastSeenText: "Active now" } } : c));
      });

      // Listen for reactions updates
      socket.on("reaction-update", ({ messageId, senderId, emoji, isAdded }: { messageId: string; senderId: string; emoji: string; isAdded: boolean }) => {
        setConversations(prev => {
          const updated = prev.map(conv => {
            const msgIndex = conv.messages.findIndex(m => m.id === messageId);
            if (msgIndex === -1) return conv;

            const msgs = [...conv.messages];
            const msg = { ...msgs[msgIndex] };
            const reactions = { ...(msg.reactions || {}) };

            if (isAdded) {
              if (!reactions[emoji]) reactions[emoji] = [];
              if (!reactions[emoji].includes(senderId)) reactions[emoji].push(senderId);
            } else {
              if (reactions[emoji]) {
                reactions[emoji] = reactions[emoji].filter(uid => uid !== senderId);
                if (reactions[emoji].length === 0) delete reactions[emoji];
              }
            }

            msg.reactions = reactions;
            msgs[msgIndex] = msg;
            return { ...conv, messages: msgs };
          });
          saveConvsToLocalStorage(updated);
          return updated;
        });
      });

      // Presence list handler
      socket.on("online-users-list", (list: Array<{ userId: string; status: string }>) => {
        setConversations(prev => prev.map(conv => {
          const matched = list.find(l => l.userId === conv.id);
          if (matched) {
            return {
              ...conv,
              user: {
                ...conv.user,
                onlineStatus: matched.status as any
              }
            };
          }
          return conv;
        }));
      });

      socket.on("presence-update", ({ userId, status }: { userId: string; status: string }) => {
        setConversations(prev => prev.map(conv => {
          if (conv.id === userId) {
            return {
              ...conv,
              user: {
                ...conv.user,
                onlineStatus: status === "OFFLINE" ? "OFFLINE" : status as any,
                lastSeenText: status === "OFFLINE" ? "Offline" : "Active now"
              }
            };
          }
          return conv;
        }));
      });
    };

    if (clerkLoaded) {
      initDataAndSocket();
    }

    // Request notifications permission
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission();
    }
  }, [clerkLoaded]);

  // Sync scroll to bottom when messages list change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConvId, conversations]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimerRef.current);
      setRecordingSeconds(0);
    }
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

  // Call timer
  useEffect(() => {
    if (activeCall && activeCall.status === 'connected') {
      callTimerRef.current = setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, timer: prev.timer + 1 } : null);
      }, 1000);
    } else {
      clearInterval(callTimerRef.current);
    }
    return () => clearInterval(callTimerRef.current);
  }, [activeCall?.status]);

  // Save changes helper
  const saveConvsToLocalStorage = (convsList: ConversationV2[]) => {
    const activeUserClerkId = clerkUser?.id || "temp-clerk-user";
    localStorage.setItem(`noventra_convs_${activeUserClerkId}`, JSON.stringify(convsList));
  };

  const getActiveConversation = (): ConversationV2 | undefined => {
    return conversations.find(c => c.id === selectedConvId);
  };

  // Emit typing state
  const handleComposerChange = (text: string) => {
    setInputText(text);
    if (!socketConnected || !selectedConvId) return;

    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      socketRef.current?.emit("typing-start", {
        senderId: clerkUser?.id || "temp-clerk-user",
        receiverId: selectedConvId
      });
    } else if (text.length === 0 && isTyping) {
      setIsTyping(false);
      socketRef.current?.emit("typing-stop", {
        senderId: clerkUser?.id || "temp-clerk-user",
        receiverId: selectedConvId
      });
    }
  };

  // Send message controller
  const triggerSendMessage = async (msgPayload: Partial<MessageV2>) => {
    const activeUserClerkId = clerkUser?.id || "temp-clerk-user";
    const newMsg: MessageV2 = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      senderId: activeUserClerkId,
      receiverId: selectedConvId || "",
      content: msgPayload.content || "",
      createdAt: new Date().toISOString(),
      type: msgPayload.type || "TEXT",
      metadata: msgPayload.metadata,
      pinned: false,
      readBy: [activeUserClerkId],
      ...(replyingTo ? {
        replyToId: replyingTo.id,
        replyToMessage: {
          senderName: replyingTo.senderId === activeUserClerkId ? "You" : (getActiveConversation()?.user.name || "User"),
          contentPreview: replyingTo.content.substring(0, 50)
        }
      } : {})
    };

    // Optimistic UI update
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === selectedConvId) {
          return {
            ...conv,
            messages: [...conv.messages, newMsg]
          };
        }
        return conv;
      });
      saveConvsToLocalStorage(updated);
      return updated;
    });

    setInputText("");
    setReplyingTo(null);
    setIsTyping(false);

    // Emit via sockets if online
    if (socketConnected) {
      socketRef.current?.emit("message-sent", newMsg);
      socketRef.current?.emit("typing-stop", {
        senderId: activeUserClerkId,
        receiverId: selectedConvId
      });
    }

    // Try posting to actual backend route as well (fire and forget in background)
    try {
      const token = await getToken();
      if (token) {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        fetch(`${apiUrl}/api/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            receiverId: selectedConvId,
            content: newMsg.content
          })
        });
      }
    } catch (e) {
      console.warn("Could not sync message to server database", e);
    }
  };

  // Composer submit
  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    triggerSendMessage({
      content: inputText,
      type: "TEXT"
    });
  };

  // Trigger file attachment
  const simulateFileUpload = (fileType: string) => {
    setIsUploading(true);
    setUploadProgress(10);
    
    // Simulate upload progress
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(timer);
          setIsUploading(false);
          setUploadProgress(null);
          
          let name = "attachment.zip";
          let type: any = "ZIP";
          if (fileType === 'pdf') {
            name = "Product_Roadmap_Noventra_2026.pdf";
            type = "PITCHDECK";
          } else if (fileType === 'image') {
            name = "App_Mockup_Clean.png";
            type = "IMAGE";
          }
          
          triggerSendMessage({
            content: `Uploaded file: ${name}`,
            type,
            metadata: {
              fileName: name,
              fileSize: fileType === 'pdf' ? "4.8 MB" : "1.2 MB",
              fileUrl: fileType === 'image' ? "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop" : "#",
              version: "v1.0"
            }
          });
          return null;
        }
        return prev + 30;
      });
    }, 400);
  };

  // Toggle voice recording
  const handleVoiceRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      // Send mock voice note
      triggerSendMessage({
        content: "Voice Message (0:08)",
        type: "VOICENOTE",
        metadata: {
          fileName: "voice_note.mp3",
          fileSize: "240 KB",
          duration: `${recordingSeconds}s`
        }
      });
    } else {
      setIsRecording(true);
    }
  };

  // Toggle reactions
  const toggleReaction = (msgId: string, emoji: string) => {
    const activeUserClerkId = clerkUser?.id || "temp-clerk-user";
    
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id !== selectedConvId) return conv;
        
        const msgs = [...conv.messages];
        const msgIndex = msgs.findIndex(m => m.id === msgId);
        if (msgIndex === -1) return conv;

        const msg = { ...msgs[msgIndex] };
        const reactions = { ...(msg.reactions || {}) };
        let isAdded = true;

        if (reactions[emoji] && reactions[emoji].includes(activeUserClerkId)) {
          reactions[emoji] = reactions[emoji].filter(uid => uid !== activeUserClerkId);
          if (reactions[emoji].length === 0) delete reactions[emoji];
          isAdded = false;
        } else {
          if (!reactions[emoji]) reactions[emoji] = [];
          reactions[emoji].push(activeUserClerkId);
        }

        msg.reactions = reactions;
        msgs[msgIndex] = msg;

        // Emit socket reaction event
        if (socketConnected) {
          socketRef.current?.emit("reaction-toggle", {
            senderId: activeUserClerkId,
            receiverId: selectedConvId,
            messageId: msgId,
            emoji,
            isAdded
          });
        }

        return { ...conv, messages: msgs };
      });
      saveConvsToLocalStorage(updated);
      return updated;
    });
  };

  // AI Summary Generator
  const runAISummary = () => {
    const active = getActiveConversation();
    if (!active) return;

    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      setAiSummaryResult({
        tldr: "Discussed the tech demo scheduled for tomorrow. Jason was impressed by the Noventra Pitch Deck and wants to see details on database scaling latency and cap tables.",
        decisions: [
          "Demo scheduled for tomorrow at 4:00 PM EST.",
          "Cap table worksheet needs review before call."
        ],
        tasks: [
          "Update Cap Table worksheet (Due: Tomorrow 12:00 PM)",
          "Prepare AWS latency logs (Due: Tomorrow 3:00 PM)"
        ]
      });
    }, 1500);
  };

  // AI Contextual Reply Suggestions
  const runAISuggestedReply = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      setAiSuggestions([
        "Hi Jason, looking forward to it. I'll make sure to have the cap table and latency metrics ready.",
        "Perfect. The scheduler link is confirmed for tomorrow 4:00 PM EST.",
        "Thanks Jason. Would you like me to invite our lead database engineer as well?"
      ]);
    }, 1000);
  };

  // Create Poll from Modal
  const handleCreatePoll = (question: string, options: string[]) => {
    setShowPollModal(false);
    triggerSendMessage({
      content: `Poll: ${question}`,
      type: "POLL",
      metadata: {
        pollQuestion: question,
        pollOptions: options.map(o => ({ option: o, votes: [] }))
      }
    });
  };

  // Vote on Poll
  const handlePollVote = (msgId: string, optionIndex: number) => {
    const activeUserClerkId = clerkUser?.id || "temp-clerk-user";
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id !== selectedConvId) return conv;

        const msgs = [...conv.messages];
        const msgIndex = msgs.findIndex(m => m.id === msgId);
        if (msgIndex === -1) return conv;

        const msg = { ...msgs[msgIndex] };
        if (msg.metadata && msg.metadata.pollOptions) {
          const pollOptions = [...msg.metadata.pollOptions];
          const opt = { ...pollOptions[optionIndex] };
          
          if (opt.votes.includes(activeUserClerkId)) {
            opt.votes = opt.votes.filter(v => v !== activeUserClerkId);
          } else {
            opt.votes = [...opt.votes, activeUserClerkId];
          }

          pollOptions[optionIndex] = opt;
          msg.metadata = { ...msg.metadata, pollOptions };
          msgs[msgIndex] = msg;
        }
        return { ...conv, messages: msgs };
      });
      saveConvsToLocalStorage(updated);
      return updated;
    });
  };

  // Create Scheduled Meeting from Modal
  const handleCreateMeeting = (title: string, date: string, time: string, duration: string) => {
    setShowMeetingModal(false);
    const meetingCode = `NOV-MEET-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Add meeting message to chat
    triggerSendMessage({
      content: `Scheduled meeting: ${title}`,
      type: "EVENT",
      metadata: {
        meetingTitle: title,
        meetingDate: date,
        meetingTime: time,
        meetingDuration: duration,
        meetingTimezone: "EST",
        meetingCode
      }
    });

    // Add meeting to sharedWorkspace meeting lists
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === selectedConvId) {
          const meetings = [...conv.sharedWorkspace.meetings, {
            id: `meet-${Date.now()}`,
            title,
            date,
            time,
            duration,
            meetingCode,
            agenda: ["Introductions", "Project alignment review", "Q&A"],
            notes: "Pending call. Notes will be generated by AI Assistant after completion."
          }];
          return {
            ...conv,
            sharedWorkspace: {
              ...conv.sharedWorkspace,
              meetings
            }
          };
        }
        return conv;
      });
      saveConvsToLocalStorage(updated);
      return updated;
    });
  };

  // Call Initiation
  const startCall = (callType: 'audio' | 'video') => {
    setActiveCall({
      type: callType,
      status: 'calling',
      roomId: `room-${Math.floor(100000 + Math.random() * 900000)}`,
      transcripts: ["[AI Transcription Engine connecting...]"],
      notes: "",
      timer: 0
    });

    // Simulate connection after 2 seconds
    setTimeout(() => {
      setActiveCall(prev => {
        if (!prev || prev.status === 'ended') return prev;
        return {
          ...prev,
          status: 'connected',
          transcripts: [
            "[AI Transcription active - Speak clearly]",
            "Jason: Hey, thanks for jumping on so quickly.",
            "You: Absolutely, happy to join. How is the audio quality?",
            "Jason: Sounds perfect. Let's start the deck walkthrough."
          ]
        };
      });
      
      // Simulate live transcription updates every 8 seconds
      const transcriptionInterval = setInterval(() => {
        setActiveCall(prev => {
          if (!prev || prev.status !== 'connected') {
            clearInterval(transcriptionInterval);
            return prev;
          }
          const lines = [
            "Jason: Yes, I noticed your user acquisition has grown 18% week-over-week.",
            "You: Yes, that is mostly driven by the organic Discovery tags on our main platform.",
            "Jason: Very interesting. Let's make sure we document the next steps on the cap table review."
          ];
          const nextLine = lines[Math.floor(Math.random() * lines.length)];
          return {
            ...prev,
            transcripts: [...prev.transcripts, nextLine]
          };
        });
      }, 7000);

    }, 2000);
  };

  // End active call
  const endCall = () => {
    if (!activeCall) return;
    
    // Add meeting recap report to chat
    triggerSendMessage({
      content: `Completed Call Recaps: ${activeCall.type === 'video' ? 'Video' : 'Audio'} Call`,
      type: "CRM_UPDATE",
      metadata: {
        oppTitle: `${activeCall.type === 'video' ? 'Video' : 'Audio'} Conference Completed`,
        oppSubtitle: `Duration: ${Math.floor(activeCall.timer / 60)}m ${activeCall.timer % 60}s`,
        oppCompany: `Transcript summary generated by AI Meeting Assistant.`
      }
    });

    // Update meeting notes in workspace
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === selectedConvId) {
          const meetings = [...conv.sharedWorkspace.meetings];
          meetings.push({
            id: `meet-recap-${Date.now()}`,
            title: `Completed ${activeCall.type === 'video' ? 'Video' : 'Audio'} Call`,
            date: "Today",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            duration: `${Math.floor(activeCall.timer / 60)}m ${activeCall.timer % 60}s`,
            summary: "Walked through Noventra tech metrics and solar grid battery storage pricing models. Jason requested details on local DB scaling performance.",
            actionItems: [
              "Review Cap Table (Pending)",
              "Prepare technical metrics worksheet (Pending)"
            ],
            notes: activeCall.notes || "Call completed. Notes persisted."
          });
          return {
            ...conv,
            sharedWorkspace: {
              ...conv.sharedWorkspace,
              meetings
            }
          };
        }
        return conv;
      });
      saveConvsToLocalStorage(updated);
      return updated;
    });

    setActiveCall(null);
  };

  // Add Task inside Startup Workspace
  const handleAddWorkspaceTask = (title: string) => {
    if (!title.trim()) return;
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === selectedConvId) {
          const tasks = [...conv.sharedWorkspace.tasks, {
            id: `task-${Date.now()}`,
            title,
            status: 'todo' as const,
            assignee: "Founder"
          }];
          return {
            ...conv,
            sharedWorkspace: {
              ...conv.sharedWorkspace,
              tasks
            }
          };
        }
        return conv;
      });
      saveConvsToLocalStorage(updated);
      return updated;
    });
  };

  // Update Task Status
  const handleUpdateTaskStatus = (taskId: string, status: 'todo' | 'inprogress' | 'done') => {
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === selectedConvId) {
          const tasks = conv.sharedWorkspace.tasks.map(t => t.id === taskId ? { ...t, status } : t);
          return {
            ...conv,
            sharedWorkspace: {
              ...conv.sharedWorkspace,
              tasks
            }
          };
        }
        return conv;
      });
      saveConvsToLocalStorage(updated);
      return updated;
    });
  };

  // Update Notes
  const handleUpdateNotes = (notesText: string) => {
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === selectedConvId) {
          return {
            ...conv,
            sharedWorkspace: {
              ...conv.sharedWorkspace,
              notes: notesText
            }
          };
        }
        return conv;
      });
      saveConvsToLocalStorage(updated);
      return updated;
    });
  };

  // Update CRM stage index
  const handleCRMStageNext = () => {
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === selectedConvId) {
          const crmTimeline = { ...conv.crmTimeline };
          if (crmTimeline.currentStageIndex < crmTimeline.stages.length - 1) {
            crmTimeline.currentStageIndex += 1;
            
            // Add CRM update message to conversation
            const stageName = crmTimeline.stages[crmTimeline.currentStageIndex];
            const activeUserClerkId = clerkUser?.id || "temp-clerk-user";
            setTimeout(() => {
              triggerSendMessage({
                content: `CRM Stage updated to: ${stageName}`,
                type: "CRM_UPDATE",
                metadata: {
                  oppTitle: `Timeline Updated: ${stageName}`,
                  oppSubtitle: `Relationship stage progression updated by Noventra CRM.`
                }
              });
            }, 100);
          }
          return { ...conv, crmTimeline };
        }
        return conv;
      });
      saveConvsToLocalStorage(updated);
      return updated;
    });
  };

  const handleUpdateDocContent = (docId: string, content: string) => {
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === selectedConvId) {
          const documents = conv.sharedWorkspace.documents.map(d => 
            d.id === docId ? { ...d, content, lastUpdated: "Just now" } : d
          );
          return {
            ...conv,
            sharedWorkspace: {
              ...conv.sharedWorkspace,
              documents
            }
          };
        }
        return conv;
      });
      saveConvsToLocalStorage(updated);
      return updated;
    });
  };

  // Star / Archive conversation
  const toggleStarred = (cId: string) => {
    setConversations(prev => {
      const updated = prev.map(c => c.id === cId ? { ...c, starred: !c.starred } : c);
      saveConvsToLocalStorage(updated);
      return updated;
    });
  };

  const toggleArchived = (cId: string) => {
    setConversations(prev => {
      const updated = prev.map(c => c.id === cId ? { ...c, archived: !c.archived } : c);
      saveConvsToLocalStorage(updated);
      return updated;
    });
  };

  // Gmail-style Filter Search helper
  const getFilteredConversations = () => {
    return conversations.filter(conv => {
      // 1. Sidebar tab filter
      if (activeFilter === 'unread') {
        const hasUnread = conv.messages.length % 2 === 0; // Simulated unread check
        if (!hasUnread) return false;
      } else if (activeFilter === 'founders') {
        if (conv.user.role !== 'FOUNDER') return false;
      } else if (activeFilter === 'investors') {
        if (conv.user.role !== 'INVESTOR') return false;
      } else if (activeFilter === 'startups') {
        if (conv.user.company !== 'Noventra' && conv.user.role !== 'FOUNDER') return false;
      } else if (activeFilter === 'teams') {
        if (conv.context.type !== 'Startup Team') return false;
      }

      // 2. Search query check (supports from:Jason has:file filters)
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      if (q.startsWith('from:')) {
        const senderPart = q.replace('from:', '').trim();
        return conv.user.name.toLowerCase().includes(senderPart);
      }
      if (q.includes('has:file') || q.includes('has:image')) {
        return conv.messages.some(m => m.type === 'IMAGE' || m.type === 'PITCHDECK');
      }
      if (q.startsWith('tag:')) {
        const tagPart = q.replace('tag:', '').trim();
        return conv.context.type.toLowerCase().includes(tagPart);
      }

      return (
        conv.user.name.toLowerCase().includes(q) ||
        conv.user.company.toLowerCase().includes(q) ||
        conv.messages.some(m => m.content.toLowerCase().includes(q))
      );
    });
  };

  const activeConv = getActiveConversation();
  const activeUserClerkId = clerkUser?.id || "temp-clerk-user";

  return (
    <div className="h-screen bg-slate-50/50 flex flex-col overflow-hidden font-sans antialiased">
      <Navbar />

      {/* Main Layout Workspace - 3 Panels */}
      <main className="flex-1 flex overflow-hidden w-full relative">
        
        {/* PANEL 1: Left Sidebar - Conversation Feeds */}
        <div className="w-80 border-r border-slate-100 bg-white flex flex-col shrink-0 overflow-hidden select-none">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Collaborations
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-600 border border-blue-100">
                {socketConnected ? "Live Sync" : "Sandbox"}
              </span>
            </div>

            {/* Gmail-style search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search (e.g. from:Jason has:file)"
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-700 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {(['all', 'unread', 'founders', 'investors', 'teams'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg shrink-0 border capitalize transition-all ${
                    activeFilter === filter
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Cards List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {loading ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <span className="text-xs text-slate-400">Loading workspaces...</span>
              </div>
            ) : getFilteredConversations().length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-700">No conversations found</h4>
                <p className="text-[10px] text-slate-400 px-4 leading-normal">
                  Try clearing search filters or head over to the Discovery tab to connect with founders.
                </p>
              </div>
            ) : (
              getFilteredConversations().map((conv) => {
                const isSelected = selectedConvId === conv.id;
                const lastMsg = conv.messages[conv.messages.length - 1];
                const onlineColors = {
                  ONLINE: 'bg-emerald-500 ring-white',
                  AWAY: 'bg-amber-500 ring-white',
                  DND: 'bg-rose-500 ring-white',
                  IDLE: 'bg-slate-400 ring-white',
                  OFFLINE: 'bg-slate-300 ring-white'
                };
                
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      setReplyingTo(null);
                    }}
                    className={`w-full text-left p-3.5 flex gap-3 transition-all relative outline-none border-l-2 ${
                      isSelected
                        ? "bg-slate-50/80 border-slate-900"
                        : "bg-white hover:bg-slate-50/40 border-l-transparent"
                    }`}
                  >
                    {/* Avatar with Status badge */}
                    <div className="relative shrink-0 select-none">
                      <div className="w-11 h-11 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                        {conv.user.avatarUrl ? (
                          <img src={conv.user.avatarUrl} alt={conv.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-blue-600 bg-blue-50">
                            {conv.user.name[0]}
                          </div>
                        )}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ring-1 ring-slate-100 ${onlineColors[conv.user.onlineStatus]}`} />
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-xs truncate">{conv.user.name}</h4>
                          {conv.user.isVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-50 shrink-0" />
                          )}
                        </div>
                        <span className="text-[9px] text-slate-400 shrink-0">
                          {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                          conv.user.role === 'INVESTOR' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}>
                          {conv.user.role}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate font-medium">
                          {conv.user.company}
                        </span>
                      </div>

                      {/* Last Message preview or Status trigger */}
                      <p className="text-[11px] text-slate-500 truncate mt-1.5 font-normal leading-normal">
                        {conv.user.lastSeenText === 'Typing...' ? (
                          <span className="text-blue-600 font-semibold animate-pulse">Typing...</span>
                        ) : conv.user.lastSeenText === 'Recording audio...' ? (
                          <span className="text-blue-600 font-semibold animate-pulse">Recording voice note...</span>
                        ) : lastMsg ? (
                          lastMsg.content
                        ) : (
                          "No messages yet"
                        )}
                      </p>
                    </div>

                    {/* Action flags - Starred / Pinned */}
                    <div className="absolute right-3.5 bottom-3 flex gap-1">
                      {conv.starred && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      {conv.pinnedMessages.length > 0 && <Bookmark className="w-3 h-3 text-blue-500 fill-blue-500" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* PANEL 2: Active Conversation center viewport */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden relative">
          {activeConv ? (
            <>
              {/* Header bar */}
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      {activeConv.user.avatarUrl ? (
                        <img src={activeConv.user.avatarUrl} alt={activeConv.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-blue-600 bg-blue-50">
                          {activeConv.user.name[0]}
                        </div>
                      )}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ring-1 ring-slate-100 bg-emerald-500" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-slate-800">{activeConv.user.name}</h3>
                      {activeConv.user.isVerified && <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-50" />}
                      <span className="text-[10px] text-slate-400">• {activeConv.user.onlineStatus}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {activeConv.user.role} at {activeConv.user.company} • {activeConv.user.mutualConnectionsCount} mutual connections
                    </p>
                  </div>
                </div>

                {/* Main Action buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => startCall('audio')}
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-100 transition-all shadow-sm"
                    title="Audio call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => startCall('video')}
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-100 transition-all shadow-sm"
                    title="Video call"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowMeetingModal(true)}
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-100 transition-all shadow-sm"
                    title="Schedule Meeting"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                  <div className="w-[1px] h-6 bg-slate-200 mx-1" />
                  <button
                    onClick={() => setShowRightSidebar(!showRightSidebar)}
                    className={`p-2 rounded-xl border transition-all shadow-sm ${
                      showRightSidebar ? 'bg-slate-900 border-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pinned Universal Context Engine Banner */}
              <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded bg-blue-100 text-[9px] font-extrabold uppercase text-blue-700 tracking-wider">
                    {activeConv.context.type}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{activeConv.context.title}</span>
                  <span className="text-[11px] text-slate-400">• {activeConv.context.subtitle}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">CRM State:</span>
                  <span className="text-[10px] font-bold text-slate-800">
                    {activeConv.crmTimeline.stages[activeConv.crmTimeline.currentStageIndex]}
                  </span>
                  {activeConv.crmTimeline.currentStageIndex < activeConv.crmTimeline.stages.length - 1 && (
                    <button
                      onClick={handleCRMStageNext}
                      className="text-[9px] font-extrabold px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded hover:bg-slate-50 transition-all"
                    >
                      Advance Stage
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Viewport Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/20 scrollbar-none">
                
                {/* CRM Timeline Header Block */}
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm shadow-slate-100/50 mb-4 select-none">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      Startup CRM Pipeline Status
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      Stage {activeConv.crmTimeline.currentStageIndex + 1} of {activeConv.crmTimeline.stages.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-1 relative">
                    {activeConv.crmTimeline.stages.map((stage, idx) => {
                      const isActive = idx === activeConv.crmTimeline.currentStageIndex;
                      const isCompleted = idx < activeConv.crmTimeline.currentStageIndex;
                      return (
                        <div key={stage} className="flex flex-col gap-1 items-center relative">
                          <div className={`w-full h-1.5 rounded-full ${
                            isActive ? 'bg-blue-600' : isCompleted ? 'bg-blue-200' : 'bg-slate-100'
                          }`} />
                          <span className={`text-[9px] font-bold text-center mt-1 truncate w-full ${
                            isActive ? 'text-blue-600' : 'text-slate-400'
                          }`}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {activeConv.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12 gap-3">
                    <MessageSquare className="w-10 h-10 text-slate-300" />
                    <p className="text-xs font-medium">No messages yet. Send a query to start collaborating!</p>
                  </div>
                ) : (
                  activeConv.messages.map((msg, index) => {
                    const isMe = msg.senderId === activeUserClerkId;
                    const dateObj = new Date(msg.createdAt);
                    
                    return (
                      <div key={msg.id} className={`flex gap-3 group/msg ${isMe ? "justify-end" : "justify-start"}`}>
                        {/* Avatar */}
                        {!isMe && (
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                            {activeConv.user.avatarUrl ? (
                              <img src={activeConv.user.avatarUrl} alt={activeConv.user.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-blue-600 bg-blue-50">
                                {activeConv.user.name[0]}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="max-w-[70%] flex flex-col gap-1 relative">
                          
                          {/* Reply quote indicator */}
                          {msg.replyToMessage && (
                            <div className="text-[10px] text-slate-500 bg-slate-100/60 rounded-lg px-2.5 py-1.5 border-l-2 border-slate-400 mb-1 line-clamp-1 italic">
                              <span className="font-semibold not-italic text-slate-600 block text-[9px] mb-0.5">
                                Replying to {msg.replyToMessage.senderName}
                              </span>
                              "{msg.replyToMessage.contentPreview}"
                            </div>
                          )}

                          {/* Message Body Container */}
                          <div className={`rounded-2xl px-4 py-3 text-xs shadow-sm border border-slate-100 ${
                            isMe
                              ? "bg-slate-900 border-slate-900 text-white rounded-br-none"
                              : "bg-white text-slate-800 rounded-bl-none"
                          }`}>
                            
                            {/* RENDER MESSAGE TYPES */}
                            {msg.type === 'TEXT' && (
                              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            )}

                            {msg.type === 'CODE' && (
                              <div className="rounded-xl overflow-hidden border border-slate-200/50 bg-slate-950 text-slate-200 font-mono text-[11px] p-3.5 relative">
                                <div className="flex items-center justify-between text-[9px] text-slate-400 uppercase font-sans font-bold border-b border-slate-800 pb-1.5 mb-2">
                                  <span>{msg.metadata?.codeLanguage || 'code'}</span>
                                  <button
                                    onClick={() => navigator.clipboard.writeText(msg.metadata?.codeSnippet || '')}
                                    className="hover:text-white flex items-center gap-1"
                                  >
                                    <Copy className="w-3 h-3" /> Copy
                                  </button>
                                </div>
                                <pre className="overflow-x-auto scrollbar-none">{msg.metadata?.codeSnippet}</pre>
                              </div>
                            )}

                            {msg.type === 'PITCHDECK' && (
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className={`font-bold ${isMe ? 'text-white' : 'text-slate-800'}`}>
                                      {msg.metadata?.fileName}
                                    </h4>
                                    <span className="text-[9px] opacity-75">{msg.metadata?.fileSize} • PDF Presentation ({msg.metadata?.version})</span>
                                  </div>
                                </div>
                                <div className="h-[140px] bg-slate-900 rounded-lg overflow-hidden relative group/deck flex items-center justify-center">
                                  <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=200&fit=crop')` }} />
                                  <button className="z-10 px-3.5 py-1.5 bg-white text-slate-800 hover:bg-slate-100 rounded-lg font-bold shadow flex items-center gap-1.5 transition-all text-[11px]">
                                    <PlayCircle className="w-4 h-4 text-blue-600" />
                                    Launch Presentation
                                  </button>
                                </div>
                              </div>
                            )}

                            {msg.type === 'IMAGE' && (
                              <div className="flex flex-col gap-2">
                                <div className="rounded-lg overflow-hidden border border-slate-100">
                                  <img src={msg.metadata?.fileUrl} alt={msg.metadata?.fileName} className="w-full max-h-56 object-cover" />
                                </div>
                                <span className="text-[10px] opacity-75">{msg.metadata?.fileName} ({msg.metadata?.fileSize})</span>
                              </div>
                            )}

                            {msg.type === 'VOICENOTE' && (
                              <div className="flex items-center gap-3 py-1">
                                <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                                  <Play className="w-3.5 h-3.5 fill-white" />
                                </button>
                                <div className="flex-1 flex flex-col gap-1 min-w-[120px]">
                                  {/* Simulated Audio Wave lines */}
                                  <div className="flex items-end gap-[2px] h-5">
                                    {[3, 5, 2, 7, 8, 4, 6, 2, 8, 7, 5, 3, 6, 8, 4, 3, 2, 7, 6, 3].map((val, idx) => (
                                      <div key={idx} className="flex-1 bg-blue-500 rounded-full" style={{ height: `${val * 10}%` }} />
                                    ))}
                                  </div>
                                  <span className="text-[9px] opacity-75">Voice note • {msg.metadata?.duration || '0:05'}</span>
                                </div>
                              </div>
                            )}

                            {msg.type === 'POLL' && (
                              <div className="flex flex-col gap-3 min-w-[200px] select-none text-slate-800">
                                <h4 className="font-bold text-xs text-slate-900">{msg.metadata?.pollQuestion}</h4>
                                <div className="space-y-2">
                                  {msg.metadata?.pollOptions?.map((opt, optIdx) => {
                                    const totalVotes = msg.metadata?.pollOptions?.reduce((acc, curr) => acc + curr.votes.length, 0) || 1;
                                    const percentage = Math.round((opt.votes.length / (totalVotes || 1)) * 100);
                                    const hasVoted = opt.votes.includes(activeUserClerkId);
                                    
                                    return (
                                      <button
                                        key={opt.option}
                                        onClick={() => handlePollVote(msg.id, optIdx)}
                                        className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all relative overflow-hidden flex items-center justify-between"
                                      >
                                        <div className="absolute left-0 top-0 bottom-0 bg-blue-100/50" style={{ width: `${percentage}%` }} />
                                        <span className="z-10 font-medium text-[11px] text-slate-800 flex items-center gap-1.5">
                                          {hasVoted && <Check className="w-3.5 h-3.5 text-blue-600 font-bold" />}
                                          {opt.option}
                                        </span>
                                        <span className="z-10 text-[10px] font-bold text-slate-500">{percentage}%</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {msg.type === 'EVENT' && (
                              <div className="flex flex-col gap-3 min-w-[220px] text-slate-800 select-none">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                    <Calendar className="w-4.5 h-4.5" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-[11px] text-slate-900">{msg.metadata?.meetingTitle}</h4>
                                    <p className="text-[10px] text-slate-500">Scheduled Call Invitation</p>
                                  </div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/50 space-y-1.5 text-[10px] font-semibold text-slate-600">
                                  <div className="flex justify-between">
                                    <span>Date:</span>
                                    <span className="text-slate-800">{msg.metadata?.meetingDate}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Time:</span>
                                    <span className="text-slate-800">{msg.metadata?.meetingTime} {msg.metadata?.meetingTimezone}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Duration:</span>
                                    <span className="text-slate-800">{msg.metadata?.meetingDuration}</span>
                                  </div>
                                </div>
                                <button className="w-full py-1.5 bg-blue-600 text-white font-bold rounded-lg text-[10px] shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-1">
                                  Join Room ({msg.metadata?.meetingCode})
                                </button>
                              </div>
                            )}

                            {msg.type === 'OPPORTUNITY_CARD' && msg.metadata?.oppType === 'video' && (
                              <div className="flex flex-col gap-2.5 min-w-[220px] text-slate-800 select-none">
                                <div className="flex items-center gap-2">
                                  <Tv className="w-4.5 h-4.5 text-blue-600" />
                                  <span className="text-[10px] font-extrabold uppercase text-blue-600 tracking-wider">FounderTV Highlight</span>
                                </div>
                                <div className="h-[120px] rounded-lg bg-slate-900 relative flex items-center justify-center overflow-hidden border border-slate-200/20">
                                  <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop')` }} />
                                  <button className="w-10 h-10 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow hover:scale-105 transition-all">
                                    <Play className="w-4 h-4 fill-blue-600 ml-0.5" />
                                  </button>
                                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-slate-950/80 text-white text-[9px] font-bold rounded">
                                    {msg.metadata?.oppDuration}
                                  </span>
                                </div>
                                <div className="space-y-0.5">
                                  <h4 className="font-bold text-[11px] text-slate-900">{msg.metadata?.oppTitle}</h4>
                                  <p className="text-[9px] text-slate-500">{msg.metadata?.oppSubtitle}</p>
                                </div>
                              </div>
                            )}

                            {msg.type === 'COMMIT' && (
                              <div className="flex flex-col gap-2 min-w-[220px] text-slate-800 select-none font-mono">
                                <div className="flex items-center gap-2 text-slate-700">
                                  <Github className="w-4 h-4 text-slate-900" />
                                  <span className="text-[10px] font-bold">{msg.metadata?.commitRepo}</span>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl space-y-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[9px] font-bold">{msg.metadata?.commitHash}</span>
                                    <span className="text-slate-400 text-[10px] font-semibold">{msg.metadata?.commitBranch}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-700 leading-snug">{msg.metadata?.commitMessage}</p>
                                </div>
                              </div>
                            )}

                            {msg.type === 'CRM_UPDATE' && (
                              <div className="flex items-center gap-3 text-slate-800 min-w-[200px] select-none">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600">
                                  <CheckCircle className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-bold text-[11px] text-slate-900">{msg.metadata?.oppTitle}</h5>
                                  <p className="text-[9px] text-slate-500 leading-normal">{msg.metadata?.oppSubtitle}</p>
                                </div>
                              </div>
                            )}

                            {/* Timestamp & Seen ticks */}
                            <div className="flex items-center justify-between gap-2 mt-1.5 opacity-80 select-none">
                              <span className="text-[8px]">
                                {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isMe && (
                                <div className="flex items-center">
                                  <CheckCheck className="w-3 h-3 text-blue-400" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Reactions Emoji Pile */}
                          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                              {Object.entries(msg.reactions).map(([emoji, uids]) => (
                                <button
                                  key={emoji}
                                  onClick={() => toggleReaction(msg.id, emoji)}
                                  className={`px-1.5 py-0.5 rounded-full border text-[10px] font-semibold flex items-center gap-1 transition-all ${
                                    uids.includes(activeUserClerkId)
                                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  <span>{emoji}</span>
                                  <span>{uids.length}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Messages hover menu */}
                          <div className={`absolute top-2 opacity-0 group-hover/msg:opacity-100 transition-opacity flex items-center bg-white border border-slate-100 rounded-xl shadow-sm z-20 ${
                            isMe ? '-left-12' : '-right-12'
                          }`}>
                            <button
                              onClick={() => setReplyingTo(msg)}
                              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-l-xl"
                              title="Reply"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setShowEmojiPicker(msg.id);
                              }}
                              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                              title="React"
                            >
                              <SmilePlus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => navigator.clipboard.writeText(msg.content)}
                              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-r-xl"
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Floating mini emoji reaction popover */}
                            {showEmojiPicker === msg.id && (
                              <div className="absolute bottom-8 left-0 bg-white border border-slate-200 rounded-full shadow-lg p-1.5 flex gap-1.5 z-30">
                                {['👍', '❤️', '🔥', '🚀', '👏', '😂', '💡'].map(emoji => (
                                  <button
                                    key={emoji}
                                    onClick={() => {
                                      toggleReaction(msg.id, emoji);
                                      setShowEmojiPicker(null);
                                    }}
                                    className="text-xs hover:scale-125 transition-transform"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                                <button onClick={() => setShowEmojiPicker(null)} className="text-[10px] text-slate-400 pl-1">✕</button>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{uploadProgress}% uploading</span>
                </div>
              )}

              {/* Composer Section */}
              <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                {replyingTo && (
                  <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between mb-3 text-xs">
                    <div className="truncate">
                      <span className="font-bold text-slate-700">Replying to {replyingTo.senderId === activeUserClerkId ? "You" : activeConv.user.name}:</span>
                      <p className="text-slate-500 truncate mt-0.5 font-normal">"{replyingTo.content}"</p>
                    </div>
                    <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* AI reply suggestion chips */}
                {aiSuggestions.length > 0 && (
                  <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-none select-none">
                    {aiSuggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInputText(sug);
                          setAiSuggestions([]);
                        }}
                        className="text-[10px] font-medium bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-all shrink-0 max-w-[280px] truncate"
                      >
                        {sug}
                      </button>
                    ))}
                    <button onClick={() => setAiSuggestions([])} className="text-slate-400 hover:text-slate-600 text-xs px-2 shrink-0">✕ Clear</button>
                  </div>
                )}

                {/* Composer Main controls */}
                <form onSubmit={handleSendText} className="flex gap-2.5 items-end">
                  <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 p-2 flex flex-col gap-1.5 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                    
                    {/* Input Field */}
                    <textarea
                      ref={composerInputRef}
                      placeholder={isRecording ? "Recording voice note..." : "Type message, use @ to mention, or drag & drop files..."}
                      className="w-full bg-transparent text-xs font-normal border-0 outline-none resize-none p-1.5 max-h-24 min-h-[36px] text-slate-800 leading-relaxed"
                      value={inputText}
                      onChange={(e) => handleComposerChange(e.target.value)}
                      disabled={isRecording}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendText();
                        }
                      }}
                    />

                    {/* Toolbar actions */}
                    <div className="flex items-center justify-between border-t border-slate-100/60 pt-2 select-none">
                      <div className="flex items-center gap-1">
                        {/* Attach File buttons */}
                        <button
                          type="button"
                          onClick={() => simulateFileUpload('pdf')}
                          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                          title="Attach PDF Roadmap"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => simulateFileUpload('image')}
                          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                          title="Attach Mockups"
                        >
                          <Folder className="w-4 h-4" />
                        </button>

                        <div className="w-[1px] h-4 bg-slate-200 mx-1" />

                        {/* Interactive Widget Creators */}
                        <button
                          type="button"
                          onClick={() => setShowPollModal(true)}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 bg-white"
                        >
                          + Poll
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowOpportunityModal(true)}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 bg-white"
                        >
                          + Card
                        </button>

                        {/* Copilot Helper trigger */}
                        <button
                          type="button"
                          onClick={runAISuggestedReply}
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg flex items-center gap-1 font-bold text-[10px] transition-all"
                          title="AI Suggested Replies"
                        >
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          AI Reply
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Voice Recorder button */}
                        <button
                          type="button"
                          onClick={handleVoiceRecordToggle}
                          className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                            isRecording
                              ? 'bg-rose-500 text-white animate-pulse px-2.5'
                              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                          }`}
                          title="Voice Message"
                        >
                          <Mic className="w-4 h-4" />
                          {isRecording && <span className="text-[10px] font-bold">{recordingSeconds}s (Click stop)</span>}
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 shadow transition-all h-[48px] w-[48px] flex items-center justify-center shrink-0"
                    disabled={!inputText.trim() && !isRecording}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 select-none">
              <MessageSquare className="w-14 h-14 text-slate-200 mb-4" />
              <h3 className="font-bold text-base text-slate-700">Startup Collaborations Hub</h3>
              <p className="text-xs max-w-xs mt-1 leading-relaxed">
                Select a contact on the left panel to begin workspace sharing, document alignment, CRM timeline progression, and team planning.
              </p>
            </div>
          )}
        </div>

        {/* PANEL 3: Right Sidebar - Info panel & Workspace Details */}
        <AnimatePresence>
          {showRightSidebar && activeConv && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l border-slate-100 bg-white flex flex-col shrink-0 overflow-hidden relative shadow-sm select-none"
            >
              {/* Tabs selector */}
              <div className="flex border-b border-slate-100 shrink-0">
                {(['info', 'workspace', 'files'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setRightSidebarTab(tab)}
                    className={`flex-1 text-center py-3 text-xs font-extrabold capitalize border-b-2 transition-all ${
                      rightSidebarTab === tab
                        ? 'border-slate-900 text-slate-900 bg-slate-50/50'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Scrollable Content Container */}
              <div className="flex-1 overflow-y-auto">
                
                {/* TAB 1: Profile & Professional Information */}
                {rightSidebarTab === 'info' && (
                  <div className="p-4 space-y-5">
                    {/* Header profile cards */}
                    <div className="text-center py-2 flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                        {activeConv.user.avatarUrl ? (
                          <img src={activeConv.user.avatarUrl} alt={activeConv.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-lg text-blue-600 bg-blue-50">
                            {activeConv.user.name[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1 justify-center">
                          {activeConv.user.name}
                          {activeConv.user.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{activeConv.user.role} at {activeConv.user.company}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal px-2 mt-1">{activeConv.user.bio}</p>
                      
                      <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                        <span className="text-[9px] font-semibold bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {activeConv.user.location}
                        </span>
                        <a href={activeConv.user.website} target="_blank" rel="noreferrer" className="text-[9px] font-semibold bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-400" /> Web Link
                        </a>
                      </div>
                    </div>

                    {/* Mode specific panels: Investor Mode details */}
                    {activeConv.user.role === 'INVESTOR' && (
                      <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 space-y-3 text-xs">
                        <h5 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200/50 pb-1.5 text-[11px]">
                          <Briefcase className="w-4 h-4 text-emerald-600" /> Investor Profile Information
                        </h5>
                        <div className="space-y-2">
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Average Ticket:</span>
                            <span className="font-bold text-slate-800">{activeConv.user.averageTicket}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Investment Thesis:</span>
                            <span className="text-slate-600 leading-normal">{activeConv.user.investmentThesis}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Recent Investments:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {activeConv.user.portfolio?.map(p => (
                                <span key={p.name} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-700">
                                  {p.name} ({p.ticket})
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mode specific panels: Founder Mode details */}
                    {activeConv.user.role === 'FOUNDER' && (
                      <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 space-y-3 text-xs">
                        <h5 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200/50 pb-1.5 text-[11px]">
                          <Award className="w-4 h-4 text-blue-600" /> Founder Metrics & Scorecard
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-white rounded-lg border border-slate-200/55 text-center">
                            <span className="text-[9px] text-slate-400 font-semibold block">Founder Score</span>
                            <span className="text-sm font-extrabold text-blue-600">{activeConv.user.founderScore || 90}%</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-slate-200/55 text-center">
                            <span className="text-[9px] text-slate-400 font-semibold block">Discovery Score</span>
                            <span className="text-sm font-extrabold text-indigo-600">{activeConv.user.discoveryScore || 85}%</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-semibold block">Open Positions:</span>
                          <span className="font-bold text-slate-800">{activeConv.user.openPositionsCount || 0} Open Roles</span>
                        </div>
                        {activeConv.user.recentFounderTV && activeConv.user.recentFounderTV.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-semibold block">FounderTV uploads:</span>
                            <div className="p-2 bg-white border border-slate-200/55 rounded-lg flex items-center gap-2">
                              <PlayCircle className="w-4.5 h-4.5 text-blue-600" />
                              <div className="truncate">
                                <span className="font-bold text-[10px] block truncate">{activeConv.user.recentFounderTV[0].title}</span>
                                <span className="text-[9px] text-slate-400">{activeConv.user.recentFounderTV[0].views} views • {activeConv.user.recentFounderTV[0].duration}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* AI ASSISTANT WORKSPACE WIDGET */}
                    <div className="border border-slate-200/80 rounded-2xl p-4 space-y-3.5 bg-slate-900 text-white shadow-sm shadow-slate-900/10">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <h5 className="font-extrabold text-xs flex items-center gap-1.5 text-blue-400">
                          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                          AI Conversation Copilot
                        </h5>
                        <button
                          onClick={runAISummary}
                          className="text-[9px] font-extrabold px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Summarize
                        </button>
                      </div>

                      {/* AI workspace tabs */}
                      <div className="flex bg-slate-950 p-1 rounded-xl gap-0.5 select-none">
                        {(['summary', 'suggested', 'tasks'] as const).map(tab => (
                          <button
                            key={tab}
                            onClick={() => setAiTab(tab)}
                            className={`flex-1 text-center py-1 text-[9px] font-extrabold rounded-lg capitalize transition-all ${
                              aiTab === tab ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      {/* AI workspace views */}
                      {aiGenerating ? (
                        <div className="py-6 text-center flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                          <span className="text-[10px] text-slate-400">AI Thinking...</span>
                        </div>
                      ) : (
                        <div className="space-y-3 text-xs leading-normal">
                          {aiTab === 'summary' && (
                            <div className="space-y-3 text-slate-300">
                              {aiSummaryResult ? (
                                <>
                                  <div>
                                    <span className="text-[10px] text-slate-500 font-bold block mb-1">TL;DR:</span>
                                    <p className="text-[11px] leading-relaxed">{aiSummaryResult.tldr}</p>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-500 font-bold block mb-1">Key Decisions:</span>
                                    <ul className="list-disc pl-4 space-y-1 text-[11px]">
                                      {aiSummaryResult.decisions.map((d, i) => <li key={i}>{d}</li>)}
                                    </ul>
                                  </div>
                                </>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic text-center py-4">Click "Summarize" above to scan message history.</p>
                              )}
                            </div>
                          )}

                          {aiTab === 'suggested' && (
                            <div className="space-y-2 select-none">
                              <span className="text-[10px] text-slate-500 font-bold block mb-1">Suggested Tone Replies:</span>
                              <div className="grid grid-cols-2 gap-1.5">
                                {['Friendly', 'Professional', 'Investor', 'Recruiter'].map(tone => (
                                  <button
                                    key={tone}
                                    onClick={() => {
                                      setAiGenerating(true);
                                      setTimeout(() => {
                                        setAiGenerating(false);
                                        setInputText(
                                          tone === 'Friendly' ? `Hey ${activeConv.user.name.split(' ')[0]}! Stoked for our call. I'll make sure to get the deck sent shortly.`
                                          : tone === 'Professional' ? `Dear Jason, Thank you for the follow-up. I will review the cap table and ensure all scaling analytics are shared ahead of schedule.`
                                          : tone === 'Investor' ? `I appreciate the feedback. We're targeting an $18M Valuation Cap for this SAFE round and have committed $1.2M already.`
                                          : `Thanks for reviewing. I'd love to learn more about the take-home assessment guidelines.`
                                        );
                                      }, 800);
                                    }}
                                    className="p-2 rounded bg-slate-800 text-slate-200 border border-slate-700/80 hover:bg-slate-700 text-[10px] font-bold capitalize text-left transition-all"
                                  >
                                    ✍️ {tone} Reply
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {aiTab === 'tasks' && (
                            <div className="space-y-2">
                              <span className="text-[10px] text-slate-500 font-bold block mb-1">Extracted Tasks & ToDos:</span>
                              {aiSummaryResult ? (
                                <div className="space-y-1.5">
                                  {aiSummaryResult.tasks.map((task, i) => (
                                    <div key={i} className="flex items-start gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700/50">
                                      <input type="checkbox" className="mt-0.5 rounded border-slate-600 bg-transparent text-blue-600 focus:ring-0" />
                                      <span className="text-[10px] text-slate-200 leading-normal">{task}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic text-center py-4">Scan messages using Summarize to extract action items.</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: Startup Collaboration Workspace */}
                {rightSidebarTab === 'workspace' && (
                  <div className="p-4 space-y-4">
                    {/* Collaboration Mode Tabs Selector */}
                    <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100 select-none">
                      {([
                        { id: 'tasks', icon: CheckCircle, label: 'Tasks' },
                        { id: 'docs', icon: FileText, label: 'Docs' },
                        { id: 'roadmap', icon: TrendingUp, label: 'Roadmap' },
                        { id: 'meetings', icon: Calendar, label: 'Meetings' }
                      ] as const).map(subTab => (
                        <button
                          key={subTab.id}
                          onClick={() => setWorkspaceSubTab(subTab.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                            workspaceSubTab === subTab.id
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <subTab.icon className="w-3.5 h-3.5" />
                          {subTab.label}
                        </button>
                      ))}
                    </div>

                    {/* Workspace Views */}
                    {workspaceSubTab === 'tasks' && (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add task and press Enter"
                            className="w-full text-xs rounded-xl bg-slate-50 border border-slate-200 p-2 outline-none focus:bg-white focus:border-blue-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddWorkspaceTask(e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                        </div>

                        {/* Task columns */}
                        <div className="space-y-3 text-xs">
                          {(['todo', 'inprogress', 'done'] as const).map(col => {
                            const colTasks = activeConv.sharedWorkspace.tasks.filter(t => t.status === col);
                            return (
                              <div key={col} className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                                    {col === 'todo' ? 'To Do' : col === 'inprogress' ? 'In Progress' : 'Completed'}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 rounded">{colTasks.length}</span>
                                </div>
                                <div className="space-y-1">
                                  {colTasks.map(t => (
                                    <div key={t.id} className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between">
                                      <span className={`font-semibold text-[11px] truncate pr-2 ${t.status === 'done' ? 'line-through text-slate-400' : 'text-slate-700'}`}>{t.title}</span>
                                      <select
                                        value={t.status}
                                        onChange={(e) => handleUpdateTaskStatus(t.id, e.target.value as any)}
                                        className="text-[9px] bg-white border border-slate-200 rounded p-1 outline-none text-slate-500 font-bold"
                                      >
                                        <option value="todo">To Do</option>
                                        <option value="inprogress">Active</option>
                                        <option value="done">Done</option>
                                      </select>
                                    </div>
                                  ))}
                                  {colTasks.length === 0 && (
                                    <p className="text-[10px] text-slate-400 italic text-center py-2 bg-slate-50/20 border border-dashed border-slate-100 rounded-xl">No tasks</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {workspaceSubTab === 'docs' && (
                      <div className="space-y-3 text-xs">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Shared Documents (Markdown)</span>
                        {activeConv.sharedWorkspace.documents.map(doc => (
                          <div key={doc.id} className="border border-slate-200/80 rounded-xl overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-100 p-2 flex items-center justify-between text-[10px] font-bold text-slate-600">
                              <span>{doc.title}</span>
                              <span className="text-[9px] text-slate-400">By {doc.author} • {doc.lastUpdated}</span>
                            </div>
                            <textarea
                              className="w-full min-h-[140px] text-xs font-normal border-0 outline-none p-3 resize-y font-mono text-slate-700 leading-relaxed bg-slate-50/10"
                              value={doc.content}
                              onChange={(e) => handleUpdateDocContent(doc.id, e.target.value)}
                            />
                          </div>
                        ))}
                        {activeConv.sharedWorkspace.documents.length === 0 && (
                          <p className="text-[10px] text-slate-400 italic text-center py-6">No documents shared yet.</p>
                        )}
                      </div>
                    )}

                    {workspaceSubTab === 'roadmap' && (
                      <div className="space-y-3.5 text-xs">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Startup Roadmap Timeline</span>
                        <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 bg-slate-50/50">
                          {activeConv.sharedWorkspace.roadmap.map(item => (
                            <div key={item.id} className="p-3 flex items-center justify-between bg-white first:rounded-t-xl last:rounded-b-xl">
                              <div>
                                <span className="font-bold text-slate-800 text-[11px] block">{item.title}</span>
                                <span className="text-[9px] text-slate-400">{item.date}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                item.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : item.status === 'in-progress'
                                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                  : 'bg-slate-50 text-slate-400 border border-slate-200'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                          ))}
                          {activeConv.sharedWorkspace.roadmap.length === 0 && (
                            <p className="text-[10px] text-slate-400 italic text-center py-6">No roadmap milestones added.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {workspaceSubTab === 'meetings' && (
                      <div className="space-y-3 text-xs">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Meeting History recaps</span>
                        <div className="space-y-3">
                          {activeConv.sharedWorkspace.meetings.map(meet => (
                            <div key={meet.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                              <div className="flex items-center justify-between border-b border-slate-200/50 pb-1.5 text-[10px] font-bold">
                                <span className="text-slate-800">{meet.title}</span>
                                <span className="text-slate-400 font-semibold">{meet.date} • {meet.duration}</span>
                              </div>
                              {meet.summary && (
                                <div>
                                  <span className="text-[9px] text-slate-400 font-bold block">Summary:</span>
                                  <p className="text-[10px] text-slate-600 leading-relaxed font-normal">{meet.summary}</p>
                                </div>
                              )}
                              {meet.actionItems && meet.actionItems.length > 0 && (
                                <div>
                                  <span className="text-[9px] text-slate-400 font-bold block mb-1">Actions:</span>
                                  <div className="space-y-1">
                                    {meet.actionItems.map((act, i) => (
                                      <div key={i} className="flex items-center gap-1.5 text-[9px] text-slate-600">
                                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                                        <span>{act}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          {activeConv.sharedWorkspace.meetings.length === 0 && (
                            <p className="text-[10px] text-slate-400 italic text-center py-6">No calls scheduled or recaps logged.</p>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* TAB 3: Shared Files & Links */}
                {rightSidebarTab === 'files' && (
                  <div className="p-4 space-y-5">
                    {/* Media attachments */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Shared Documents & PDF Pitch decks</span>
                      <div className="space-y-2">
                        {activeConv.sharedWorkspace.files.map(f => (
                          <div key={f.id} className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5 truncate">
                              <FileText className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                              <div className="truncate">
                                <span className="font-bold text-slate-800 text-[11px] block truncate">{f.name}</span>
                                <span className="text-[9px] text-slate-400">{f.size} • {f.date}</span>
                              </div>
                            </div>
                            <button className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded">
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {activeConv.sharedWorkspace.files.length === 0 && (
                          <p className="text-[10px] text-slate-400 italic text-center py-4">No documents shared.</p>
                        )}
                      </div>
                    </div>

                    {/* Shared Links */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Shared External Links</span>
                      <div className="space-y-2">
                        {activeConv.sharedWorkspace.links.map(l => (
                          <a
                            key={l.id}
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs hover:bg-slate-100 transition-all"
                          >
                            <div className="truncate pr-2">
                              <span className="font-bold text-slate-800 text-[11px] block truncate">{l.title}</span>
                              <span className="text-[9px] text-slate-400 block truncate mt-0.5">{l.url}</span>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          </a>
                        ))}
                        {activeConv.sharedWorkspace.links.length === 0 && (
                          <p className="text-[10px] text-slate-400 italic text-center py-4">No links shared.</p>
                        )}
                      </div>
                    </div>

                    {/* Private notes */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Local Private Notes (Autosaved)</span>
                      <textarea
                        className="w-full min-h-[120px] rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs outline-none focus:bg-white focus:border-blue-500 resize-none font-semibold text-slate-700 leading-relaxed"
                        placeholder="Write private notes about this meeting/contact. Saved locally on this browser."
                        value={activeConv.sharedWorkspace.notes}
                        onChange={(e) => handleUpdateNotes(e.target.value)}
                      />
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* MODAL 1: Schedule Meetings Form */}
      {showMeetingModal && activeConv && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-5 shadow-2xl relative select-none animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowMeetingModal(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-base text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Schedule Collaboration Call
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              handleCreateMeeting(
                fd.get('title') as string || 'Project Walkthrough',
                fd.get('date') as string || 'Tomorrow',
                fd.get('time') as string || '12:00 PM',
                fd.get('duration') as string || '30 Mins'
              );
            }} className="space-y-4 text-xs font-semibold text-slate-600">
              <div>
                <label className="block mb-1.5">Meeting Agenda/Title:</label>
                <input required type="text" name="title" placeholder="e.g. Cap Table Walkthrough" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-700" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5">Date:</label>
                  <input required type="text" name="date" placeholder="e.g. July 23, 2026" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-700" />
                </div>
                <div>
                  <label className="block mb-1.5">Time (EST):</label>
                  <input required type="text" name="time" placeholder="e.g. 4:00 PM" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-700" />
                </div>
              </div>
              <div>
                <label className="block mb-1.5">Duration:</label>
                <select name="duration" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-700">
                  <option value="15 Mins">15 Mins Quick Sync</option>
                  <option value="30 Mins">30 Mins Standard Q&A</option>
                  <option value="45 Mins">45 Mins Pitch Walkthrough</option>
                  <option value="60 Mins">1 Hour Deep Tech Demo</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-3">
                <Button type="button" onClick={() => setShowMeetingModal(false)} className="flex-1 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded-xl py-2">Cancel</Button>
                <Button type="submit" className="flex-1 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl py-2">Create & Invite</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Poll Widget */}
      {showPollModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-5 shadow-2xl relative select-none animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowPollModal(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-base text-slate-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Create Chat Poll
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const opts = [
                fd.get('opt1') as string,
                fd.get('opt2') as string,
                fd.get('opt3') as string
              ].filter(Boolean);
              handleCreatePoll(fd.get('question') as string, opts);
            }} className="space-y-4 text-xs font-semibold text-slate-600">
              <div>
                <label className="block mb-1.5">Poll Question:</label>
                <input required type="text" name="question" placeholder="e.g. Schedule solar battery metrics walk?" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-700" />
              </div>
              <div className="space-y-2">
                <label className="block">Poll Options:</label>
                <input required type="text" name="opt1" placeholder="Option 1" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-700" />
                <input required type="text" name="opt2" placeholder="Option 2" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-700" />
                <input type="text" name="opt3" placeholder="Option 3 (Optional)" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 outline-none focus:bg-white focus:border-blue-500 text-slate-700" />
              </div>

              <div className="flex gap-2.5 pt-3">
                <Button type="button" onClick={() => setShowPollModal(false)} className="flex-1 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded-xl py-2">Cancel</Button>
                <Button type="submit" className="flex-1 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl py-2">Post Poll</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Create Smart Opportunity Cards */}
      {showOpportunityModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-5 shadow-2xl relative select-none animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowOpportunityModal(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-base text-slate-800 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Share Opportunity Card
            </h3>
            
            <div className="grid grid-cols-2 gap-2 pb-4">
              <button
                onClick={() => {
                  setShowOpportunityModal(false);
                  triggerSendMessage({
                    content: "Opportunity Card: Senior Backend Engineer Job Role",
                    type: "OPPORTUNITY_CARD",
                    metadata: {
                      oppType: 'job',
                      oppTitle: "Senior Lead Backend Architect",
                      oppSubtitle: "Full-Time • Remote (North America)",
                      oppCompany: "Noventra Core Dev",
                      oppSalary: "$140,000 - $175,000 + Equity",
                      oppLocation: "New York, NY"
                    }
                  });
                }}
                className="p-3 text-center border border-slate-200 hover:bg-slate-50 rounded-xl"
              >
                <span className="font-bold text-xs block text-slate-800">💼 Job Card</span>
                <span className="text-[9px] text-slate-400 mt-1 block">Lead Dev opening</span>
              </button>

              <button
                onClick={() => {
                  setShowOpportunityModal(false);
                  triggerSendMessage({
                    content: "Opportunity Card: Sequoia Venture Capital Partner Profile",
                    type: "OPPORTUNITY_CARD",
                    metadata: {
                      oppType: 'investor',
                      oppTitle: "Sequoia Capital",
                      oppSubtitle: "Backing legendary founders from idea to IPO.",
                      oppSectors: ["AI", "SaaS", "Security", "DevTools"],
                      oppStage: "Seed to Growth"
                    }
                  });
                }}
                className="p-3 text-center border border-slate-200 hover:bg-slate-50 rounded-xl"
              >
                <span className="font-bold text-xs block text-slate-800">💵 Investor Card</span>
                <span className="text-[9px] text-slate-400 mt-1 block">Fund Thesis details</span>
              </button>

              <button
                onClick={() => {
                  setShowOpportunityModal(false);
                  triggerSendMessage({
                    content: "Opportunity Card: MedQuick Startup profile",
                    type: "OPPORTUNITY_CARD",
                    metadata: {
                      oppType: 'startup',
                      oppTitle: "MedQuick AI",
                      oppSubtitle: "Next-gen LLMs optimized for clinical diagnostics.",
                      oppStage: "Series Seed ($3M Raised)",
                      oppCompany: "MedQuick Healthcare"
                    }
                  });
                }}
                className="p-3 text-center border border-slate-200 hover:bg-slate-50 rounded-xl"
              >
                <span className="font-bold text-xs block text-slate-800">🚀 Startup Card</span>
                <span className="text-[9px] text-slate-400 mt-1 block">Company summary page</span>
              </button>

              <button
                onClick={() => {
                  setShowOpportunityModal(false);
                  triggerSendMessage({
                    content: "Opportunity Card: GitHub Repository code link",
                    type: "COMMIT",
                    metadata: {
                      commitRepo: "Noventra/discovery-client",
                      commitBranch: "staging",
                      commitHash: "aae8c05",
                      commitMessage: "refactor: optimize infinite scroll viewport caching in explore tab"
                    }
                  });
                }}
                className="p-3 text-center border border-slate-200 hover:bg-slate-50 rounded-xl"
              >
                <span className="font-bold text-xs block text-slate-800">🐙 GitHub Commit</span>
                <span className="text-[9px] text-slate-400 mt-1 block">Staging push preview</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN CALL OVERLAY: Built-in Audio/Video Calling Screen */}
      {activeCall && activeConv && (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col justify-between p-6 select-none animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between text-white border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden border border-slate-700">
                {activeConv.user.avatarUrl ? (
                  <img src={activeConv.user.avatarUrl} alt={activeConv.user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-blue-500">
                    {activeConv.user.name[0]}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm">{activeConv.user.name}</h4>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {activeCall.status === 'calling' ? 'Calling...' : `Connected • ${Math.floor(activeCall.timer / 60)}:${(activeCall.timer % 60).toString().padStart(2, '0')}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest">Live Recording Active</span>
            </div>
          </div>

          {/* Call screen display area */}
          <div className="flex-1 flex overflow-hidden py-4 gap-4">
            
            {/* Left: Speaker view frame */}
            <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800/50 overflow-hidden relative flex items-center justify-center shadow-inner">
              {activeCall.type === 'video' ? (
                <>
                  <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&fit=crop')` }} />
                  {/* Floating User picture in picture */}
                  <div className="absolute bottom-4 right-4 w-28 h-36 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop')` }} />
                    <span className="absolute bottom-1.5 left-2 text-[9px] font-bold text-white bg-slate-950/60 px-1 rounded">You</span>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl mx-auto text-blue-500 select-none">
                    🎙️
                  </div>
                  {/* Animated audio ripples */}
                  <div className="flex items-center justify-center gap-1.5 h-8">
                    {[3, 6, 8, 5, 2, 7, 9, 4, 3, 5, 8, 2, 6, 3, 7].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-blue-500 rounded-full animate-bounce"
                        style={{
                          height: `${h * 8}px`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '1.2s'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: AI Meeting Assistant Panel */}
            <div className="w-80 bg-slate-950/80 rounded-2xl border border-slate-800/60 flex flex-col overflow-hidden text-slate-300">
              <div className="p-3.5 border-b border-slate-800/80 shrink-0">
                <span className="font-extrabold text-[11px] text-blue-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                  AI Meeting Assistant
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none text-xs">
                
                {/* Live Transcript */}
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide block">Live Transcription Feed</span>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 max-h-[140px] overflow-y-auto space-y-2 text-[10px] leading-relaxed font-mono">
                    {activeCall.transcripts.map((t, idx) => (
                      <p key={idx} className={t.startsWith('You:') ? 'text-blue-400' : 'text-slate-300'}>{t}</p>
                    ))}
                  </div>
                </div>

                {/* Call Notes scratchpad */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide block">Meeting Scratchpad</span>
                  <textarea
                    placeholder="Type meeting decisions or private alignment notes here..."
                    className="w-full h-24 bg-slate-900 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-blue-600 font-sans text-[11px] leading-relaxed text-slate-300"
                    value={activeCall.notes}
                    onChange={(e) => setActiveCall(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  />
                </div>

                {/* Agenda & Action items extracted */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide block">Realtime Action items</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800/40">
                      <input checked disabled type="checkbox" className="rounded border-slate-700 bg-transparent text-blue-600 focus:ring-0 w-3.5 h-3.5" />
                      <span className="text-[10px] text-slate-400 line-through">Establish audio connection</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800/40">
                      <input type="checkbox" className="rounded border-slate-700 bg-transparent text-blue-600 focus:ring-0 w-3.5 h-3.5" />
                      <span className="text-[10px] text-slate-300">Walkthrough Cap Table metrics</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800/40">
                      <input type="checkbox" className="rounded border-slate-700 bg-transparent text-blue-600 focus:ring-0 w-3.5 h-3.5" />
                      <span className="text-[10px] text-slate-300">Submit cloud latency analytics logs</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-center gap-4 bg-slate-950 border border-slate-800/60 p-4 rounded-2xl select-none shrink-0">
            <button className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all" title="Mute microphone">
              🎤
            </button>
            <button className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all" title="Toggle camera">
              📷
            </button>
            <button className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all" title="Share Screen">
              💻
            </button>
            <div className="w-[1px] h-6 bg-slate-800 mx-2" />
            <button
              onClick={endCall}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full transition-all shadow shadow-rose-900/40"
            >
              End Connection
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
