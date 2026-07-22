"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getApiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase, DollarSign, Target, UserPlus, Send, ExternalLink, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function InvestorsPage() {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();
  const role = clerkUser?.publicMetadata?.role as string | undefined;

  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [interestFilter, setInterestFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  // Role Guard
  useEffect(() => {
    if (clerkLoaded) {
      if (!clerkUser) {
        router.push("/");
      } else if (role !== "founder" && role !== "investor") {
        // Only founders and investors can view the list of investors
        router.push("/feed");
      } else {
        fetchInvestors();
      }
    }
  }, [clerkLoaded, clerkUser, role]);

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/users/investors`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setInvestors(data);
      }
    } catch (err) {
      console.error("Error fetching investors:", err);
      setInvestors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (investorId: string) => {
    try {
      const token = await getToken();
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/users/${investorId}/follow`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.followed ? "Successfully followed!" : "Unfollowed.");
        fetchInvestors(); // reload to update state
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter Logic
  const filteredInvestors = investors.filter((inv) => {
    const matchesSearch = inv.name.toLowerCase().includes(search.toLowerCase()) ||
                          (inv.bio && inv.bio.toLowerCase().includes(search.toLowerCase()));
    const matchesStage = !stageFilter || (inv.ticketSize && inv.ticketSize.toLowerCase().includes(stageFilter.toLowerCase()));
    
    // Check if inv interests contains search keyword
    const matchesInterest = !interestFilter || (inv.investmentInterests && inv.investmentInterests.some((int: string) => 
      int.toLowerCase().includes(interestFilter.toLowerCase())
    ));
    
    const matchesLocation = !locationFilter || (inv.location && inv.location.toLowerCase().includes(locationFilter.toLowerCase()));

    return matchesSearch && matchesStage && matchesInterest && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-foreground">VCs & Angel Investors</h1>
          <p className="text-muted-foreground mt-1">Discover capital partners open to investment and build strategic partnerships.</p>
        </div>

        {/* Filter Controls Panel */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or bio..."
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Interests */}
            <input
              type="text"
              placeholder="Investment Interest (e.g. AI)"
              className="px-4 py-2.5 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
            />
            {/* Ticket Size / Stage */}
            <select
              className="px-4 py-2.5 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="">All Ticket Sizes</option>
              <option value="Pre-Seed">Pre-Seed / Angel</option>
              <option value="Seed">Seed Stage</option>
              <option value="Series">Series A / B</option>
            </select>
            {/* Location */}
            <input
              type="text"
              placeholder="Location (e.g. Remote)"
              className="px-4 py-2.5 border border-border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Investors Directory grid */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground font-semibold">Loading active investors directory...</p>
          </div>
        ) : filteredInvestors.length === 0 ? (
          <div className="bg-card border border-border p-16 rounded-xl text-center shadow-sm">
            <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-1">No Active Investors</h3>
            <p className="text-muted-foreground max-w-sm mx-auto text-sm">There are no investors currently open to invest matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvestors.map((investor) => (
              <div key={investor.id} className="bg-card border border-border rounded-xl shadow-sm flex flex-col hover:border-primary/50 transition-all overflow-hidden">
                <div className="p-6 flex-1 space-y-4">
                  {/* Header info */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-muted overflow-hidden flex-shrink-0 border border-border">
                      {investor.avatarUrl ? (
                        <img src={investor.avatarUrl} alt={investor.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-lg text-primary bg-primary/10">
                          {investor.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base leading-tight text-foreground">{investor.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> {investor.location || "Undisclosed Location"}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm line-clamp-3 text-muted-foreground leading-relaxed">
                    {investor.bio || "No investment thesis written yet."}
                  </p>

                  {/* Investor Details grid */}
                  <div className="border-t border-border/60 pt-4 space-y-2 text-xs font-semibold text-muted-foreground">
                    {investor.ticketSize && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">Ticket Size: {investor.ticketSize}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span>Portfolio Size: {investor.portfolioCount || 0} startups</span>
                    </div>
                    {investor.investmentInterests?.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Briefcase className="w-4 h-4 text-amber-600 mt-0.5" />
                        <span className="text-amber-700 leading-tight">Focus: {investor.investmentInterests.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-border bg-muted/20 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/profile/${investor.id}`} className="w-full col-span-1">
                      <Button variant="outline" size="sm" className="w-full font-bold text-xs flex items-center justify-center gap-1">
                        View Profile <ExternalLink className="w-3 h-3" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full font-bold text-xs flex items-center justify-center gap-1" onClick={() => handleFollow(investor.id)}>
                      <UserPlus className="w-3.5 h-3.5 text-primary" /> Connect / Follow
                    </Button>
                    {role === "founder" && (
                      <Button className="col-span-2 font-bold text-xs flex items-center justify-center gap-1" size="sm" onClick={() => handleFollow(investor.id)}>
                        <Send className="w-3.5 h-3.5" /> Send Pitch Deck
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
