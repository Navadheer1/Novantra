"use client";

export function ExploreSkeleton() {
  return (
    <div className="space-y-8 animate-pulse max-w-7xl mx-auto px-4 py-8">
      {/* Hero Spotlight Skeleton */}
      <div className="h-64 bg-card border border-border rounded-3xl p-8" />

      {/* Goal Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-card border border-border rounded-2xl" />
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-14 bg-card border border-border rounded-xl" />

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-card border border-border rounded-2xl" />
          ))}
        </div>
        <div className="lg:col-span-1 space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-60 bg-card border border-border rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
