"use client";

export default function FeedSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-slate-200/80 p-6 rounded-[20px] shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-200" />
              <div className="space-y-1.5">
                <div className="w-32 h-4 bg-slate-200 rounded" />
                <div className="w-20 h-3 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="w-24 h-6 bg-slate-200 rounded-full" />
          </div>

          <div className="space-y-2">
            <div className="w-full h-4 bg-slate-200 rounded" />
            <div className="w-5/6 h-4 bg-slate-200 rounded" />
            <div className="w-2/3 h-4 bg-slate-200 rounded" />
          </div>

          <div className="w-full h-48 bg-slate-100 rounded-2xl" />

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <div className="w-20 h-4 bg-slate-200 rounded" />
            <div className="w-24 h-4 bg-slate-200 rounded" />
            <div className="w-16 h-4 bg-slate-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
