import React from 'react';

export default function DeliverablesLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-2 space-y-10 selection:bg-[#6366F1] selection:text-white">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-black/[0.06] animate-pulse">
        <div className="space-y-3 max-w-2xl">
          <div className="h-6 w-64 bg-black/[0.06] rounded-full" />
          <div className="h-10 w-96 bg-black/[0.08] rounded-2xl" />
          <div className="h-4 w-80 bg-black/[0.04] rounded-lg" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-black/[0.06] rounded-full" />
          <div className="h-10 w-36 bg-black/[0.08] rounded-full" />
        </div>
      </div>

      {/* Shimmer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-black/[0.06] rounded-3xl p-8 space-y-6 shadow-sm animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-black/[0.06] rounded-md" />
              <div className="h-6 w-20 bg-black/[0.06] rounded-full" />
            </div>

            <div className="space-y-2">
              <div className="h-3 w-28 bg-black/[0.04] rounded-md" />
              <div className="h-8 w-full bg-black/[0.08] rounded-xl" />
            </div>

            <div className="h-12 w-full bg-black/[0.04] rounded-xl" />

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="h-12 bg-black/[0.04] rounded-2xl" />
              <div className="h-12 bg-black/[0.04] rounded-2xl" />
            </div>

            <div className="pt-6 border-t border-black/[0.06] space-y-3">
              <div className="h-3 w-full bg-black/[0.06] rounded-full" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 w-32 bg-black/[0.06] rounded-md" />
                <div className="h-4 w-28 bg-black/[0.08] rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
