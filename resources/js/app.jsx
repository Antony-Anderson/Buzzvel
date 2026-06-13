import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import CreateRequest from './components/CreateRequest';
import FinanceReview from './components/FinanceReview';
import Toast from './components/Toast';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [token, setToken] = useState(localStorage.getItem('buzzvel_token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('buzzvel_user')) || null);
  const [currentView, setCurrentView] = useState('overview'); 
  const [authPage, setAuthPage] = useState('login');

  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, lastPage: 1, perPage: 10, total: 0 });
  const [filters, setFilters] = useState({ status: 'all', search: '', sort: 'latest' });
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const [toasts, setToasts] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    async function fetchRates() {
      setRatesLoading(true);
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/EUR');
        if (response.ok) {
          const data = await response.json();
          if (data && data.rates) {
            setExchangeRates(data.rates);
          }
        }
      } catch (err) {
        console.warn('Could not fetch exchange rates from public API, using default values.', err);
        setExchangeRates({
          USD: 1.0827,
          BRL: 5.5385,
          GBP: 0.8649,
          JPY: 159.41,
          EUR: 1.0
        });
      } finally {
        setRatesLoading(false);
      }
    }
    fetchRates();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setUser(null);
      localStorage.removeItem('buzzvel_user');
    }
  }, [token]);

  useEffect(() => {
    if (token && (currentView === 'overview' || currentView === 'requests')) {
      loadDashboardData();
    }
  }, [token, currentView, pagination.page, filters.status, filters.search, filters.sort]);

  useEffect(() => {
    if (token && user && user.role === 'finance') {
      fetchPendingReviewCount();
    }
  }, [token, user, requests]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/users/show', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const resJson = await response.json();
        setUser(resJson.data);
        localStorage.setItem('buzzvel_user', JSON.stringify(resJson.data));
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
    }
  };

  const loadDashboardData = async () => {
    let url = `/api/payment-requests?page=${pagination.page}&per_page=${pagination.perPage}`;
    if (filters.status !== 'all') {
      url += `&status=${filters.status}`;
    }

    setLoadingDashboard(true);

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const resData = await response.json();
        const paginated = resData.data;

        let list = paginated.data || [];

        if (filters.search) {
          list = list.filter(req =>
            req.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
            req.id.toString().includes(filters.search) ||
            req.amount.toString().includes(filters.search) ||
            req.currency.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        if (filters.sort === 'latest') {
          list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else {
          list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }

        setRequests(list);
        setPagination({
          page: paginated.current_page || 1,
          lastPage: paginated.last_page || 1,
          perPage: paginated.per_page || 10,
          total: paginated.total || 0
        });
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      addToast('Failed to fetch payment requests from server.', 'error');
    } finally {
      setLoadingDashboard(false);
    }
  };

  const fetchPendingReviewCount = async () => {
    try {
      const response = await fetch('/api/payment-requests?status=pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const json = await response.json();
        setPendingReviewCount(json.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch pending reviews count:', err);
    }
  };

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    localStorage.setItem('buzzvel_token', newToken);
    setCurrentView('overview');
  };

  const handleRegisterSuccess = (newToken) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('buzzvel_token', newToken);
      setCurrentView('overview');
    } else {
      setAuthPage('login');
      addToast('Account created! Please sign in.', 'success');
    }
  };

  const handleLogout = () => {
    if (token) {
      fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }).catch(err => console.error('Logout request failed:', err));
    }
    localStorage.removeItem('buzzvel_token');
    localStorage.removeItem('buzzvel_user');
    setToken(null);
    setUser(null);
    setCurrentView('overview');
    setAuthPage('login');
    addToast('Logged out successfully');
  };

  const switchView = (viewName) => {
    if (viewName === 'review' && !selectedRequestId) {
      addToast('Please select a payment request to review from the dashboard table list', 'info');
      return;
    }
    setCurrentView(viewName);
  };

  const handleSelectRequest = (id) => {
    setSelectedRequestId(id);
    if (user && user.role === 'finance') {
      setCurrentView('review');
    } else {
      const req = requests.find(r => r.id === id);
      addToast(`Selected request details: ${req?.description || 'No description'}`);
    }
  };

  if (!token) {
    return (
      <>
        <div id="toast-container" className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map(t => (
            <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
          ))}
        </div>
        {authPage === 'login' ? (
          <Login
            onLoginSuccess={handleLoginSuccess}
            addToast={addToast}
            theme={theme}
            toggleTheme={toggleTheme}
            onGoToRegister={() => setAuthPage('register')}
          />
        ) : (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            addToast={addToast}
            theme={theme}
            toggleTheme={toggleTheme}
            onGoToLogin={() => setAuthPage('login')}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div id="toast-container" className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-brand-dark">
        <Sidebar
          currentView={currentView}
          switchView={switchView}
          user={user}
          pendingReviewCount={pendingReviewCount}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-brand-dark">
          <Header
            user={user}
            onLogout={handleLogout}
            onSearchChange={(search) =>
              setFilters(prev => ({ ...prev, search, page: 1 }))
            }
            switchView={switchView}
            theme={theme}
            toggleTheme={toggleTheme}
          />

          <main className="flex-1 overflow-y-auto p-6 relative">
            {currentView === 'overview' && (
              <Overview
                requests={requests}
                pagination={pagination}
                loading={loadingDashboard}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                onFilterChange={setFilters}
                onSortChange={(sort) => setFilters(prev => ({ ...prev, sort }))}
                onSelectRequest={handleSelectRequest}
                filters={filters}
                user={user}
              />
            )}

            {currentView === 'create' && (
              <CreateRequest
                token={token}
                exchangeRates={exchangeRates}
                ratesLoading={ratesLoading}
                addToast={addToast}
                onCancel={() => setCurrentView('overview')}
                onSuccess={() => setCurrentView('overview')}
              />
            )}

            {currentView === 'review' && (
              <FinanceReview
                token={token}
                requestId={selectedRequestId}
                addToast={addToast}
                onCancel={() => setCurrentView('overview')}
                onDecisionSuccess={() => {
                  loadDashboardData();
                  fetchPendingReviewCount();
                }}
              />
            )}
          </main>

          <footer className="h-12 border-t border-brand-border/40 bg-brand-surface px-6 flex items-center justify-between text-[10px] text-brand-text-muted shrink-0">
            <p>© 2026 buzzvel Payment Portal. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}