import React, { useState, useEffect, useRef } from 'react';

export default function Header({
  user,
  onLogout,
  onSearchChange,
  switchView,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';

    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  return (
    <>
      <header className="h-16 border-b border-brand-border/60 bg-[#0d0e11]/80 backdrop-blur px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tight text-white select-none">
            buzzvel
          </span>

          <div className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => switchView('overview')}
              className="text-xs text-white border-b-2 border-transparent pb-[22px] mt-[20px] font-medium hover:border-brand-coral transition"
            >
              Overview
            </button>

            <button
              onClick={() => switchView('create')}
              className="text-xs text-white border-b-2 border-transparent pb-[22px] mt-[20px] font-medium hover:border-brand-coral transition"
            >
              Requests
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchValue}
              onChange={handleSearchInput}
              className="w-56 bg-brand-input border border-brand-border/60 hover:border-brand-border focus:border-brand-coral/40 rounded-lg py-1.5 pl-8 pr-4 text-xs text-white placeholder-brand-text-muted/50 outline-none transition duration-200"
            />

            <svg
              className="w-3.5 h-3.5 absolute left-3 top-2.5 text-brand-text-muted/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 py-1 px-1.5 rounded-lg border border-transparent hover:border-brand-border/60 hover:bg-brand-card transition cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-brand-coral/20 border border-brand-coral/40 flex items-center justify-center font-bold text-xs text-brand-coral">
                {getInitials(user?.name)}
              </div>

              <span className="text-xs font-medium text-white max-w-[100px] truncate hidden md:inline">
                {user?.name || 'User'}
              </span>

              <svg
                className="w-3.5 h-3.5 text-brand-text-muted hidden md:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-brand-card border border-brand-border rounded-lg shadow-xl py-1.5 z-40">
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-white">
                    {user?.name || 'User Name'}
                  </p>

                  <p className="text-[10px] text-brand-text-muted truncate mt-0.5">
                    {user?.email || 'email@example.com'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>

            <span className="hidden md:inline text-xs font-medium">
              Sign Out
            </span>
          </button>
        </div>
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md mx-4 bg-brand-card border border-brand-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20">
                  <svg
                    className="w-6 h-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Sign Out
                  </h3>

                  <p className="mt-2 text-sm text-brand-text-muted">
                    Are you sure you want to sign out of your account?
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-brand-border text-brand-text-muted hover:bg-brand-input transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}