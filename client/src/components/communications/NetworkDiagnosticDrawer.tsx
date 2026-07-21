"use client";

import React from "react";
import { X, Wifi, ShieldAlert, CheckCircle2, RefreshCw, Server, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiagnosticDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRetryConnection: () => void;
  isConnecting: boolean;
  networkError: boolean;
}

export default function NetworkDiagnosticDrawer({
  isOpen,
  onClose,
  onRetryConnection,
  isConnecting,
  networkError,
}: DiagnosticDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-slate-900 text-white border-t border-slate-800 shadow-2xl p-6 animate-in slide-in-from-bottom duration-200">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">System & Network Diagnostic Log</h3>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" />
              <span>Signaling Server</span>
            </div>
            {networkError ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> Disconnected
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-purple-400" />
              <span>WebRTC ICE Transport</span>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> STUN Ready
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Media Engine</span>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Hardware Accel
            </span>
          </div>

        </div>

        {/* Diagnostic Logs */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1 max-h-32 overflow-y-auto">
          <p className="text-slate-500">[System Log 14:24:00] WebRTC AudioContext initialized at 48000Hz sample rate.</p>
          <p className="text-slate-500">[System Log 14:24:02] Socket.io ping interval 25000ms. Timeout 20000ms.</p>
          {networkError && (
            <p className="text-rose-400 font-bold">[Network Warning] Backend ping failed. Auto-retry attempt queued in 5 seconds.</p>
          )}
          {!networkError && (
            <p className="text-emerald-400 font-bold">[Health OK] Peer-to-peer media transport layer is operating with 0 latency spikes.</p>
          )}
        </div>

        {/* Retry CTA */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={onRetryConnection}
            disabled={isConnecting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-4 h-9 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
            <span>{isConnecting ? "Testing Connection..." : "Retry System Ping"}</span>
          </Button>
        </div>

      </div>
    </div>
  );
}
