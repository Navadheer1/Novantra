"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Loader2, Copy, Check, Send, Bot, Zap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/apiConfig";

export type AIActionType = 
  | "pitch" 
  | "hiring" 
  | "update" 
  | "investor_email" 
  | "product_launch" 
  | "linkedin";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialAction?: AIActionType;
  startupName?: string;
  industry?: string;
}

const ACTION_CONFIGS: Record<AIActionType, { title: string; subtitle: string; icon: any; promptType: string }> = {
  pitch: {
    title: "Improve Startup Pitch",
    subtitle: "Refine your elevator pitch into a compelling, investor-ready narrative.",
    icon: Zap,
    promptType: "pitch_summary"
  },
  hiring: {
    title: "Generate Hiring Post",
    subtitle: "Create high-converting job post text for software engineers & key roles.",
    icon: FileText,
    promptType: "description"
  },
  update: {
    title: "Generate Startup Update",
    subtitle: "Draft a monthly investor & team progress update highlighting traction.",
    icon: Sparkles,
    promptType: "description"
  },
  investor_email: {
    title: "Generate Investor Cold Email",
    subtitle: "Personalized 3-paragraph cold outreach for VC partners.",
    icon: Send,
    promptType: "investor_outreach"
  },
  product_launch: {
    title: "Generate Product Launch Post",
    subtitle: "Punchy launch announcement for Product Hunt, Twitter & Hacker News.",
    icon: Bot,
    promptType: "description"
  },
  linkedin: {
    title: "Generate LinkedIn Thought Leadership",
    subtitle: "Founder reflections on building, scaling, and market trends.",
    icon: Sparkles,
    promptType: "profile_improvement"
  }
};

export default function NoventraAICopilotModal({
  isOpen,
  onClose,
  initialAction = "pitch",
  startupName = "Noventra",
  industry = "AI & Developer Infrastructure"
}: Props) {
  const { getToken } = useAuth();
  const [activeAction, setActiveAction] = useState<AIActionType>(initialAction);
  const [customInput, setCustomInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentConfig = ACTION_CONFIGS[activeAction];
  const Icon = currentConfig.icon;

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setResult("");
      const token = await getToken();
      const apiUrl = getApiUrl();

      const payload = {
        promptType: currentConfig.promptType,
        data: {
          startupName,
          industry,
          idea: customInput || `Building next-gen ${industry} platform`,
          description: customInput || `Scaling ${startupName} in the ${industry} market.`,
          vcFocus: "Seed & Series A SaaS/AI VCs"
        }
      };

      const res = await fetch(`${apiUrl}/api/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.result || "Generation finished successfully.");
      } else {
        setResult("Failed to communicate with AI Copilot service. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setResult("Error contacting Noventra AI backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  Noventra AI Copilot
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    Groq Llama-3
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Autonomous Founder Assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Selector Bar */}
          <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-200/60 overflow-x-auto flex gap-2 no-scrollbar">
            {(Object.keys(ACTION_CONFIGS) as AIActionType[]).map((actionKey) => {
              const cfg = ACTION_CONFIGS[actionKey];
              const ActIcon = cfg.icon;
              const isSelected = activeAction === actionKey;
              return (
                <button
                  key={actionKey}
                  onClick={() => {
                    setActiveAction(actionKey);
                    setResult("");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80"
                  }`}
                >
                  <ActIcon className="w-3.5 h-3.5" />
                  {cfg.title.replace("Generate ", "").replace("Improve ", "")}
                </button>
              );
            })}
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Icon className="w-4 h-4 text-blue-600" />
                {currentConfig.title}
              </h4>
              <p className="text-xs text-slate-500">{currentConfig.subtitle}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Context / Specific Instructions (Optional)
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={`Provide key highlights, traction metrics, or specifics for ${startupName}...`}
                className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate Response
                  </>
                )}
              </Button>
            </div>

            {/* AI Generated Output Display */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 space-y-3 relative shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Generated Result
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-md transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Text
                      </>
                    )}
                  </button>
                </div>
                <div className="text-xs leading-relaxed whitespace-pre-wrap font-mono text-slate-200 max-h-60 overflow-y-auto">
                  {result}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
