"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, FileText, Bookmark, Send, Bot, User, 
  PenTool, Link2, GitFork, CheckSquare, BookOpen, Quote, 
  Plus, Check, Trash2, HelpCircle 
} from "lucide-react";
import { Video } from "./types";

interface AIWorkspaceProps {
  video: Video;
  onSeek: (seconds: number) => void;
  onSelectChannel?: (channelId: string) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function AIWorkspace({ video, onSeek, onSelectChannel }: AIWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "transcript" | "ask" | "notes" | "resources" | "mindmap">("summary");
  
  // Ask AI Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Notes & Tasks state
  const [personalNotes, setPersonalNotes] = useState<string>("");
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: "task-1", text: "Configure PgBouncer socket limit", completed: false },
    { id: "task-2", text: "Bench test Redis TTL configurations", completed: true },
    { id: "task-3", text: "Profile server action hydration boundaries", completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  // Sync/Reset notes and chat history when video changes
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hi! I'm Noventra's Video Copilot. I've analyzed "${video.title}". Ask me anything about this video (e.g. "What tech is used?", "Summarize the scaling plan", or "Explain the DB cache").`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    
    // Load local storage note or default template
    const savedNote = localStorage.getItem(`note-${video.id}`);
    setPersonalNotes(savedNote || `### Notes on: ${video.title}\n\n- Write down key thoughts here...\n- Click timeline tags to copy timestamps.`);
  }, [video]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Save notes handler (auto-saves to local storage!)
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setPersonalNotes(val);
    localStorage.setItem(`note-${video.id}`, val);
  };

  // Add custom Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks(prev => [
      ...prev,
      { id: `task-${Date.now()}`, text: newTaskText, completed: false }
    ]);
    setNewTaskText("");
  };

  // Toggle Task Completion
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Delete Task
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Ask AI response simulator
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: Message = {
      role: "user",
      content: inputVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      let response = "";
      const query = userMsg.content.toLowerCase();

      if (query.includes("tech") || query.includes("stack") || query.includes("framework")) {
        response = `The architecture uses **${video.technology || "React & Next.js"}** for core pipelines, integrated with PostgreSQL and Redis. The speaker highlights swapping out standard client sockets for server layouts to avoid rendering bottlenecks.`;
      } else if (query.includes("scale") || query.includes("caching") || query.includes("postgres")) {
        response = `To achieve daily scale targets, they deployed:\n1. **Redis clusters** in front of PostgreSQL.\n2. **PgBouncer** connection pooling to recycle sockets.\n3. Protocol buffers to decrease network size.`;
      } else if (query.includes("quote") || query.includes("speaker") || query.includes("say")) {
        response = `A critical quote by the founder at minute 5: *"Optimizing db socket pipelines is the single biggest unlock for edge compute frameworks."*`;
      } else {
        response = `Under "${video.title}", they configured connection caches to stabilize throughput during load spikes. Let me know if you would like me to draft a task for this!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[520px] lg:h-[600px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-3xl overflow-hidden shadow-sm">
      
      {/* Workspace Menu Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-950 p-1 overflow-x-auto scrollbar-none shrink-0">
        {[
          { id: "summary", label: "Summary", icon: Sparkles },
          { id: "transcript", label: "Transcript", icon: FileText },
          { id: "ask", label: "Ask AI", icon: Bot },
          { id: "notes", label: "Notes & Tasks", icon: PenTool },
          { id: "resources", label: "Resources", icon: Link2 },
          { id: "mindmap", label: "Mind Map", icon: GitFork }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-1 py-2 px-2.5 text-[10px] sm:text-xs font-bold rounded-xl transition whitespace-nowrap focus:outline-none ${
                active
                  ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace Content Display */}
      <div className="flex-1 overflow-y-auto p-4.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-350">
        
        {/* SUMMARY TAB */}
        {activeTab === "summary" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="space-y-1.5">
              <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">AI Summary</h4>
              <p className="leading-relaxed text-neutral-800 dark:text-neutral-200 font-semibold">
                {video.aiSummary}
              </p>
            </div>

            {video.keyTakeaways && (
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Key Takeaways</h4>
                <ul className="space-y-2 font-semibold">
                  {video.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start space-x-2 bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-xl border dark:border-neutral-850">
                      <span className="bg-neutral-900 dark:bg-neutral-800 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        {idx + 1}
                      </span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Important Quotes */}
            {video.quotes && video.quotes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Key Quotes</h4>
                <div className="space-y-2">
                  {video.quotes.map((q, idx) => (
                    <div 
                      key={idx}
                      onClick={() => onSeek(q.time)}
                      className="group cursor-pointer bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border dark:border-neutral-850 hover:border-neutral-300 dark:hover:border-neutral-750 transition flex space-x-2 items-start"
                    >
                      <Quote className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-white shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-[11px] text-neutral-750 dark:text-neutral-300 font-bold leading-normal">
                          "{q.quote}"
                        </p>
                        <span className="text-[9px] text-neutral-450 font-bold block">
                          – {q.speaker} at {Math.floor(q.time / 60)}:{q.time % 60 < 10 ? "0" : ""}{q.time % 60}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TRANSCRIPT TAB */}
        {activeTab === "transcript" && (
          <div className="space-y-3 animate-fadeIn">
            <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Scrubbable Transcript</h4>
            {video.transcript ? (
              <div className="space-y-3">
                {video.transcript.split(/(\[\d+:\d+\][^\[]+)/g).filter(Boolean).map((chunk, idx) => {
                  const match = chunk.match(/\[(\d+):(\d+)\]\s*(.*)/);
                  if (!match) return null;
                  const mins = parseInt(match[1]);
                  const secs = parseInt(match[2]);
                  const totalSeconds = mins * 60 + secs;
                  const text = match[3];

                  return (
                    <div
                      key={idx}
                      onClick={() => onSeek(totalSeconds)}
                      className="group flex items-start space-x-3 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-955 cursor-pointer border border-transparent hover:border-neutral-200/50 dark:hover:border-neutral-850 transition"
                    >
                      <button className="text-[10px] font-extrabold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-lg group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition shrink-0 mt-0.5">
                        {mins}:{secs < 10 ? "0" : ""}{secs}
                      </button>
                      <span className="flex-1 text-neutral-800 dark:text-neutral-300 leading-relaxed font-semibold">
                        {text}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-neutral-400 italic">No transcript available.</p>
            )}
          </div>
        )}

        {/* ASK AI TAB */}
        {activeTab === "ask" && (
          <div className="flex flex-col h-full space-y-4 animate-fadeIn pb-14 relative">
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[360px]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex space-x-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role !== "user" && (
                    <div className="bg-neutral-950 dark:bg-neutral-800 text-white rounded-full p-1.5 w-7 h-7 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] font-semibold leading-relaxed ${
                      msg.role === "user"
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
                        : "bg-neutral-50 dark:bg-neutral-950 text-neutral-850 dark:text-neutral-300 border dark:border-neutral-850"
                    }`}
                  >
                    <p className="whitespace-pre-line text-xs">{msg.content}</p>
                    <span className="block text-[8px] text-neutral-400 mt-1.5 text-right font-bold">{msg.timestamp}</span>
                  </div>
                  {msg.role === "user" && (
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full p-1.5 w-7 h-7 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-neutral-750 dark:text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex space-x-2 items-center text-neutral-400 font-bold">
                  <div className="bg-neutral-900 dark:bg-neutral-800 rounded-full p-1.5 w-7 h-7 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] animate-pulse">Copilot is drafting answers...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input form */}
            <form
              onSubmit={handleSendMessage}
              className="absolute bottom-0 left-0 right-0 border-t border-neutral-100 dark:border-neutral-850 pt-3 bg-white dark:bg-neutral-900 flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Ask about query latency, pools, caches..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 px-3 py-2.5 text-xs border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-955 focus:bg-white dark:focus:bg-neutral-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="bg-neutral-900 dark:bg-white hover:bg-neutral-850 dark:hover:bg-neutral-150 disabled:opacity-40 text-white dark:text-neutral-900 p-2.5 rounded-xl transition focus:outline-none"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* NOTES & TASKS TAB */}
        {activeTab === "notes" && (
          <div className="space-y-5 animate-fadeIn">
            {/* Notepad */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400 flex justify-between">
                <span>Personal Notepad</span>
                <span className="text-emerald-500 font-bold lowercase">Autosaved</span>
              </span>
              <textarea
                value={personalNotes}
                onChange={handleNotesChange}
                rows={6}
                className="w-full p-3 text-xs border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-955 rounded-2xl focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white font-mono leading-relaxed"
              />
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Task Checklist</span>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-xl border dark:border-neutral-850 text-xs font-semibold">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className="focus:outline-none"
                      >
                        {task.completed ? (
                          <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                        ) : (
                          <div className="w-4 h-4 rounded border border-neutral-300 dark:border-neutral-700" />
                        )}
                      </button>
                      <span className={task.completed ? "line-through text-neutral-400" : ""}>{task.text}</span>
                    </div>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-neutral-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Task form */}
              <form onSubmit={handleAddTask} className="flex items-center space-x-2 mt-1">
                <input
                  type="text"
                  placeholder="Create next design step..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-955 rounded-lg focus:outline-none"
                />
                <button type="submit" className="bg-neutral-905 dark:bg-white text-white dark:text-black p-1.5 rounded-lg">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === "resources" && (
          <div className="space-y-4.5 animate-fadeIn">
            {/* Connected Creator Hub */}
            {video.channel && (
              <div className="bg-neutral-55/60 dark:bg-neutral-950 p-3.5 rounded-2xl border dark:border-neutral-850 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={video.channel.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-black text-neutral-900 dark:text-white">Uploaded by: {video.channel.name}</h5>
                    <span className="text-[9.5px] text-neutral-450 font-bold block">Score: {video.channel.discoveryScore || 90} • Verified Hub</span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectChannel?.(video.channelId)}
                  className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3 py-1.5 rounded-xl text-[10px] font-bold focus:outline-none transition hover:opacity-90"
                >
                  Explore Hub
                </button>
              </div>
            )}
            {/* Repository Links */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Documentation & Source</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-bold text-xs">
                {video.githubRepo && (
                  <a
                    href={video.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-xl border dark:border-neutral-850 hover:border-neutral-350 transition text-neutral-750 dark:text-neutral-300"
                  >
                    <GitFork className="w-4 h-4 text-neutral-400" />
                    <span>View GitHub Repo</span>
                  </a>
                )}
                {video.documentationLink && (
                  <a
                    href={video.documentationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-xl border dark:border-neutral-850 hover:border-neutral-350 transition text-neutral-750 dark:text-neutral-300"
                  >
                    <Link2 className="w-4 h-4 text-neutral-400" />
                    <span>API Documentation</span>
                  </a>
                )}
              </div>
            </div>

            {/* Glossary */}
            {video.glossary && video.glossary.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Glossary Definitions</span>
                <div className="space-y-2">
                  {video.glossary.map((g, idx) => (
                    <div key={idx} className="bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-xl border dark:border-neutral-850 space-y-0.5">
                      <strong className="text-neutral-900 dark:text-white text-[11px]">{g.term}</strong>
                      <p className="text-[10.5px] text-neutral-450 font-semibold leading-normal">{g.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MIND MAP TAB */}
        {activeTab === "mindmap" && (
          <div className="space-y-4.5 animate-fadeIn">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Technical Mind Map</span>
            
            {/* Stylized Visual Flow Map */}
            <div className="bg-neutral-50 dark:bg-neutral-955 border dark:border-neutral-850 rounded-2xl p-4 flex flex-col items-center space-y-4">
              <div className="bg-neutral-900 dark:bg-neutral-800 text-white font-extrabold px-3.5 py-1.5 rounded-xl border border-neutral-750 text-[10px] shadow-xs text-center">
                Client (Next.js Hydration Layouts)
              </div>
              <div className="w-0.5 h-4 bg-neutral-300 dark:bg-neutral-700" />
              
              <div className="bg-neutral-800 dark:bg-neutral-700 text-white font-extrabold px-3.5 py-1.5 rounded-xl border border-neutral-650 text-[10px] shadow-xs text-center">
                Proxy Gateway / Load Balancer
              </div>
              <div className="w-0.5 h-4 bg-neutral-300 dark:bg-neutral-700" />

              <div className="flex items-center space-x-6">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-900 dark:bg-blue-950/40 text-blue-100 border border-blue-800 font-extrabold px-3 py-1 rounded-lg text-[9px]">
                    Redis (Read Cache)
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="bg-indigo-900 dark:bg-indigo-950/40 text-indigo-100 border border-indigo-850 font-extrabold px-3 py-1 rounded-lg text-[9px]">
                    PgBouncer (Pooler)
                  </div>
                  <div className="w-0.5 h-2 bg-neutral-300 dark:bg-neutral-700" />
                  <div className="bg-neutral-900 dark:bg-neutral-800 text-white border border-neutral-700 font-extrabold px-2.5 py-1 rounded-lg text-[8px]">
                    Postgres DB
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-neutral-450 leading-relaxed font-semibold text-center italic">
              Mind map displays standard caching boundaries and connection pool routing discussed in the video.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
