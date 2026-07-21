"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, X, CheckCircle2, Send } from "lucide-react";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName: string;
}

export default function ScheduleMeetingModal({ isOpen, onClose, targetName }: ScheduleModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [topic, setTopic] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 max-w-md w-full rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Schedule 1:1 Session</h3>
              <p className="text-xs text-slate-500">Book meeting with {targetName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-base text-slate-900">Meeting Requested!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              A calendar invite and notification has been dispatched to {targetName}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Select Date</label>
              <input
                type="date"
                required
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Select Slot</label>
              <select
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option>09:00 AM EST</option>
                <option>10:30 AM EST</option>
                <option>02:00 PM EST</option>
                <option>04:30 PM EST</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Meeting Agenda / Topic</label>
              <textarea
                rows={3}
                required
                placeholder="Briefly state what you'd like to discuss (e.g., Seed pitch deck review)..."
                className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs font-bold">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-5 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Send Request</span>
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
