'use client';

import Link from "next/link";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";

export default function CreateProject() {
    const router = useRouter();
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [aspectRatio, setAspectRatio] = useState('9:16');
    const [smartSubtitles, setSmartSubtitles] = useState(true);
    const [faceZoom, setFaceZoom] = useState(false);
    const [language, setLanguage] = useState('Indonesian');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            setSelectedFile(acceptedFiles[0]);
            setYoutubeUrl(''); // Clear YouTube URL if file is selected
            setError('');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/mp4': ['.mp4'],
            'video/quicktime': ['.mov', '.qt'],
            'video/x-msvideo': ['.avi'],
            'video/webm': ['.webm']
        },
        maxFiles: 1,
        maxSize: 500 * 1024 * 1024 // 500MB
    });

    const handleSubmit = async () => {
        if (!youtubeUrl.trim() && !selectedFile) {
            setError('Please provide a YouTube URL or upload a video file');
            return;
        }

        setIsProcessing(true);
        setError('');
        setUploadProgress(0);

        try {
            let project;

            if (selectedFile) {
                // Handle File Upload
                const formData = new FormData();
                formData.append('file', selectedFile);

                // Simulated progress (since fetch doesn't support progress events natively easily)
                const progressInterval = setInterval(() => {
                    setUploadProgress(prev => Math.min(prev + 10, 90));
                }, 500);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                clearInterval(progressInterval);
                setUploadProgress(100);

                if (!uploadRes.ok) {
                    const errData = await uploadRes.json();
                    throw new Error(errData.error || 'Failed to upload video');
                }

                const data = await uploadRes.json();
                project = data.project;

            } else {
                // Handle YouTube URL
                const projectRes = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        video_url: youtubeUrl,
                        video_title: 'New Project'
                    })
                });

                if (!projectRes.ok) {
                    const errData = await projectRes.json();
                    throw new Error(errData.error || 'Failed to create project');
                }

                const data = await projectRes.json();
                project = data.project;
            }

            // Step 2: Trigger Worker API for processing
            // Note: For uploaded files, the worker might need to download from Supabase Storage provided in video_url
            const workerRes = await fetch('/api/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: project.id,
                    video_url: project.video_url, // This will be public Supabase URL for uploads
                    aspect_ratios: [aspectRatio],
                    target_count: 10
                })
            });

            if (!workerRes.ok) {
                const errData = await workerRes.json();
                throw new Error(errData.error || 'Failed to start processing');
            }

            // Redirect to editor with the new project
            router.push(`/editor/${project.id}`);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
            setIsProcessing(false);
            setUploadProgress(0);
        }
    };

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
            <main className="relative z-10 flex-grow flex flex-col lg:flex-row overflow-hidden">
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

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <p className="text-red-400 text-sm font-bold">{error}</p>
                            </div>
                        )}

                        {/* Upload Matrix */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Drop Zone */}
                            <div
                                {...getRootProps()}
                                className={`group relative aspect-video md:aspect-auto md:h-[320px] glass-card rounded-2xl border-white/5 transition-all duration-500 flex flex-col items-center justify-center p-8 gap-6 overflow-hidden cursor-pointer ${isDragActive ? 'border-primary bg-primary/10' : 'hover:border-primary/40'}`}
                            >
                                <input {...getInputProps()} />
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,242,255,0.1)]">
                                    <span className="material-symbols-outlined text-primary text-3xl font-bold">upload_file</span>
                                </div>
                                <div className="text-center space-y-1 z-10">
                                    <h3 className="text-sm font-black uppercase tracking-widest">
                                        {selectedFile ? selectedFile.name : (isDragActive ? "Drop it here!" : "Drop Video File")}
                                    </h3>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                        {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "MP4, MOV up to 500MB"}
                                    </p>
                                </div>
                                {!selectedFile && (
                                    <button className="relative px-6 py-2 bg-white/5 border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black hover:border-primary transition-all z-10">
                                        Browse Files
                                    </button>
                                )}
                                {selectedFile && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                        className="relative px-6 py-2 bg-red-500/10 border border-red-500/20 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all z-10"
                                    >
                                        Remove File
                                    </button>
                                )}
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
                                        value={youtubeUrl}
                                        onChange={(e) => {
                                            setYoutubeUrl(e.target.value);
                                            setSelectedFile(null); // Clear file if typing URL
                                        }}
                                        placeholder="PASTE YOUTUBE URL HERE"
                                        className="w-full bg-black/40 border-0 border-b-2 border-white/10 py-4 font-display font-black text-sm tracking-widest placeholder:text-white/10 focus:ring-0 focus:border-primary transition-all text-primary"
                                        disabled={isProcessing}
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
                                        <span>Recent Analysis: &quot;Marketing_Podcast_Final.mp4&quot;</span>
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
                                    { label: '9:16', icon: 'smartphone' },
                                    { label: '1:1', icon: 'square_foot' },
                                    { label: '16:9', icon: 'tv' }
                                ].map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => setAspectRatio(item.label)}
                                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${aspectRatio === item.label
                                            ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,242,255,0.15)] text-primary'
                                            : 'bg-white/5 border-white/5 text-white/30 hover:border-white/20'
                                            }`}
                                        disabled={isProcessing}
                                    >
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
                                <button
                                    onClick={() => setSmartSubtitles(!smartSubtitles)}
                                    className={`w-full p-4 glass-card rounded-xl flex items-center justify-between transition-all ${smartSubtitles ? 'border-primary/30' : 'border-white/10'}`}
                                    disabled={isProcessing}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`material-symbols-outlined text-sm ${smartSubtitles ? 'text-primary' : 'text-white/50'}`}>auto_awesome</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Smart Subtitles</span>
                                    </div>
                                    <div className={`size-4 rounded-full border-2 ${smartSubtitles ? 'border-primary bg-primary/20' : 'border-white/10'}`}></div>
                                </button>
                                <button
                                    onClick={() => setFaceZoom(!faceZoom)}
                                    className={`w-full p-4 glass-card rounded-xl flex items-center justify-between transition-all ${faceZoom ? 'border-primary/30' : 'border-white/5 opacity-50'}`}
                                    disabled={isProcessing}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`material-symbols-outlined text-sm ${faceZoom ? 'text-primary' : 'text-white/50'}`}>face</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Face Zoom</span>
                                    </div>
                                    <div className={`size-4 rounded-full border-2 ${faceZoom ? 'border-primary bg-primary/20' : 'border-white/10'}`}></div>
                                </button>
                            </div>
                        </div>

                        {/* Language Matrix */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Language Detection</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary text-primary transition-all"
                                disabled={isProcessing}
                            >
                                <option value="Indonesian">Indonesian (Optimized)</option>
                                <option value="English">English (Neural)</option>
                                <option value="Japanese">Japanese (Flash)</option>
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

                        {isProcessing && uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={isProcessing || (!youtubeUrl.trim() && !selectedFile)}
                            className="group relative h-14 w-full flex items-center justify-center overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-primary clip-parallelogram group-hover:scale-[1.05] transition-transform"></div>
                            <div className="absolute inset-0 flex items-center justify-center gap-3 transform skew-x-[-10deg]">
                                {isProcessing ? (
                                    <>
                                        <span className="material-symbols-outlined text-black font-bold text-lg animate-spin">progress_activity</span>
                                        <span className="text-black font-black uppercase tracking-[0.2em]">
                                            {uploadProgress > 0 && uploadProgress < 100 ? `Uploading ${uploadProgress}%` : "Processing..."}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-black font-black uppercase tracking-[0.2em]">Generate Neural Clips</span>
                                        <span className="material-symbols-outlined text-black font-bold text-lg animate-bounce-right">arrow_forward</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    );
}
