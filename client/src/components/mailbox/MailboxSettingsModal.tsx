"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Settings,
  Sun,
  Moon,
  Bell,
  Tag,
  FileText,
  ShieldAlert,
  Keyboard,
  Mail,
  Zap,
  Globe,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab =
  | "general"
  | "appearance"
  | "notifications"
  | "labels"
  | "templates"
  | "shortcuts"
  | "signature"
  | "autoreply";

export default function MailboxSettingsModal({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [signature, setSignature] = useState("Best regards,\nFounder & CTO @ Noventra");
  const [vacationMode, setVacationMode] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const tabs: { id: SettingsTab; label: string; icon: any }[] = [
    { id: "general", label: "General", icon: Settings },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "labels", label: "Labels & Tags", icon: Tag },
    { id: "templates", label: "Templates", icon: FileText },
    { id: "signature", label: "Signature", icon: Mail },
    { id: "shortcuts", label: "Keyboard Shortcuts", icon: Keyboard },
    { id: "autoreply", label: "Auto Reply / Vacation", icon: Zap },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-base text-slate-900">Communication Hub Settings</h3>
            </div>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden min-h-[400px]">
            {/* Left Nav Tabs */}
            <div className="w-56 border-r border-slate-100 p-3 bg-slate-50/50 space-y-1">
              {tabs.map((tb) => {
                const TbIcon = tb.icon;
                const isSel = activeTab === tb.id;
                return (
                  <button
                    key={tb.id}
                    onClick={() => setActiveTab(tb.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                      isSel ? "bg-blue-600 text-white shadow-2xs" : "text-slate-600 hover:bg-slate-200/60"
                    }`}
                  >
                    <TbIcon className="w-4 h-4" />
                    {tb.label}
                  </button>
                );
              })}
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5">
              {activeTab === "general" && (
                <div className="space-y-4 text-xs">
                  <h4 className="font-extrabold text-slate-900 text-sm">General Preferences</h4>
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 block">Default Reply Behavior</label>
                    <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none">
                      <option>Reply (Direct Sender Only)</option>
                      <option>Reply All</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === "signature" && (
                <div className="space-y-4 text-xs">
                  <h4 className="font-extrabold text-slate-900 text-sm">Custom Mail Signature</h4>
                  <textarea
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none"
                  />
                </div>
              )}

              {activeTab === "shortcuts" && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-extrabold text-slate-900 text-sm">Gmail-Style Keyboard Shortcuts</h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 bg-slate-50 border rounded-xl flex justify-between">
                      <span className="font-bold">Compose Mail</span> <kbd className="bg-white px-2 py-0.5 rounded border font-mono">C</kbd>
                    </div>
                    <div className="p-2.5 bg-slate-50 border rounded-xl flex justify-between">
                      <span className="font-bold">Reply</span> <kbd className="bg-white px-2 py-0.5 rounded border font-mono">R</kbd>
                    </div>
                    <div className="p-2.5 bg-slate-50 border rounded-xl flex justify-between">
                      <span className="font-bold">Archive Item</span> <kbd className="bg-white px-2 py-0.5 rounded border font-mono">E</kbd>
                    </div>
                    <div className="p-2.5 bg-slate-50 border rounded-xl flex justify-between">
                      <span className="font-bold">Delete Mail</span> <kbd className="bg-white px-2 py-0.5 rounded border font-mono">#</kbd>
                    </div>
                    <div className="p-2.5 bg-slate-50 border rounded-xl flex justify-between">
                      <span className="font-bold">Global Search</span> <kbd className="bg-white px-2 py-0.5 rounded border font-mono">/</kbd>
                    </div>
                    <div className="p-2.5 bg-slate-50 border rounded-xl flex justify-between">
                      <span className="font-bold">Next / Prev</span> <kbd className="bg-white px-2 py-0.5 rounded border font-mono">J / K</kbd>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "autoreply" && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <p className="font-bold text-slate-900">Vacation Auto Responder</p>
                      <p className="text-slate-500 text-[11px]">Automatically reply to incoming pitch decks & investor inquiries.</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setVacationMode(!vacationMode)}
                      className={vacationMode ? "bg-emerald-600 text-white font-bold" : "bg-slate-300 text-slate-800 font-bold"}
                    >
                      {vacationMode ? "Active" : "Disabled"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <Button size="sm" variant="ghost" onClick={onClose} className="font-bold text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-blue-600 text-white font-bold text-xs px-5">
              {saved ? <Check className="w-4 h-4 mr-1 text-white" /> : null}
              {saved ? "Saved!" : "Save Settings"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
