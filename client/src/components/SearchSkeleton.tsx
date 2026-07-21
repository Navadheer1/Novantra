"use client";

export function OmniboxSkeleton() {
  return (
    <div className="p-3 space-y-3 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
          <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-muted rounded w-2/5" />
            <div className="h-2.5 bg-muted/80 rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SearchPageSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-card border border-border p-6 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted/80 rounded w-1/4" />
              <div className="h-3 bg-muted/60 rounded w-3/4" />
            </div>
          </div>
          <div className="h-9 w-24 bg-muted rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}
