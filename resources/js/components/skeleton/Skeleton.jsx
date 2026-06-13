import React from 'react';

export default function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`skeleton-shimmer rounded ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 && lines > 1 ? 'w-4/5' : 'w-full'}`}
        />
      ))}
    </div>
  );
}
