"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  MapPin,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { geoEqualEarth } from "d3-geo";
import { feature } from "topojson-client";
import land110m from "world-atlas/land-110m.json";
import { useReducedMotion } from "@/lib/design-system";
import { GlobalConnectivityBackground } from "./GlobalConnectivityBackground";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type UserRole =
  | "Founder"
  | "Investor"
  | "Student"
  | "Builder"
  | "Mentor"
  | "Designer"
  | "Developer";

export type UserStatus =
  | "Online"
  | "Recently Active"
  | "Collaborating"
  | "Pitching"
  | "Hiring"
  | "Fundraising";

export interface UserNode {
  id: string;
  name: string;
  role: UserRole;
  location: string;
  hubName: string;
  startup: string;
  bio: string;
  funding: string;
  avatar: string;
  coords: [number, number]; // [longitude, latitude] exact geographic coordinates
  status: UserStatus;
  tags: string[];
  connections: string[]; // Connected user IDs
}

// ============================================================================
// ROLE DESIGN SYSTEM & BADGES
// ============================================================================

const ROLE_STYLES: Record<
  UserRole,
  {
    ring: string;
    glow: string;
    badgeBg: string;
    badgeText: string;
    dotBg: string;
  }
> = {
  Founder: {
    ring: "ring-emerald-500",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.4)]",
    badgeBg: "bg-emerald-50 border-emerald-200",
    badgeText: "text-emerald-700",
    dotBg: "bg-emerald-500",
  },
  Investor: {
    ring: "ring-blue-600",
    glow: "shadow-[0_0_15px_rgba(37,99,235,0.4)]",
    badgeBg: "bg-blue-50 border-blue-200",
    badgeText: "text-blue-700",
    dotBg: "bg-blue-600",
  },
  Student: {
    ring: "ring-amber-500",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.4)]",
    badgeBg: "bg-amber-50 border-amber-200",
    badgeText: "text-amber-700",
    dotBg: "bg-amber-500",
  },
  Builder: {
    ring: "ring-violet-600",
    glow: "shadow-[0_0_15px_rgba(124,58,237,0.4)]",
    badgeBg: "bg-violet-50 border-violet-200",
    badgeText: "text-violet-700",
    dotBg: "bg-violet-600",
  },
  Mentor: {
    ring: "ring-cyan-500",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.4)]",
    badgeBg: "bg-cyan-50 border-cyan-200",
    badgeText: "text-cyan-700",
    dotBg: "bg-cyan-500",
  },
  Designer: {
    ring: "ring-pink-500",
    glow: "shadow-[0_0_15px_rgba(236,72,153,0.4)]",
    badgeBg: "bg-pink-50 border-pink-200",
    badgeText: "text-pink-700",
    dotBg: "bg-pink-500",
  },
  Developer: {
    ring: "ring-indigo-600",
    glow: "shadow-[0_0_15px_rgba(79,70,229,0.4)]",
    badgeBg: "bg-indigo-50 border-indigo-200",
    badgeText: "text-indigo-700",
    dotBg: "bg-indigo-600",
  },
};

// ============================================================================
// REALISTIC GEOGRAPHICALLY ANCHORED USER DATASET
// ============================================================================

