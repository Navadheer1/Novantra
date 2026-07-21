"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Rocket, Briefcase, DollarSign, BarChart2, TrendingUp, Image as ImageIcon, Loader2 } from "lucide-react";
import { DBUser } from "@/lib/feedStore";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetType?: string;
  dbUser: DBUser | null;
  onSubmitPost: (content: string, postType: string, mediaUrl: string) => Promise<boolean>;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  presetType = "text",
  dbUser,
  onSubmitPost,
}: CreatePostModalProps) {
  const [postType, setPostType] = useState(presetType);
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (presetType) {
      if (presetType === "launch_startup") setPostType("startup_launch");
      else if (presetType === "share_update") setPostType("startup_update");
      else if (presetType === "hire_talent") setPostType("hiring");
      else if (presetType === "raise_funding") setPostType("funding");
      else setPostType("text");
    }
  }, [presetType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    const success = await onSubmitPost(content, postType, mediaUrl);
    setSubmitting(false);

    if (success) {
      setContent("");
      setMediaUrl("");
      onClose();
    }
  };

  const tabs = [
    { id: "startup_update", label: "Update", icon: TrendingUp },
    { id: "startup_launch", label: "Product Launch", icon: Rocket },
    { id: "hiring", label: "Hiring", icon: Briefcase },
    { id: "funding", label: "Funding", icon: DollarSign },
    { id: "poll", label: "Poll", icon: BarChart2 },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-slate-200 rounded-[20px] shadow-2xl max-w-lg w-full overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">Publish to Startup Ecosystem</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = postType === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPostType(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all border whitespace-nowrap ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Textarea */}
            <textarea
              rows={4}
              placeholder={
                postType === "startup_launch"
                  ? "Describe your product launch, key features, target audience, and link..."
                  : postType === "hiring"
                  ? "We are hiring! Specify role title, location, equity/salary range, and requirements..."
                  : postType === "funding"
                  ? "Share your funding target, current traction, valuation expectations, and pitch summary..."
                  : "Share an update with founders, investors, and builders..."
              }
              className="w-full p-3.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50/50 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoFocus
            />

            {/* Image/Media Attachment Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Media URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/... or screenshot link"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-600"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Publish Post
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
