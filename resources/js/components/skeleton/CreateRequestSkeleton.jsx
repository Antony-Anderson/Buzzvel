import React from 'react';
import Skeleton from './Skeleton';

export default function CreateRequestSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-3 w-full max-w-2xl mt-3" />
        <Skeleton className="h-3 w-4/5 max-w-xl mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-brand-card border border-brand-border/60 rounded-xl p-6 space-y-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Skeleton className="h-2.5 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-2.5 w-16 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>

          <div>
            <Skeleton className="h-2.5 w-20 mb-2" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>

          <div className="p-4 bg-[#0d0e11] border border-brand-border/40 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-2 pl-3">
              <Skeleton className="h-2.5 w-36" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="space-y-2 sm:text-right pl-3 sm:pl-0">
              <Skeleton className="h-2.5 w-24 sm:ml-auto" />
              <Skeleton className="h-7 w-32 sm:ml-auto" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-32 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-brand-card border border-red-500/20 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-4 h-4 rounded shrink-0" />
              <Skeleton className="h-3.5 w-28" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
