import React from 'react';
import Skeleton from './Skeleton';

export default function FinanceReviewSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-2" />
        <Skeleton className="h-3 w-32" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-7 w-28 rounded self-start sm:self-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-brand-card border border-brand-border/60 rounded-xl p-6 space-y-6 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-brand-border/30">
              <div>
                <Skeleton className="h-2.5 w-28" />
                <div className="flex items-center gap-3 mt-3">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
              <div>
                <Skeleton className="h-2.5 w-20" />
                <div className="flex items-center gap-3 mt-4">
                  <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className={`mt-2.5 ${i === 0 ? 'h-8 w-28' : 'h-4 w-24'}`} />
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-brand-border/30 space-y-3">
              <Skeleton className="h-2.5 w-36" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-brand-card border border-brand-border/60 rounded-xl p-6 space-y-5 shadow-xl">
            <Skeleton className="h-4 w-36" />
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-32" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>

          <div className="bg-brand-card border border-brand-border/60 rounded-xl p-5 space-y-4">
            <Skeleton className="h-3.5 w-28" />
            <div className="relative pl-6 space-y-5 py-1">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-brand-border/80" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="relative space-y-1.5">
                  <Skeleton className="absolute -left-[26px] top-0.5 w-2 h-2 rounded-full" />
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-2.5 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
