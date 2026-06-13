import React, { useState } from 'react';
export default function Login({ onLoginSuccess, addToast }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const resJson = await response.json();
            if (response.ok) {
                addToast('Login successful!');
                onLoginSuccess(resJson.data.token);
            } else {
                addToast(resJson.message || 'Invalid credentials. Please try again.', 'error');
            }
        } catch (err) {
            console.error('Login error:', err);
            addToast('Connection to server failed. Check your network.', 'error');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
            {/* Background glow effects */}
            <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-coral/10 blur-[120px] pointer-events-none top-1/4 left-1/4"></div>
            <div className="absolute w-[350px] h-[350px] rounded-full bg-brand-coral/5 blur-[100px] pointer-events-none bottom-1/4 right-1/4"></div>
            <div className="w-full max-w-[420px] bg-brand-card/90 border border-brand-border/60 rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
                {/* Top Accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-coral to-transparent"></div>
                {/* Logo Branding */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 bg-brand-coral flex items-center justify-center rounded-lg shadow-lg shadow-brand-coral/30">
                            <span className="text-white font-extrabold text-xl tracking-tighter">b</span>
                        </div>
                        <span className="text-2xl font-semibold tracking-tight text-white">buzzvel</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight mt-2 text-white">Finance Portal</h2>
                    <p className="text-xs text-brand-text-muted mt-1">Secure access to payment requests</p>
                </div>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold tracking-widest text-brand-text-muted uppercase mb-1.5" htmlFor="login-email">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                id="login-email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@buzzvel.com"
                                className="w-full bg-brand-input border border-brand-border/60 hover:border-brand-border focus:border-brand-coral/50 focus:ring-1 focus:ring-brand-coral/30 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-brand-text-muted/50 outline-none transition duration-200"
                            />
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between mb-1.5">
                            <label className="block text-[10px] font-bold tracking-widest text-brand-text-muted uppercase" htmlFor="login-password">
                                Password
                            </label>
                            <a href="#" className="text-[10px] text-brand-coral hover:text-brand-coral-hover font-semibold transition">
                                Forgot?
                            </a>
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="login-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-brand-input border border-brand-border/60 hover:border-brand-border focus:border-brand-coral/50 focus:ring-1 focus:ring-brand-coral/30 rounded-lg py-2.5 pl-10 pr-10 text-sm text-white placeholder-brand-text-muted/50 outline-none transition duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-text-muted hover:text-white transition cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-brand-coral to-[#ff6b6b] hover:from-[#ff6b6b] hover:to-[#ff8888] text-white py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-coral/20 transition-all duration-300 hover:scale-[1.01] glow-coral-sm disabled:opacity-50"
                    >
                        <span>{loading ? 'Logging in...' : 'Login'}</span>
                        {!loading && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        )}
                    </button>
                </form>
                <div className="mt-8 pt-6 border-t border-brand-border/40 text-center text-[10px] text-brand-text-muted/60 space-y-1.5">
                    <p>© 2026 buzzvel. All rights reserved.</p>
                </div>
            </div>
            {/* Virtues branding */}
            <div className="mt-12 flex items-center justify-center gap-6 text-[10px] font-bold tracking-[0.2em] text-brand-text-muted/40">
                <span>PRECISION</span>
                <span className="w-1 h-1 rounded-full bg-brand-text-muted/20"></span>
                <span>AUTHORITY</span>
                <span className="w-1 h-1 rounded-full bg-brand-text-muted/20"></span>
                <span>CLARITY</span>
            </div>
        </div>
    );
}
