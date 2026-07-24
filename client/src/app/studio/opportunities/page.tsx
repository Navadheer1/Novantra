"use client";

import React, { useState } from "react";
import StudioLayout from "@/components/studio/StudioLayout";
import {
  Briefcase,
  Users,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Calendar,
  ExternalLink,
  Building,
  Check,
  Clock,
  Filter,
} from "lucide-react";

export default function StudioOpportunitiesPage() {
  const [activeTab, setActiveTab] = useState("all");

  const [requests, setRequests] = useState([
    {
      id: "req-1",
      sender: "Sarah Chen",
      role: "Partner at Sequoia Capital",
      type: "investor",
      interest: "$500K - $1.5M Seed Round",
      videoRef: "Noventra Healthcare AI & Real-time Sync Demo",
      message: "Hey! Loved your product demo on sub-10ms state synchronization. We're actively deploying in healthcare AI. Would love to schedule a 30-min intro call.",
      timestamp: "2 hours ago",
      status: "pending",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    },
    {
      id: "req-2",
      sender: "Michael Vance",
      role: "Managing Director, Accel",
      type: "investor",
      interest: "Series A Pre-Emptive",
      videoRef: "Real-Time Edge Infrastructure Architecture",
      message: "Impressed by the live benchmarks in your FounderTV video. Let's get on a call with our dev tools partner.",
      timestamp: "5 hours ago",
      status: "pending",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    },
    {
      id: "req-3",
      sender: "Rohan Gupta",
      role: "VP Engineering, Stripe",
      type: "hiring",
      interest: "Co-Founder / Advisor",
      videoRef: "Noventra Healthcare AI & Real-time Sync Demo",
      message: "Great walkthrough! Interested in advising or partnering on distributed system infrastructure.",
      timestamp: "1 day ago",
      status: "accepted",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    {
      id: "req-4",
      sender: "Elena Rostova",
      role: "Partner, Y Combinator",
      type: "investor",
      interest: "Batch W27 Interview Invite",
      videoRef: "Noventra Healthcare AI & Real-time Sync Demo",
      message: "Your product demo video caught our team's attention. Would love to invite your team for an interview.",
      timestamp: "2 days ago",
      status: "pending",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
    },
  ]);

  const handleAction = (id: string, newStatus: "accepted" | "rejected") => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  const filteredRequests = requests.filter((r) => {
    if (activeTab === "all") return true;
    return r.type === activeTab;
  });

  return (
    <StudioLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Opportunity Inbox</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Inbound investor meeting requests, co-founder inquiries, and partnership leads triggered by your FounderTV videos.
          </p>
        </div>

        {/* TAB FILTERS */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
          {[
            { id: "all", label: "All Requests" },
            { id: "investor", label: "Investor Requests" },
            { id: "hiring", label: "Hiring & Advisors" },
            { id: "collaboration", label: "Partnerships" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OPPORTUNITY CARDS LIST */}
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 transition hover:border-blue-300"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                <div className="flex items-center gap-3">
                  <img src={req.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900">{req.sender}</h3>
                      <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">
                        {req.interest}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{req.role} • {req.timestamp}</p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    req.status === "accepted"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : req.status === "rejected"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {req.status === "accepted" ? "Meeting Scheduled" : req.status === "rejected" ? "Declined" : "Pending Review"}
                </span>
              </div>

              {/* VIDEO REFERENCE & MESSAGE BODY */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                  <span>Watched Video:</span>
                  <span className="text-blue-600 font-extrabold">{req.videoRef}</span>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed">{req.message}</p>
              </div>

              {/* ACTIONS */}
              {req.status === "pending" ? (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    onClick={() => alert(`Redirecting to investor profile for ${req.sender}`)}
                    className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1"
                  >
                    View Investor Profile <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(req.id, "rejected")}
                      className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => {
                        handleAction(req.id, "accepted");
                        alert(`Accepted request from ${req.sender}! Meeting scheduler link sent.`);
                      }}
                      className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                    >
                      <Calendar className="w-4 h-4" /> Accept & Schedule Meeting
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 font-medium">
                  {req.status === "accepted" ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Meeting confirmed. Check calendar invite in messages.
                    </span>
                  ) : (
                    <span className="text-slate-400">Request declined.</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </StudioLayout>
  );
}
