"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Paperclip,
  Send,
  Bold,
  Italic,
  Underline,
  List,
  Code,
  Link as LinkIcon,
  Loader2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import RecipientPicker, { RecipientUser } from "./RecipientPicker";
import { getApiUrl } from "@/lib/apiConfig";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialRecipient?: string;
  initialSubject?: string;
  initialBody?: string;
}

export default function MailboxComposeModal({
  isOpen,
  onClose,
  initialRecipient = "",
  initialSubject = "",
  initialBody = ""
}: Props) {
  const { getToken } = useAuth();

  const [selectedRecipients, setSelectedRecipients] = useState<RecipientUser[]>([]);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);

  const [aiTone, setAiTone] = useState<"investor" | "hiring" | "friendly" | "professional">("investor");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (initialRecipient) {
      setSelectedRecipients([
        {
          id: `initial-${Date.now()}`,
          name: initialRecipient,
          email: initialRecipient.includes("@") ? initialRecipient : "recipient@noventra.io",
          avatarUrl: null,
          role: "RECIPIENT"
        }
      ]);
    }
    if (initialSubject) setSubject(initialSubject);
    if (initialBody) setBody(initialBody);
  }, [initialRecipient, initialSubject, initialBody]);

  if (!isOpen) return null;

  const handleAIGenerate = async () => {
    try {
      setIsAiLoading(true);
      setAiResult("");
      const token = await getToken();
      const apiUrl = getApiUrl();

      let promptType = "description";
      if (aiTone === "investor") promptType = "investor_outreach";
      if (aiTone === "hiring") promptType = "description";

      const res = await fetch(`${apiUrl}/api/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          promptType,
          data: {
            startupName: "Noventra",
            industry: "AI & SaaS",
            idea: aiPrompt || subject || "Reaching out regarding startup proposal",
            description: body || aiPrompt || "Building next-gen platform",
            vcFocus: "Seed VCs & Investors"
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiResult(data.result || "");
      } else {
        setAiResult("Failed to generate AI response. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setAiResult("Error connecting to AI Assistant.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyAiResult = () => {
    if (!aiResult) return;
    setBody((prev) => (prev ? `${prev}\n\n${aiResult}` : aiResult));
    setAiResult("");
  };

  const handleSend = async () => {
    if (selectedRecipients.length === 0) {
      alert("Please add at least one recipient.");
      return;
    }

    try {
      setIsSending(true);
      const token = await getToken();
      const apiUrl = getApiUrl();

      if (token) {
        // Send to each selected recipient ID
        for (const recipient of selectedRecipients) {
          await fetch(`${apiUrl}/api/messages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              receiverId: recipient.id,
              content: subject ? `Subject: ${subject}\n\n${body}` : body
            })
          });
        }
      }

      window.dispatchEvent(new Event("inbox-updated"));
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to send communication.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-extrabold text-base text-white">New Communication — Noventra Mail</h3>
            </div>
            <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Header with RecipientPicker Autocomplete */}
          <div className="px-6 py-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
            <div className="flex items-start gap-3">
              <span className="text-xs font-bold text-slate-400 w-16 pt-2.5">To:</span>
              <div className="flex-1 min-w-0">
                <RecipientPicker
                  selectedRecipients={selectedRecipients}
                  onChangeRecipients={setSelectedRecipients}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
              <span className="text-xs font-bold text-slate-400 w-16">Subject:</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter Subject (e.g. Investment Proposal / Job Application)..."
                className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="px-6 py-2 border-b border-slate-100 bg-slate-100/60 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-600"><Bold className="w-3.5 h-3.5" /></button>
              <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-600"><Italic className="w-3.5 h-3.5" /></button>
              <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-600"><Underline className="w-3.5 h-3.5" /></button>
              <span className="h-4 w-px bg-slate-300 mx-1" />
              <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-600"><List className="w-3.5 h-3.5" /></button>
              <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-600"><Code className="w-3.5 h-3.5" /></button>
              <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-600"><LinkIcon className="w-3.5 h-3.5" /></button>
            </div>

            {/* AI Assistant Quick Trigger */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">AI Copilot:</span>
              {(["investor", "hiring", "friendly", "professional"] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setAiTone(t)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-colors ${
                    aiTone === t ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Body Editor Area */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4 min-h-[200px]">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your communication message here..."
              className="w-full h-40 text-xs leading-relaxed text-slate-900 bg-transparent focus:outline-none resize-none font-sans"
            />

            {/* AI Prompt Drawer */}
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Writing Copilot ({aiTone} tone)
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAIGenerate}
                  disabled={isAiLoading}
                  className="h-7 text-[10px] font-bold bg-blue-600 text-white"
                >
                  {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Zap className="w-3 h-3 mr-1" />}
                  Generate Draft
                </Button>
              </div>

              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Give AI context (e.g. 'Propose 15% equity for $500k Seed investment')..."
                className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
              />

              {aiResult && (
                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs space-y-2">
                  <p className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">{aiResult}</p>
                  <Button type="button" size="sm" onClick={applyAiResult} className="h-6 text-[10px] font-bold bg-emerald-600 text-white">
                    Insert into Message Body
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button type="button" size="sm" variant="ghost" className="text-xs font-bold text-slate-600">
                <Paperclip className="w-3.5 h-3.5 mr-1" /> Attach Pitch Deck / PDF
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button type="button" size="sm" variant="ghost" onClick={onClose} className="text-xs font-bold text-slate-500">
                Discard
              </Button>

              <Button
                type="button"
                onClick={handleSend}
                disabled={isSending || selectedRecipients.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md flex items-center gap-1.5"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send ({selectedRecipients.length})
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
