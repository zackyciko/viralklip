"use client";

import Link from "next/link";
import { useTeams } from "@/hooks/useTeams";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useState } from "react";

export default function TeamsPage() {
    const { teams, currentTeam, setCurrentTeam, members, loading, error, createTeam } = useTeams();
    const [isCreating, setIsCreating] = useState(false);
    const [newTeamName, setNewTeamName] = useState("");

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;
        try {
            await createTeam(newTeamName);
            setIsCreating(false);
            setNewTeamName("");
        } catch (err) {
            alert("Failed to create team");
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
                        {teams.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setCurrentTeam(t)}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${currentTeam?.id === t.id ? 'text-primary' : 'text-white/30 hover:text-white'}`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="px-5 py-2 glass-card rounded-xl border-white/10 hover:border-primary/30 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">add_box</span>
                        New Team
                    </button>
                    <button className="px-5 py-2 glass-card rounded-xl border-white/10 hover:border-primary/30 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">group_add</span>
                        Invite
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-grow p-6 lg:p-12 overflow-y-auto custom-scrollbar">
                <div className="max-w-7xl mx-auto space-y-12">

                    {/* Create Team Overlay/Form */}
                    {isCreating && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                            <form onSubmit={handleCreateTeam} className="bg-background-dark p-8 rounded-2xl border border-white/10 w-96 space-y-4">
                                <h3 className="text-xl font-bold">Create New Matrix Node</h3>
                                <input
                                    type="text"
                                    placeholder="Team Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    value={newTeamName}
                                    onChange={e => setNewTeamName(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-white/50 hover:text-white">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-primary text-black rounded font-bold">Create</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Hero Section */}
                    <div className="flex flex-col lg:row items-center justify-between gap-12">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20">
                                <span className="text-[10px] font-black tracking-[0.2em] text-secondary uppercase">Unified Nodes</span>
                            </div>
                            <h1 className="text-4xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-none">
                                {currentTeam?.name || "No Team Selected"} <br />
                                <span className="text-outline-neon">Matrix</span>
                            </h1>
                        </div>

                        {currentTeam && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
                                {[
                                    { label: 'Active Nodes', value: `${members.length} / 05` },
                                    { label: 'Team Plan', value: currentTeam.plan || 'Free' },
                                    { label: 'Sync Velocity', value: 'Ultra' },
                                    { label: 'Your Role', value: currentTeam.my_role }
                                ].map((stat) => (
                                    <div key={stat.label} className="px-6 py-6 glass-card rounded-2xl border-white/5 space-y-1">
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 block">{stat.label}</span>
                                        <span className="text-xl font-display font-black text-white capitalize">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {!currentTeam ? (
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-bold text-white/50">You are not part of any team matrix yet.</h2>
                            <button onClick={() => setIsCreating(true)} className="mt-4 text-primary underline">Create one now</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Col: Member List */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xl font-display font-black uppercase tracking-tight">Active Matrix Members</h3>
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Max capacity: 10 Nodes</span>
                                </div>

                                <div className="space-y-4">
                                    {members.map((member) => (
                                        <div key={member.id} className="group glass-card rounded-3xl border-white/5 p-6 flex items-center justify-between gap-6 hover:border-white/20 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="size-16 rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary/30 transition-colors">
                                                    <img src={member.avatar || `https://i.pravatar.cc/150?u=${member.id}`} alt={member.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-lg font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">{member.name || "Unknown User"}</h4>
                                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] border border-white/10 rounded px-2 py-0.5">{member.role}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right hidden sm:block">
                                                    <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] block">Status</span>
                                                    <span className="text-[10px] font-bold text-white uppercase">{member.status}</span>
                                                </div>
                                                <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 hover:border-red-500/30 hover:text-red-500 transition-all">
                                                    <span className="material-symbols-outlined text-xl">logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 glass-card rounded-3xl border-dashed border-white/10 flex flex-col items-center justify-center gap-4 group hover:border-primary/30 transition-all cursor-pointer">
                                    <div className="size-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:text-primary group-hover:border-primary/30">
                                        <span className="material-symbols-outlined text-2xl">person_add</span>
                                    </div>
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Link New Member Node</span>
                                </div>
                            </div>

                            {/* Right Col: Team Settings & Insights */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="p-8 glass-card rounded-3xl border-white/5 space-y-8">
                                    <h3 className="text-lg font-black uppercase tracking-widest">Node Settings</h3>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Team Identity Name</label>
                                            <input
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-primary/30 transition-all"
                                                value={currentTeam.name}
                                                readOnly
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Global Sync Tier</label>
                                            <div className="p-4 glass-card rounded-xl border-primary/20 bg-primary/5 flex items-center justify-between">
                                                <span className="text-[10px] font-black text-primary uppercase capitalize">{currentTeam.plan}</span>
                                                <span className="material-symbols-outlined text-primary text-sm">verified</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5 space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Shared Storage Usage</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[8px] font-black text-white/30 uppercase">
                                                <span>R2 Vault</span>
                                                <span>0%</span>
                                            </div>
                                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-secondary w-[0%] shadow-[0_0_10px_rgba(123,47,247,0.5)]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {currentTeam.my_role === 'owner' && (
                                        <button className="w-full py-4 glass-card rounded-xl border-white/10 text-[10px] font-black uppercase tracking-widest hover:border-red-500/30 hover:text-red-500 transition-all">
                                            Liquidate Team Node
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
