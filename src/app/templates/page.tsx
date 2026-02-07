"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const FEATURED_COLLECTIONS = [
    { id: 1, title: "High Velocity", tag: "Alpha", update: "2h ago", desc: "Whiplash-inducing transitions and punchy neon text effects for high-energy tech highlights.", img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" },
    { id: 2, title: "Deep Focus", tag: "Beta", update: "12m ago", desc: "Minimalist captions and subtle neural waveforms designed for long-form matrix content.", img: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1932&auto=format&fit=crop" }
];

const TEMPLATES = [
    { id: 1, title: "Hormozi Kinetic", rating: 4.9, desc: "Rapid-fire neon yellow captions with zoom cuts.", uses: "12.5k", creator: "Sarah K.", aspect: "aspect-[9/16]", img: "https://i.pravatar.cc/300?u=a1" },
    { id: 2, title: "Cinematic Vlog", rating: 4.2, desc: "Slow pans, moody grading, and elegant serif nodes.", uses: "840", creator: "Davide R.", aspect: "aspect-video", img: "https://i.pravatar.cc/300?u=a2" },
    { id: 3, title: "Podcast Pro", rating: 4.7, desc: "Split screen layout with neural waveform visualization.", uses: "5.2k", creator: "PodCuts", aspect: "aspect-[4/5]", img: "https://i.pravatar.cc/300?u=a3" },
    { id: 4, title: "Gradient Pop", rating: 4.6, desc: "Vibrant animated nodes for text-only matrix reels.", uses: "3.1k", creator: "ColorM.", aspect: "aspect-[9/16]", img: "https://i.pravatar.cc/300?u=a4" },
    { id: 5, title: "Cyber Glitch", rating: 4.8, desc: "Digital artifacts and aggressive kinetic typography.", uses: "9.2k", creator: "NeonX", aspect: "aspect-[9/16]", img: "https://i.pravatar.cc/300?u=a5" },
    { id: 6, title: "Minimal Node", rating: 4.5, desc: "Clean lines and subtle glassmorphism headers.", uses: "2.1k", creator: "GlassLab", aspect: "aspect-[9/16]", img: "https://i.pravatar.cc/300?u=a6" },
];

export default function TemplateLibrary() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState<any[]>([]);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            setTemplates(TEMPLATES);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleUseTemplate = async (template: any) => {
        setProcessingId(template.id);
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    video_url: "https://www.w3schools.com/html/mov_bbb.mp4", // Mock URL for template
                    video_title: `${template.title} Project`,
                })
            });

            if (!response.ok) throw new Error('Failed to create project');

            const data = await response.json();
            router.push(`/editor/${data.project.id}`);
        } catch (error) {
            console.error(error);
            alert("Failed to use template");
            setProcessingId(null);
        }
    };

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
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-float-1"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[130px] animate-float-2"></div>
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

                    <div className="hidden lg:flex items-center gap-8">
                        {['All Styles', 'Trending', 'New', 'Essentials'].map((item) => (
                            <button key={item} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors relative group">
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all"></span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                            <span className="material-symbols-outlined text-[18px]">search</span>
                        </span>
                        <input
                            className="w-64 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest placeholder-white/20 focus:outline-none focus:border-primary/30 transition-all"
                            placeholder="Deep Scan Styles..."
                            type="text"
                        />
                    </div>
                    <button className="px-5 py-2 glass-card rounded-xl border-white/10 hover:border-primary/30 transition-all text-[10px] font-black uppercase tracking-widest">
                        Custom Node
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-grow p-6 lg:p-12 overflow-y-auto custom-scrollbar">
                <div className="max-w-7xl mx-auto space-y-20">

                    {/* Header Title */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Asset Matrix Alpha</span>
                        </div>
                        <h1 className="text-4xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-none">
                            Neural <br />
                            <span className="text-outline-neon">Templates</span>
                        </h1>
                    </div>

                    {/* Featured Collections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {FEATURED_COLLECTIONS.map((col) => (
                            <div key={col.id} className="group relative aspect-[16/7] rounded-3xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all">
                                <img src={col.img} alt={col.title} className="size-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-primary/20 backdrop-blur-md rounded text-[8px] font-black text-primary uppercase tracking-widest border border-primary/20">{col.tag}</span>
                                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Latest Update: {col.update}</span>
                                    </div>
                                    <h3 className="text-3xl font-display font-black uppercase tracking-tighter truncate">{col.title}</h3>
                                    <p className="text-[10px] font-bold text-white/50 uppercase max-w-sm line-clamp-1">{col.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Template Grid */}
                    <div className="space-y-12">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <div className="flex gap-4">
                                {['Vertical', 'Landscape', 'Square'].map((f) => (
                                    <button key={f} className="px-4 py-2 glass-card rounded-xl border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                                        {f}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase">
                                Sort: <span className="text-primary tracking-widest">Growth Factor</span>
                                <span className="material-symbols-outlined text-sm">expand_more</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {templates.map((tpl) => (
                                <div key={tpl.id} className="group glass-card rounded-2xl border-white/5 p-4 space-y-4 hover:border-primary/30 transition-all hover:-translate-y-1">
                                    <div className={`relative ${tpl.aspect} rounded-xl overflow-hidden bg-white/5`}>
                                        <img src={tpl.img} alt={tpl.title} className="size-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all"></div>
                                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => handleUseTemplate(tpl)}
                                                disabled={processingId === tpl.id}
                                                className="size-10 bg-primary text-black rounded-lg flex items-center justify-center border border-primary/40 shadow-[0_0_15px_rgba(0,242,255,0.4)] disabled:opacity-50"
                                            >
                                                {processingId === tpl.id ? (
                                                    <span className="material-symbols-outlined font-bold animate-spin">progress_activity</span>
                                                ) : (
                                                    <span className="material-symbols-outlined font-bold">bolt</span>
                                                )}
                                            </button>
                                        </div>
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                                            <span className="material-symbols-outlined text-[14px] text-primary">star</span>
                                            <span className="text-[10px] font-black text-white">{tpl.rating}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black uppercase tracking-widest">{tpl.title}</h4>
                                        <p className="text-[10px] font-bold text-white/30 uppercase line-clamp-1">{tpl.desc}</p>
                                    </div>

                                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="size-6 rounded-full bg-white/10 border border-white/10"></div>
                                            <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">{tpl.creator}</span>
                                        </div>
                                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">{tpl.uses} Used</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upgrade Callout */}
                    <div className="p-12 glass-card rounded-3xl border-secondary/20 bg-secondary/5 flex flex-col md:row items-center justify-between gap-12 relative overflow-hidden">
                        <div className="absolute top-0 right-10 size-60 bg-secondary/10 rounded-full blur-[120px]"></div>
                        <div className="space-y-4 relative z-10 text-center md:text-left">
                            <h3 className="text-3xl font-display font-black uppercase tracking-tighter">Unlock Pro Nodes</h3>
                            <p className="text-sm font-bold text-white/50 uppercase tracking-widest max-w-xl">
                                Gain access to 500+ handcrafted kinetic templates and high-retention subtitle matrixes.
                            </p>
                        </div>
                        <button className="px-10 py-5 bg-secondary text-white font-display font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-all shadow-[0_0_30px_rgba(123,47,247,0.3)] relative z-10">
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
