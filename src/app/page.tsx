import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-background-dark text-white font-body overflow-x-hidden min-h-screen flex flex-col relative selection:bg-primary selection:text-black">
      {/* Background VFX */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-float-1"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[700px] h-[700px] bg-secondary/15 rounded-full blur-[100px] animate-float-2"></div>
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] animate-float-3"></div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-50"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 w-full px-6 py-8 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(0,242,255,0.2)]">
            <span className="material-symbols-outlined text-primary font-bold">bolt</span>
          </div>
          <h2 className="text-white text-2xl font-display font-bold tracking-tighter uppercase">ViralKlip</h2>
        </div>
        <div className="hidden lg:flex items-center gap-12">
          {['Features', 'Pricing', 'Showcase', 'Reviews'].map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="text-white/60 hover:text-primary transition-all text-sm font-semibold tracking-widest uppercase hover:blur-[0.5px]">
              {item}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-white/80 text-xs sm:text-sm font-bold uppercase tracking-widest hover:text-white transition-colors px-3 py-2">
            Login
          </Link>
          <Link href="/signup" className="bg-primary text-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-sm text-xs sm:text-sm font-black uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,242,255,0.5)] active:scale-95">
            Sign Up Free
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex-grow pt-12 pb-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Hero Text */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit animate-glow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">v2.0 Flash is Live</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl xl:text-[7rem] font-display font-black leading-[0.9] tracking-tighter uppercase">
                Ubah Video <br />
                <span className="text-outline-neon">Jadi Viral</span>
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-white/50 font-medium leading-relaxed">
                Platform AI tercanggih untuk kreator Indonesia. Potong video panjang jadi 10+ konten viral TikTok & Reels dalam hitungan detik.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link href="/signup" className="group relative h-16 w-full sm:w-64">
                <div className="absolute inset-0 bg-primary clip-parallelogram shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-transform group-hover:scale-[1.02]"></div>
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <span className="text-black font-black uppercase tracking-[0.2em] transform skew-x-[-10deg]">Mulai Sekarang</span>
                </div>
              </Link>
              <div className="flex items-center gap-4 px-6 py-4 glass-card rounded-sm cursor-pointer hover:bg-white/5 transition-colors group">
                <div className="size-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-white/50 group-hover:text-primary text-sm">play_arrow</span>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-white/50 group-hover:text-white">Lihat Demo</span>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="size-10 rounded-full border-2 border-background-dark bg-surface overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="material-symbols-outlined text-primary text-sm font-bold">star</span>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Dipercaya 850k+ kreator</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="lg:col-span-12 xl:col-span-5 relative">
            <div className="aspect-[4/5] relative glass-card p-4 rounded-xl rotate-2">
              <div className="absolute -top-12 -right-12 size-40 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 size-32 bg-primary/20 rounded-full blur-3xl animate-pulse delay-700"></div>

              <div className="h-full w-full rounded-lg bg-black/40 overflow-hidden relative border border-white/5">
                <img
                  src="https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=2032&auto=format&fit=crop"
                  alt="AI Visualization"
                  className="h-full w-full object-cover opacity-60 mix-blend-overlay"
                />

                {/* Floating UI Elements */}
                <div className="absolute top-6 left-6 right-6 p-4 glass-card rounded-lg border-primary/20 transform -translate-y-2 animate-float-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Viral Score</span>
                    <span className="text-xl font-display font-black text-primary">9.8</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[98%] shadow-[0_0_10px_rgba(0,242,255,0.5)]"></div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 p-4 glass-card rounded-lg border-secondary/20 transform translate-y-2 animate-float-2">
                  <div className="flex items-center gap-3">
                    <div className="size-3 bg-secondary rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">AI Analyzing...</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="h-1 w-full bg-white/5 rounded-full"></div>
                    <div className="h-1 w-2/3 bg-white/5 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Ticker Section */}
      <div className="fixed bottom-0 left-0 w-full bg-background-dark/80 backdrop-blur-md border-t border-white/5 z-40 py-5">
        <div className="ticker-wrap">
          <div className="ticker-move animate-ticker">
            {[1, 2].map((i) => (
              <div key={i} className="inline-flex items-center">
                {[
                  { text: '2.4M Clips Generated', icon: 'auto_awesome' },
                  { text: '850K+ Active Creators', icon: 'groups' },
                  { text: '10x Faster Workflow', icon: 'rocket_launch' },
                  { text: 'Indonesia\'s #1 AI Clipper', icon: 'verified' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center mx-16">
                    <span className="material-symbols-outlined text-primary/40 mr-4 text-2xl">{item.icon}</span>
                    <span className="text-white font-display font-black text-3xl uppercase tracking-tighter opacity-80">{item.text}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 border-t border-white/5 bg-background-dark/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mb-4 animate-glow">Core Capabilities</h2>
            <h3 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight">Evolusi Video Editing</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Discovery Archives",
                desc: "Telusuri feed klip viral global dan kloning gaya editing terbaik dengan satu klik.",
                icon: "explore",
                color: "primary"
              },
              {
                title: "Team Matrix",
                desc: "Kelola workspace kolaboratif dengan peran kustom untuk editor dan manajer.",
                icon: "group_work",
                color: "secondary"
              },
              {
                title: "Affiliate Portal",
                desc: "Dapatkan komisi seumur hidup dengan mengajak kreator lain masuk ke ekosistem ViralKlip.",
                icon: "payments",
                color: "accent"
              },
              {
                title: "AI Moment Detection",
                desc: "Gemini 2.0 Flash mendeteksi hook & momen emosional secara otomatis.",
                icon: "psychology",
                color: "primary"
              },
              {
                title: "Auto Subtitles",
                desc: "Captions Bahasa Indonesia yang akurat dengan animasi modern.",
                icon: "subtitles",
                color: "secondary"
              },
              {
                title: "Viral Scorecard",
                desc: "Prediksi tingkat viralitas konten sebelum Anda mempostingnya.",
                icon: "query_stats",
                color: "accent"
              }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 glass-card rounded-xl border-white/5 hover:border-primary/30 transition-all duration-500">
                <div className={`size-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <span className={`material-symbols-outlined text-${feature.color} text-2xl`}>{feature.icon}</span>
                </div>
                <h4 className="text-xl font-display font-black uppercase mb-3 tracking-tighter">{feature.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-32 bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mb-4 animate-glow">Pricing Strategy</h2>
            <h3 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight">Investasi Konten Anda</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Free",
                price: "0",
                features: ["3 clips per bulan", "Watermark ViralKlip", "Basic features", "Email support"],
                cta: "Coba Gratis",
                popular: false
              },
              {
                name: "Starter",
                price: "29k",
                features: ["20 clips per bulan", "No watermark", "All aspect ratios", "Priority email"],
                cta: "Pilih Starter",
                popular: false
              },
              {
                name: "Pro",
                price: "79k",
                features: ["100 clips per bulan", "Fast processing", "Viral analytics", "WhatsApp support"],
                cta: "Pilih Pro",
                popular: true
              },
              {
                name: "Creator",
                price: "199k",
                features: ["Unlimited clips", "API access", "Team collab (3 seats)", "Custom branding"],
                cta: "Pilih Creator",
                popular: false
              }
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`relative p-8 rounded-xl flex flex-col ${plan.popular
                  ? 'bg-primary/5 border-2 border-primary shadow-[0_0_40px_rgba(0,242,255,0.1)]'
                  : 'glass-card border-white/5'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                    Best Seller
                  </div>
                )}
                <div className="mb-8">
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-2">{plan.name}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-white/40">Rp</span>
                    <span className="text-4xl font-display font-black">{plan.price}</span>
                    <span className="text-xs font-bold text-white/40">/bln</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-12 flex-grow">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-bold text-white/60">
                      <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-sm text-xs font-black uppercase tracking-widest transition-all ${plan.popular
                  ? 'bg-primary text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(0,242,255,0.4)]'
                  : 'bg-white/5 text-white hover:bg-white/10'
                  }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative z-10 py-20 border-t border-white/5 bg-background-dark">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30">
                <span className="material-symbols-outlined text-primary text-xl font-bold">bolt</span>
              </div>
              <h2 className="text-white text-xl font-display font-bold tracking-tighter uppercase">ViralKlip</h2>
            </div>
            <p className="max-w-xs text-sm text-white/40 font-medium leading-relaxed">
              Platform revolusioner untuk kreator masa depan. Fokus pada kreativitas, biarkan AI kami mengurus sisanya.
            </p>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Product</h5>
            <ul className="space-y-4 text-xs font-bold text-white/40">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Support</h5>
            <ul className="space-y-4 text-xs font-bold text-white/40">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/legal" className="hover:text-white transition-colors">Legal</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between gap-6">
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">© 2026 ViralKlip Indonesia. All rights reserved.</span>
          <div className="flex gap-8">
            {['tiktok', 'instagram', 'youtube'].map((social) => (
              <span key={social} className="text-white/20 hover:text-primary transition-colors cursor-pointer uppercase text-[10px] font-black tracking-widest">{social}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
