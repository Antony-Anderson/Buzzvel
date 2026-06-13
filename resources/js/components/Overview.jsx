import React, { useState } from 'react';
import { OverviewSkeleton } from './skeleton';

export default function Overview({
    requests,
    pagination,
    loading = false,
    onPageChange,
    onFilterChange,
    onSortChange,
    onSelectRequest,
    filters,
    user
}) {
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const formatCurrency = (amount, currency) => {
        const num = parseFloat(amount);
        if (isNaN(num)) return amount;

        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        const val = formatter.format(num);
        switch (currency) {
            case 'USD': return `$${val} USD`;
            case 'GBP': return `£${val} GBP`;
            case 'JPY': return `¥${val} JPY`;
            case 'BRL': return `R$${val} BRL`;
            case 'EUR': return `€${val}`;
            default: return `${val} ${currency}`;
        }
    };
    const totalEur = requests.reduce((sum, req) => sum + parseFloat(req.converted_amount_eur || 0), 0);
    const pendingCount = requests.filter(req => req.status === 'pending').length;
    const processedCount = requests.filter(req => req.status === 'approved').length;
    const totalCount = requests.length || 1;
    const pendingPercentage = (pendingCount / totalCount) * 100;
    const processedPercentage = (processedCount / totalCount) * 100;
    const startResult = requests.length > 0 ? (pagination.page - 1) * pagination.perPage + 1 : 0;
    const endResult = Math.min(startResult + requests.length - 1, pagination.total);

    if (loading) {
        return <OverviewSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-brand-foreground">Inside Buzzvel</h1>
                <p className="text-xs text-brand-text-muted mt-2 max-w-2xl leading-relaxed">
                    Track and manage your global payment requests with surgical precision. Our real-time engine ensures mathematical harmony across all high-stakes financial operations.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-brand-card border border-brand-border/60 rounded-xl p-6 relative overflow-hidden">
                    <span className="text-[9px] font-bold tracking-widest text-brand-accent uppercase">TOTAL MANAGED</span>
                    <h3 className="text-2xl font-bold mt-2 text-brand-foreground">
                        €{totalEur.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-2.5 text-xs text-emerald-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>+12.4% from last month</span>
                    </div>
                </div>

                <div className="bg-brand-card border border-brand-border/60 rounded-xl p-6 relative">
                    <span className="text-[9px] font-bold tracking-widest text-brand-accent uppercase">Pending</span>
                    <h3 className="text-2xl font-bold mt-2 text-brand-foreground">{pendingCount}</h3>
                    <div className="w-full bg-brand-track rounded-full h-1 mt-4.5 overflow-hidden">
                        <div className="bg-brand-coral h-full rounded-full transition-all duration-300" style={{ width: `${pendingPercentage}%` }}></div>
                    </div>
                </div>
                <div className="bg-brand-card border border-brand-border/60 rounded-xl p-6 relative">
                    <span className="text-[9px] font-bold tracking-widest text-brand-accent uppercase">Processed 24h</span>
                    <h3 className="text-2xl font-bold mt-2 text-brand-foreground">{processedCount}</h3>
                    <div className="w-full bg-brand-track rounded-full h-1 mt-4.5 overflow-hidden">
                        <div className="bg-brand-text-muted h-full rounded-full transition-all duration-300" style={{ width: `${processedPercentage}%` }}></div>
                    </div>
                </div>
            </div>
            <div className="bg-brand-card/60 border border-brand-border/60 rounded-xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-brand-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {['all', 'pending', 'approved', 'rejected', 'expired'].map((status) => {
                            const isActive = filters.status === status;
                            return (
                                <button
                                    key={status}
                                    onClick={() => onFilterChange({ ...filters, status })}
                                    className={`px-4 py-1.5 text-xs rounded-full font-medium border transition cursor-pointer select-none ${isActive
                                            ? 'border-brand-border bg-brand-input text-brand-foreground'
                                            : 'border-brand-border/60 bg-transparent text-brand-text-muted hover:text-brand-foreground hover:border-brand-border'
                                        }`}
                                >
                                    {status === 'all' ? 'All Requests' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="relative">
                            <button
                                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border border-brand-border/60 bg-brand-input hover:border-brand-border text-brand-text-muted hover:text-brand-foreground transition cursor-pointer select-none"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                </svg>
                                <span>{filters.sort === 'latest' ? 'Latest First' : 'Oldest First'}</span>
                            </button>

                            {sortDropdownOpen && (
                                <div className="absolute right-0 mt-1 w-36 bg-brand-card border border-brand-border rounded-lg shadow-xl py-1.5 z-30">
                                    <button
                                        onClick={() => {
                                            onSortChange('latest');
                                            setSortDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-border/40 text-brand-foreground transition"
                                    >
                                        Latest First
                                    </button>
                                    <button
                                        onClick={() => {
                                            onSortChange('oldest');
                                            setSortDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-border/40 text-brand-foreground transition"
                                    >
                                        Oldest First
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto min-w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-brand-border/40 text-[9px] font-bold tracking-widest text-brand-accent uppercase bg-brand-surface/30">
                                <th className="py-3 px-6 select-none">Request ID</th>
                                <th className="py-3 px-6 select-none">Local Currency</th>
                                <th className="py-3 px-6 select-none text-right sm:text-left">Converted EUR</th>
                                <th className="py-3 px-6 select-none text-center">Status</th>
                                <th className="py-3 px-6 select-none hidden md:table-cell">Timestamp</th>
                                <th className="py-3 px-6 text-center select-none w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/20 text-xs text-brand-text-muted">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-brand-text-muted/60">
                                        No payment requests found.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => {
                                    let badgeClass = '';
                                    let statusText = req.status.toUpperCase();
                                    if (req.status === 'pending') {
                                        badgeClass = 'border-brand-bold/40 text-bold bg-brand-coral/5';
                                        statusText = 'PENDING';
                                    } else if (req.status === 'approved') {
                                        badgeClass = 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5';
                                        statusText = 'PAID';
                                    } else if (req.status === 'rejected') {
                                        badgeClass = 'border-red-500/40 text-red-400 bg-red-500/5';
                                        statusText = 'REJECTED';
                                    } else {
                                        badgeClass = 'border-gray-500/40 text-gray-400 bg-gray-500/5';
                                        statusText = 'EXPIRED';
                                    }
                                    const dateStr = new Date(req.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }) + ' · ' + new Date(req.created_at).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    });
                                    return (
                                        <tr
                                            key={req.id}
                                            onClick={() => onSelectRequest(req.id)}
                                            className="hover:bg-brand-card/40 transition duration-150 cursor-pointer border-b border-brand-border/10"
                                        >
                                            <td className="py-3.5 px-6 font-bold text-brand-foreground tracking-tight">#BZ-90{req.id}</td>
                                            <td className="py-3.5 px-6 font-medium text-brand-foreground/95">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-brand-text-muted/40"></span>
                                                    <span>{formatCurrency(req.amount, req.currency)}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6 font-bold text-brand-foreground text-right sm:text-left">
                                                €{parseFloat(req.converted_amount_eur).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="py-3.5 px-6 text-center">
                                                <span className={`inline-block px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider border rounded-full ${badgeClass}`}>
                                                    {statusText}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-6 text-brand-text-muted hidden md:table-cell select-none">{dateStr}</td>
                                            <td className="py-3.5 px-6 text-center select-none w-10">
                                                <button className="text-brand-text-muted hover:text-brand-foreground p-1 rounded transition cursor-pointer">
                                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-brand-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-[10px] text-brand-text-muted">
                        Showing {startResult} to {endResult} of {pagination.total} results
                    </div>
                    {pagination.lastPage > 1 && (
                        <div className="flex items-center gap-1.5 self-center sm:self-auto">
                            <button
                                disabled={pagination.page === 1}
                                onClick={() => onPageChange(pagination.page - 1)}
                                className="p-1 border border-brand-border/60 rounded hover:border-brand-border text-brand-text-muted hover:text-brand-foreground transition cursor-pointer select-none disabled:opacity-40"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {Array.from({ length: pagination.lastPage }, (_, idx) => idx + 1).map((pNum) => (
                                <button
                                    key={pNum}
                                    onClick={() => onPageChange(pNum)}
                                    className={`w-7 h-7 text-xs font-semibold rounded border transition cursor-pointer select-none ${pagination.page === pNum
                                            ? 'bg-brand-accent/20 border-brand-coral/50 text-brand-accent font-bold'
                                            : 'border-brand-border/60 text-brand-text-muted hover:border-brand-border hover:text-brand-foreground'
                                        }`}
                                >
                                    {pNum}
                                </button>
                            ))}
                            <button
                                disabled={pagination.page === pagination.lastPage}
                                onClick={() => onPageChange(pagination.page + 1)}
                                className="p-1 border border-brand-border/60 rounded hover:border-brand-border text-brand-text-muted hover:text-brand-foreground transition cursor-pointer select-none disabled:opacity-40"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}