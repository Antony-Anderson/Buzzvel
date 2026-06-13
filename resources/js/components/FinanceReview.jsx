import React, { useState, useEffect } from 'react';
import { FinanceReviewSkeleton } from './skeleton';

export default function FinanceReview({ token, requestId, addToast, onCancel, onDecisionSuccess }) {
  const [request, setRequest] = useState(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestId) {
      loadDetails();
    }
  }, [requestId]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/payment-requests/${requestId}/show`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const resJson = await response.json();
        setRequest(resJson.data);
      } else {
        addToast('Failed to load request details.', 'error');
        onCancel();
      }
    } catch (err) {
      console.error('Failed to load review details:', err);
      addToast('Failed to fetch request information from server.', 'error');
      onCancel();
    } finally {
      setLoading(false);
    }
  };

  const submitDecision = async (status) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/payment-requests/${requestId}/update`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        addToast(`Payment request was ${status} successfully!`);
        setNotes('');
        onDecisionSuccess();
        loadDetails();
      } else {
        const errRes = await response.json();
        addToast(errRes.message || 'Failed to submit decision.', 'error');
      }
    } catch (err) {
      console.error('Failed to submit approval update:', err);
      addToast('API request failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return <FinanceReviewSkeleton />;
  }

  if (!request) return null;

  const timestampStr = new Date(request.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) + ' — ' + new Date(request.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }) + ' UTC';

  const timelineTime = new Date(request.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }).toUpperCase() + ', ' + new Date(request.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  let badgeClass = '';
  let statusText = request.status.toUpperCase() === 'APPROVED' ? 'PAID' : request.status.toUpperCase();
  let timelineNodeTitle = 'Waiting for Final Sign-off';

  if (request.status === 'pending') {
    badgeClass = 'border-brand-coral/40 text-brand-coral bg-brand-coral/5';
    statusText = 'PENDING REVIEW';
    timelineNodeTitle = 'Waiting for Final Sign-off';
  } else if (request.status === 'approved') {
    badgeClass = 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5';
    statusText = 'PAID';
    timelineNodeTitle = 'Approved & Paid';
  } else if (request.status === 'rejected') {
    badgeClass = 'border-red-500/40 text-red-400 bg-red-500/5';
    statusText = 'REJECTED';
    timelineNodeTitle = 'Rejected';
  } else {
    badgeClass = 'border-gray-500/40 text-gray-400 bg-gray-500/5';
    timelineNodeTitle = 'Expired';
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-[10px] font-bold text-brand-text-muted/80 tracking-widest uppercase">
        <span onClick={onCancel} className="cursor-pointer hover:text-white transition">
          Finance Review
        </span>
        <span>&gt;</span>
        <span className="text-[#ff8e8e]">Request #BZ-90{request.id}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">
          Finance <span className="text-brand-coral">Approval</span>
        </h1>
        <div className={`self-start sm:self-auto px-3.5 py-1 text-[10px] font-extrabold tracking-wider border rounded ${badgeClass}`}>
          {statusText}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-brand-card border border-brand-border/60 rounded-xl p-6 space-y-6 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-brand-border/30">
              <div>
                <span className="text-[9px] font-bold tracking-widest text-[#ff8e8e] uppercase">Requesting User</span>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-10 h-10 rounded-full bg-brand-coral/20 border border-brand-coral/30 flex items-center justify-center font-bold text-brand-coral">
                    {getInitials(request.user?.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{request.user?.name || 'Unknown User'}</p>
                    <p className="text-[10px] text-brand-text-muted mt-0.5">
                      {request.user?.role === 'finance' ? 'Finance Manager' : 'Senior Manager'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-bold tracking-widest text-[#ff8e8e] uppercase">Timestamp</span>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-8 h-8 rounded-lg bg-[#0d0e11] border border-brand-border/40 flex items-center justify-center text-brand-text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{timestampStr}</p>
                    <p className="text-[10px] text-brand-text-muted mt-0.5">Created date UTC</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2">
              <div>
                <span className="text-[9px] font-bold tracking-widest text-brand-text-muted uppercase">Total Amount</span>
                <p className="text-2xl font-black text-white mt-1.5">
                  €{parseFloat(request.converted_amount_eur).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <span className="text-[9px] font-bold tracking-widest text-brand-text-muted uppercase">Local Rate</span>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <p class="text-xs font-bold text-white">{parseFloat(request.exchange_rate).toFixed(4)}</p>
                  <span className="text-[9px] font-bold bg-brand-input border border-brand-border/40 text-brand-text-muted px-1.5 py-0.5 rounded uppercase">
                    {request.currency}/EUR
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold tracking-widest text-brand-text-muted uppercase">Category</span>
                <p className="text-xs font-semibold text-white mt-2.5">External Vendor</p>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-border/30 space-y-2">
              <span className="text-[9px] font-bold tracking-widest text-[#ff8e8e] uppercase">Request Justification</span>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                {request.description || 'No justification notes provided for this payment request.'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-brand-card border border-brand-border/60 rounded-xl p-6 space-y-6 shadow-xl relative overflow-hidden">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Decision Terminal</h3>

            {request.status === 'pending' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-brand-text-muted uppercase mb-1.5" htmlFor="review-notes">
                    Decision Notes (Optional)
                  </label>
                  <textarea
                    id="review-notes"
                    rows="4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes for the requester if rejecting..."
                    className="w-full bg-brand-input border border-brand-border/60 hover:border-brand-border focus:border-brand-coral/50 rounded-lg p-2.5 text-xs text-white placeholder-brand-text-muted/40 outline-none resize-none transition"
                  ></textarea>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => submitDecision('approved')}
                    disabled={submitting}
                    className="w-full bg-[#ffecec] border border-transparent hover:bg-white text-brand-dark py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition duration-200 cursor-pointer shadow-lg shadow-brand-coral/5 glow-coral-sm uppercase disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" />
                    </svg>
                    <span>{submitting ? 'Processing...' : 'Approve Payment'}</span>
                  </button>

                  <button
                    onClick={() => submitDecision('rejected')}
                    disabled={submitting}
                    className="w-full bg-[#121316] border border-brand-border/60 hover:border-brand-border text-red-400 hover:text-red-300 py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition duration-200 cursor-pointer uppercase disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>{submitting ? 'Processing...' : 'Reject Request'}</span>
                  </button>
                </div>

                <div className="p-3.5 bg-[#0d0e11] border border-brand-border/40 rounded-lg flex gap-2.5">
                  <svg className="w-4 h-4 text-brand-text-muted shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[10px] text-brand-text-muted leading-relaxed">
                    Once approved, the funds will be queued for automated local transfer via the primary banking gateway.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-brand-text-muted bg-[#0d0e11] border border-brand-border/40 rounded-lg text-xs font-semibold">
                Decision was finalized as {request.status.toUpperCase()}.
              </div>
            )}
          </div>

          <div className="bg-brand-card border border-brand-border/60 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recent Activity</h4>

            <div className="relative pl-6 border-l border-brand-border/80 space-y-5 text-xs py-1">
              <div className="relative">
                <div className="absolute -left-[30px] top-0.5 w-2 h-2 rounded-full bg-brand-coral border-4 border-brand-card ring-1 ring-brand-coral/25"></div>
                <p className="font-semibold text-white">Request Created</p>
                <p className="text-[10px] text-brand-text-muted mt-0.5">{timelineTime}</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[30px] top-0.5 w-2 h-2 rounded-full bg-brand-text-muted border-4 border-brand-card"></div>
                <p className="font-semibold text-white">{timelineNodeTitle}</p>
                <p className="text-[10px] text-brand-text-muted mt-0.5">CURRENT STATUS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
