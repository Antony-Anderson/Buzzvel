import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Register({ onRegisterSuccess, addToast, theme, toggleTheme, onGoToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            addToast('Passwords do not match.', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });
            const resJson = await response.json();
            if (response.ok) {
                addToast('Account created successfully!');
                if (onRegisterSuccess) onRegisterSuccess(resJson.data?.token);
            } else {
                const firstError =
                    resJson.message ||
                    (resJson.errors && Object.values(resJson.errors).flat()[0]) ||
                    'Registration failed. Please try again.';
                addToast(firstError, 'error');
            }
        } catch (err) {
            console.error('Register error:', err);
            addToast('Connection to server failed. Check your network.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative min-h-screen bg-brand-dark">
            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>

            <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-coral/10 blur-[120px] pointer-events-none top-1/4 left-1/4"></div>
            <div className="absolute w-[350px] h-[350px] rounded-full bg-brand-coral/5 blur-[100px] pointer-events-none bottom-1/4 right-1/4"></div>

            <div className="w-full max-w-[420px] bg-brand-card/90 border border-brand-border/60 rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-coral to-transparent"></div>

                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 bg-brand-coral flex items-center justify-center rounded-lg shadow-lg shadow-brand-coral/30">
                            <span className="text-white font-extrabold text-xl tracking-tighter">b</span>
                        </div>
                        <span className="text-2xl font-semibold tracking-tight text-brand-foreground">buzzvel</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight mt-2 text-brand-foreground">Create Account</h2>
                    <p className="text-xs text-brand-text-muted mt-1">Request access to the finance portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold tracking-widest text-brand-text-muted uppercase mb-1.5" htmlFor="register-name">
                            Full Name
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                id="register-name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                className="w-full bg-brand-input border border-brand-border/60 hover:border-brand-border focus:border-brand-coral/50 focus:ring-1 focus:ring-brand-coral/30 rounded-lg py-2.5 pl-10 pr-4 text-sm text-brand-foreground placeholder-brand-text-muted/50 outline-none transition duration-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold tracking-widest text-brand-text-muted uppercase mb-1.5" htmlFor="register-email">
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
                                id="register-email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@buzzvel.com"
                                className="w-full bg-brand-input border border-brand-border/60 hover:border-brand-border focus:border-brand-coral/50 focus:ring-1 focus:ring-brand-coral/30 rounded-lg py-2.5 pl-10 pr-4 text-sm text-brand-foreground placeholder-brand-text-muted/50 outline-none transition duration-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold tracking-widest text-brand-text-muted uppercase mb-1.5" htmlFor="register-password">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="register-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-brand-input border border-brand-border/60 hover:border-brand-border focus:border-brand-coral/50 focus:ring-1 focus:ring-brand-coral/30 rounded-lg py-2.5 pl-10 pr-10 text-sm text-brand-foreground placeholder-brand-text-muted/50 outline-none transition duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-text-muted hover:text-brand-foreground transition cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold tracking-widest text-brand-text-muted uppercase mb-1.5" htmlFor="register-password-confirmation">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </span>
                            <input
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                id="register-password-confirmation"
                                required
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-brand-input border border-brand-border/60 hover:border-brand-border focus:border-brand-coral/50 focus:ring-1 focus:ring-brand-coral/30 rounded-lg py-2.5 pl-10 pr-10 text-sm text-brand-foreground placeholder-brand-text-muted/50 outline-none transition duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-text-muted hover:text-brand-foreground transition cursor-pointer"
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
                        <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                        {!loading && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        )}
                    </button>
                </form>

                {onGoToLogin && (
                    <div className="mt-6 text-center">
                        <p className="text-[11px] text-brand-text-muted">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={onGoToLogin}
                                className="text-brand-coral hover:text-brand-coral-hover font-semibold transition cursor-pointer"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                )}

                <div className="mt-6 pt-6 border-t border-brand-border/40 text-center text-[10px] text-brand-text-muted/60 space-y-1.5">
                    <p>© 2026 buzzvel. All rights reserved.</p>
                </div>
            </div>

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