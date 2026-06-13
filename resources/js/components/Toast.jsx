import React from 'react';
export default function Toast({ message, type, onClose }) {
    React.useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const isSuccess = type === 'success';
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold shadow-xl border pointer-events-auto transition duration-300 transform translate-y-0 opacity-100 select-none ${isSuccess
                ? 'bg-[#121316] border-emerald-500/30 text-emerald-400'
                : 'bg-[#121316] border-red-500/30 text-red-400'
            }`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-auto text-brand-text-muted hover:text-white transition cursor-pointer">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}