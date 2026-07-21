"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, ShieldAlert, Loader2, User } from "lucide-react";
import { getApiUrl } from "@/lib/apiConfig";

interface Conversation {
  user: {
    id: string;
    name: string;
    role: string;
    avatarUrl: string | null;
  };
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
  } | null;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

export default function MessagesPage() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (clerkLoaded) {
      if (!clerkUser) {
        router.push("/");
      } else {
        fetchConversations();
      }
    }
  }, [clerkLoaded, clerkUser]);

  // Poll for messages in the active chat every 4 seconds
  useEffect(() => {
    if (!selectedUserId) return;
    
    fetchMessages(selectedUserId, false); // silent reload
    const interval = setInterval(() => {
      fetchMessages(selectedUserId, false);
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedUserId]);

  const getApiUrl = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

  const fetchConversations = async () => {
    try {
      setLoadingConv(true);
      const token = await getToken();
      if (!token) return;
      const apiUrl = getApiUrl();
      const endpoint = `${apiUrl}/api/messages/conversations`;
      console.log(`[Messages Request] GET ${endpoint} | Base API URL: ${apiUrl}`);
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error(err);
      setConversations([]);
    } finally {
      setLoadingConv(false);
    }
  };

  const fetchMessages = async (otherId: string, showSpinner = true) => {
    try {
      if (showSpinner) setLoadingMsg(true);
      const token = await getToken();
      if (!token) return;
      const apiUrl = getApiUrl();
      const endpoint = `${apiUrl}/api/messages/${otherId}`;
      console.log(`[Messages Request] GET ${endpoint} | Base API URL: ${apiUrl}`);
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        // scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (showSpinner) setLoadingMsg(false);
    }
  };

  const selectConversation = (conv: Conversation) => {
    setSelectedUserId(conv.user.id);
    setSelectedUser(conv.user);
    fetchMessages(conv.user.id, true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedUserId) return;

    try {
      setSending(true);
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${getApiUrl()}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: selectedUserId,
          content: inputText
        })
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages(prev => [...prev, newMessage]);
        setInputText("");
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        
        // Refresh conversations list to update lastMessage
        fetchConversations();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex overflow-hidden gap-6">
        
        {/* Left conversations list panel */}
        <div className="w-full md:w-80 bg-card border border-border rounded-xl flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-border bg-muted/10">
            <h2 className="font-black text-lg text-foreground">Direct Messages</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Mutual followers are listed here.</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {loadingConv ? (
              <div className="p-8 text-center flex justify-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground/50" />
                <p>No connections yet.</p>
                <p className="px-4 text-[10px]">Follow other founders/investors, and once they follow you back, they will appear here!</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = selectedUserId === conv.user.id;
                return (
                  <button
                    key={conv.user.id}
                    onClick={() => selectConversation(conv)}
                    className={`w-full text-left p-4 flex gap-3 hover:bg-muted/50 transition-all ${isSelected ? "bg-primary/5 border-l-4 border-primary" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0 border border-border">
                      {conv.user.avatarUrl ? (
                        <img src={conv.user.avatarUrl} alt={conv.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-primary bg-primary/10">
                          {conv.user.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-extrabold text-sm truncate text-foreground">{conv.user.name}</h4>
                      </div>
                      <span className="inline-block text-[9px] font-black uppercase tracking-wider text-primary bg-primary/5 px-1 rounded">
                        {conv.user.role}
                      </span>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {conv.lastMessage ? conv.lastMessage.content : "Start chatting..."}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right chat viewport */}
        <div className="hidden md:flex flex-1 bg-card border border-border rounded-xl flex-col overflow-hidden relative">
          {selectedUserId ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/10">
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0 border border-border">
                  {selectedUser?.avatarUrl ? (
                    <img src={selectedUser.avatarUrl} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-primary bg-primary/10">
                      {selectedUser?.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-foreground">{selectedUser?.name}</h3>
                  <span className="text-[9px] font-black uppercase text-primary bg-primary/5 px-1 rounded">
                    {selectedUser?.role}
                  </span>
                </div>
              </div>

              {/* Chat history */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/5">
                {loadingMsg ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-xs text-muted-foreground gap-2">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/50 animate-bounce" />
                    <p>No messages yet. Send a greeting to start!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId !== selectedUserId;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          isMe
                            ? "bg-primary text-white rounded-br-none"
                            : "bg-card border border-border text-foreground rounded-bl-none"
                        }`}>
                          <p className="leading-relaxed">{msg.content}</p>
                          <span className={`block text-[9px] mt-1 text-right ${isMe ? "text-white/80" : "text-muted-foreground"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Editor */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-card flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-2.5 border border-border rounded-lg bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={sending}
                />
                <Button type="submit" size="sm" className="font-bold flex items-center gap-1.5 px-4" disabled={sending || !inputText.trim()}>
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 text-muted-foreground/40 mb-3" />
              <h3 className="font-bold text-base text-foreground">Select a connection</h3>
              <p className="text-xs max-w-xs mt-1">Pick a conversation from the left sidebar to start messaging.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
