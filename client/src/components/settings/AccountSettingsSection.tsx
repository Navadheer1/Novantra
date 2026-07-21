"use client";

import { useState } from "react";
import { Shield, Moon, Sun, Globe, Eye, Lock, Mail, Bell, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountSettingsSection() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [language, setLanguage] = useState("English (US)");
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" /> Account & System Settings
        </h2>
        <p className="text-xs text-slate-500">Manage your appearance, security, language, and system preferences.</p>
      </div>

      {/* Appearance */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <Sun className="w-4 h-4 text-blue-600" /> Appearance & Interface Theme
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "light", label: "Clean White (Default)", icon: Sun },
            { id: "dark", label: "Dark Mode", icon: Moon },
            { id: "system", label: "System Auto", icon: Globe },
          ].map((t) => {
            const TIcon = t.icon;
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`p-4 rounded-xl border font-bold text-xs flex flex-col items-center gap-2 transition-all ${
                  isSelected
                    ? "bg-white border-blue-600 text-blue-600 shadow-2xs ring-2 ring-blue-600/20"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <TIcon className="w-5 h-5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Security & 2FA */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600" /> Security & Authentication
        </h3>
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 text-xs">
          <div>
            <p className="font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
            <p className="text-[11px] text-slate-500">Add extra security with TOTP authenticator apps.</p>
          </div>
          <Button
            size="sm"
            onClick={() => setTwoFactor(!twoFactor)}
            className={twoFactor ? "bg-emerald-600 text-white font-bold" : "bg-blue-600 text-white font-bold"}
          >
            {twoFactor ? "Enabled" : "Enable 2FA"}
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 bg-red-50/50 rounded-2xl border border-red-200/80 space-y-3">
        <h3 className="font-extrabold text-red-900 text-sm flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-red-600" /> Delete Founder Account
        </h3>
        <p className="text-xs text-red-700">Permanently remove your profile, startups, and data. This action is irreversible.</p>
        <Button size="sm" variant="destructive" className="font-bold text-xs">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
