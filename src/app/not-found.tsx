import Link from "next/link";

export default function NotFound() {
    return (
        <div className="bg-background-dark text-white font-body min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background VFX */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-float-1"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[130px] animate-float-2"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>

            <div className="relative z-10 text-center space-y-8 p-8">
                <div className="space-y-4">
                    <h1 className="text-[10rem] font-display font-black text-primary leading-none animate-glow">404</h1>
                    <h2 className="text-3xl font-display font-black uppercase tracking-tight">Node Not Found</h2>
                    <p className="text-sm text-white/40 font-bold uppercase tracking-widest">
                        The neural pathway you're looking for doesn't exist
                    </p>
                </div>

                <Link
                    href="/dashboard"
                    className="inline-block px-12 py-5 bg-primary text-black font-display font-black uppercase tracking-[0.3em] text-sm rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(0,242,255,0.3)]"
                >
                    Return to Matrix
                </Link>
            </div>
        </div>
    );
}
