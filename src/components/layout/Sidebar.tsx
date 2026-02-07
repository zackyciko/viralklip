"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "Projects", href: "/projects", icon: "movie" },
    { name: "AI Tools", href: "/create", icon: "smart_toy" },
    { name: "Analytics", href: "/analytics", icon: "bar_chart" },
    { name: "Assets", href: "/assets", icon: "folder_open" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-20 lg:w-64 h-screen sticky top-0 border-r border-white/5 bg-background-dark flex-shrink-0 transition-all duration-300 z-50">
            <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-black font-bold text-xl flex-shrink-0">
                        VK
                    </div>
                    <span className="ml-1 font-bold text-xl tracking-tight hidden lg:block text-white">ViralKlip</span>
                </Link>
            </div>

            <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-4 px-3 py-3 rounded-lg group transition-colors ${pathname === item.href
                                ? "bg-surface-highlight text-primary"
                                : "text-gray-400 hover:bg-surface-highlight hover:text-white"
                            }`}
                    >
                        <span className={`material-symbols-outlined ${pathname === item.href ? "text-secondary" : "text-secondary group-hover:text-primary"
                            } transition-colors`}>
                            {item.icon}
                        </span>
                        <span className="hidden lg:block font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5">
                <Link
                    href="/settings"
                    className="flex items-center gap-4 px-3 py-3 rounded-lg text-gray-400 hover:bg-surface-highlight hover:text-white group transition-colors"
                >
                    <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">settings</span>
                    <span className="hidden lg:block font-medium">Settings</span>
                </Link>
                <div className="mt-4 hidden lg:flex items-center gap-3 px-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary"></div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">Alex Chen</span>
                        <span className="text-xs text-gray-500">Pro Plan</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
