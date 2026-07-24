"use client";

import React, { useState } from "react";
import StudioLayout from "@/components/studio/StudioLayout";
import { Settings, Building, Globe, Shield, Save, Check } from "lucide-react";

export default function StudioSettingsPage() {
  const [channelName, setChannelName] = useState("Noventra Founder Studio");
  const [handle, setHandle] = useState("@noventra");
  const [startupName, setStartupName] = useState("Noventra Tech");
  const [bio, setBio] = useState("Building real-time workspace synchronization and AI tools for founders.");
  const [defaultVisibility, setDefaultVisibility] = useState("public");
  const [notifyInvestorRequests, setNotifyInvestorRequests] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <StudioLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Studio & Channel Settings</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configure your FounderTV channel branding, attached startup profile, and ecosystem notification defaults.
          </p>
        </div>

        {/* SETTINGS FORM */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6 max-w-3xl">
          <div className="space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Channel Branding & Profile Integration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Channel Name</label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Founder Handle</label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Attached Startup Profile</label>
              <input
                type="text"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Channel Bio & Mission</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-4 text-xs pt-2">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Default Publishing & Notifications
            </h3>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Default Video Visibility</label>
              <select
                value={defaultVisibility}
                onChange={(e) => setDefaultVisibility(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 outline-none"
              >
                <option value="public">🌍 Public Ecosystem</option>
                <option value="followers">👥 Followers Only</option>
                <option value="investors">💰 Investors Only</option>
              </select>
            </div>

            <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={notifyInvestorRequests}
                onChange={(e) => setNotifyInvestorRequests(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>Instantly notify me via email & inbox when an investor requests a pitch meeting</span>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {saved ? (
              <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Settings Saved!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>

      </div>
    </StudioLayout>
  );
}
