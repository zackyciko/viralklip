"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        const supabase = createClient();

        const origin = window.location.hostname.includes('localhost')
            ? 'http://localhost:3000'
            : 'https://viralklip.vercel.app';

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-dark text-white font-body min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background VFX */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-float-1"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[130px] animate-float-2"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-8">
                <div className="glass-card rounded-3xl border-white/5 p-12 space-y-8">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3">
                        <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30">
                            <span className="material-symbols-outlined text-primary text-2xl font-bold">bolt</span>
                        </div>
                        <h2 className="text-white text-2xl font-display font-black tracking-tighter uppercase">ViralKlip</h2>
                    </div>

                    {/* Title */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-display font-black uppercase tracking-tight">Create Matrix</h1>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Initialize Your Node</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-xs font-bold text-red-500 uppercase">{error}</p>
                        </div>
                    )}

                    {/* Signup Form */}
                    <form onSubmit={handleEmailSignup} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Identity Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary/30 transition-all"
                                placeholder="Your Name"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Email Node</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary/30 transition-all"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Access Key</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary/30 transition-all"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                            <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Min 6 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-black font-display font-black uppercase tracking-[0.2em] text-sm rounded-xl hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating..." : "Initialize Node"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest">
                            <span className="bg-background-dark px-4 text-white/30">Or Continue With</span>
                        </div>
                    </div>

                    {/* Google OAuth */}
                    <button
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="w-full py-4 glass-card rounded-xl border-white/10 text-[10px] font-black uppercase tracking-widest hover:border-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-xl">account_circle</span>
                        Google Matrix
                    </button>

                    {/* Login Link */}
                    <div className="text-center pt-4">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                            Already Have Node?{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                Access Matrix
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
