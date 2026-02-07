"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";
import { useUser } from "@/hooks/useUser";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Dashboard() {
    const { projects, loading: projectsLoading, createProject } = useProjects();
    const { user, profile, loading: userLoading } = useUser();
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalClips: 0,
        avgViralScore: 0,
        creditsRemaining: 0,
    });

    useEffect(() => {
        if (projects && profile) {
            const totalClips = projects.reduce((sum, p) => sum + (p.clip_count || 0), 0);
            const avgScore = projects.length > 0
                ? projects.reduce((sum, p) => sum + (p.viral_score_avg || 0), 0) / projects.length
                : 0;

            setStats({
                totalProjects: projects.length,
                totalClips,
                avgViralScore: avgScore,
                creditsRemaining: profile.credits_remaining || 0,
            });
        }
    }, [projects, profile]);

    if (projectsLoading || userLoading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    const recentProjects = projects?.slice(0, 3) || [];

    return (
        <div className="bg-background-dark text-white font-body min-h-screen flex flex-col relative overflow-hidden">
            {/* Background VFX */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-float-1"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[130px] animate-float-2"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
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
                        {['Dashboard', 'Analytics', 'Templates', 'Leaderboard', 'Teams', 'Affiliate'].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase()}`}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${item === 'Dashboard' ? 'text-primary' : 'text-white/30 hover:text-white'
                                    }`}
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                            {profile?.subscription_tier || 'Free'}
                        </span>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                            Credits: {stats.creditsRemaining}
                        </span>
                    </div>
                    <Link
                        href="/settings"
                        className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:border-primary/30 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">settings</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-grow p-6 lg:p-12 overflow-y-auto custom-scrollbar">
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Welcome Section */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">
                                    Command Center
                                </span>
                            </div>
                            <h1 className="text-4xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-none">
                                Dashboard <br />
                                <span className="text-outline-neon">Overview</span>
                            </h1>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
                            {[
                                { label: 'Projects', value: stats.totalProjects },
                                { label: 'Viral Score', value: stats.avgViralScore.toFixed(1) },
                                { label: 'Total Clips', value: stats.totalClips },
                                { label: 'Credits', value: stats.creditsRemaining },
                            ].map((stat) => (
                                <div key={stat.label} className="px-6 py-6 glass-card rounded-2xl border-white/5 space-y-1">
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 block">
                                        {stat.label}
                                    </span>
                                    <span className="text-xl font-display font-black text-white">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link
                            href="/create"
                            className="p-6 glass-card rounded-2xl border-primary/30 hover:border-primary/50 transition-all group"
                        >
                            <span className="material-symbols-outlined text-4xl text-primary mb-3 block">add_circle</span>
                            <h3 className="font-display font-black uppercase text-sm mb-1">New Project</h3>
                            <p className="text-xs text-white/40">Start creating viral clips</p>
                        </Link>

                        <Link
                            href="/templates"
                            className="p-6 glass-card rounded-2xl border-white/10 hover:border-white/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-4xl text-secondary mb-3 block">collections</span>
                            <h3 className="font-display font-black uppercase text-sm mb-1">Templates</h3>
                            <p className="text-xs text-white/40">Browse viral templates</p>
                        </Link>

                        <Link
                            href="/analytics"
                            className="p-6 glass-card rounded-2xl border-white/10 hover:border-white/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-4xl text-accent mb-3 block">analytics</span>
                            <h3 className="font-display font-black uppercase text-sm mb-1">Analytics</h3>
                            <p className="text-xs text-white/40">Track performance</p>
                        </Link>

                        <Link
                            href="/pricing"
                            className="p-6 glass-card rounded-2xl border-white/10 hover:border-white/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-4xl text-white/60 mb-3 block">upgrade</span>
                            <h3 className="font-display font-black uppercase text-sm mb-1">Upgrade</h3>
                            <p className="text-xs text-white/40">Get more credits</p>
                        </Link>
                    </div>

                    {/* Recent Projects */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-display font-black uppercase tracking-tight">Recent Projects</h2>
                            <Link
                                href="/create"
                                className="px-4 py-2 bg-primary text-black rounded-xl font-display font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all"
                            >
                                New Project
                            </Link>
                        </div>

                        {recentProjects.length === 0 ? (
                            <div className="glass-card rounded-2xl p-12 text-center border-white/10">
                                <span className="material-symbols-outlined text-6xl text-white/20 mb-4 block">video_library</span>
                                <h3 className="font-display font-black uppercase text-lg mb-2">No Projects Yet</h3>
                                <p className="text-white/40 mb-6">Create your first viral clip project</p>
                                <Link
                                    href="/create"
                                    className="inline-block px-6 py-3 bg-primary text-black rounded-xl font-display font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all"
                                >
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {recentProjects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/editor/${project.id}`}
                                        className="glass-card rounded-2xl p-6 border-white/10 hover:border-primary/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-xl bg-white/5 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-4xl text-primary">movie</span>
                                            </div>

                                            <div className="flex-grow">
                                                <h3 className="font-display font-black uppercase text-lg mb-1 group-hover:text-primary transition-colors">
                                                    {project.video_title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-xs text-white/40">
                                                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span className={`px-2 py-1 rounded ${project.status === 'completed' ? 'bg-primary/20 text-primary' :
                                                            project.status === 'processing' ? 'bg-secondary/20 text-secondary' :
                                                                'bg-white/10 text-white/60'
                                                        }`}>
                                                        {project.status}
                                                    </span>
                                                    {project.clip_count > 0 && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{project.clip_count} clips</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <span className="material-symbols-outlined text-2xl text-white/20 group-hover:text-primary transition-colors">
                                                arrow_forward
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
