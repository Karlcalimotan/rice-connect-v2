import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const featureCards = [
    {
        title: 'Intelligent Tracing',
        description: 'Track every bag across the supply chain with precision and provenance.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
        ),
    },
    {
        title: 'Smart Inventory',
        description: 'Automate stock levels for mills and warehouses using live sensor intelligence.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 10.5V20h18v-9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 3v13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 10.5l9-5.25 9 5.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.5 20V13.5H16.5V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        title: 'Ecosystem Trust',
        description: 'Build confidence among partners with immutable transaction and quality records.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 12l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 19V5c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        title: 'Secure Logistics',
        description: 'Encrypt transit records and keep goods moving safely from farm to shelf.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="11" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
    },
];

export default function LandingPage() {
    const [selectedRoute, setSelectedRoute] = useState('Pavia Hub - Santa Barbara');
    const [weight, setWeight] = useState(1200);
    const [distance, setDistance] = useState(28);

    const cost = useMemo(() => {
        const base = 150;
        const load = weight / 50;
        const travel = distance * 1.7;
        return Math.max(180, base + load + travel).toFixed(2);
    }, [weight, distance]);

    return (
        <>
            <Head title="Rice-Connect | The Future of Agri-Logistics" />
            <div className="min-h-screen bg-[#030506] text-white selection:bg-emerald-500/30">
                {/* Hero Section */}
                <section className="relative min-h-screen flex flex-col">
                    <div 
                        className="absolute inset-0 z-0 bg-fixed bg-cover bg-center"
                        style={{ backgroundImage: "url('resources/css/1.jpeg')" }}
                    />
                    <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/80 via-black/40 to-[#030506]" />
                    <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.15),_transparent_40%)]" />

                    <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8 sm:px-12">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 font-bold text-black shadow-lg shadow-emerald-500/20">
                                RC
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">RiceConnect</h1>
                                <p className="text-[10px] uppercase tracking-widest text-emerald-400/80">Digital Supply Chain</p>
                            </div>
                        </div>
                        <div className="hidden items-center gap-10 md:flex">
                            <a href="#features" className="text-sm font-medium text-white/70 transition hover:text-white">Features</a>
                            <a href="#logistics" className="text-sm font-medium text-white/70 transition hover:text-white">Logistics</a>
                            <Link href={route('login')} className="text-sm font-medium text-white/70 transition hover:text-white">Sign In</Link>
                            <Link 
                                href={route('register')}
                                className="group relative overflow-hidden rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition-all hover:pr-10"
                            >
                                <span className="relative z-10">Get Started</span>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:opacity-100">→</span>
                            </Link>
                        </div>
                    </nav>

                    <div className="relative z-10 flex flex-1 items-center px-6 sm:px-12">
                        <div className="mx-auto w-full max-w-7xl">
                            <div className="max-w-4xl space-y-8">
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
                                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">System Live v2.4</span>
                                </div>
                                <h2 className="text-5xl font-black leading-[1.1] text-white sm:text-7xl lg:text-8xl">
                                    INTELLIGENCE IN <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-200">
                                        EVERY GRAIN.
                                    </span>
                                </h2>
                                <p className="max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
                                    Revolutionizing the rice supply chain with blockchain-grade tracing, 
                                    real-time logistics, and predictive analytics for a smarter agriculture.
                                </p>
                                <div className="flex flex-col gap-5 pt-4 sm:flex-row">
                                    <Link 
                                        href={route('register')}
                                        className="inline-flex h-14 items-center justify-center rounded-2xl bg-emerald-500 px-10 text-lg font-bold text-black transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
                                    >
                                        Join the Hub
                                    </Link>
                                    <a 
                                        href="#features"
                                        className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-10 text-lg font-bold text-white backdrop-blur-xl transition-all hover:bg-white/10"
                                    >
                                        Explore Tech
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Glass Feature Section */}
                <section id="features" className="py-32 px-6 sm:px-12">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col gap-4 mb-20">
                            <h3 className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-sm">Capabilities</h3>
                            <h2 className="text-4xl font-bold sm:text-5xl">Built for Scale.</h2>
                        </div>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {featureCards.map((feature, i) => (
                                <div 
                                    key={i}
                                    className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] p-8 transition-all hover:bg-white/[0.05] hover:border-emerald-500/30"
                                >
                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 transition-transform group-hover:scale-110 group-hover:rotate-3">
                                        {feature.icon}
                                    </div>
                                    <h4 className="mb-3 text-xl font-bold">{feature.title}</h4>
                                    <p className="text-sm leading-relaxed text-white/50">{feature.description}</p>
                                    <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-emerald-500/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Logistics Hub Interaction */}
                <section id="logistics" className="py-32 px-6 sm:px-12 bg-white/[0.02]">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-16 lg:grid-cols-2 items-center">
                            <div className="space-y-8">
                                <h3 className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-sm">Operations</h3>
                                <h2 className="text-4xl font-bold sm:text-6xl leading-tight">
                                    Precision Logistics <br />
                                    Engine.
                                </h2>
                                <p className="text-lg text-white/60 leading-relaxed">
                                    Our intelligent routing algorithm calculates the most efficient path 
                                    and transparent pricing based on real-world constraints.
                                </p>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="p-6 rounded-3xl border border-white/5 bg-black/40">
                                        <p className="text-3xl font-bold text-emerald-400">99.8%</p>
                                        <p className="text-xs uppercase tracking-widest text-white/40 mt-2">Uptime Rate</p>
                                    </div>
                                    <div className="p-6 rounded-3xl border border-white/5 bg-black/40">
                                        <p className="text-3xl font-bold text-emerald-400">0.5s</p>
                                        <p className="text-xs uppercase tracking-widest text-white/40 mt-2">Latency</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 to-transparent blur-2xl rounded-[40px]" />
                                <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-black/60 p-8 backdrop-blur-2xl">
                                    <div className="flex items-center justify-between mb-10">
                                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Hub Simulator</span>
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3">Target Route</label>
                                            <select 
                                                value={selectedRoute}
                                                onChange={(e) => setSelectedRoute(e.target.value)}
                                                className="w-full h-12 px-5 rounded-2xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                                            >
                                                <option className="bg-[#030506]">Pavia Hub - Santa Barbara</option>
                                                <option className="bg-[#030506]">Iloilo City - Leganes</option>
                                                <option className="bg-[#030506]">Zarraga Hub - New Lucena</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3">Load (KG)</label>
                                                <input 
                                                    type="number"
                                                    value={weight}
                                                    onChange={(e) => setWeight(Number(e.target.value))}
                                                    className="w-full h-12 px-5 rounded-2xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-emerald-500/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3">Distance (KM)</label>
                                                <input 
                                                    type="number"
                                                    value={distance}
                                                    onChange={(e) => setDistance(Number(e.target.value))}
                                                    className="w-full h-12 px-5 rounded-2xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-emerald-500/50"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold">Estimated Cost</span>
                                                <span className="text-3xl font-black text-emerald-400">₱{cost}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
