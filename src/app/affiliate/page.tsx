import Link from "next/link";

const payoutHistory = [
    { id: 1, date: "Feb 01, 2026", amount: "Rp 2,500,000", status: "Neural Paid", color: "primary" },
    { id: 2, date: "Jan 15, 2026", amount: "Rp 1,800,000", status: "Neural Paid", color: "primary" },
    { id: 3, date: "Jan 02, 2026", amount: "Rp 3,200,000", status: "Neural Paid", color: "primary" },
];

export default function AffiliateDashboard() {
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
                        <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">Lobby</Link>
                        <Link href="/affiliate" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary transition-colors">Affiliates</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <button className="px-5 py-2 glass-card rounded-xl border-white/10 hover:border-primary/30 transition-all text-[10px] font-black uppercase tracking-widest">
                        Withdraw Alpha
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-grow p-6 lg:p-12 overflow-y-auto custom-scrollbar">
                <div className="max-w-7xl mx-auto space-y-12">

                    {/* Hero Section */}
                    <div className="flex flex-col lg:row items-center justify-between gap-12">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Referral Matrix v1.0</span>
                            </div>
                            <h1 className="text-4xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-none">
                                Affiliate <br />
                                <span className="text-outline-neon">Portal</span>
                            </h1>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
                            {[
                                { label: 'Unpaid Commissions', value: 'Rp 1.4M' },
                                { label: 'Total Earned', value: 'Rp 28.5M' },
                                { label: 'Active Matrix', value: '42' },
                                { label: 'Growth Factor', value: '+14%' }
                            ].map((stat) => (
                                <div key={stat.label} className="px-6 py-6 glass-card rounded-2xl border-white/5 space-y-1">
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 block">{stat.label}</span>
                                    <span className="text-xl font-display font-black text-white">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Col: Referral Link & Stats */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="p-8 glass-card rounded-3xl border-primary/20 bg-primary/5 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-display font-black uppercase tracking-tight">Your Referral Link</h3>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">12% Commission Tier</span>
                                </div>
                                <div className="flex gap-4">
                                    <input
                                        readOnly
                                        value="viralklip.com/ref/matrix_alpha_99"
                                        className="flex-grow bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white/80 focus:outline-none"
                                    />
                                    <button className="px-8 py-4 bg-primary text-black font-display font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">
                                        Copy
                                    </button>
                                </div>
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em]">
                                    Invite creators to ViralKlip and earn life-time commissions on every credit pack they sync.
                                </p>
                            </div>

                            <div className="p-8 glass-card rounded-3xl border-white/5 space-y-8">
                                <h3 className="text-xl font-display font-black uppercase tracking-tight">Matrix Performance</h3>
                                <div className="h-64 relative border-l border-b border-white/10 flex items-end justify-between px-4 pb-2">
                                    <div className="absolute inset-0 bg-[linear-gradient(to_top,#80808005_1px,transparent_1px)] bg-[size:100%_20px]"></div>
                                    {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                                        <div key={i} className="w-12 bg-primary/20 border-t-2 border-primary relative group cursor-help transition-all hover:bg-primary/40" style={{ height: `${h}%` }}>
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {h * 10} Syncs
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Col: Payout History */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="p-8 glass-card rounded-3xl border-white/5 h-full space-y-8">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black uppercase tracking-widest">Payout History</h3>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Completed Transactions</p>
                                </div>

                                <div className="space-y-4">
                                    {payoutHistory.map((p) => (
                                        <div key={p.id} className="p-4 glass-card rounded-2xl border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{p.date}</span>
                                                <p className="text-sm font-black text-white">{p.amount}</p>
                                            </div>
                                            <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 glass-card rounded-2xl bg-secondary/10 border-secondary/20 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-secondary">redeem</span>
                                        <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest">Alpha Bonus</h4>
                                    </div>
                                    <p className="text-[10px] font-bold text-white/50 uppercase leading-relaxed">
                                        Refer 10 creators this week to unlock the <span className="text-white">Apex Commission</span> tier (15%).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
