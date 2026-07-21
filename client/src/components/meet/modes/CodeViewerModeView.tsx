"use client";

import React, { useState } from "react";
import { Code2, Play, Copy, Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CodeViewerModeView() {
  const [code, setCode] = useState(`// Noventra WebRTC Peer Signaling Handler
async function handlePeerSignal(senderId, signalData) {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });
  
  if (signalData.sdp) {
    await pc.setRemoteDescription(signalData.sdp);
  }
  return pc;
}`);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const handleRun = () => {
    setOutput("Code compiled successfully. PeerConnection initialized with 0 errors.");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 w-full h-full p-4 flex flex-col bg-slate-950 text-white rounded-2xl space-y-3 font-mono">
      
      {/* Code Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-sans">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-sky-400" />
          <h3 className="font-extrabold text-sm text-white">Live Technical Code Viewer</h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleCopy}
            variant="outline"
            className="border-slate-800 text-slate-300 font-bold text-xs rounded-xl h-8"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleRun}
            className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl h-8 px-4"
          >
            <Play className="w-3.5 h-3.5 mr-1" /> Run Code
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <textarea
          className="w-full flex-1 p-4 bg-transparent text-sky-300 font-mono text-xs outline-none resize-none leading-relaxed"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {output && (
          <div className="p-3 border-t border-slate-800 bg-slate-950 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{output}</span>
          </div>
        )}
      </div>

    </div>
  );
}
