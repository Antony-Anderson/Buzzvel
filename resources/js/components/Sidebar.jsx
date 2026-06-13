import React from 'react';

export default function Sidebar({ currentView, switchView, user, pendingReviewCount }) {
  const isFinance = user && user.role === 'finance';

  const navLinks = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      id: 'create',
      label: 'New Request',
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-brand-surface border-b md:border-b-0 md:border-r border-brand-border/60 flex flex-col shrink-0">
      <div className="p-6 border-b border-brand-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand-coral flex items-center justify-center rounded-lg shadow-md shadow-brand-coral/10">
            <span className="text-white font-extrabold text-xl tracking-tighter">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight leading-none text-brand-foreground">Management</span>
            <span className="text-[10px] text-brand-text-muted leading-none mt-1">Payment Portal</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navLinks.map((link) => {
          const isActive = currentView === link.id || (link.id === 'requests' && currentView === 'requests');
          return (
            <button
              key={link.id}
              onClick={() => switchView(link.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition duration-200 cursor-pointer ${isActive
                ? 'bg-brand-coral text-white glow-coral-sm'
                : 'text-brand-text-muted hover:bg-brand-card hover:text-brand-foreground'
                }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          );
        })}

        {isFinance && (
          <button
            onClick={() => switchView('review')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition duration-200 cursor-pointer ${currentView === 'review'
              ? 'bg-brand-coral text-white glow-coral-sm'
              : 'text-brand-text-muted hover:bg-brand-card hover:text-brand-foreground'
              }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Finance Review</span>
            </div>
            {pendingReviewCount > 0 && (
              <span className="text-[10px] bg-brand-coral/20 text-brand-coral px-1.5 py-0.5 rounded-full font-bold">
                {pendingReviewCount}
              </span>
            )}
          </button>
        )}
      </nav>

      <div className="p-4 border-t border-brand-border/40 space-y-2">
        <button
          onClick={() => switchView('create')}
          className="w-full bg-gradient-to-r from-brand-coral to-[#ff6b6b] hover:from-[#ff6b6b] hover:to-[#ff8888] text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-brand-coral/10 hover:scale-[1.01] transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create New Request</span>
        </button>
      </div>
    </aside>
  );
}