export const COMMUNITY_NODES: UserNode[] = [
  // SILICON VALLEY / SAN FRANCISCO
  {
    id: "sf-1",
    name: "Elena Vance",
    role: "Founder",
    location: "San Francisco, USA",
    hubName: "Silicon Valley",
    startup: "NeuralAI Engine",
    bio: "Building autonomous agent infrastructure for developers.",
    funding: "$3.2M Series A",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop",
    coords: [-122.4194, 37.7749],
    status: "Pitching",
    tags: ["AI", "Infrastructure", "Developer Tools"],
    connections: ["ny-1", "london-1", "sg-1"],
  },
  {
    id: "sf-2",
    name: "David Vance",
    role: "Investor",
    location: "San Francisco, USA",
    hubName: "Silicon Valley",
    startup: "Sequoia Capital",
    bio: "Partner focusing on AI infra & developer platforms.",
    funding: "Active Investor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    coords: [-122.4194, 37.7749],
    status: "Collaborating",
    tags: ["Seed", "Series A", "AI"],
    connections: ["sf-1", "london-2", "blr-1"],
  },
  {
    id: "sf-3",
    name: "Liam Chen",
    role: "Developer",
    location: "San Francisco, USA",
    hubName: "Silicon Valley",
    startup: "Ex-Google Staff Eng",
    bio: "Rust & Distributed systems architect.",
    funding: "Hiring Co-founder",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    coords: [-122.4194, 37.7749],
    status: "Hiring",
    tags: ["Rust", "Distributed Systems", "WebRTC"],
    connections: ["sf-1", "seattle-1"],
  },

  // SEATTLE
  {
    id: "seattle-1",
    name: "Benjamin Hayes",
    role: "Builder",
    location: "Seattle, USA",
    hubName: "Seattle",
    startup: "Ex-AWS Principal",
    bio: "Building serverless vector database kernels.",
    funding: "Pre-Seed",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop",
    coords: [-122.3321, 47.6062],
    status: "Online",
    tags: ["Cloud", "Databases", "Vector"],
    connections: ["sf-3", "toronto-1"],
  },

  // NEW YORK
  {
    id: "ny-1",
    name: "Marcus Thorne",
    role: "Founder",
    location: "New York, USA",
    hubName: "New York",
    startup: "Payload Security",
    bio: "Real-time compliance auditing for FinTech APIs.",
    funding: "$1.8M Seed",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop",
    coords: [-74.006, 40.7128],
    status: "Fundraising",
    tags: ["Fintech", "Cybersecurity", "API"],
    connections: ["sf-1", "london-1", "dubai-1"],
  },
  {
    id: "ny-2",
    name: "Aria Montgomery",
    role: "Designer",
    location: "New York, USA",
    hubName: "New York",
    startup: "Ex-Framer Lead",
    bio: "Designing spatial UI design systems for SaaS.",
    funding: "Open for Advisory",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    coords: [-74.006, 40.7128],
    status: "Online",
    tags: ["Design Systems", "Figma", "UX"],
    connections: ["ny-1", "london-3"],
  },

  // TORONTO
  {
    id: "toronto-1",
    name: "Chloe Miller",
    role: "Student",
    location: "Toronto, Canada",
    hubName: "Toronto",
    startup: "Univ. of Toronto AI Lab",
    bio: "Researching multi-modal LLM compression.",
    funding: "Pre-Seed",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop",
    coords: [-79.3832, 43.6532],
    status: "Recently Active",
    tags: ["ML", "Research", "PyTorch"],
    connections: ["seattle-1", "ny-1"],
  },

  // LONDON
  {
    id: "london-1",
    name: "Alex Rivera",
    role: "Founder",
    location: "London, UK",
    hubName: "London",
    startup: "FinFlow AI",
    bio: "Automated cross-border Treasury infrastructure.",
    funding: "$2.4M Seed",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    coords: [-0.1276, 51.5074],
    status: "Online",
    tags: ["Fintech", "Payments", "Treasury"],
    connections: ["sf-1", "ny-1", "berlin-1"],
  },
  {
    id: "london-2",
    name: "Victoria Sterling",
    role: "Investor",
    location: "London, UK",
    hubName: "London",
    startup: "Index Ventures",
    bio: "Investing in European B2B SaaS and AI infra.",
    funding: "Active Investor",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop",
    coords: [-0.1276, 51.5074],
    status: "Collaborating",
    tags: ["Series A", "Fintech", "SaaS"],
    connections: ["sf-2", "london-1", "paris-1"],
  },
  {
    id: "london-3",
    name: "Oliver Smith",
    role: "Mentor",
    location: "London, UK",
    hubName: "London",
    startup: "Ex-Revolut VP Eng",
    bio: "Scaling engineering organizations from 10 to 200.",
    funding: "Advisor",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop",
    coords: [-0.1276, 51.5074],
    status: "Recently Active",
    tags: ["Scalability", "Leadership", "DevOps"],
    connections: ["ny-2", "london-1"],
  },

  // AMSTERDAM
  {
    id: "ams-1",
    name: "Sven Van Dijk",
    role: "Builder",
    location: "Amsterdam, Netherlands",
    hubName: "Amsterdam",
    startup: "Techstars Amsterdam",
    bio: "Managing director supporting early stage European founders.",
    funding: "Batch W26",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop",
    coords: [4.9041, 52.3676],
    status: "Hiring",
    tags: ["Accelerator", "Pre-Seed", "Europe"],
    connections: ["berlin-1", "london-1"],
  },

  // PARIS
  {
    id: "paris-1",
    name: "Camille Dubois",
    role: "Developer",
    location: "Paris, France",
    hubName: "Paris",
    startup: "Mistral Ecosystem Contributor",
    bio: "Building open-source AI models & inference runtimes.",
    funding: "Grant Winner",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    coords: [2.3522, 48.8566],
    status: "Online",
    tags: ["Open Source", "LLMs", "C++"],
    connections: ["london-2", "berlin-1"],
  },

  // BERLIN
  {
    id: "berlin-1",
    name: "Klaus Weber",
    role: "Founder",
    location: "Berlin, Germany",
    hubName: "Berlin",
    startup: "Solaris CleanTech",
    bio: "Grid-scale battery optimization algorithms.",
    funding: "€1.5M Pre-Seed",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop",
    coords: [13.405, 52.52],
    status: "Fundraising",
    tags: ["ClimateTech", "AI", "Clean Energy"],
    connections: ["london-1", "paris-1", "ams-1"],
  },

  // DUBAI
  {
    id: "dubai-1",
    name: "Tariq Al-Mansoor",
    role: "Investor",
    location: "Dubai, UAE",
    hubName: "Dubai",
    startup: "MENA Ventures",
    bio: "Backing cross-border SaaS connecting Middle East & Asia.",
    funding: "$50M Fund",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    coords: [55.2708, 25.2048],
    status: "Online",
    tags: ["Fintech", "Logistics", "SaaS"],
    connections: ["ny-1", "blr-1", "sg-1"],
  },

  // BANGALORE
  {
    id: "blr-1",
    name: "Aarav Patel",
    role: "Founder",
    location: "Bangalore, India",
    hubName: "Bangalore",
    startup: "PulseMed AI",
    bio: "AI diagnostics platform for rural health centers.",
    funding: "$1.2M Seed",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop",
    coords: [77.5946, 12.9716],
    status: "Pitching",
    tags: ["Healthcare", "AI", "SaaS"],
    connections: ["sf-2", "dubai-1", "hyd-1", "sg-1"],
  },
  {
    id: "blr-2",
    name: "Priya Sharma",
    role: "Developer",
    location: "Bangalore, India",
    hubName: "Bangalore",
    startup: "Ex-Postman Tech Lead",
    bio: "Building high-performance GraphQL & API gateway toolkits.",
    funding: "Hiring Co-founder",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop",
    coords: [77.5946, 12.9716],
    status: "Online",
    tags: ["APIs", "Go", "Cloud Native"],
    connections: ["blr-1", "sg-2"],
  },

  // HYDERABAD
  {
    id: "hyd-1",
    name: "Rohan Varma",
    role: "Student",
    location: "Hyderabad, India",
    hubName: "Hyderabad",
    startup: "IIT Hyderabad AI Hub",
    bio: "Building low-bit quantization for edge AI chips.",
    funding: "Pre-Seed",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    coords: [78.4867, 17.385],
    status: "Recently Active",
    tags: ["Edge AI", "Hardware", "Embedded"],
    connections: ["blr-1", "tokyo-1"],
  },

  // SINGAPORE
  {
    id: "sg-1",
    name: "Samantha Wu",
    role: "Founder",
    location: "Singapore",
    hubName: "Singapore",
    startup: "BioHealth AI",
    bio: "Genomic sequencing search engine for clinical trials.",
    funding: "Pre-Seed YC W26",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    coords: [103.8198, 1.3521],
    status: "Fundraising",
    tags: ["BioTech", "AI", "DeepTech"],
    connections: ["sf-1", "blr-1", "tokyo-1"],
  },
  {
    id: "sg-2",
    name: "Kenji Sato",
    role: "Investor",
    location: "Singapore",
    hubName: "Singapore",
    startup: "Monk's Hill Ventures",
    bio: "Investing in Southeast Asian SEA tech founders.",
    funding: "Active Investor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    coords: [103.8198, 1.3521],
    status: "Collaborating",
    tags: ["SEA", "Seed", "Marketplaces"],
    connections: ["sg-1", "blr-2"],
  },

  // TOKYO
  {
    id: "tokyo-1",
    name: "Yuki Tanaka",
    role: "Builder",
    location: "Tokyo, Japan",
    hubName: "Tokyo",
    startup: "Robotics Compute Lab",
    bio: "Humanoid robot motion planning algorithms.",
    funding: "$2.0M Seed",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop",
    coords: [139.6917, 35.6895],
    status: "Online",
    tags: ["Robotics", "ROS", "AI"],
    connections: ["sg-1", "seoul-1", "hyd-1"],
  },

  // SEOUL
  {
    id: "seoul-1",
    name: "Min-Jun Park",
    role: "Developer",
    location: "Seoul, South Korea",
    hubName: "Seoul",
    startup: "HyperScale AI",
    bio: "Sub-millisecond real-time AI inference engine.",
    funding: "Hiring Engineers",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    coords: [126.978, 37.5665],
    status: "Online",
    tags: ["AI", "Real-Time", "Infrastructure"],
    connections: ["tokyo-1", "sf-1"],
  },

  // SYDNEY
  {
    id: "sydney-1",
    name: "Jack Robinson",
    role: "Mentor",
    location: "Sydney, Australia",
    hubName: "Sydney",
    startup: "Ex-Atlassian Director",
    bio: "Advising B2B SaaS founders on PLG loops.",
    funding: "Advisor",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop",
    coords: [151.2093, -33.8688],
    status: "Recently Active",
    tags: ["PLG", "SaaS", "Growth"],
    connections: ["sg-1", "sf-2"],
  },
];

