"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { Home, Building2, Briefcase, Inbox, MessageSquare, LayoutDashboard, User, Settings, Menu, X, LogOut, ChevronDown, UserCheck, ShieldAlert, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/apiConfig";
import SearchOmnibox from "./SearchOmnibox";

import NavbarMeetButton from "./meet/NavbarMeetButton";

interface DBUser {
  id: string;
  role: string;
  name: string;
  avatarUrl: string | null;
}

// Module-level in-memory cache for zero-shift cross-page state retention
let globalCachedUser: DBUser | null = null;
let globalCachedInboxCount = 0;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { getToken, isLoaded: authLoaded, userId: clerkUserId } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut } = useClerk();
  
  const [dbUser, setDbUser] = useState<DBUser | null>(() => {
    if (globalCachedUser) return globalCachedUser;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("noventra_user_cache");
        if (stored) {
          const parsed = JSON.parse(stored);
          globalCachedUser = parsed;
          return parsed;
        }
      } catch (e) {}
    }
    return null;
  });

  const [inboxCount, setInboxCount] = useState<number>(() => {
    if (globalCachedInboxCount > 0) return globalCachedInboxCount;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("noventra_inbox_count");
        if (stored) {
          const parsed = parseInt(stored, 10);
          if (!isNaN(parsed)) {
            globalCachedInboxCount = parsed;
            return parsed;
          }
        }
      } catch (e) {}
    }
    return 0;
  });
  
  // UI states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isAuthenticated = !!clerkUserId;

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user role and db details
  useEffect(() => {
    if (clerkLoaded && clerkUser) {
      fetchDBUser();
    } else if (clerkLoaded && !clerkUser) {
      globalCachedUser = null;
      globalCachedInboxCount = 0;
      setDbUser(null);
      setInboxCount(0);
      try {
        localStorage.removeItem("noventra_user_cache");
        localStorage.removeItem("noventra_inbox_count");
      } catch (e) {}
    }
  }, [clerkLoaded, clerkUser]);

  // Listen for inbox count update events
  useEffect(() => {
    const handleUpdate = () => {
      if (clerkLoaded && clerkUser) {
        fetchDBUser();
      }
    };
    window.addEventListener("inbox-updated", handleUpdate);
    return () => window.removeEventListener("inbox-updated", handleUpdate);
  }, [clerkLoaded, clerkUser]);

  const fetchDBUser = async () => {
    // 1. Verify Clerk user ID is available before making request
    if (!clerkUser || !clerkUser.id) {
      console.warn("[Navbar] Clerk user or user ID is not available. Skipping DB user fetch.");
      return;
    }

    // 2. Resolve API URL with fallback
    const apiUrl = getApiUrl();

    try {
      // 3. Obtain authentication token
      const token = await getToken();

      // 4. Fetch DB user details
      const userEndpoint = `${apiUrl}/api/users/clerk/${clerkUser.id}`;
      console.log(`[Navbar Request] GET ${userEndpoint} | Base API URL: ${apiUrl}`);
      const res = await fetch(userEndpoint);

      if (!res.ok) {
        console.warn(`[Navbar] Backend returned non-OK status: ${res.status} ${res.statusText} for endpoint: ${userEndpoint}`);
        return;
      }

      const data = await res.json();
      globalCachedUser = data;
      setDbUser(data);
      try {
        localStorage.setItem("noventra_user_cache", JSON.stringify(data));
      } catch (e) {}

      // 5. Fetch inbox requests count if token is present
      if (!token) {
        console.warn("[Navbar] Auth token unavailable, skipping inbox count fetch.");
        return;
      }

      const reqPath = data.role === "FOUNDER" ? "/api/requests/incoming" : "/api/requests/sent";
      const reqEndpoint = `${apiUrl}${reqPath}`;
      console.log(`[Navbar Request] GET ${reqEndpoint} | Base API URL: ${apiUrl}`);
      const reqRes = await fetch(reqEndpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (reqRes.ok) {
        const reqs = await reqRes.json();
        if (Array.isArray(reqs)) {
          const pending = data.role === "FOUNDER"
            ? reqs.filter((r: any) => r.status === "PENDING").length
            : reqs.length;
          globalCachedInboxCount = pending;
          setInboxCount(pending);
          try {
            localStorage.setItem("noventra_inbox_count", pending.toString());
          } catch (e) {}
        }
      } else {
        console.warn(`[Navbar] Failed to fetch requests. Status: ${reqRes.status} ${reqRes.statusText}`);
      }
    } catch (err) {
      // 6. Graceful error handling for network / backend unreachable errors
      console.error("[Navbar] Failed to reach backend server or fetch user details:", err);
    }
  };

  const handleLogout = async () => {
    try {
      globalCachedUser = null;
      globalCachedInboxCount = 0;
      localStorage.clear();
      await signOut();
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { name: "Home Feed", href: "/feed", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Startups", href: "/startups", icon: Building2 },
    ...(dbUser?.role === "FOUNDER" || dbUser?.role === "INVESTOR" 
      ? [{ name: "Investors", href: "/investors", icon: Briefcase }] 
      : []),
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Inbox", href: "/inbox", icon: Inbox, badge: inboxCount },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl font-black tracking-wider text-primary">NOVENTRA</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-primary/10 text-primary px-1.5 py-0.5 rounded">ECOSYSTEM</span>
            </Link>

            {/* Omnibox Search Bar */}
            <div className="hidden md:block w-72 shrink-0 ml-2">
              <SearchOmnibox />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            {isAuthenticated && navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold shrink-0 transition-colors duration-150 ${
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="shrink-0">{link.name}</span>
                  {link.badge !== undefined && link.badge > 0 ? (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-black text-white ring-2 ring-card animate-pulse shrink-0">
                      {link.badge}
                    </span>
                  ) : null}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Controls / User Menu Dropdown */}
          <div className="hidden md:flex items-center gap-4 shrink-0 justify-end min-w-[120px]">
            {clerkLoaded && (
              <>
                {isAuthenticated ? (
                  <>
                    <NavbarMeetButton />
                    <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-muted overflow-hidden border border-border shrink-0">
                        {dbUser?.avatarUrl ? (
                          <img src={dbUser.avatarUrl} alt={dbUser.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-sm text-primary bg-primary/10">
                            {clerkUser?.fullName?.[0] || dbUser?.name?.[0] || "U"}
                          </div>
                        )}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Floating Dropdown Card */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border/80 bg-card shadow-lg ring-1 ring-black/5 py-2 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                        <div className="px-4 py-2 border-b border-border/80">
                          <p className="text-sm font-black text-foreground truncate">{clerkUser?.fullName || dbUser?.name}</p>
                          <p className="text-[10px] uppercase font-black text-primary mt-0.5 tracking-wider">
                            {dbUser?.role || "USER"}
                          </p>
                        </div>
                        
                        <div className="py-1">
                          {dbUser && (
                            <>
                              <Link
                                href={`/profile/${dbUser.id}`}
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                              >
                                <User className="w-4 h-4 text-primary" /> View Profile
                              </Link>
                              <Link
                                href="/settings/profile"
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all font-bold text-primary"
                              >
                                <Sparkles className="w-4 h-4 text-blue-600" /> Profile Studio
                              </Link>
                            </>
                          )}
                          <Link
                            href="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                          >
                            <LayoutDashboard className="w-4 h-4 text-primary" /> Dashboard
                          </Link>
                          <Link
                            href="/settings/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                          >
                            <Settings className="w-4 h-4 text-primary" /> Settings
                          </Link>
                        </div>

                        <div className="border-t border-border/85 pt-1 mt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 font-bold transition-all text-left"
                          >
                            <LogOut className="w-4 h-4 text-destructive" /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/auth/login">
                      <Button variant="outline" size="sm" className="font-bold">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button size="sm" className="font-bold">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-3 pt-3 pb-4 space-y-3 shadow-inner animate-in slide-in-from-top duration-200">
          <div className="px-1">
            <SearchOmnibox isMobile />
          </div>

          {isAuthenticated ? (
            <>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{link.name}</span>
                    </div>
                    {link.badge !== undefined && link.badge > 0 ? (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-black text-white">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
              
              <div className="border-t border-border pt-4 mt-4 px-4 space-y-2">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border shrink-0">
                    {dbUser?.avatarUrl ? (
                      <img src={dbUser.avatarUrl} alt={dbUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-primary bg-primary/10">
                        {dbUser?.name?.[0] || clerkUser?.fullName?.[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground">{clerkUser?.fullName || dbUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{dbUser?.role}</p>
                  </div>
                </div>

                {dbUser && (
                  <Link
                    href={`/profile/${dbUser.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-2 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <User className="w-4 h-4 text-primary" /> View Profile
                  </Link>
                )}
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-2 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  <Settings className="w-4 h-4 text-primary" /> Settings
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-3 text-sm font-black text-destructive hover:bg-destructive/5 text-left rounded-lg"
                >
                  <LogOut className="w-4 h-4 text-destructive" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-4 space-y-3">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <Button variant="outline" className="w-full font-bold">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <Button className="w-full font-bold">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
