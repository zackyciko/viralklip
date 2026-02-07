"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PricingPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const plans = [
        {
            id: "starter",
            name: "Starter",
            price: "99K",
            credits: 10,
            features: [
                "10 video processing credits",
                "Multi-aspect ratio clips",
                "AI viral detection",
                "Auto subtitles",
                "Basic analytics",
            ],
        },
        {
            id: "pro",
            name: "Pro",
            price: "299K",
            credits: 50,
            popular: true,
            features: [
                "50 video processing credits",
                "Priority processing",
                "Advanced analytics",
                "Custom branding",
                "Email support",
                "Bulk download",
            ],
        },
        {
            id: "unlimited",
            name: "Unlimited",
            price: "599K",
            credits: 999999,
            features: [
                "Unlimited processing",
                "Fastest processing",
                "Team collaboration",
                "API access",
                "Priority support",
                "Custom integrations",
            ],
        },
    ];

    const handleSubscribe = async (planId: string) => {
        setLoading(planId);

        try {
            // Create payment
            const response = await fetch("/api/payments/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planId }),
            });

            if (!response.ok) {
                throw new Error("Failed to create payment");
            }

            const { token, redirectUrl } = await response.json();

            // Load Midtrans Snap
            const script = document.createElement("script");
            script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
            script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
            document.body.appendChild(script);

            script.onload = () => {
                // @ts-ignore
                window.snap.pay(token, {
                    onSuccess: () => {
                        router.push("/dashboard?payment=success");
                    },
                    onPending: () => {
                        router.push("/dashboard?payment=pending");
                    },
                    onError: () => {
                        alert("Payment failed. Please try again.");
                        setLoading(null);
                    },
                    onClose: () => {
                        setLoading(null);
                    },
                });
            };
        } catch (error) {
            console.error("Payment error:", error);
            alert("Failed to initiate payment. Please try again.");
            setLoading(null);
        }
    };

    return (
        <div className="bg-background-dark text-white font-body min-h-screen">
            {/* Background VFX */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-float-1"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[130px] animate-float-2"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/5 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-display font-black tracking-tight">
                        VIRAL<span className="text-primary">KLIP</span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 glass-card rounded-xl border-white/10 font-display font-black uppercase tracking-[0.2em] text-xs hover:border-primary/30 transition-all"
                    >
                        Dashboard
                    </Link>
                </div>
            </header>

            {/* Pricing Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-display font-black uppercase tracking-tight mb-6">
                        Pilih <span className="text-primary">Paket</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Upgrade untuk akses unlimited dan fitur premium
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`glass-card rounded-3xl p-8 border ${plan.popular ? "border-primary/50 shadow-[0_0_50px_rgba(0,242,255,0.2)]" : "border-white/10"
                                } relative`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-black font-display font-black uppercase tracking-[0.2em] text-xs rounded-full">
                                    Popular
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-4">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-5xl font-display font-black text-primary">
                                        {plan.price}
                                    </span>
                                    <span className="text-white/40 font-bold">/bulan</span>
                                </div>
                                <p className="text-sm text-white/60 mt-2">{plan.credits} credits</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary text-xl mt-0.5">
                                            check_circle
                                        </span>
                                        <span className="text-sm text-white/80">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={loading !== null}
                                className={`w-full py-4 rounded-2xl font-display font-black uppercase tracking-[0.2em] text-sm transition-all ${plan.popular
                                        ? "bg-primary text-black hover:scale-[1.02] shadow-[0_0_30px_rgba(0,242,255,0.3)]"
                                        : "glass-card border-white/10 hover:border-primary/30"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {loading === plan.id ? "Processing..." : "Subscribe"}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <p className="text-sm text-white/40">
                        Semua paket termasuk akses ke semua fitur dasar. Upgrade kapan saja.
                    </p>
                </div>
            </div>
        </div>
    );
}
