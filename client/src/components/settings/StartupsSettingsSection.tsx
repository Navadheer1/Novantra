"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Building2, Plus, Users, Settings, Trash2, Archive, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/apiConfig";

export default function StartupsSettingsSection() {
  const { getToken } = useAuth();
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();
      if (!token) return;

      const res = await fetch(`${apiUrl}/api/startups/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStartups(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" /> Startups Management Center
          </h2>
          <p className="text-xs text-slate-500">Manage your startup profiles, roles, team permissions, and ownership.</p>
        </div>

        <Link href="/dashboard/founder/startup/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Create Startup
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        </div>
      ) : startups.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Startups Registered</h3>
          <Link href="/dashboard/founder/startup/new">
            <Button className="bg-blue-600 text-white font-bold text-xs">Register Startup</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {startups.map((s) => (
            <div key={s.id} className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-lg border border-slate-200">
                  {s.logo ? <img src={s.logo} alt={s.name} className="w-full h-full object-cover rounded-xl" /> : s.name[0]}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{s.name}</h4>
                  <p className="text-xs text-slate-500">{s.stage} Stage • {s.industry}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/dashboard/founder/startup/${s.id}`}>
                  <Button size="sm" className="bg-blue-600 text-white font-bold text-xs">
                    Manage Workspace
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