// ============================================================================
// MAIN COMPONENT: GlobalCommunityMap
// ============================================================================

export function GlobalCommunityMap() {
  const isReducedMotion = useReducedMotion();
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [liveEventMessage, setLiveEventMessage] = useState<string>(
    "Liam Chen connected with Elena Vance (San Francisco)"
  );
  const [pulseTargetId, setPulseTargetId] = useState<string | null>("sf-1");

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 640 });

  // Synchronize container bounds with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const updateBounds = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: Math.max(clientWidth, 320),
          height: Math.max(clientHeight, 240),
        });
      }
    };

    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Compute the EXACT SAME D3 GeoEqualEarth Projection as GlobalConnectivityBackground
  const projection = useMemo(() => {
    const landGeoJson = feature(
      land110m as any,
      (land110m as any).objects.land
    );
    const padX = Math.max(dimensions.width * 0.06, 36);
    const padY = Math.max(dimensions.height * 0.08, 44);
    return geoEqualEarth().fitExtent(
      [
        [padX, padY],
        [dimensions.width - padX, dimensions.height - padY],
      ],
      landGeoJson as any
    );
  }, [dimensions.width, dimensions.height]);

  // Project hub coordinates to (x, y) pixels with small radial spread for multi-user cities
  const projectedUserNodes = useMemo(() => {
    const hubGroups = new Map<string, UserNode[]>();
    COMMUNITY_NODES.forEach((node) => {
      const key = node.hubName;
      if (!hubGroups.has(key)) hubGroups.set(key, []);
      hubGroups.get(key)!.push(node);
    });

    const result: { node: UserNode; x: number; y: number }[] = [];

    hubGroups.forEach((group) => {
      const count = group.length;
      group.forEach((node, idx) => {
        const coords = projection(node.coords);
        if (!coords) return;

        let x = coords[0];
        let y = coords[1];

        // Small radial spread computed around exact projected hub position
        if (count > 1) {
          const radius = 18; // 18px radius spread
          const angle = (idx * (2 * Math.PI / count)) - (Math.PI / 4);
          x += Math.cos(angle) * radius;
          y += Math.sin(angle) * radius;
        }

        result.push({ node, x, y });
      });
    });

    return result;
  }, [projection]);

  // Map for fast target node lookup by ID
  const projectedUserMap = useMemo(() => {
    const map = new Map<string, { node: UserNode; x: number; y: number }>();
    projectedUserNodes.forEach((item) => map.set(item.node.id, item));
    return map;
  }, [projectedUserNodes]);

  // Active hover/selected node entity
  const hoveredNode = useMemo(
    () => COMMUNITY_NODES.find((n) => n.id === activeNodeId) || null,
    [activeNodeId]
  );

  const selectedNode = useMemo(
    () => COMMUNITY_NODES.find((n) => n.id === selectedNodeId) || null,
    [selectedNodeId]
  );

  const displayTooltipNode = hoveredNode || selectedNode;

  // Projection coordinate of active tooltip node
  const displayTooltipProj = useMemo(() => {
    if (!displayTooltipNode) return null;
    return projectedUserMap.get(displayTooltipNode.id) || null;
  }, [displayTooltipNode, projectedUserMap]);

  // Compute connected node IDs for visual highlighting
  const activeConnectedIds = useMemo(() => {
    if (!displayTooltipNode) return [];
    return displayTooltipNode.connections;
  }, [displayTooltipNode]);

  // Periodic random live network connection ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const randomSourceIdx = Math.floor(Math.random() * COMMUNITY_NODES.length);
      const source = COMMUNITY_NODES[randomSourceIdx];
      if (source.connections.length > 0) {
        const targetId = source.connections[Math.floor(Math.random() * source.connections.length)];
        const target = COMMUNITY_NODES.find((n) => n.id === targetId);

        if (target) {
          setLiveEventMessage(
            `${source.name} (${source.role}) connected with ${target.name} (${target.role}, ${target.hubName})`
          );
          setPulseTargetId(source.id);
        }
      }
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* 1. Header Section (Heading z-20, Subtitle, Role Badges z-10) */}
      <div className="text-center max-w-3xl mx-auto mb-14 relative z-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Globe className="w-4 h-4 text-blue-600 animate-spinSlow" />
          <span>Global Noventra Network</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Connecting Visionaries <span className="text-gradient-hero">Across the Globe</span>
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
          Connecting founders, accredited VCs, engineers, designers, and mentors across top technology hubs.
        </p>

        {/* Category Legend Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs">
          {(
            [
              "Founder",
              "Investor",
              "Student",
              "Builder",
              "Mentor",
              "Designer",
              "Developer",
            ] as UserRole[]
          ).map((role) => {
            const style = ROLE_STYLES[role];
            return (
              <div
                key={role}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${style.badgeBg} ${style.badgeText} font-semibold`}
              >
                <span className={`w-2 h-2 rounded-full ${style.dotBg}`} />
                <span>{role}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Map Showcase Card Container (rounded-[32px], relative overflow-hidden) */}
      <div
        ref={containerRef}
        className="glass-panel bg-[#F8FAFC]/90 backdrop-blur-md border border-slate-200/90 rounded-[32px] p-4 sm:p-8 shadow-xl relative overflow-hidden min-h-[580px] flex flex-col justify-between"
      >
        {/* THE ONLY INSTANCE OF GLOBAL CONNECTIVITY BACKGROUND IN THE ENTIRE APP */}
        <GlobalConnectivityBackground className="absolute inset-0 w-full h-full z-0 pointer-events-none" />

        {/* LIGHT BASE GRADIENT & GRID OVERLAY */}
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[350px] bg-blue-500/05 rounded-full filter blur-[100px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none z-0" />

        {/* SVG CONNECTION LINES LAYER BETWEEN ACCURATE D3 PROJECTED AVATARS */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="activeBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {COMMUNITY_NODES.map((node) => {
            const sourceProj = projectedUserMap.get(node.id);
            if (!sourceProj) return null;

            return node.connections.map((targetId) => {
              const targetProj = projectedUserMap.get(targetId);
              if (!targetProj) return null;

              const isHighlighted =
                displayTooltipNode &&
                (displayTooltipNode.id === node.id ||
                  displayTooltipNode.id === targetId ||
                  activeConnectedIds.includes(node.id));

              return (
                <line
                  key={`${node.id}-${targetId}`}
                  x1={sourceProj.x.toFixed(2)}
                  y1={sourceProj.y.toFixed(2)}
                  x2={targetProj.x.toFixed(2)}
                  y2={targetProj.y.toFixed(2)}
                  stroke={isHighlighted ? "url(#activeBeam)" : "#93C5FD"}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeOpacity={isHighlighted ? 0.95 : 0.35}
                  strokeDasharray={isHighlighted ? "6 6" : "none"}
                  className={isHighlighted ? "animate-pulse" : ""}
                />
              );
            });
          })}
        </svg>

        {/* USER AVATAR MARKERS LAYER (EXACTLY D3 PROJECTED TO CITY LANDMASS) */}
        <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
          {projectedUserNodes.map(({ node, x, y }) => {
            const roleStyle = ROLE_STYLES[node.role];
            const isHovered = activeNodeId === node.id;
            const isSelected = selectedNodeId === node.id;
            const isConnected = activeConnectedIds.includes(node.id);
            const isPulsing = pulseTargetId === node.id;

            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                style={{
                  position: "absolute",
                  left: `${x.toFixed(2)}px`,
                  top: `${y.toFixed(2)}px`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={() => setActiveNodeId(node.id)}
                onMouseLeave={() => setActiveNodeId(null)}
                onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                className="pointer-events-auto cursor-pointer group z-20"
                tabIndex={0}
                aria-label={`${node.name}, ${node.role} in ${node.location}`}
              >
                <motion.div
                  animate={
                    isReducedMotion
                      ? {}
                      : {
                          y: [0, -5, 0],
                        }
                  }
                  transition={{
                    duration: 4 + (node.name.length % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative flex items-center justify-center"
                >
                  {/* Pulsing Aura */}
                  {(isHovered || isPulsing || isConnected) && (
                    <span
                      className={`animate-ping absolute inline-flex h-10 w-10 rounded-full opacity-60 ${roleStyle.dotBg}`}
                    />
                  )}

                  {/* Avatar Circle Container */}
                  <div
                    className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 bg-white transition-all duration-300 shadow-md ${
                      roleStyle.ring
                    } ${
                      isHovered || isSelected
                        ? `scale-125 ${roleStyle.glow} z-40 ring-4`
                        : isConnected
                        ? "scale-110 ring-2"
                        : "hover:scale-110"
                    }`}
                  >
                    <img
                      src={node.avatar}
                      alt={node.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Online Indicator */}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${roleStyle.dotBg} shadow-sm`}
                  />
                </motion.div>
              </motion.div>
            );
          })}

          {/* INTELLIGENT FLOATING GLASS TOOLTIP */}
          <AnimatePresence>
            {displayTooltipNode && displayTooltipProj && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: "absolute",
                  top: `${Math.min(Math.max(displayTooltipProj.y - 20, 20), dimensions.height - 240)}px`,
                  left: `${
                    displayTooltipProj.x > dimensions.width / 2
                      ? Math.max(displayTooltipProj.x - 330, 20)
                      : Math.min(displayTooltipProj.x + 20, dimensions.width - 340)
                  }px`,
                }}
                className="z-50 pointer-events-none w-72 sm:w-80"
              >
                <div className="glass-panel bg-white/95 backdrop-blur-xl border border-slate-200 p-5 rounded-2xl shadow-2xl text-left space-y-3.5">
                  {/* Header: Avatar, Name, Role, Location */}
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={displayTooltipNode.avatar}
                        alt={displayTooltipNode.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-black text-slate-900">
                            {displayTooltipNode.name}
                          </h4>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-50" />
                        </div>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border inline-block mt-0.5 ${
                            ROLE_STYLES[displayTooltipNode.role].badgeBg
                          } ${ROLE_STYLES[displayTooltipNode.role].badgeText}`}
                        >
                          {displayTooltipNode.role}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      {displayTooltipNode.status}
                    </span>
                  </div>

                  {/* Location & Startup */}
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{displayTooltipNode.location}</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 mt-1">
                      {displayTooltipNode.startup}
                    </h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      "{displayTooltipNode.bio}"
                    </p>
                  </div>

                  {/* Funding / Stage Badge */}
                  <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-200 p-2 rounded-xl">
                    <span className="text-slate-500 font-medium">Stage / Status:</span>
                    <span className="text-blue-600 font-extrabold">
                      {displayTooltipNode.funding}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {displayTooltipNode.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LIVE ACTIVITY TICKER BAR AT BOTTOM */}
        <div className="bg-white/95 border border-slate-200 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs z-30 shadow-md">
          <div className="flex items-center gap-2.5 text-slate-700 overflow-hidden">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20 shrink-0" />
            <span className="font-bold text-slate-900 shrink-0">Live Network Activity:</span>
            <span className="text-slate-700 font-medium truncate">{liveEventMessage}</span>
          </div>

          <span className="text-blue-700 font-mono font-bold bg-blue-50 border border-blue-200 px-3 py-1 rounded-full shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>40+ Active Nodes</span>
          </span>
        </div>
      </div>
    </section>
  );
}
