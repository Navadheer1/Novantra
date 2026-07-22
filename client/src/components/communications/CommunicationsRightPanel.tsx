"use client";

import React, { useState } from "react";
import { Copy, Check, FileText, CheckSquare, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RightPanelProps {
  selectedMeeting?: any;
  onCopyLink: (code: string) => void;
}

export default function CommunicationsRightPanel({ selectedMeeting, onCopyLink }: RightPanelProps) {
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");
  const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [newTask, setNewTask] = useState("");

  const handleCopy = () => {
    if (!selectedMeeting?.meetingCode) return;
    onCopyLink(selectedMeeting.meetingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([...notes, newNote.trim()]);
    setNewNote("");
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: `t-${Date.now()}`, text: newTask.trim(), done: false }]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-5">
      
      {/* Selected Meeting Details */}
      {selectedMeeting ? (
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              Selected Room
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500">
              {selectedMeeting.meetingCode}
            </span>
          </div>

          <h4 className="font-extrabold text-sm text-slate-900">{selectedMeeting.title || "Noventra Room"}</h4>

          <Button
            type="button"
            size="sm"
            onClick={handleCopy}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl h-8 flex items-center justify-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Copied!" : "Copy Meeting Link"}</span>
          </Button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
          <UserPlus className="w-6 h-6 text-blue-600 mx-auto" />
          <h4 className="font-extrabold text-xs text-slate-800">Invite teammates to start collaborating</h4>
          <p className="text-[11px] text-slate-500">Start or join a meeting to collaborate live with your team.</p>
        </div>
      )}

      {/* Realtime Notes */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-blue-600" /> Realtime Meeting Notes
        </h4>

        <form onSubmit={handleAddNote} className="flex gap-1.5">
          <input
            type="text"
            placeholder="Add a meeting note..."
            className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button type="submit" size="sm" className="bg-blue-600 text-white font-bold text-xs rounded-xl h-8 px-2.5 shrink-0">
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </form>

        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {notes.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center italic border border-dashed border-slate-200 rounded-xl">
              No meeting notes yet
            </p>
          ) : (
            notes.map((n, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
                {n}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Items */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> Action Items ({tasks.filter(t => t.done).length}/{tasks.length})
        </h4>

        <form onSubmit={handleAddTask} className="flex gap-1.5">
          <input
            type="text"
            placeholder="Create your first action item"
            className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button type="submit" size="sm" className="bg-emerald-600 text-white font-bold text-xs rounded-xl h-8 px-2.5 shrink-0">
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </form>

        <div className="space-y-1 max-h-40 overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center italic border border-dashed border-slate-200 rounded-xl">
              Create your first action item
            </p>
          ) : (
            tasks.map((t) => (
              <label key={t.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTask(t.id)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span className={t.done ? "line-through text-slate-400" : ""}>{t.text}</span>
              </label>
            ))
          )}
        </div>
      </div>

    </aside>
  );
}
