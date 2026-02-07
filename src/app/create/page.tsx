import Link from "next/link";

export default function CreateProject() {
    return (
        <div className="bg-background-dark text-white font-body min-h-screen flex flex-col relative overflow-hidden">
            {/* Background VFX */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-float-1"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[130px] animate-float-2"></div>
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

                <div className="hidden lg:flex items-center gap-8">
                    <nav className="flex items-center gap-8">
                        {['Dashboard', 'Projects', 'Templates', 'Analytics'].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase()}`} className="text-[10px] font-black tracking-[0.2em] uppercase text-white/50 hover:text-primary transition-colors">
                                {item}
                            </Link>
                        ))}
                    </nav>
                    <div className="h-4 w-px bg-white/10"></div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">PRO Account</span>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">124 Credits Left</span>
                        </div>
                        <div className="size-10 rounded-full border-2 border-primary/20 p-0.5">
                            <img src="https://i.pravatar.cc/100?u=me" alt="Avatar" className="rounded-full h-full w-full object-cover" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-grow flex flex-col lg:row overflow-hidden">
                {/* Workspace Area */}
                <div className="flex-grow p-6 lg:p-12 overflow-y-auto custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-12">

                        {/* Title Section */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                                <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Neural Engine Active</span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-display font-black uppercase tracking-tighter leading-none">
                                Mulai Proyek <br />
                                <span className="text-outline-neon">Baru Anda</span>
                            </h1>
                            <p className="text-white/40 font-medium max-w-xl leading-relaxed">
                                Visualisasikan konten Anda. AI kami akan memproses setiap frame untuk menemukan momen paling berdampak untuk audiens Anda.
                            </p>
                        </div>

                        {/* Upload Matrix */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Drop Zone */}
                            <div className="group relative aspect-video md:aspect-auto md:h-[320px] glass-card rounded-2xl border-white/5 hover:border-primary/40 transition-all duration-500 flex flex-col items-center justify-center p-8 gap-6 overflow-hidden">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,242,255,0.1)]">
                                    <span className="material-symbols-outlined text-primary text-3xl font-bold">upload_file</span>
                                </div>
                                <div className="text-center space-y-1">
                                    <h3 className="text-sm font-black uppercase tracking-widest">Drop Video File</h3>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">MP4, MOV up to 2GB</p>
                                </div>
                                <button className="relative px-6 py-2 bg-white/5 border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black hover:border-primary transition-all">
                                    Browse Files
                                </button>
                            </div>

                            {/* YouTube Import */}
                            <div className="relative aspect-video md:aspect-auto md:h-[320px] glass-card rounded-2xl border-white/5 p-8 flex flex-col justify-center gap-8">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                                        <span className="material-symbols-outlined text-lg">link</span>
                                        Import from YouTube
                                    </h3>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Neural Link Processing</p>
                                </div>

                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="PASTE URL HERE"
                                        className="w-full bg-black/40 border-0 border-b-2 border-white/10 py-4 font-display font-black text-sm tracking-widest placeholder:text-white/10 focus:ring-0 focus:border-primary transition-all text-primary"
                                    />
                                    <div className="absolute right-0 bottom-4 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-primary text-sm animate-pulse">sensors</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {[480, 720, 1080].map((res) => (
                                        <div key={res} className="px-3 py-2 bg-white/5 border border-white/5 rounded-sm text-center text-[8px] font-black text-white/30 tracking-widest">
                                            {res} P
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Analysis Ticker */}
                        <div className="py-6 border-y border-white/5">
                            <div className="flex items-center gap-6 overflow-hidden whitespace-nowrap opacity-20 hover:opacity-100 transition-opacity">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <span className="text-primary">●</span>
                                        <span>Recent Analysis: "Marketing_Podcast_Final.mp4"</span>
                                        <span className="text-white/20">|</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration Sidebar */}
                <aside className="w-full lg:w-96 border-l border-white/5 bg-background-dark/80 backdrop-blur-3xl flex flex-col shadow-2xl">
                    <div className="p-8 flex-grow overflow-y-auto custom-scrollbar space-y-10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Matrix Config</h3>
                            <span className="material-symbols-outlined text-white/20 text-sm">settings_input_composite</span>
                        </div>

                        {/* Aspect Ratio */}
                        <div className="space-y-6">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Canvas Ratio</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: '9:16', icon: 'smartphone', active: true },
                                    { label: '1:1', icon: 'square_foot', active: false },
                                    { label: '16:9', icon: 'tv', active: false }
                                ].map((item) => (
                                    <button key={item.label} className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${item.active
                                            ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,242,255,0.15)] text-primary'
                                            : 'bg-white/5 border-white/5 text-white/30 hover:border-white/20'
                                        }`}>
                                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                        <span className="text-[10px] font-black">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* AI Preferences */}
                        <div className="space-y-6">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">AI Orchestrator</label>
                            <div className="space-y-4">
                                <div className="p-4 glass-card rounded-xl border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Smart Subtitles</span>
                                    </div>
                                    <div className="size-4 rounded-full border-2 border-primary bg-primary/20"></div>
                                </div>
                                <div className="p-4 glass-card rounded-xl border-white/5 flex items-center justify-between opacity-50">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-white/50 text-sm">face</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Face Zoom</span>
                                    </div>
                                    <div className="size-4 rounded-full border-2 border-white/10"></div>
                                </div>
                            </div>
                        </div>

                        {/* Language Matrix */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Language Detection</label>
                            <select className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary text-primary transition-all">
                                <option>Indonesian (Optimized)</option>
                                <option>English (Neural)</option>
                                <option>Japanese (Flash)</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-8 bg-background-dark border-t border-white/10 space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Processing Cost</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-display font-black text-primary">5</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Credits</span>
                            </div>
                        </div>

                        <Link href="/editor/1" className="group relative h-14 w-full flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-primary clip-parallelogram group-hover:scale-[1.05] transition-transform"></div>
                            <div className="absolute inset-0 flex items-center justify-center gap-3 transform skew-x-[-10deg]">
                                <span className="text-black font-black uppercase tracking-[0.2em]">Generate Neural Clips</span>
                                <span className="material-symbols-outlined text-black font-bold text-lg animate-bounce-right">arrow_forward</span>
                            </div>
                        </Link>
                    </div>
                </aside>
            </main>
        </div>
    );
}
