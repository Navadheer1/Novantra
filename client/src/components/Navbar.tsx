"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { Home, Building2, Briefcase, Inbox, MessageSquare, LayoutDashboard, User, Settings, Menu, X, LogOut, ChevronDown, UserCheck, ShieldAlert, Compass, Sparkles, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/apiConfig";
import { resilientFetch } from "@/lib/apiClient";
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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const moreDropdownRef = useRef<HTMLDivElement | null>(null);

  const isAuthenticated = !!clerkUserId;

  // Handle outside click to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
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
    if (!clerkUser || !clerkUser.id) {
      console.warn("[Navbar] Clerk user or user ID is not available. Skipping DB user fetch.");
      return;
    }

    const token = await getToken();

    // Fetch DB user details safely via resilientFetch
    const userRes = await resilientFetch<DBUser>(`/api/users/clerk/${clerkUser.id}`, { token });

    if (userRes.success && userRes.data) {
      const data = userRes.data;
      globalCachedUser = data;
      setDbUser(data);
      try {
        localStorage.setItem("noventra_user_cache", JSON.stringify(data));
      } catch (e) {}

      // Fetch inbox requests count if token is present
      if (token) {
        const reqPath = data.role === "FOUNDER" ? "/api/requests/incoming" : "/api/requests/sent";
        const reqRes = await resilientFetch<any[]>(reqPath, { token });

        if (reqRes.success && Array.isArray(reqRes.data)) {
          const reqs = reqRes.data;
          const pending = data.role === "FOUNDER"
            ? reqs.filter((r: any) => r.status === "PENDING").length
            : reqs.length;
          globalCachedInboxCount = pending;
          setInboxCount(pending);
          try {
            localStorage.setItem("noventra_inbox_count", pending.toString());
          } catch (e) {}
        }
      }
    } else if (userRes.offline) {
      console.log("[Navbar] Working offline with cached profile.");
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
    { name: "Home", href: "/feed", icon: Home, isCore: true },
    { name: "Explore", href: "/explore", icon: Compass, isCore: true },
    { name: "Startups", href: "/startups", icon: Building2, isCore: false },
    ...(dbUser?.role === "FOUNDER" || dbUser?.role === "INVESTOR" 
      ? [{ name: "Investors", href: "/investors", icon: Briefcase, isCore: false }] 
      : []),
    { name: "Shop", href: "/marketplace", icon: Store, isCore: false },
    { name: "Messages", href: "/messages", icon: MessageSquare, isCore: false, isDesktopHide: true },
    { name: "Inbox", href: "/inbox", icon: Inbox, badge: inboxCount, isCore: true },
  ];

  const coreLinks = navLinks.filter(l => l.isCore && !l.isDesktopHide);
  const secondaryLinks = navLinks.filter(l => !l.isCore && !l.isDesktopHide);
  const secondaryBadgeCount = secondaryLinks.reduce((acc, curr) => acc + (curr.badge || 0), 0);

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border/80 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 gap-2 lg:gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-xl lg:text-2xl font-black tracking-wider text-primary">NOVENTRA</span>
              <span className="hidden sm:inline-block text-[9px] lg:text-[10px] uppercase font-bold tracking-widest bg-primary/10 text-primary px-1.5 py-0.5 rounded">ECOSYSTEM</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-0.5 lg:gap-1 min-w-0 px-4">
            {isAuthenticated && coreLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center gap-1 lg:gap-1.5 px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold shrink-0 transition-colors duration-150 ${
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

            {isAuthenticated && secondaryLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative xl:flex hidden items-center gap-1 lg:gap-1.5 px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold shrink-0 transition-colors duration-150 ${
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

            {/* Responsive More dropdown menu */}
            {isAuthenticated && secondaryLinks.length > 0 && (
              <div className="relative xl:hidden flex" ref={moreDropdownRef}>
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`relative flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold shrink-0 transition-colors duration-150 ${
                    moreDropdownOpen
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? "rotate-180" : ""}`} />
                  {secondaryBadgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-destructive px-1 text-[8px] font-black text-white ring-2 ring-card animate-pulse shrink-0">
                      {secondaryBadgeCount}
                    </span>
                  )}
                </button>

                {moreDropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-10 w-48 rounded-xl border border-border/80 bg-card shadow-lg py-1.5 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                    {secondaryLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={`flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors ${
                            isActive
                              ? "text-primary bg-primary/5"
                              : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 shrink-0 text-muted-foreground" />
                            <span>{link.name}</span>
                          </div>
                          {link.badge !== undefined && link.badge > 0 && (
                            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-black text-white shrink-0">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Auth Controls / User Menu Dropdown */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 shrink-0 justify-end min-w-0">
            {/* Omnibox Search Bar */}
            <div className="hidden md:block w-36 lg:w-56 xl:w-64 min-w-0 shrink">
              <SearchOmnibox />
            </div>
            {clerkLoaded && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/messages"
                      className="relative group flex items-center justify-center w-9 h-9 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-150 border border-slate-200/60 shrink-0"
                      title="Messages Workspace"
                    >
                      <MessageSquare className="w-4.5 h-4.5 group-hover:scale-110 transition-transform text-blue-600" />
                    </Link>
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
                            <Link
                              href={`/profile/${dbUser.id}`}
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                            >
                              <User className="w-4 h-4 text-blue-600" /> View Profile
                            </Link>
                          )}
                          <Link
                            href="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                          >
                            <LayoutDashboard className="w-4 h-4 text-blue-600" /> Dashboard
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                          >
                            <Settings className="w-4 h-4 text-blue-600" /> Settings
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
