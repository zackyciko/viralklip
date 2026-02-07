"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="bg-background-dark text-white font-body min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background VFX */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[150px] animate-float-1"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[130px] animate-float-2"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>

            <div className="relative z-10 text-center space-y-8 p-8 max-w-2xl">
                <div className="space-y-4">
                    <div className="flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-500 text-8xl animate-pulse">error</span>
                    </div>
                    <h1 className="text-5xl font-display font-black uppercase tracking-tight">System Error</h1>
                    <p className="text-sm text-white/40 font-bold uppercase tracking-widest">
                        Neural pathway disrupted
                    </p>
                    {error.message && (
                        <div className="p-6 glass-card rounded-2xl border-red-500/20 bg-red-500/5">
                            <p className="text-xs font-mono text-red-500">{error.message}</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-12 py-5 bg-primary text-black font-display font-black uppercase tracking-[0.3em] text-sm rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(0,242,255,0.3)]"
                    >
                        Retry Connection
                    </button>
                    <a
                        href="/dashboard"
                        className="px-12 py-5 glass-card rounded-2xl border-white/10 font-display font-black uppercase tracking-[0.3em] text-sm hover:border-primary/30 transition-all"
                    >
                        Return to Matrix
                    </a>
                </div>
            </div>
        </div>
    );
}
