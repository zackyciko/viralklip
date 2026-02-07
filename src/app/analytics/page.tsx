import Link from "next/link";

const topClips = [
    { id: 1, title: "Future of AI Gaming", platform: "TikTok", views: "2.4M", engagement: "18.2%", probability: "99%", color: "#FF0050", progress: 95, img: "https://i.pravatar.cc/100?u=11" },
    { id: 2, title: "Setup Wars: Ep 4", platform: "YouTube", views: "850K", engagement: "12.4%", probability: "84%", color: "#FF0000", progress: 84, img: "https://i.pravatar.cc/100?u=12" },
    { id: 3, title: "Coding ASMR 101", platform: "Instagram", views: "1.1M", engagement: "9.1%", probability: "72%", color: "#C13584", progress: 72, img: "https://i.pravatar.cc/100?u=13" },
];

export default function AnalyticsDashboard() {
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
                                { label: 'Viral Score', value: '98.4', trend: '+12%', color: 'text-primary' },
                                { label: 'Impressions', value: '12.4M', trend: '+45%', color: 'text-white' },
                                { label: 'Retention', value: '82.4%', trend: '+8%', color: 'text-secondary' },
                                { label: 'CTR', value: '14.2%', trend: '+2%', color: 'text-white' }
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

                                <div className="flex-grow relative mt-12">
                                    {/* Mock SVG Chart */}
                                    <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="rgba(0, 242, 255, 0.2)" />
                                                <stop offset="100%" stopColor="rgba(0, 242, 255, 0)" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M0 250 L100 200 L200 230 L350 120 L500 180 L650 60 L800 80 V300 H0 Z" fill="url(#chartGradient)" />
                                        <path d="M0 250 L100 200 L200 230 L350 120 L500 180 L650 60 L800 80" fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />

                                        {/* Grid Lines */}
                                        {[0, 50, 100, 150, 200, 250].map((y) => (
                                            <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="white" strokeOpacity="0.05" strokeWidth="1" />
                                        ))}

                                        {/* Active Node */}
                                        <circle cx="650" cy="60" r="6" fill="var(--background-dark)" stroke="var(--primary)" strokeWidth="3" />
                                        <circle cx="650" cy="60" r="12" fill="var(--primary)" fillOpacity="0.2" className="animate-ping" />
                                    </svg>

                                    <div className="flex justify-between mt-6 px-2">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                            <span key={day} className="text-[10px] font-black text-white/20 uppercase tracking-widest">{day}</span>
                                        ))}
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
                                        Your &quot;Tech Reviews&quot; segment is showing <span className="text-primary italic">high retention at 0:15</span>. Consider a pattern-break at that timestamp for future clips.
                                    </p>
                                </div>
                                <div className="glass-card rounded-2xl border-white/5 bg-secondary/[0.02] p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4">
                                        <span className="material-symbols-outlined text-secondary/40 group-hover:text-secondary transition-colors">tips_and_updates</span>
                                    </div>
                                    <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-4">Optimization Hack</h4>
                                    <p className="text-sm font-bold leading-relaxed">
                                        Switching your <span className="text-secondary italic">subtitles to &apos;Matrix Gloom&apos;</span> preset increased CTR by <span className="text-white">+14.2%</span> last 24h.
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

                            <div className="glass-card rounded-3xl border-white/5 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center p-8 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm group-hover:bg-background-dark/70 transition-all"></div>
                                <div className="relative z-10 space-y-4">
                                    <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] font-mono">Quantum Rewards</span>
                                    <h3 className="text-2xl font-display font-black uppercase tracking-tighter">Reach 100 Viral IQ</h3>
                                    <p className="text-[10px] font-bold text-white/50 uppercase leading-relaxed">
                                        Maintain an average Viral Score of 98 for <span className="text-white">48 hours</span> to unlock the &apos;Apex Creator&apos; badge.
                                    </p>
                                    <div className="pt-4">
                                        <div className="w-full h-2 bg-white/10 rounded-full">
                                            <div className="w-[85%] h-full bg-primary shadow-[0_0_15px_rgba(0,242,255,0.5)]"></div>
                                        </div>
                                    </div>
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {topClips.map((clip) => (
                                <div key={clip.id} className="group glass-card rounded-2xl border-white/5 p-5 space-y-4 hover:border-primary/20 transition-all">
                                    <div className="relative aspect-video rounded-xl overflow-hidden">
                                        <img src={clip.img} alt={clip.title} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                            <div className="size-8 rounded bg-primary/10 backdrop-blur-md flex items-center justify-center border border-primary/20">
                                                <span className="text-xs font-black text-primary">{clip.probability}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-white/70 uppercase">{clip.views} Views</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black uppercase tracking-widest truncate">{clip.title}</h4>
                                        <div className="flex items-center justify-between text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">
                                            <span style={{ color: clip.color }}>{clip.platform}</span>
                                            <span>{clip.engagement} Engagement</span>
                                        </div>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${clip.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
