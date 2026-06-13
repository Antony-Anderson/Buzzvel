import React from 'react';
import Skeleton from './Skeleton';

function StatCardSkeleton({ hasProgress = false }) {
  return (
    <div className="bg-brand-card border border-brand-border/60 rounded-xl p-6 relative overflow-hidden">
      <Skeleton className="h-2.5 w-24" />
      <Skeleton className="h-8 w-32 mt-3" />
      {hasProgress ? (
        <Skeleton className="h-1 w-full mt-5 rounded-full" />
      ) : (
        <Skeleton className="h-3 w-36 mt-3" />
      )}
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <tr className="border-b border-brand-border/10">
      <td className="py-3.5 px-6">
        <Skeleton className="h-3.5 w-20" />
      </td>
      <td className="py-3.5 px-6">
        <div className="flex items-center gap-2">
          <Skeleton className="w-2 h-2 rounded-full shrink-0" />
          <Skeleton className="h-3.5 w-28" />
        </div>
      </td>
      <td className="py-3.5 px-6">
        <Skeleton className="h-3.5 w-16 ml-auto sm:ml-0" />
      </td>
      <td className="py-3.5 px-6 text-center">
        <Skeleton className="h-5 w-16 rounded-full mx-auto" />
      </td>
      <td className="py-3.5 px-6 hidden md:table-cell">
        <Skeleton className="h-3 w-32" />
      </td>
      <td className="py-3.5 px-6 text-center w-10">
        <Skeleton className="h-4 w-4 rounded mx-auto" />
      </td>
    </tr>
  );
}

export default function OverviewSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-3 w-full max-w-2xl mt-3" />
        <Skeleton className="h-3 w-4/5 max-w-xl mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCardSkeleton />
        <StatCardSkeleton hasProgress />
        <StatCardSkeleton hasProgress />
      </div>

      <div className="bg-brand-card/60 border border-brand-border/60 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-brand-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-7 w-28 rounded-lg self-end sm:self-auto" />
        </div>

        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border/40 bg-[#0d0e11]/30">
                {['w-24', 'w-28', 'w-24', 'w-16', 'w-32', 'w-4'].map((width, i) => (
                  <th key={i} className="py-3 px-6">
                    <Skeleton className={`h-2.5 ${width} ${i === 2 ? 'ml-auto sm:ml-0' : ''} ${i === 3 ? 'mx-auto' : ''}`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-brand-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Skeleton className="h-3 w-44" />
          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <Skeleton className="h-7 w-7 rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-7 rounded" />
            ))}
            <Skeleton className="h-7 w-7 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
