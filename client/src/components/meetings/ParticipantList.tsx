"use client";

import { Button } from "@/components/ui/button";
import { Check, X, Shield, User } from "lucide-react";

interface Participant {
  socketId: string;
  userId: string;
  name: string;
  role: string;
  isHost: boolean;
}

interface ParticipantListProps {
  isHost: boolean;
  admittedUsers: Participant[];
  waitingUsers: Participant[];
  onAdmit: (socketId: string) => void;
  onReject: (socketId: string) => void;
  onClose: () => void;
}

export default function ParticipantList({
  isHost,
  admittedUsers,
  waitingUsers,
  onAdmit,
  onReject,
  onClose
}: ParticipantListProps) {
  return (
    <div className="w-80 h-full bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h3 className="font-bold text-white text-lg">
          Meeting Info ({admittedUsers.length}/6)
        </h3>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-900 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Waiting Room Section (Host Only) */}
      {isHost && waitingUsers.length > 0 && (
        <div className="p-4 border-b border-zinc-800 bg-blue-950/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Waiting Room ({waitingUsers.length})
            </span>
          </div>
          <div className="space-y-3">
            {waitingUsers.map((user) => (
              <div
                key={user.socketId}
                className="flex flex-col gap-2 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white truncate max-w-[150px]">
                    {user.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    onClick={() => onReject(user.socketId)}
                    size="sm"
                    className="h-8 bg-zinc-800 hover:bg-red-900/40 text-red-500 hover:text-red-400 border border-zinc-700/50 rounded-lg flex items-center gap-1 py-1 px-2.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    Deny
                  </Button>
                  <Button
                    onClick={() => onAdmit(user.socketId)}
                    size="sm"
                    className="h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 py-1 px-2.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Admit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Participants List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-3">
            Participants ({admittedUsers.length})
          </span>
          <div className="space-y-2">
            {admittedUsers.map((user) => (
              <div
                key={user.socketId}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/50 transition-all border border-transparent hover:border-zinc-900"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white truncate max-w-[140px]">
                      {user.name}
                    </span>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </div>
                {user.isHost ? (
                  <div className="flex items-center gap-1 text-blue-400 bg-blue-600/10 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-blue-500/10">
                    <Shield className="w-3 h-3" />
                    Host
                  </div>
                ) : (
                  <div className="text-zinc-500 bg-zinc-800/20 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-zinc-700/10">
                    <User className="w-3 h-3 inline mr-0.5" />
                    Guest
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
