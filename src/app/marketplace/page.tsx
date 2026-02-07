"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const MARKETPLACE_CLIPS = [
    { id: 1, title: "Cyber Glitch Vibe", stats: "124k Jobs", growth: "+42%", creator: "NeonX", img: "https://i.pravatar.cc/300?u=m1", aspect: "aspect-[9/16]" },
    { id: 2, title: "Podcast Neural Node", stats: "82k Jobs", growth: "+18%", creator: "PodCuts", img: "https://i.pravatar.cc/300?u=m2", aspect: "aspect-[4/5]" },
    { id: 3, title: "Cinematic Void", stats: "45k Jobs", growth: "+92%", creator: "GlassLab", img: "https://i.pravatar.cc/300?u=m3", aspect: "aspect-video" },
    { id: 4, title: "Hormozi Kinetic V2", stats: "210k Jobs", growth: "+12%", creator: "Sarah K.", img: "https://i.pravatar.cc/300?u=m4", aspect: "aspect-[9/16]" },
    { id: 5, title: "Minimal Matrix", stats: "12k Jobs", growth: "+114%", creator: "ZeroOne", img: "https://i.pravatar.cc/300?u=m5", aspect: "aspect-[9/16]" },
    { id: 6, title: "Neon Pulse High", stats: "67k Jobs", growth: "+29%", creator: "VibeSync", img: "https://i.pravatar.cc/300?u=m6", aspect: "aspect-[9/16]" },
];

export default function MarketplacePage() {
    const [loading, setLoading] = useState(true);
    const [clips, setClips] = useState<any[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setClips(MARKETPLACE_CLIPS);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="bg-background-dark text-white font-body min-h-screen flex flex-col relative overflow-hidden">
            {/* Background VFX */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px] animate-float-1"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[130px] animate-float-2"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.03)_0%,transparent_70%)]"></div>
            </div>

            {/* Header */}
            <header className="relative z-50 border-b border-white/5 bg-background-dark/50 backdrop-blur-xl px-6 lg:px-12 py-4 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="size-8 bg-primary/10 rounded flex items-center justify-center border border-primary/30 group-hover:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all">
                            <span className="material-symbols-outlined text-primary text-xl font-bold">bolt</span>
                        </div>
                        <h2 className="text-white text-lg font-display font-black tracking-tighter uppercase">ViralKlip</h2>
                    </Link>
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">Lobby</Link>
                        <Link href="/marketplace" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary transition-colors">Marketplace</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                            <span className="material-symbols-outlined text-[18px]">search</span>
                        </span>
                        <input
                            className="w-64 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest placeholder-white/20 focus:outline-none focus:border-primary/30 transition-all"
                            placeholder="Deep Scan Community..."
                            type="text"
                        />
                    </div>
                    <button className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:border-primary/30 transition-all relative">
                        <span className="material-symbols-outlined text-xl">favorite</span>
                        <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full text-[8px] flex items-center justify-center font-black">4</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-grow p-6 lg:p-12 overflow-y-auto custom-scrollbar">
                <div className="max-w-7xl mx-auto space-y-16">

                    {/* Section Header */}
                    <div className="flex flex-col lg:row items-end justify-between gap-8 pb-12 border-b border-white/5">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Discovery Mode Alpha</span>
                            </div>
                            <h1 className="text-4xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-none">
                                Neural <br />
                                <span className="text-outline-neon">Archives</span>
                            </h1>
                        </div>

                        <div className="flex gap-4">
                            {['Trending', 'Most Cloned', 'New Syncs'].map((f) => (
                                <button key={f} className="px-6 py-3 glass-card rounded-2xl border-white/5 text-[10px] font-black uppercase tracking-widest hover:border-primary/30 transition-all">
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Asset Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {clips.map((clip) => (
                            <div key={clip.id} className="group glass-card rounded-3xl border-white/5 p-4 space-y-6 hover:border-primary/30 transition-all relative">
                                <div className={`relative ${clip.aspect} rounded-2xl overflow-hidden bg-white/5`}>
                                    <img src={clip.img} alt={clip.title} className="size-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-60"></div>

                                    <div className="absolute top-4 left-4 flex items-center gap-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                                        <span className="text-primary text-[10px] font-black tracking-widest">{clip.growth} Growth</span>
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                        <button className="flex-grow py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary transition-colors">
                                            Clone Node
                                        </button>
                                        <button className="size-10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                                            <span className="material-symbols-outlined">share</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-black uppercase tracking-widest truncate">{clip.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Creator: {clip.creator}</span>
                                            <span className="text-[8px] font-black text-primary uppercase tracking-widest">{clip.stats}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Creator Billboard */}
                    <div className="p-16 glass-card rounded-[3rem] border-secondary/20 bg-secondary/5 relative overflow-hidden flex flex-col items-center text-center space-y-8">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 size-96 bg-secondary/10 rounded-full blur-[140px]"></div>
                        <div className="space-y-4 max-w-2xl relative z-10">
                            <h2 className="text-4xl lg:text-6xl font-display font-black uppercase tracking-tighter">Become a <span className="text-outline-neon">Matrix Creator</span></h2>
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-relaxed">
                                Upload your handcrafted kinetic templates to the marketplace and earn neural rewards for every project sync worldwide.
                            </p>
                        </div>
                        <button className="px-12 py-6 bg-secondary text-white font-display font-black uppercase tracking-[0.3em] text-sm hover:scale-105 transition-all shadow-[0_0_40px_rgba(123,47,247,0.4)] relative z-10 rounded-2xl">
                            Open Creative Portal
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
