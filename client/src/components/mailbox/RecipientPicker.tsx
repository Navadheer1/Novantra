"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, ShieldCheck, Search, Loader2, User, Building2, Plus } from "lucide-react";
import { resilientFetch } from "@/lib/apiClient";
import { getApiUrl } from "@/lib/apiConfig";

export interface RecipientUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string | null;
  startupName?: string;
}

interface Props {
  selectedRecipients: RecipientUser[];
  onChangeRecipients: (recipients: RecipientUser[]) => void;
  placeholder?: string;
}

export default function RecipientPicker({
  selectedRecipients,
  onChangeRecipients,
  placeholder = "Type name, email, startup, or role..."
}: Props) {
  const [inputText, setInputText] = useState("");
  const [searchResults, setSearchResults] = useState<RecipientUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const queryCache = useRef<Record<string, RecipientUser[]>>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced live user search (250ms) with AbortController & In-Memory Cache
  useEffect(() => {
    const query = inputText.trim();
    if (!query) {
      setSearchResults([]);
      setDropdownOpen(false);
      setIsSearching(false);
      return;
    }

    // Check memory cache first for instant response
    const cached = queryCache.current[query.toLowerCase()];
    if (cached) {
      setSearchResults(cached);
      setHighlightedIndex(0);
      setDropdownOpen(true);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timer = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const res = await resilientFetch<any[]>(`/api/users/search?q=${encodeURIComponent(query)}`, {
        signal: abortControllerRef.current.signal
      });

      if (res && res.success && Array.isArray(res.data)) {
        const mapped: RecipientUser[] = res.data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          avatarUrl: u.avatarUrl,
          role: u.role || "MEMBER",
          startupName: u.startups?.[0]?.name || null
        }));

        queryCache.current[query.toLowerCase()] = mapped;
        setSearchResults(mapped);
        setHighlightedIndex(0);
        setDropdownOpen(true);
      }
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [inputText]);

  // Add recipient chip
  const addRecipient = useCallback(
    (user: RecipientUser) => {
      if (selectedRecipients.some((r) => r.id === user.id)) {
        setInputText("");
        setDropdownOpen(false);
        return;
      }
      onChangeRecipients([...selectedRecipients, user]);
      setInputText("");
      setDropdownOpen(false);
      if (inputRef.current) inputRef.current.focus();
    },
    [selectedRecipients, onChangeRecipients]
  );

  // Remove recipient chip
  const removeRecipient = useCallback(
    (id: string) => {
      onChangeRecipients(selectedRecipients.filter((r) => r.id !== id));
      if (inputRef.current) inputRef.current.focus();
    },
    [selectedRecipients, onChangeRecipients]
  );

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace on empty input removes last chip
    if (e.key === "Backspace" && !inputText && selectedRecipients.length > 0) {
      removeRecipient(selectedRecipients[selectedRecipients.length - 1].id);
      return;
    }

    if (!dropdownOpen || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (searchResults[highlightedIndex]) {
        addRecipient(searchResults[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input & Selected Chips Container */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="w-full min-h-[42px] p-2 bg-slate-50 border border-slate-200/90 rounded-xl flex flex-wrap items-center gap-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all cursor-text"
      >
        {/* Recipient Chips */}
        {selectedRecipients.map((recipient) => (
          <span
            key={recipient.id}
            className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200/80 text-blue-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs group animate-in fade-in-50"
          >
            <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-black overflow-hidden shrink-0">
              {recipient.avatarUrl ? (
                <img src={recipient.avatarUrl} alt={recipient.name} className="w-full h-full object-cover" />
              ) : (
                recipient.name[0]
              )}
            </div>
            <span className="truncate max-w-[140px]">{recipient.name}</span>
            <span className="text-[9px] font-black uppercase text-blue-700 bg-blue-100 px-1 py-0.2 rounded shrink-0">
              {recipient.role || "USER"}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeRecipient(recipient.id);
              }}
              className="p-0.5 text-blue-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Search Text Input */}
        <div className="flex-1 min-w-[160px] flex items-center gap-1">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputText.trim() && searchResults.length > 0) setDropdownOpen(true);
            }}
            placeholder={selectedRecipients.length === 0 ? placeholder : "Add another recipient..."}
            className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
          />

          {isSearching && <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0 mr-1" />}
        </div>
      </div>

      {/* Floating Gmail-Style Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto animate-in fade-in-50 slide-in-from-top-1">
          {searchResults.length === 0 && !isSearching ? (
            <div className="p-4 text-center space-y-2 text-xs">
              <p className="text-slate-500 font-medium">No platform users found matching "{inputText}".</p>
              <button
                type="button"
                onClick={() => {
                  const customEmail = inputText.trim();
                  if (customEmail) {
                    addRecipient({
                      id: `custom-${Date.now()}`,
                      name: customEmail,
                      email: customEmail,
                      avatarUrl: null,
                      role: "GUEST"
                    });
                  }
                }}
                className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add "{inputText}" as direct email recipient
              </button>
            </div>
          ) : (
            <div className="py-1 divide-y divide-slate-100">
              {searchResults.map((user, idx) => {
                const isHighlighted = idx === highlightedIndex;
                const isAlreadySelected = selectedRecipients.some((r) => r.id === user.id);

                return (
                  <div
                    key={user.id}
                    onClick={() => addRecipient(user)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isHighlighted ? "bg-blue-50/80" : "hover:bg-slate-50"
                    } ${isAlreadySelected ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs border border-slate-200 overflow-hidden shrink-0">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name[0]
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900 truncate">{user.name}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="text-[9px] font-black uppercase text-blue-700 bg-blue-100/80 px-1.5 py-0.2 rounded shrink-0">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono truncate">{user.email}</p>
                        {user.startupName && (
                          <p className="text-[10px] font-bold text-slate-600 truncate flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-400" /> Startup: {user.startupName}
                          </p>
                        )}
                      </div>
                    </div>

                    {isAlreadySelected && (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        Added
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
