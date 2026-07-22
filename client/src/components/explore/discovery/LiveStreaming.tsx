"use client";

import React, { useState, useEffect } from "react";
import { Radio, Users, Bell, BellOff, Send, MessageSquare, Flame } from "lucide-react";
import { LiveStream } from "./types";
import { mockLiveStreams } from "./mockDiscoveryData";

interface LiveStreamingProps {
  onSelectChannel: (channelId: string) => void;
}

// Helper countdown component
const CountdownTimer = ({ startsAt }: { startsAt: string }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(startsAt) - +new Date();
      if (difference <= 0) {
        setTimeLeft("Starting Now");
        return;
      }

      const hours = Math.floor(difference / (1005 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startsAt]);

  return <span className="font-mono text-neutral-900 dark:text-white font-bold">{timeLeft}</span>;
};

export default function LiveStreaming({ onSelectChannel }: LiveStreamingProps) {
  const [streams, setStreams] = useState<LiveStream[]>(mockLiveStreams);
  const [selectedLive, setSelectedLive] = useState<LiveStream | null>(mockLiveStreams.find(s => s.liveBadge) || null);
  const [chatMessages, setChatMessages] = useState<{ user: string; text: string }[]>([
    { user: "Sarah C.", text: "Welcome developers! Ask Next.js questions here." },
    { user: "Alex_Dev", text: "Is there caching support for edge actions?" },
    { user: "InvestPro", text: "Excited to see the deck roast tomorrow!" }
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleToggleNotify = (id: string) => {
    setStreams((prev) =>
      prev.map((s) => (s.id === id ? { ...s, notificationSubscribed: !s.notificationSubscribed } : s))
    );
    if (selectedLive && selectedLive.id === id) {
      setSelectedLive((prev) => prev ? { ...prev, notificationSubscribed: !prev.notificationSubscribed } : null);
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setChatMessages((prev) => [...prev, { user: "You", text: inputVal }]);
    setInputVal("");

    // Simulate auto user replies inside live chat
    setTimeout(() => {
      const bots = ["DevopsGuy", "FounderCore", "Alice_V", "StripeEngineer"];
      const messages = [
        "Yes, pgBouncer is highly recommended.",
        "We are launching on Product Hunt tonight!",
        "Stripe APIs are so intuitive.",
        "Does Vercel support dynamic caching keys?"
      ];
      const randomBot = bots[Math.floor(Math.random() * bots.length)];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setChatMessages((prev) => [...prev, { user: randomBot, text: randomMsg }]);
    }, 1500);
  };

  return (
    <div className="space-y-8 w-full pb-10">
      
      {/* Live Stream Main Player & Chat Area */}
      {selectedLive && selectedLive.liveBadge ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Columns: Live Video Stream Frame */}
          <div className="lg:col-span-2 space-y-5">
            <div className="aspect-video w-full rounded-3xl bg-neutral-950 relative overflow-hidden flex items-center justify-center border border-neutral-850 shadow-lg">
              {/* Simulated stream video loop */}
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-75"
              />

              {/* Live Badge Overlay */}
              <div className="absolute top-4 left-4 bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-md">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>LIVE</span>
              </div>

              {/* Viewers Counter Overlay */}
              <div className="absolute top-4 right-4 bg-black/60 text-white font-semibold text-xs px-3 py-1 rounded-full flex items-center space-x-1.5 backdrop-blur-xs">
                <Users className="w-3.5 h-3.5 text-neutral-300" />
                <span>{selectedLive.viewerCount?.toLocaleString()} watching</span>
              </div>
            </div>

            {/* Live Stream Details */}
            <div className="space-y-4">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-909 dark:text-white leading-tight">
                {selectedLive.title}
              </h1>

              <div
                onClick={() => onSelectChannel(selectedLive.channel.id)}
                className="flex items-center space-x-3 cursor-pointer border-b border-neutral-100 dark:border-neutral-850 pb-4 w-max group"
              >
                <img src={selectedLive.channel.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover border" />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition">
                    {selectedLive.channel.name}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-neutral-450 font-bold">
                    {selectedLive.channel.subscribersCount.toLocaleString()} subscribers
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-350 leading-relaxed font-semibold">
                {selectedLive.description}
              </p>
            </div>
          </div>

          {/* Right Column: Live Chat Placeholder */}
          <div className="lg:col-span-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between h-[450px]">
            <div className="bg-neutral-50 dark:bg-neutral-950 p-4 border-b border-neutral-200 dark:border-neutral-850 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-neutral-400" />
                <span>Live Chat</span>
              </h3>
            </div>

            {/* Chat List area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="text-xs leading-relaxed">
                  <span className={`font-bold mr-1.5 ${
                    msg.user === "You" ? "text-neutral-900 dark:text-white" : "text-neutral-450"
                  }`}>
                    {msg.user}:
                  </span>
                  <span className="text-neutral-750 dark:text-neutral-300 font-semibold">{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Send chat form */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-850 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Say something nice..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white transition"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="bg-neutral-900 dark:bg-white text-white dark:text-black p-2 rounded-xl disabled:opacity-40 transition focus:outline-none"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {/* Upcoming Streams Scheduler List */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-400 font-bold">Upcoming Live Events</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.filter(s => !s.liveBadge).map((stream) => (
            <div
              key={stream.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-3xl shadow-xs flex flex-col justify-between h-64 hover:border-neutral-350 dark:hover:border-neutral-700 transition"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-neutral-100 dark:bg-neutral-850 text-neutral-650 dark:text-neutral-450 px-2.5 py-0.5 rounded-full font-bold">
                    Scheduled Stream
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs text-neutral-500 font-bold">
                    <CountdownTimer startsAt={stream.startsAt || ""} />
                  </div>
                </div>
                
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-2 leading-tight">
                  {stream.title}
                </h3>
                <p className="text-xs text-neutral-450 line-clamp-2 font-medium">
                  {stream.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-850 pt-4 mt-2">
                <div className="flex items-center space-x-2">
                  <img src={stream.channel.avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-[10px] text-neutral-500 font-bold">{stream.channel.name}</span>
                </div>

                <button
                  onClick={() => handleToggleNotify(stream.id)}
                  className={`p-2 rounded-xl border transition focus:outline-none ${
                    stream.notificationSubscribed
                      ? "bg-neutral-900 border-neutral-900 dark:bg-white dark:border-white text-white dark:text-black"
                      : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-50"
                  }`}
                  title="Notify Me"
                >
                  {stream.notificationSubscribed ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
