"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
        { href: "/create", label: "Create", icon: "add_circle" },
        { href: "/editor", label: "Editor", icon: "video_library" },
        { href: "/analytics", label: "Analytics", icon: "analytics" },
        { href: "/templates", label: "Templates", icon: "collections" },
        { href: "/leaderboard", label: "Leaderboard", icon: "leaderboard" },
        { href: "/teams", label: "Teams", icon: "groups" },
        { href: "/affiliate", label: "Affiliate", icon: "attach_money" },
        { href: "/settings", label: "Settings", icon: "settings" },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-6 right-6 z-50 p-3 glass-card rounded-xl border-white/10"
                aria-label="Toggle menu"
            >
                <span className="material-symbols-outlined text-2xl">
                    {isOpen ? "close" : "menu"}
                </span>
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Menu */}
            <nav
                className={`lg:hidden fixed top-0 right-0 h-full w-80 glass-card border-l border-white/10 z-40 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-6 pt-24">
                    <div className="text-2xl font-display font-black tracking-tight mb-8">
                        VIRAL<span className="text-primary">KLIP</span>
                    </div>

                    <div className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                            ? "bg-primary/20 border border-primary/30 text-primary"
                                            : "hover:bg-white/5 border border-transparent"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {item.icon}
                                    </span>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10">
                        <Link
                            href="/pricing"
                            onClick={() => setIsOpen(false)}
                            className="block w-full py-3 px-4 bg-primary text-black rounded-xl font-display font-black uppercase tracking-[0.2em] text-xs text-center hover:scale-[1.02] transition-all"
                        >
                            Upgrade
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}
