import Link from "next/link";

export default function SettingsPage() {
    return (
        <div className="bg-background-dark text-white font-body min-h-screen flex flex-col relative overflow-hidden">
            {/* Background VFX */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-float-1"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[130px] animate-float-2"></div>
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
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
                        <Link href="/settings" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary transition-colors">Admin Node</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <button className="px-5 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                        Terminate Session
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-grow p-6 lg:p-12 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Hero Section */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Identity Matrix v2.4</span>
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-none">
                            Node <br />
                            <span className="text-outline-neon">Parameters</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        {/* Nav Rail */}
                        <div className="md:col-span-3 space-y-4">
                            {[
                                { icon: 'person', label: 'Profile' },
                                { icon: 'shield', label: 'Security' },
                                { icon: 'payments', label: 'Billing' },
                                { icon: 'api', label: 'Matrix Keys' },
                                { icon: 'notifications', label: 'Notifications' }
                            ].map((item) => (
                                <button key={item.label} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all ${item.label === 'Profile' ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-transparent border-transparent text-white/30 hover:text-white hover:bg-white/5'}`}>
                                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="md:col-span-9 space-y-12 pb-20">
                            {/* Profile Section */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-8 pb-8 border-b border-white/5">
                                    <div className="size-24 rounded-3xl overflow-hidden border border-primary/20 p-1 relative">
                                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" alt="Avatar" className="size-full object-cover rounded-2xl" />
                                        <button className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white">photo_camera</span>
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-display font-black uppercase tracking-tight">Identity Node #9942</h3>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Global Ranking: #124</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Matrix Username</label>
                                        <input className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary/30 transition-all" value="NeonHustle_Alpha" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Contact Node (Email)</label>
                                        <input className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary/30 transition-all font-mono" value="alex@matrix.sync" />
                                    </div>
                                    <div className="sm:col-span-2 space-y-3">
                                        <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Neural Bio</label>
                                        <textarea className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary/30 transition-all h-32 resize-none" defaultValue="Building the next generation of viral artifacts using high-retention matrixes." />
                                    </div>
                                </div>
                            </section>

                            {/* Account Tier */}
                            <section className="p-8 glass-card rounded-3xl border-secondary/20 bg-secondary/5 space-y-6 relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 size-40 bg-secondary/10 rounded-full blur-[80px]"></div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-display font-black uppercase tracking-tight text-white">Subscription Node</h4>
                                        <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Current Plan: Creator Pro</p>
                                    </div>
                                    <button className="px-8 py-3 bg-secondary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(123,47,247,0.3)]">
                                        Modify Tier
                                    </button>
                                </div>
                                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest relative z-10">
                                    <span>Neural Reset in 12 days</span>
                                    <span>Next Cycle: Rp 249,000</span>
                                </div>
                            </section>

                            {/* Danger Zone */}
                            <section className="pt-12 border-t border-white/5 space-y-6">
                                <h3 className="text-xl font-display font-black uppercase tracking-tight text-red-500/80">Danger Parameters</h3>
                                <div className="p-8 border border-red-500/20 rounded-3xl space-y-6 bg-red-500/5">
                                    <p className="text-[10px] font-bold text-white/50 uppercase leading-relaxed tracking-wider">
                                        Initializing the liquidation request will permanently delete all Neural Syncs and history. This action is not reversible within the Matrix.
                                    </p>
                                    <button className="px-8 py-4 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500/10 transition-all">
                                        Liquidate Identity Node
                                    </button>
                                </div>
                            </section>

                            <div className="flex justify-end pt-12">
                                <button className="px-12 py-5 bg-white text-black font-display font-black uppercase tracking-[0.3em] text-sm rounded-2xl hover:bg-primary transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                    Apply Parameters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
