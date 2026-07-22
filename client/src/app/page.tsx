"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { 
  ArrowRight, Briefcase, Building2, Users, Video, Zap, MessageSquare, 
  Search, Shield, Star, Sparkles, Globe, Heart, ChevronRight, Check
} from "lucide-react";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/feed");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased relative overflow-hidden flex flex-col justify-between selection:bg-blue-500/10 select-none">
      
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Radial mesh background */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0,transparent_60%)] filter blur-3xl" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_0,transparent_65%)] filter blur-3xl" />
        <div className="absolute bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0,transparent_50%)] filter blur-3xl" />
        
        {/* Sleek Grid Overlay Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
      </div>

      {/* Global Header Brand Bar */}
      <header className="max-w-[1440px] mx-auto w-full px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between z-20 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl lg:text-2xl font-black tracking-wider text-slate-950">NOVENTRA</span>
          <span className="text-[9px] uppercase font-bold tracking-widest bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded">Ecosystem</span>
        </Link>

        <div className="flex items-center gap-3">
          {!isLoaded ? (
            <div className="h-8 w-16 bg-slate-100 rounded-xl animate-pulse" />
          ) : !isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100/50">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="bg-slate-950 text-white font-bold hover:bg-slate-800 rounded-xl text-xs px-4">
                  Get Started
                </Button>
              </SignUpButton>
            </>
          ) : (
            <Link href="/feed">
              <Button size="sm" className="bg-slate-950 text-white font-bold hover:bg-slate-800 rounded-xl text-xs px-4">
                Feed Workspace
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Content Section */}
      <section className="max-w-[1440px] mx-auto w-full px-6 sm:px-10 lg:px-16 pt-8 pb-16 flex flex-col items-center text-center space-y-8 z-10">
        
        {/* Animated Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50/60 text-blue-600 border border-blue-100 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-sm shadow-blue-100/30 animate-pulse">
          <Zap className="w-3.5 h-3.5 fill-blue-100" /> Powered by AI Pitching & WebRTC Pitch Rooms
        </div>

        {/* Dynamic Big Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-tight sm:leading-none">
          The Premier <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">Startup Ecosystem</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl leading-relaxed">
          Noventra unites visionary founders, accredited VCs, and top talent. Pitch live in real-time WebRTC rooms, generate sub-second pitches using Groq AI, and DM without middle filters.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto pt-2">
          {!isLoaded ? (
            <div className="text-slate-400 text-xs font-bold">Initializing Noventra network...</div>
          ) : !isSignedIn ? (
            <>
              <SignUpButton mode="modal">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-md shadow-blue-600/10 hover:scale-[1.02] transition-transform">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </SignUpButton>
              <Link href="/explore" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 border-slate-200 text-slate-700 hover:bg-slate-50 font-extrabold rounded-2xl">
                  Explore Startups
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/feed" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-md hover:scale-[1.02] transition-transform">
                Go to Workspace Feed <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>

        {/* Interactive Mockup Frame */}
        <div className="w-full max-w-4xl pt-8 z-10">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden group">
            
            {/* Glossy top reflection panel */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-80" />
            
            {/* Header circles */}
            <div className="flex gap-1.5 border-b border-slate-800/80 pb-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            {/* Simulation Canvas */}
            <div className="aspect-video bg-slate-950/80 rounded-2xl border border-slate-800/40 relative overflow-hidden flex flex-col justify-between p-4 text-left">
              
              {/* Overlay Grid mesh inside Mockup */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_0.5px,transparent_0.5px),linear-gradient(to_bottom,#334155_0.5px,transparent_0.5px)] bg-[size:2rem_2rem] opacity-[0.03] pointer-events-none" />

              {/* Top Row: Pitch room title */}
              <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-bold text-slate-100">Live Pitching: MedQuick.AI Series A Room</span>
                </div>
                <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded font-black uppercase">08:24</span>
              </div>

              {/* Floating Element 1: Live WebRTC Video Room */}
              <div className="self-center flex gap-3 max-w-md w-full justify-center my-6 z-10">
                
                {/* Speaker 1 */}
                <div className="w-36 sm:w-44 aspect-video bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative shadow-lg">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=120&fit=crop" alt="Founder" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-white font-bold">Sarah (Founder)</span>
                </div>

                {/* Speaker 2 */}
                <div className="w-36 sm:w-44 aspect-video bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative shadow-lg">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=120&fit=crop" alt="VC" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-white font-bold">David (Sequoia Partner)</span>
                </div>

              </div>

              {/* Bottom Row: AI Suggestions & Connection Logs */}
              <div className="flex flex-col sm:flex-row gap-2.5 justify-between items-stretch sm:items-center z-10">
                
                {/* Floating Connection Badge */}
                <div className="bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-xl flex items-center gap-2.5 shadow max-w-xs">
                  <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-300 font-bold block">VC Deal-Flow Connection</span>
                    <span className="text-[8px] text-slate-500 block">David (Sequoia) matched with MedQuick.AI</span>
                  </div>
                </div>

                {/* Groq Live Pitch generator */}
                <div className="bg-blue-600 border border-blue-500 p-2.5 rounded-xl text-white shadow-lg flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-blue-400 text-white shrink-0" />
                  <div>
                    <span className="text-[9px] text-blue-100 font-bold block">Groq AI Live Copilot</span>
                    <span className="text-[8px] text-white font-semibold block">"Suggested: Focus pitch on Q2 ARR growth (120%)"</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </section>

      {/* Metrics & Social Proof Bar */}
      <section className="bg-white border-y border-slate-100 py-10 z-10 shrink-0">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "$25M+", label: "Capital Represented", desc: "Committed VC portfolios" },
            { val: "1,200+", label: "Verified Founders & Talent", desc: "Top tech talent & innovators" },
            { val: "100%", label: "Direct WebRTC Pitching", desc: "Zero links or external delays" },
            { val: "Sub-Second", label: "Groq AI Pitch Generation", desc: "Llama 3 powered copilots" }
          ].map((metric) => (
            <div key={metric.label} className="space-y-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 block">{metric.val}</span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-700 block">{metric.label}</span>
              <span className="text-[9px] text-slate-400 block">{metric.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Choose Your Path Section */}
      <section className="max-w-[1440px] mx-auto w-full px-6 sm:px-10 lg:px-16 py-20 space-y-12 z-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Choose Your Path</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">Select your role inside the Noventra ecosystem to access tailored features and dashboards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              role: "Founders",
              badge: "AI Pitch Deck",
              desc: "Deploy startup profiles, generate cold templates with Llama 3, track deal stages, and pitch in custom WebRTC streaming rooms.",
              action: "Register Startup Profile",
              icon: Building2,
              color: "hover:border-blue-500 hover:shadow-blue-500/5",
              features: ["Instant valuation generation", "Equity distribution mapping", "Direct pitch scheduler"]
            },
            {
              role: "Investors & VCs",
              badge: "Direct Deal-Flow",
              desc: "Access verified early-stage directories, review real-time KPI data, bookmark listings, and schedule direct stream calls.",
              action: "Request VC Access",
              icon: Briefcase,
              color: "hover:border-indigo-500 hover:shadow-indigo-500/5",
              features: ["Filter by target ticket", "Automatic alerts on followups", "Verified founders logs"]
            },
            {
              role: "Talent & Builders",
              badge: "1-Click Application",
              desc: "Discover equity-incentivized co-founder opportunities, freelance projects, and standard internship/job logs.",
              action: "Browse Startup Roles",
              icon: Users,
              color: "hover:border-blue-600 hover:shadow-blue-600/5",
              features: ["Direct messenger contact", "Resume matching indexer", "Equity transparency cards"]
            }
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.role}
                className={`bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-lg transition-all group duration-200 ${card.color}`}
              >
                <div className="space-y-4">
                  {/* Badge Header & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700">
                      <Icon className="w-5 h-5 text-slate-800" />
                    </div>
                    <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                      {card.badge}
                    </span>
                  </div>

                  {/* Body Text */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900">{card.role}</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{card.desc}</p>
                  </div>

                  {/* Bullet features */}
                  <div className="space-y-1.5 pt-2">
                    {card.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/explore">
                  <Button className="w-full bg-slate-900 text-white font-bold hover:bg-slate-800 rounded-xl text-xs py-2 shadow-sm transition-all flex items-center justify-center gap-1">
                    {card.action} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Feature Grid Section */}
      <section className="bg-white border-y border-slate-100 py-20 z-10">
        <div className="max-w-[1440px] mx-auto w-full px-6 sm:px-10 lg:px-16 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Platform Technology Stack</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">Explore the custom-built systems designed to optimize startup networking.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "WebRTC Video Pitch Rooms",
                desc: "Schedule and stream high-performance video pitches right in the app. Incorporates secure virtual waiting lobbies, real-time audio transcriptions, and instant screen-share capabilities.",
                icon: Video,
                accent: "Built-in waiting rooms & WebRTC streaming logs"
              },
              {
                title: "Groq AI Pitch Assistant",
                desc: "Formulate cold email templates, polish elevator pitches, and prepare presentation FAQs in sub-seconds. Powered by the Groq Llama 3 engine for maximum copywriting precision.",
                icon: Sparkles,
                accent: "Sub-second Llama 3 cold drafts generation"
              },
              {
                title: "Mutual-Follow Direct Messaging",
                desc: "Spam-free high-conviction networking. DM conversations are only unlocked when both participants mutually follow each other. Fully integrated with shared Kanban task boards.",
                icon: MessageSquare,
                accent: "Direct socket DM & shared files exchange"
              },
              {
                title: "Deal-Flow Directory Engine",
                desc: "Filter through verified startup assets, investment roles, and services in real-time. Refine directories by target pricing, tech stack, funding round, and location.",
                icon: Search,
                accent: "Advanced indexers & offline fallbacks"
              }
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="p-6 bg-slate-50 border border-slate-200/50 rounded-3xl flex gap-4 items-start shadow-sm shadow-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-sm text-slate-900">{feat.title}</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
                    <span className="inline-block text-[9px] bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded font-bold uppercase mt-1">
                      {feat.accent}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Final CTA Full-Width Block */}
      <section className="max-w-[1440px] mx-auto w-full px-6 sm:px-10 lg:px-16 py-20 z-10 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl space-y-6 relative overflow-hidden text-white">
          {/* Top reflection lines */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-80" />
          
          <div className="space-y-3 max-w-xl mx-auto z-10 relative">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Ready to launch your next venture?</h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              Connect directly with verified startup partners, execute pitch reviews, and close investment allocations inside the ecosystem.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 z-10 relative max-w-sm mx-auto">
            {!isLoaded ? (
              <div className="h-10 w-24 bg-slate-800 rounded-xl animate-pulse" />
            ) : !isSignedIn ? (
              <>
                <SignUpButton mode="modal">
                  <Button className="w-full bg-blue-600 text-white font-extrabold hover:bg-blue-700 rounded-2xl h-11 px-6 shadow shadow-blue-600/10">
                    Get Started Free
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300 font-extrabold rounded-2xl h-11 px-6">
                    Sign In to Portal
                  </Button>
                </SignInButton>
              </>
            ) : (
              <Link href="/feed" className="w-full">
                <Button className="w-full bg-blue-600 text-white font-extrabold hover:bg-blue-700 rounded-2xl h-11 px-6 shadow">
                  Go to Feed Workspace
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Modern Footer Links Block */}
      <footer className="bg-white border-t border-slate-100 z-10 shrink-0">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-black tracking-wider text-slate-900">NOVENTRA</span>
            </Link>
            <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed font-normal">
              Next-generation collaboration directory connecting verified founders, capital allocation resources, and builders.
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Product</span>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li><Link href="/explore" className="hover:text-slate-800 transition-colors">Startups Directory</Link></li>
              <li><Link href="/explore" className="hover:text-slate-800 transition-colors">Deal-Flow Feed</Link></li>
              <li><Link href="/marketplace" className="hover:text-slate-800 transition-colors">Platform Shop</Link></li>
            </ul>
          </div>

          {/* Roles links */}
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Roles</span>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li><Link href="/explore" className="hover:text-slate-800 transition-colors">For Founders</Link></li>
              <li><Link href="/explore" className="hover:text-slate-800 transition-colors">For VCs & Investors</Link></li>
              <li><Link href="/explore" className="hover:text-slate-800 transition-colors">For Creators & Talent</Link></li>
            </ul>
          </div>

          {/* Resources links */}
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Resources</span>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li><Link href="/messages" className="hover:text-slate-800 transition-colors">Direct Messaging</Link></li>
              <li><Link href="/communications" className="hover:text-slate-800 transition-colors">Video Pitch Rooms</Link></li>
              <li><Link href="/explore" className="hover:text-slate-800 transition-colors">Groq AI Helper</Link></li>
            </ul>
          </div>

        </div>

        {/* Copyright notice */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 border-t border-slate-50 py-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] font-semibold text-slate-400">
          <span>&copy; {new Date().getFullYear()} Noventra Labs LLC. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-700 transition-all">Privacy Policy</a>
            <a href="#" className="hover:text-slate-700 transition-all">Terms of Service</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
