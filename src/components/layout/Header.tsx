import Link from "next/link";

export default function Header() {
    return (
        <header className="h-24 px-6 md:px-10 flex items-center justify-between sticky top-0 bg-background-dark/80 backdrop-blur-md z-40 border-b border-white/5">
            <div className="flex-1 max-w-2xl">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-500 group-focus-within:text-primary transition-colors">terminal</span>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-3 bg-surface-card border-none rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-primary focus:shadow-[0_0_10px_rgba(195,255,15,0.5)] transition-shadow duration-300 text-lg"
                        placeholder="Search projects, assets, or run commands..."
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-xs text-gray-600 border border-gray-700 rounded px-1.5 py-0.5">⌘K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 ml-6">
                <button className="relative text-gray-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-3xl">notifications</span>
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-background-dark"></span>
                </button>
                <Link
                    href="/create"
                    className="bg-primary hover:bg-primary/90 text-black font-bold py-2.5 px-6 rounded shadow-[0_0_15px_rgba(195,255,15,0.3)] transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-xl">add</span>
                    <span>New Project</span>
                </Link>
                {/* Mobile Menu Button */}
                <button className="md:hidden text-white">
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </div>
        </header>
    );
}
