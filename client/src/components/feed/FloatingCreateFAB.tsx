"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Rocket, Send, DollarSign, Briefcase, Calendar, BarChart2 } from "lucide-react";

interface FloatingCreateFABProps {
  onSelectAction: (actionId: string) => void;
}

export default function FloatingCreateFAB({ onSelectAction }: FloatingCreateFABProps) {
  const [open, setOpen] = useState(false);

  const options = [
    { id: "launch_startup", label: "Launch Startup", icon: Rocket, color: "text-blue-600 bg-blue-50" },
    { id: "share_update", label: "Share Update", icon: Send, color: "text-emerald-600 bg-emerald-50" },
    { id: "raise_funding", label: "Raise Funding", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { id: "hire_talent", label: "Hire Talent", icon: Briefcase, color: "text-purple-600 bg-purple-50" },
    { id: "create_event", label: "Create Event", icon: Calendar, color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="mb-3 space-y-2 flex flex-col items-end"
          >
            {options.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setOpen(false);
                    onSelectAction(opt.id);
                  }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border border-slate-200/90 shadow-lg hover:border-blue-400 hover:shadow-xl text-xs font-extrabold text-slate-800 transition-all group"
                >
                  <span>{opt.label}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${opt.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-blue-500/30 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Plus className={`w-6 h-6 transition-transform duration-200 ${open ? "rotate-45" : ""}`} />
      </button>
    </div>
  );
}
