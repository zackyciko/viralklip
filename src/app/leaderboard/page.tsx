import Link from "next/link";

const leaderboardData = [
    { rank: 1, creator: "DigitalFlow", score: 124500, status: "Apex", trend: "+12%", img: "https://i.pravatar.cc/100?u=1" },
    { rank: 2, creator: "NeonHustle", score: 98400, status: "Master", trend: "+8%", img: "https://i.pravatar.cc/100?u=2" },
    { rank: 3, creator: "CyberVibe", score: 89200, status: "Master", trend: "+24%", img: "https://i.pravatar.cc/100?u=3" },
    { rank: 4, creator: "MarcoEditZ", score: 72100, status: "Diamond", trend: "-2%", img: "https://i.pravatar.cc/100?u=4" },
    { rank: 5, creator: "Alex_Streams", score: 65800, status: "Diamond", trend: "+15%", img: "https://i.pravatar.cc/100?u=5" },
];

export default function Leaderboard() {
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
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Season 04 Matrix</span>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Ends in 12:04:22:15</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-grow p-6 lg:p-12 overflow-y-auto custom-scrollbar">
                <div className="max-w-6xl mx-auto space-y-16">

                    {/* Title & Stats Grid */}
                    <div className="flex flex-col lg:row items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                                <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Global Ranking Alpha</span>
                            </div>
                            <h1 className="text-4xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-none">
                                Viral <br />
                                <span className="text-outline-neon">Leaderboard</span>
                            </h1>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full lg:w-auto">
                            {[
                                { label: 'Total Clips', value: '1.2M+' },
                                { label: 'Avg Viral IQ', value: '88.4' },
                                { label: 'Rewards Pool', value: 'Rp 500jt' }
                            ].map((stat) => (
                                <div key={stat.label} className="px-6 py-4 glass-card rounded-2xl border-white/5 text-center sm:text-left">
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 block mb-1">{stat.label}</span>
                                    <span className="text-xl font-display font-black text-white">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Podium Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pb-12 border-b border-white/5">
                        {/* Rank 2 */}
                        <div className="order-2 md:order-1 space-y-6">
                            <div className="relative group text-center space-y-4">
                                <div className="size-24 mx-auto rounded-full border-2 border-white/20 p-1 relative z-10">
                                    <img src={leaderboardData[1].img} alt="Rank 2" className="rounded-full size-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    <div className="absolute -bottom-2 right-0 size-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center font-display font-black text-sm">2</div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black uppercase tracking-widest">{leaderboardData[1].creator}</h3>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{leaderboardData[1].score.toLocaleString()} PTS</p>
                                </div>
                                <div className="h-[120px] glass-card rounded-t-2xl border-white/10 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/5"></div>
                                </div>
                            </div>
                        </div>

                        {/* Rank 1 */}
                        <div className="order-1 md:order-2 space-y-6 -mb-6 relative z-20">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-primary animate-bounce">
                                <span className="material-symbols-outlined text-4xl">crown</span>
                            </div>
                            <div className="relative group text-center space-y-4">
                                <div className="size-32 mx-auto rounded-full border-4 border-primary p-1.5 relative z-10 shadow-[0_0_30px_rgba(0,242,255,0.2)]">
                                    <img src={leaderboardData[0].img} alt="Rank 1" className="rounded-full size-full object-cover" />
                                    <div className="absolute -bottom-2 right-0 size-10 bg-primary text-black border-4 border-background-dark rounded-full flex items-center justify-center font-display font-black text-lg">1</div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-display font-black uppercase tracking-tighter text-glow">{leaderboardData[0].creator}</h3>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                                        <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">{leaderboardData[0].status} Tier</span>
                                    </div>
                                </div>
                                <div className="h-[200px] glass-card rounded-t-3xl border-primary/30 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/5"></div>
                                    <div className="absolute top-8 left-0 right-0 text-center space-y-1">
                                        <p className="text-2xl font-display font-black text-white">{leaderboardData[0].score.toLocaleString()}</p>
                                        <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Matrix Credits</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rank 3 */}
                        <div className="order-3 space-y-6">
                            <div className="relative group text-center space-y-4">
                                <div className="size-24 mx-auto rounded-full border-2 border-secondary/40 p-1 relative z-10">
                                    <img src={leaderboardData[2].img} alt="Rank 3" className="rounded-full size-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    <div className="absolute -bottom-2 right-0 size-8 bg-secondary/20 backdrop-blur-xl border border-secondary/40 rounded-full flex items-center justify-center font-display font-black text-sm">3</div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black uppercase tracking-widest">{leaderboardData[2].creator}</h3>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{leaderboardData[2].score.toLocaleString()} PTS</p>
                                </div>
                                <div className="h-[100px] glass-card rounded-t-2xl border-white/10 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/5"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ranking Table */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-4 px-8 pb-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                            <div className="col-span-2">Creator Matrix</div>
                            <div className="text-right">Growth</div>
                            <div className="text-right">Credits</div>
                        </div>

                        {leaderboardData.slice(3).map((item) => (
                            <div key={item.rank} className="group glass-card rounded-2xl border-white/5 px-8 py-5 flex items-center justify-between hover:border-white/20 transition-all hover:translate-x-1">
                                <div className="flex items-center gap-6 col-span-2">
                                    <span className="text-xs font-black text-white/20 group-hover:text-primary transition-colors">#{item.rank}</span>
                                    <div className="size-10 rounded-xl bg-white/5 p-0.5 overflow-hidden">
                                        <img src={item.img} alt={item.creator} className="size-full object-cover rounded-lg" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-sm font-black uppercase tracking-widest">{item.creator}</h4>
                                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{item.status} Rank</span>
                                    </div>
                                </div>
                                <div className="flex gap-16 items-center">
                                    <div className="text-right">
                                        <span className={`text-[10px] font-black tracking-widest ${item.trend.startsWith('+') ? 'text-primary' : 'text-red-400'}`}>
                                            {item.trend}
                                        </span>
                                    </div>
                                    <div className="text-right min-w-[80px]">
                                        <span className="text-sm font-display font-black">{item.score.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Invite Ticker */}
                    <div className="p-8 glass-card rounded-3xl border-primary/20 bg-primary/5 flex flex-col md:row items-center justify-between gap-8 relative overflow-hidden">
                        <div className="absolute top-0 right-10 size-40 bg-primary rounded-full blur-[100px] opacity-10"></div>
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-xl font-display font-black uppercase tracking-tighter">Ready to top the matrix?</h3>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Generate more clips to earn season credits</p>
                        </div>
                        <Link href="/create" className="px-8 py-4 bg-primary text-black font-display font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)] relative z-10">
                            Start Processing
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
