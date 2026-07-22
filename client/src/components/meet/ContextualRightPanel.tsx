"use client";

import React, { useState } from "react";
import { 
  MessageSquare, FileText, CheckSquare, Layers, Code2, 
  ShieldCheck, Copy, Check, Plus, Send, FileCode, Terminal, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/hooks/useNoventraMeet";

export type WorkspaceMode = "VIDEO" | "PITCH" | "CANVAS" | "CODE" | "DILIGENCE" | "NOTES";

interface ContextualRightPanelProps {
  mode: WorkspaceMode;
  meetingCode: string;
  chatMessages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
}

export default function ContextualRightPanel({
  mode,
  meetingCode,
  chatMessages,
  onSendMessage,
  onClose,
}: ContextualRightPanelProps) {
  const [inputText, setInputText] = useState("");
  const [copied, setCopied] = useState(false);

  // Pitch Notes & Cap Table State
  const [investorNotes, setInvestorNotes] = useState<string[]>([
    "ARR growth targets: 3.2x YoY projected",
    "Cap Table: Founder 65%, Seed VCs 20%, ESOP 15%"
  ]);
  const [newNote, setNewNote] = useState("");

  // Code Explorer State
  const [activeFile, setActiveFile] = useState("main.py");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[info] Server running on port 5000",
    "[info] WebRTC Signaling Socket initialized",
    "[debug] ICE connection state: connected"
  ]);

  // Due Diligence Checklist State
  const [checklist, setChecklist] = useState([
    { id: "1", label: "Certificate of Incorporation", verified: true },
    { id: "2", label: "Series A Term Sheet Draft", verified: true },
    { id: "3", label: "IP Assignment Agreements", verified: false },
    { id: "4", label: "Audited Financial Statements 2025", verified: false },
  ]);

  // General Action Items State
  const [actionItems, setActionItems] = useState([
    { id: "a1", text: "Send updated pitch deck to Lead VC", done: false },
    { id: "a2", text: "Schedule technical co-founder interview", done: true },
  ]);
  const [newItem, setNewItem] = useState("");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/meet/${meetingCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setInvestorNotes([...investorNotes, newNote.trim()]);
    setNewNote("");
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setActionItems([...actionItems, { id: `item-${Date.now()}`, text: newItem.trim(), done: false }]);
    setNewItem("");
  };

  return (
    <aside className="w-full sm:w-80 lg:w-96 shrink-0 bg-white border-l border-slate-200/80 text-slate-900 flex flex-col h-full z-30 shadow-xs">
      
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          {mode === "VIDEO" && <MessageSquare className="w-4 h-4 text-blue-600" />}
          {mode === "PITCH" && <DollarSign className="w-4 h-4 text-emerald-600" />}
          {mode === "CANVAS" && <Layers className="w-4 h-4 text-purple-600" />}
          {mode === "CODE" && <Code2 className="w-4 h-4 text-sky-600" />}
          {mode === "DILIGENCE" && <ShieldCheck className="w-4 h-4 text-amber-600" />}
          {mode === "NOTES" && <FileText className="w-4 h-4 text-indigo-600" />}

          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            {mode === "VIDEO" && "Meeting Chat"}
            {mode === "PITCH" && "Investor Notes & Cap Table"}
            {mode === "CANVAS" && "Canvas Layer List"}
            {mode === "CODE" && "File Explorer & Console"}
            {mode === "DILIGENCE" && "Due Diligence Checklist"}
            {mode === "NOTES" && "Shared Action Items"}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Mode Specific Panel Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* 1. VIDEO MODE -> CHAT PANEL */}
        {mode === "VIDEO" && (
          <div className="flex flex-col h-full justify-between space-y-4">
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">No messages yet</p>
                  <p className="text-[11px] text-slate-400">Invite teammates to start collaborating</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-blue-600">{msg.senderName}</span>
                      <span className="text-slate-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed break-words">{msg.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center shrink-0 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* 2. PITCH MODE -> INVESTOR NOTES & CAP TABLE */}
        {mode === "PITCH" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Round Target
                </span>
                <span className="text-xs font-mono font-extrabold text-slate-900">$2,500,000</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">Series Seed • Pre-Money Valuation $12.5M</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center justify-between">
                <span>Investor Meeting Notes</span>
                <span className="text-[10px] text-slate-400">{investorNotes.length} notes</span>
              </h4>

              <form onSubmit={handleAddNote} className="flex gap-1.5">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record investor feedback..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-xs cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="space-y-2">
                {investorNotes.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center italic">No meeting notes yet</p>
                ) : (
                  investorNotes.map((note, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-medium">
                      {note}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. CANVAS MODE -> LAYER LIST */}
        {mode === "CANVAS" && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400">Canvas Layers</h4>
            <div className="space-y-1.5">
              {[
                { name: "Product Vision Flowchart", type: "Diagram" },
                { name: "System Architecture Nodes", type: "Graph" },
                { name: "Sticky Notes Group", type: "Annotations" },
              ].map((layer, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{layer.name}</span>
                  <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    {layer.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CODE MODE -> FILE EXPLORER & TERMINAL LOGS */}
        {mode === "CODE" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-sky-600" /> Files
              </h4>
              <div className="space-y-1">
                {["main.py", "webrtc_service.ts", "config.json"].map((file) => (
                  <button
                    key={file}
                    onClick={() => setActiveFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer ${
                      activeFile === file ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{file}</span>
                    {activeFile === file && <span className="text-[9px] uppercase bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-600" /> Console Logs
              </h4>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-200 space-y-1 max-h-48 overflow-y-auto">
                {terminalLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. DUE DILIGENCE MODE -> CHECKLIST */}
        {mode === "DILIGENCE" && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Verification Checklist
            </h4>
            <div className="space-y-2">
              {checklist.map((item) => (
                <label key={item.id} className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={item.verified}
                    onChange={() =>
                      setChecklist(checklist.map((c) => (c.id === item.id ? { ...c, verified: !c.verified } : c)))
                    }
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span className={item.verified ? "line-through text-slate-400 font-normal" : "text-slate-800 font-semibold"}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 6. NOTES MODE -> ACTION ITEMS */}
        {mode === "NOTES" && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-600" /> Action Items
            </h4>

            <form onSubmit={handleAddItem} className="flex gap-1.5">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Create your first action item"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-xl text-xs cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="space-y-2">
              {actionItems.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center italic">Create your first action item</p>
              ) : (
                actionItems.map((item) => (
                  <label key={item.id} className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() =>
                        setActionItems(actionItems.map((a) => (a.id === item.id ? { ...a, done: !a.done } : a)))
                      }
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className={item.done ? "line-through text-slate-400 font-normal" : "text-slate-800 font-semibold"}>
                      {item.text}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* Footer Share Action */}
      <div className="p-4 border-t border-slate-200/80 bg-slate-50/70">
        <Button
          type="button"
          onClick={handleCopyLink}
          variant="outline"
          className="w-full bg-white hover:bg-slate-100 border-slate-200 text-slate-800 font-bold text-xs rounded-xl h-9 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Meeting Link Copied!" : "Copy Room Link"}</span>
        </Button>
      </div>

    </aside>
  );
}
