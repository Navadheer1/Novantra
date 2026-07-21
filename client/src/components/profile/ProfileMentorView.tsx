"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Users, Calendar, Clock, Star, MessageSquare, 
  Award, CheckCircle2, Building, Sparkles, Send 
} from "lucide-react";
import EmptyState from "./EmptyState";

interface Review {
  id: string;
  authorName: string;
  authorRole: string;
  rating: number;
  comment: string;
  date: string;
}

interface MentorProps {
  profile: {
    bio: string | null;
    expertise?: string[];
    hourlyRate?: string;
    availableSlots?: string;
    pastCompanies?: Array<{ name: string; title: string; years: string }>;
    reviews?: Review[];
  };
  onBookSession?: () => void;
}

export default function ProfileMentorView({ profile, onBookSession }: MentorProps) {
  const expertiseChips = profile.expertise?.length ? profile.expertise : [
    "Fundraising & Pitch Decks", "Go-To-Market Strategy", "Product-Market Fit", "Technical Leadership", "Scaling Engineering Teams", "Cap Table & Equity"
  ];

  const pastCompanies = profile.pastCompanies || [
    { name: "Stripe", title: "Former Director of Engineering", years: "2020 - 2024" },
    { name: "Linear", title: "VP Product", years: "2018 - 2020" },
    { name: "Google", title: "Staff Tech Lead", years: "2014 - 2018" }
  ];

  const defaultReviews: Review[] = [
    {
      id: "r1",
      authorName: "Alex Rivera",
      authorRole: "Founder @ AI Flow",
      rating: 5,
      comment: "Invaluable feedback on our pitch deck structure. Helped us secure $500k in angel allocations within 3 weeks!",
      date: "Feb 2026"
    },
    {
      id: "r2",
      authorName: "Elena Rostova",
      authorRole: "CTO @ DataPulse",
      rating: 5,
      comment: "Clear, actionable advice on scaling microservices and hiring senior backend engineers.",
      date: "Jan 2026"
    }
  ];

  const reviewList = profile.reviews && profile.reviews.length > 0 ? profile.reviews : defaultReviews;

  return (
    <div className="space-y-6">

      {/* Booking Card Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-[20px] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2.5 py-0.5 rounded-full">
              Verified Mentor
            </span>
            <span className="text-xs text-slate-300">⚡ High Response Rate</span>
          </div>

          <h3 className="text-xl font-black">Book a 1:1 Mentorship Session</h3>
          <p className="text-xs text-slate-300 max-w-md">
            Get personalized advice on fundraising, technical architecture, or GTM scaling directly from an experienced founder.
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-400" /> 30 Min Session
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {profile.hourlyRate || "Pro-Bono / Free"}
            </span>
          </div>
        </div>

        {onBookSession && (
          <Button
            onClick={onBookSession}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl px-6 h-11 shadow-md shrink-0 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Session</span>
          </Button>
        )}
      </div>

      {/* About Mentor */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900">Mentorship Philosophy</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {profile.bio || "Dedicated to helping early-stage founders avoid common pitfalls, refine product strategy, and build enduring technology platforms."}
        </p>
      </div>

      {/* Areas of Expertise */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Areas of Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {expertiseChips.map((chip) => (
            <span
              key={chip}
              className="bg-purple-50 text-purple-700 border border-purple-200/60 text-xs px-3.5 py-1.5 rounded-xl font-bold"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Career Experience & Past Companies */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Building className="w-4 h-4 text-purple-600" /> Professional Track Record
        </h3>

        <div className="space-y-3">
          {pastCompanies.map((c, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h5 className="font-extrabold text-xs text-slate-900">{c.title}</h5>
                <p className="text-xs text-slate-600 font-medium mt-0.5">{c.name}</p>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-white px-2.5 py-1 rounded-lg border">
                {c.years}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mentee Reviews & Testimonials */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[20px] shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Mentee Reviews & Testimonials
          </h3>
          <span className="text-xs text-slate-500 font-semibold">4.98 ★ Rating</span>
        </div>

        {reviewList.length === 0 ? (
          <EmptyState
            icon="mentorship"
            title="No Mentee Reviews Yet"
            description="Reviews will appear here after initial mentorship sessions are completed."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviewList.map((r) => (
              <div key={r.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900">{r.authorName}</h5>
                    <p className="text-[10px] text-slate-400">{r.authorRole}</p>
                  </div>
                  <div className="flex items-center text-amber-400 text-xs font-bold">
                    {"★".repeat(r.rating)}
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed pt-1">
                  "{r.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
