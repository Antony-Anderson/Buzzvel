import React, { useState, useEffect, useMemo } from 'react';
import { CreateRequestSkeleton } from './skeleton';

const currencyDisplayNames = new Intl.DisplayNames(['en'], { type: 'currency' });

function getCurrencyLabel(code) {
  try {
    const name = currencyDisplayNames.of(code);
    return name ? `${code} - ${name}` : code;
  } catch {
    return code;
  }
}

export default function CreateRequest({ token, exchangeRates, ratesLoading = false, addToast, onCancel, onSuccess }) {
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(0);

  const currencies = useMemo(
    () => Object.keys(exchangeRates).sort(),
    [exchangeRates]
  );

  useEffect(() => {
    if (!currencies.length) return;

    if (!currencies.includes(currency)) {
      setCurrency(currencies.includes('USD') ? 'USD' : currencies[0]);
    }
  }, [currencies, currency]);

  useEffect(() => {
    const amt = parseFloat(amount);
    const rate = exchangeRates[currency] || 1.0;
    
    if (isNaN(amt) || amt <= 0) {
      setEstimate(0);
    } else {
      setEstimate(amt / rate);
    }
  }, [amount, currency, exchangeRates]);

  if (ratesLoading) {
    return <CreateRequestSkeleton />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/payment-requests/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ amount, currency, description })
      });
      const resJson = await response.json();
      if (response.ok) {
        addToast('Payment request created successfully!');
        onSuccess();
      } else {
        addToast(resJson.message || 'Validation failed. Check your inputs.', 'error');
      }
    } catch (err) {
      console.error('Request creation failed:', err);
      addToast('API request failed.', 'error');
    } finally {
      setLoading(false);
    }
  };
  const rate = exchangeRates[currency] || 1.0;
  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Create Payment <span className="text-brand-coral">Request</span>
        </h1>
        <p className="text-xs text-brand-text-muted mt-2 max-w-2xl leading-relaxed">
          Initiate a new financial request. All amounts are automatically converted based on the current market exchange rate at the time of submission.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-brand-card border border-brand-border/60 rounded-xl p-6 space-y-6 shadow-xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[#ff8e8e] uppercase mb-1.5" htmlFor="req-currency">
                  Currency Code
                </label>
                <div className="relative">
                  <select
                    id="req-currency"
                    required
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    disabled={!currencies.length || ratesLoading}
                    className="w-full bg-brand-input border border-brand-border/60 hover:border-brand-border focus:border-brand-coral/50 rounded-lg py-2.5 px-3.5 text-xs text-white outline-none cursor-pointer appearance-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currencies.length === 0 ? (
                      <option value="">Loading currencies...</option>
                    ) : (
                      currencies.map((code) => (
                        <option key={code} value={code}>
                          {getCurrencyLabel(code)}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-brand-text-muted">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[#ff8e8e] uppercase mb-1.5" htmlFor="req-amount">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="req-amount"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-brand-input border border-brand-border/60 hover:border-brand-border focus:border-brand-coral/50 rounded-lg py-2 px-3.5 text-xs text-white placeholder-brand-text-muted/40 outline-none pr-12 transition"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-brand-text-muted/70 uppercase select-none">
                    {currency}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest text-[#ff8e8e] uppercase mb-1.5" htmlFor="req-description">
                Description
              </label>
              <textarea
                id="req-description"
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the purpose of this payment request..."
                className="w-full bg-brand-input border border-brand-border/60 hover:border-brand-border focus:border-brand-coral/50 rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-brand-text-muted/40 outline-none resize-none transition"
              ></textarea>
            </div>

            <div className="p-4 bg-[#0d0e11] border border-brand-border/40 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative">

              <div className="absolute left-0 top-3 bottom-3 w-1 bg-brand-coral/70 rounded"></div>
              
              <div className="pl-3">
                <span className="text-[9px] font-bold text-brand-text-muted uppercase">Current EUR Rate (Mock API)</span>
                <p className="text-xs font-bold mt-1 text-white">
                  {rate.toFixed(4)} {currency}/EUR
                </p>
              </div>
              
              <div className="sm:text-right pl-3 sm:pl-0">
                <span className="text-[9px] font-bold text-brand-text-muted uppercase">Estimated Total</span>
                <p className="text-lg font-black mt-1 text-[#ff8e8e]">
                  € {estimate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-brand-coral to-[#ff6b6b] hover:from-[#ff6b6b] hover:to-[#ff8888] text-white py-2 px-6 rounded-lg text-xs font-bold shadow-lg shadow-brand-coral/10 hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-brand-card hover:bg-brand-border/40 text-brand-text-muted hover:text-white px-6 py-2 border border-brand-border/60 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-5">
          <div className="bg-brand-card border border-red-500/20 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 text-red-500/5 rotate-12 pointer-events-none translate-x-4 -translate-y-4">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <div className="flex items-center gap-2.5 text-brand-coral mb-3">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-xs font-bold uppercase tracking-wider">48h Expiration</h4>
            </div>
            <p className="text-[11px] text-brand-text-muted leading-relaxed">
              Please note that all initiated payment requests must be completed within 48 hours. After this window, the exchange rate will be voided and the request will automatically expire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
