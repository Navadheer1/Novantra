"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, Plus, CheckCircle2, UserCheck } from "lucide-react";

export interface OfficeHourSlot {
  id: string;
  hostName: string;
  hostFirm: string;
  hostAvatar?: string;
  topic: string;
  date: string;
  timeSlot: string;
  availableSlots: number;
  totalSlots: number;
}

interface OfficeHoursWidgetProps {
  onActionSuccess: (msg: string) => void;
}

export default function OfficeHoursWidget({ onActionSuccess }: OfficeHoursWidgetProps) {
  const [slots, setSlots] = useState<OfficeHourSlot[]>([
    {
      id: "slot-1",
      hostName: "Jari Vance",
      hostFirm: "Apex Ventures",
      topic: "1-on-1 Pitch Feedback & Pre-Seed Term Sheets",
      date: "Thursday, July 30",
      timeSlot: "3:00 PM - 5:00 PM EST",
      availableSlots: 2,
      totalSlots: 5
    },
    {
      id: "slot-2",
      hostName: "Sarah Chen",
      hostFirm: "Horizon Capital",
      topic: "AI SaaS Unit Economics & Pricing Model Review",
      date: "Friday, August 1",
      timeSlot: "11:00 AM - 1:00 PM PST",
      availableSlots: 4,
      totalSlots: 6
    }
  ]);

  const [bookedSlots, setBookedSlots] = useState<Record<string, boolean>>({});

  const handleBook = (slot: OfficeHourSlot) => {
    setBookedSlots(prev => ({ ...prev, [slot.id]: true }));
    onActionSuccess(`Office Hour slot booked with ${slot.hostName} for ${slot.date}!`);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
              Investor Mentorship & Office Hours
            </span>
          </div>
          <h2 className="text-xl font-black text-foreground">1-on-1 Founder Office Hours</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Book 20-minute pitch review sessions directly with verified VCs and Angel Leads.
          </p>
        </div>

        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shrink-0"
          onClick={() => onActionSuccess("Office Hours scheduling portal opened.")}
        >
          <Plus className="w-4 h-4 mr-1.5" /> Schedule Office Hours Slot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slots.map((slot) => (
          <div key={slot.id} className="bg-muted/30 border border-border/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                    {slot.hostName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-foreground">{slot.hostName}</h4>
                    <p className="text-[10px] text-muted-foreground font-semibold">{slot.hostFirm}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {slot.availableSlots} Slots Left
                </span>
              </div>

              <p className="text-xs font-bold text-foreground mb-2">{slot.topic}</p>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-semibold">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-primary" /> {slot.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary" /> {slot.timeSlot}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60">
              <Button
                size="sm"
                disabled={bookedSlots[slot.id]}
                className="w-full text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => handleBook(slot)}
              >
                <Video className="w-3.5 h-3.5 mr-1" />
                {bookedSlots[slot.id] ? "Slot Confirmed ✓" : "Book 1-on-1 Office Hour Slot"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
