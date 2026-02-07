"use client";

import Link from "next/link";
import { useAnalytics } from "@/hooks/useAnalytics";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AnalyticsDashboard() {
    const { analytics, loading } = useAnalytics();

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className="bg-background-dark text-white font-body min-h-screen flex flex-col relative overflow-hidden">
            {/* Background VFX */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-float-1"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[130px] animate-float-2"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>

            {/* Header */}
            <header className="relative z-50 border-b border-white/5 bg-background-dark/50 backdrop-blur-xl px-6 lg:px-12 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="size-8 bg-primary/10 rounded flex items-center justify-center border border-primary/30 group-hover:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all">
                        <span className="material-symbols-outlined text-primary text-xl font-bold">bolt</span>
                    </div>
                    <h2 className="text-white text-lg font-display font-black tracking-tighter uppercase">ViralKlip</h2>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Neural Analysis</span>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Real-time Matrix Feed</span>
                    </div>
                    <button className="px-4 py-2 glass-card rounded-xl border-white/10 hover:border-primary/30 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest">Generate Report</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-grow p-6 lg:p-12 overflow-y-auto custom-scrollbar">
                <div className="max-w-7xl mx-auto space-y-12">

                    {/* Hero Section */}
                    <div className="flex flex-col lg:row items-center justify-between gap-12">
                        <div className="space-y-4 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <span className="size-1.5 bg-primary rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Deep Scan Active</span>
                            </div>
                            <h1 className="text-4xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-none">
                                Viral <br />
                                <span className="text-outline-neon">Intelligence</span>
                            </h1>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
                            {[
                                { label: 'Viral Score', value: analytics.avgViralScore.toFixed(1), trend: 'Avg', color: 'text-primary' },
                                { label: 'Total Clips', value: analytics.totalClips.toString(), trend: 'Count', color: 'text-white' },
                                { label: 'Projects', value: analytics.totalProjects.toString(), trend: 'Total', color: 'text-secondary' },
                                { label: 'Pred. Views', value: analytics.totalPredictedViews.toLocaleString(), trend: 'Est', color: 'text-white' }
                            ].map((stat) => (
                                <div key={stat.label} className="px-6 py-6 glass-card rounded-2xl border-white/5 space-y-2">
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 block">{stat.label}</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-2xl font-display font-black ${stat.color}`}>{stat.value}</span>
                                        <span className="text-[10px] font-black text-primary">{stat.trend}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Analytics Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Main Trend Map */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <div className="glass-card rounded-3xl border-white/5 p-8 flex flex-col h-[500px]">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black uppercase tracking-widest">Growth Matrix</h3>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Historical Performance Node</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {['1D', '1W', '1M', 'ALL'].map((t) => (
                                            <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${t === '1W' ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10 text-white/40'}`}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-grow relative mt-12 flex items-center justify-center">
                                    {/* Placeholder for Chart - Real implementation would use Recharts or Chart.js */}
                                    <div className="text-center opacity-50">
                                        <span className="material-symbols-outlined text-6xl text-primary/30 mb-4 block">query_stats</span>
                                        <p className="text-xs font-bold uppercase tracking-widest text-white/50">Chart data requires more history</p>
                                    </div>
                                </div>
                            </div>

                            {/* Insights Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card rounded-2xl border-white/5 bg-primary/[0.02] p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4">
                                        <span className="material-symbols-outlined text-primary/40 group-hover:text-primary transition-colors">auto_awesome</span>
                                    </div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Neural Insight</h4>
                                    <p className="text-sm font-bold leading-relaxed">
                                        {analytics.avgViralScore > 8 ?
                                            "Your content is performing exceptionally well. Continue adhering to the current style patterns." :
                                            "Consider increasing the pacing of your edits to boost retention rates."
                                        }
                                    </p>
                                </div>
                                <div className="glass-card rounded-2xl border-white/5 bg-secondary/[0.02] p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4">
                                        <span className="material-symbols-outlined text-secondary/40 group-hover:text-secondary transition-colors">tips_and_updates</span>
                                    </div>
                                    <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-4">Optimization Hack</h4>
                                    <p className="text-sm font-bold leading-relaxed">
                                        Using <span className="text-secondary italic">dynamic captions</span> has shown a 40% increase in view retention across the platform.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Side Analytics */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="glass-card rounded-3xl border-white/5 p-8 space-y-8">
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-widest mb-1">Source Distribution</h3>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Traffic Origin Nodes</p>
                                </div>

                                <div className="space-y-6">
                                    {/* Static for now as we don't track platforms yet */}
                                    {[
                                        { label: 'TikTok Feed', value: '45%', color: 'bg-primary' },
                                        { label: 'YT Shorts', value: '32%', color: 'bg-white' },
                                        { label: 'IG Reels', value: '23%', color: 'bg-secondary' }
                                    ].map((source) => (
                                        <div key={source.label} className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span>{source.label}</span>
                                                <span className="text-white/40">{source.value}</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full ${source.color} rounded-full`} style={{ width: source.value }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                    <Link href="/create" className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all">
                                        Run Distribution Scan
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ranking Matrix */}
                    <div className="glass-card rounded-3xl border-white/5 p-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-display font-black uppercase tracking-tighter">Neural Top Clips</h3>
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">High Probability Viral Nodes</p>
                            </div>
                            <Link href="/leaderboard" className="text-[10px] font-black text-primary uppercase tracking-widest px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary hover:text-black transition-all">
                                Full Matrix View
                            </Link>
                        </div>

                        {analytics.clips.length === 0 ? (
                            <div className="text-center py-12 text-white/30">
                                <p>No clip data available yet. Start a project to see analytics.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {analytics.clips.map((clip: any) => (
                                    <div key={clip.id} className="group glass-card rounded-2xl border-white/5 p-5 space-y-4 hover:border-primary/20 transition-all">
                                        <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black">
                                            {clip.thumbnail_url ? (
                                                <img src={clip.thumbnail_url} alt="Thumbnail" className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full bg-white/5">
                                                    <span className="material-symbols-outlined text-white/20 text-4xl">movie</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                                <div className="size-8 rounded bg-primary/10 backdrop-blur-md flex items-center justify-center border border-primary/20">
                                                    <span className="text-xs font-black text-primary">{clip.viral_score?.toFixed(1) || '0.0'}</span>
                                                </div>
                                                <span className="text-[10px] font-black text-white/70 uppercase">{clip.view_prediction || 0} Est. Views</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black uppercase tracking-widest truncate">{clip.projects?.video_title || 'Untitled Clip'}</h4>
                                            <div className="flex items-center justify-between text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">
                                                <span>{new Date(clip.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${(clip.viral_score || 0) * 10}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
