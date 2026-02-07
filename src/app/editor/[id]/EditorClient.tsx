"use client";

import Link from "next/link";
import { useProject } from "@/hooks/useProject";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useState, useEffect } from "react";

export default function EditorClient({ id }: { id: string }) {
    const { project, loading, error, updateProject } = useProject(id);
    const [isSaving, setIsSaving] = useState(false);
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (project) {
            setTitle(project.video_title || "Untitled Project");
        }
    }, [project]);

    const handleSave = async () => {
        if (!project) return;
        setIsSaving(true);
        try {
            await updateProject({ video_title: title });
            // Ideally use a Toast component here
            alert("Project saved successfully!");
        } catch (err) {
            alert("Failed to save project");
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
                    <p className="text-white/50 mb-6">{error || "The requested project currently does not exist."}</p>
                    <Link href="/dashboard" className="px-6 py-2 bg-primary text-black rounded font-bold uppercase">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-dark text-white font-body min-h-screen flex flex-col relative overflow-hidden">
            {/* Background VFX */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-float-1"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[130px] animate-float-2"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>

            {/* Header */}
            <header className="relative z-50 border-b border-white/5 bg-background-dark/50 backdrop-blur-xl px-6 lg:px-12 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="size-8 bg-primary/10 rounded flex items-center justify-center border border-primary/30 group-hover:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all">
                            <span className="material-symbols-outlined text-primary text-xl font-bold">bolt</span>
                        </div>
                        <h2 className="text-white text-lg font-display font-black tracking-tighter uppercase">ViralKlip</h2>
                    </Link>
                    <div className="h-4 w-px bg-white/10 hidden md:block"></div>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/5">
                        <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Project:</span>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-transparent border-none text-[10px] font-black tracking-widest text-primary uppercase focus:ring-0 w-48"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Processing Mode</span>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Neural Render v2.4</span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-primary text-black px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)] disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Save Project"}
                    </button>
                    <button className="bg-white/10 text-white px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                        Export Final
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 flex-grow flex flex-col lg:row overflow-hidden">

                {/* Left Side: Video Preview (70%) */}
                <section className="flex-grow p-6 lg:p-12 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-display font-black uppercase tracking-tighter">Clip Preview</h1>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Status: {project.status}</span>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Viral Score: {project.viral_score || "N/A"}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="size-10 rounded glass-card flex items-center justify-center border-white/5 hover:border-primary/30 transition-all">
                                <span className="material-symbols-outlined text-white/50 text-xl">undo</span>
                            </button>
                            <button className="size-10 rounded glass-card flex items-center justify-center border-white/5 hover:border-primary/30 transition-all">
                                <span className="material-symbols-outlined text-white/50 text-xl">redo</span>
                            </button>
                        </div>
                    </div>

                    {/* Video Container */}
                    <div className="flex-grow relative glass-card rounded-2xl border-white/5 overflow-hidden group shadow-2xl flex items-center justify-center bg-black">
                        {project.video_url ? (
                            <video
                                src={project.video_url}
                                controls
                                className="h-full w-full object-contain"
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="text-center p-8">
                                <span className="material-symbols-outlined text-4xl text-white/20 mb-4">movie</span>
                                <p className="text-white/40 uppercase tracking-widest text-xs">Processing Video...</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Right Side: Neural Controls (30%) */}
                <aside className="w-full lg:w-[480px] border-l border-white/5 bg-background-dark/80 backdrop-blur-3xl flex flex-col">
                    <div className="flex border-b border-white/5">
                        {['Analytics', 'Caption', 'Templates'].map((tab, idx) => (
                            <button key={tab} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${tab === 'Analytics' ? 'text-primary bg-primary/5 border-b border-primary' : 'text-white/30 hover:text-white'
                                }`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-8 flex-grow overflow-y-auto custom-scrollbar space-y-10">
                        {/* Viral Score Breakdown */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Viral IQ</h3>
                                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[8px] font-black uppercase tracking-widest">Optimized</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Hook Impact', value: 92 },
                                    { label: 'Retention', value: 88 },
                                    { label: 'Shareability', value: 95 },
                                    { label: 'Trend Match', value: 85 }
                                ].map((stat) => (
                                    <div key={stat.label} className="p-4 glass-card rounded-xl border-white/5">
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 block">{stat.label}</span>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-display font-black text-glow">{stat.value}</span>
                                            <div className="size-8 rounded-full border border-white/5 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-xs text-primary">trending_up</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Caption Workspace */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Neural Caption</label>
                                <button className="text-[8px] font-black text-primary uppercase tracking-widest hover:blur-[0.5px]">Regenerate</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative glass-card rounded-xl border-white/10 p-6 h-48 bg-black/40">
                                    <p className="text-sm font-medium leading-relaxed italic text-white/80">
                                        {project.transcript ? project.transcript.substring(0, 150) + "..." : "Transcript generating..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-t border-white/5 bg-background-dark">
                        <button className="w-full h-14 bg-white/5 border border-white/10 rounded-sm group overflow-hidden relative transition-all hover:border-primary/50">
                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                            <div className="flex items-center justify-center gap-3">
                                <span className="material-symbols-outlined text-white/50 group-hover:text-primary transition-colors">download</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 group-hover:text-white">Download Component</span>
                            </div>
                        </button>
                    </div>
                </aside>
            </main>

            {/* Floating Status Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6">
                <div className="glass-card rounded-full border-primary/20 p-2.5 flex items-center justify-between pr-6 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-4 pl-4 border-r border-white/10 pr-6">
                        <div className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(0,242,255,0.8)]"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Review</span>
                    </div>
                    <div className="flex items-center gap-8 pl-6">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Post to</span>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">TikTok Matrix</span>
                        </div>
                        <button className="size-10 bg-primary text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                            <span className="material-symbols-outlined font-bold">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
