"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, Sparkles, Shield, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreJoinScreenProps {
  meetingCode: string;
  userName: string;
  onJoin: (micOn: boolean, camOn: boolean, blurOn: boolean) => void;
}

export default function PreJoinScreen({ meetingCode, userName, onJoin }: PreJoinScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [blurOn, setBlurOn] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    startMedia();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startMedia = async () => {
    try {
      setPermissionDenied(false);
      const ms = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      setStream(ms);
      setCamOn(true);
      setMicOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = ms;
      }
    } catch (e: any) {
      console.warn("PreJoin media permission denied or camera unavailable:", e);
      setPermissionDenied(true);
      setCamOn(false);
      setMicOn(false);
    }
  };

  const toggleCam = () => {
    if (stream) {
      stream.getVideoTracks().forEach((t) => (t.enabled = !camOn));
    }
    setCamOn(!camOn);
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    }
    setMicOn(!micOn);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 antialiased font-sans">
      
      <div className="max-w-2xl w-full bg-white border border-slate-200/80 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6 text-center">
        
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider border border-blue-100">
            <Video className="w-3.5 h-3.5 text-blue-600" /> Noventra Meet
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ready to Join?</h2>
          <p className="text-xs font-semibold text-slate-500">
            Meeting Room: <span className="font-mono text-slate-800 font-bold">{meetingCode}</span>
          </p>
        </div>

        {/* Media Permission Warning Banner */}
        {permissionDenied && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-3 text-left animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Camera/Microphone Permission Blocked</p>
              <p className="text-[11px] text-amber-700 font-medium">
                You can still join the meeting in listen/view-only mode with mic and camera disabled.
              </p>
            </div>
          </div>
        )}

        {/* Video Preview Box */}
        <div className="relative w-full aspect-video rounded-2xl bg-slate-50 overflow-hidden border border-slate-200/80 flex items-center justify-center shadow-xs">
          {camOn && stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${blurOn ? 'blur-md scale-105 transition-all' : ''}`}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 p-4">
              <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-black text-2xl text-blue-600 shadow-xs">
                {userName[0] || "U"}
              </div>
              <p className="text-xs font-bold text-slate-500">
                {permissionDenied ? "Camera Access Blocked" : "Camera is Turned Off"}
              </p>
            </div>
          )}

          {/* Quick Pre-Join Controls Floating Overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 shadow-md">
            <button
              type="button"
              onClick={toggleMic}
              disabled={permissionDenied}
              className={`p-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                micOn ? "bg-slate-100 hover:bg-slate-200 text-slate-800" : "bg-rose-600 text-white"
              } ${permissionDenied ? "opacity-50 cursor-not-allowed" : ""}`}
              title={micOn ? "Mute Mic" : "Unmute Mic"}
            >
              {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={toggleCam}
              disabled={permissionDenied}
              className={`p-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                camOn ? "bg-slate-100 hover:bg-slate-200 text-slate-800" : "bg-rose-600 text-white"
              } ${permissionDenied ? "opacity-50 cursor-not-allowed" : ""}`}
              title={camOn ? "Turn Camera Off" : "Turn Camera On"}
            >
              {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setBlurOn(!blurOn)}
              className={`p-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                blurOn ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
              }`}
              title="Toggle Background Blur"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Join Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Joining as <strong className="text-slate-900">{userName}</strong></span>
          </div>

          <Button
            type="button"
            onClick={() => onJoin(micOn, camOn, blurOn)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl px-8 h-11 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{permissionDenied ? "Join (Muted Mode)" : "Join Now"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

      </div>

    </div>
  );
}
