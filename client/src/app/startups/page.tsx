"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Building2, Search, SlidersHorizontal, MapPin, DollarSign, Target, Briefcase, Plus, Send, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/apiConfig";

export default function StartupsPage() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const role = clerkUser?.publicMetadata?.role as string | undefined;

  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [hiringFilter, setHiringFilter] = useState(false);
  const [fundingFilter, setFundingFilter] = useState(false);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const endpoint = `${apiUrl}/api/startups`;
      console.log(`[Startups Request] GET ${endpoint} | Base API URL: ${apiUrl}`);
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setStartups(data);
      } else {
        console.warn(`Failed to fetch startups. Status: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error("Error fetching startups:", err);
      setStartups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (startupId: string, receiverFounderId: string, type: string) => {
    if (!clerkUser) {
      alert("Please sign in to submit applications.");
      return;
    }

    try {
      const token = await getToken();
      
      let mappedType = type;
      if (type === "INTERN") mappedType = "INTERNSHIP";
      if (type === "CO_FOUNDER") mappedType = "COFOUNDER";

      const apiUrl = getApiUrl();
      const endpoint = `${apiUrl}/api/startups/${startupId}/requests`;
      console.log(`[Startups Request] POST ${endpoint} | Base API URL: ${apiUrl}`);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: mappedType,
          message: `Interested in connection request for ${type.toLowerCase().replace("_", " ")}.`
        })
      });

      if (res.ok) {
        alert(`Request for ${type.replace("_", " ")} submitted successfully!`);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    }
  };

  // Filtering Logic
  const filteredStartups = startups.filter((startup) => {
    const matchesSearch = startup.name.toLowerCase().includes(search.toLowerCase()) ||
                          startup.description.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = !industryFilter || startup.industry.toLowerCase().includes(industryFilter.toLowerCase());
    const matchesStage = !stageFilter || startup.stage === stageFilter;
    const matchesHiring = !hiringFilter || (startup.requiredRoles && startup.requiredRoles.length > 0);
    const matchesFunding = !fundingFilter || (startup.fundingNeeded && Number(startup.fundingNeeded) > 0);

    return matchesSearch && matchesIndustry && matchesStage && matchesHiring && matchesFunding;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Discover Startups</h1>
            <p className="text-muted-foreground mt-1">Pitch to visionary startups or apply to join their founding team.</p>
          </div>
          {role === "founder" && (
            <Link href="/dashboard/founder/startup/new">
              <Button className="font-bold flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Register Startup
              </Button>
            </Link>
          )}
        </div>

        {/* Filter Controls Panel */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search startups by name or details..."
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Industry search */}
            <input
              type="text"
              placeholder="Filter by Industry (e.g. AI)"
              className="px-4 py-2.5 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary w-full md:w-60"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            />
            {/* Stage filter */}
            <select
              className="px-4 py-2.5 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary w-full md:w-48"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="">All Stages</option>
              <option value="Idea">Idea / Concept</option>
              <option value="Pre-Seed">Pre-Seed</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
            </select>
          </div>

          {/* Toggle Switches */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-sm font-semibold text-muted-foreground">
            <label className="flex items-center gap-2 cursor-pointer hover:text-foreground">
              <input
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                checked={hiringFilter}
                onChange={(e) => setHiringFilter(e.target.checked)}
              />
              <span>Actively Hiring Team</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-foreground">
              <input
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                checked={fundingFilter}
                onChange={(e) => setFundingFilter(e.target.checked)}
              />
              <span>Open for Investment</span>
            </label>
          </div>
        </div>

        {/* Startups List Feed */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
            <Building2 className="w-10 h-10 text-primary animate-pulse" />
            <p className="text-muted-foreground font-semibold">Loading ecosystem directory...</p>
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="bg-card border border-border p-16 rounded-xl text-center shadow-sm">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold mb-1">No Startups Found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto text-sm">Adjust your filters or query to find startups matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <div key={startup.id} className="bg-card border border-border rounded-xl shadow-sm flex flex-col hover:border-primary/50 transition-all overflow-hidden">
                <Link href={`/startups/${startup.id}`} className="p-6 flex-1 space-y-4 hover:bg-muted/5 transition-all block">
                  {/* Card Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center overflow-hidden border border-border/50">
                      {startup.logo ? (
                        <img src={startup.logo} alt={startup.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-7 h-7" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg leading-tight text-foreground">{startup.name}</h3>
                      <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded">
                        {startup.industry}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm line-clamp-3 text-muted-foreground leading-relaxed">{startup.description}</p>

                  {/* Core Details grid */}
                  <div className="border-t border-border/60 pt-4 grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-semibold text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span>{startup.stage} Stage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{startup.location}</span>
                    </div>
                    {startup.fundingNeeded && (
                      <div className="flex items-center gap-2 col-span-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">Seeking ${Number(startup.fundingNeeded).toLocaleString()}</span>
                      </div>
                    )}
                    {startup.requiredRoles?.length > 0 && (
                      <div className="flex items-start gap-2 col-span-2">
                        <Briefcase className="w-4 h-4 text-amber-600 mt-0.5" />
                        <span className="text-amber-700 leading-tight">Hiring: {startup.requiredRoles.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Footer Action buttons */}
                <div className="p-4 border-t border-border bg-muted/20 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs text-muted-foreground px-1 pb-2">
                    <span>Founder: <strong className="text-foreground">{startup.founder?.name || "Unknown"}</strong></span>
                    {startup.founder?.id && (
                      <Link 
                        href={`/profile/${startup.founder.id}`} 
                        className="text-primary font-bold flex items-center gap-0.5 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Profile <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {role === "user" && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="font-bold text-xs" 
                        onClick={(e) => { e.stopPropagation(); handleRequest(startup.id, startup.founderId, "JOB"); }}
                      >
                        Apply Job
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="font-bold text-xs" 
                        onClick={(e) => { e.stopPropagation(); handleRequest(startup.id, startup.founderId, "INTERN"); }}
                      >
                        Internship
                      </Button>
                      <Button 
                        className="col-span-2 font-bold text-xs" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); handleRequest(startup.id, startup.founderId, "CO_FOUNDER"); }}
                      >
                        Request Co-Founder Role
                      </Button>
                    </div>
                  )}

                  {role === "vc" && (
                    <Button 
                      className="w-full font-bold flex items-center justify-center gap-1.5" 
                      size="sm" 
                      onClick={(e) => { e.stopPropagation(); handleRequest(startup.id, startup.founderId, "INVESTMENT"); }}
                    >
                      <Send className="w-4 h-4" /> Send Pitch / Invest Request
                    </Button>
                  )}

                  {(role === "founder" || !role) && (
                    <Button variant="secondary" className="w-full font-bold text-xs" disabled>
                      View Only
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
