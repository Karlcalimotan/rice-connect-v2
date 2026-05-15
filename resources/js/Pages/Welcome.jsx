import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';

const featureCards = [
    {
        title: 'Intelligent Tracing',
        description: 'Track every bag across the supply chain with precision and provenance.',
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
        ),
    },
    {
        title: 'Smart Inventory',
        description: 'Automate stock levels for mills and warehouses using live sensor intelligence.',
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M3 10.5V20h18v-9.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M12 3v13.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M3 10.5l9-5.25 9 5.25"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M7.5 20V13.5H16.5V20"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        title: 'Ecosystem Trust',
        description: 'Build confidence among partners with immutable transaction and quality records.',
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M7 12l3 3 7-7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M4 19V5c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v14"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M4 7h16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        ),
    },
    {
        title: 'Secure Logistics',
        description: 'Encrypt transit records and keep goods moving safely from farm to shelf.',
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                    x="5"
                    y="11"
                    width="14"
                    height="8"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                />
                <path
                    d="M8 11V8a4 4 0 0 1 8 0v3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        ),
    },
];

export default function Welcome({ canLogin, canRegister }) {
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
            <Head title="Rice-Connect" />
            <div className="min-h-screen bg-[#030506] text-white">
                <section
                    className="relative overflow-hidden bg-fixed bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/70" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,90,39,0.22),_transparent_35%)]" />
                    <div className="relative z-10 mx-auto max-w-7xl px-6 py-6 sm:px-8">
                        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-[0_40px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-emerald-200/75">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-100">
                                    RC
                                </span>
                                Rice-Connect is live — digital rice logistics simplified.
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <a
                                    href="#logistics"
                                    className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm text-emerald-200 transition hover:bg-emerald-500/25"
                                >
                                    Explore logistics hub
                                </a>
                                <a
                                    href="#features"
                                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-emerald-500/40 hover:text-emerald-200"
                                >
                                    View features
                                </a>
                            </div>
                        </div>
                    </div>

                    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8">
                        <div className="flex items-center gap-3 text-white">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl font-semibold text-emerald-200 shadow-md shadow-black/20">
                                R
                            </span>
                            <div>
                                <p className="text-sm uppercase tracking-[0.35em] text-emerald-200/80">Rice-Connect</p>
                                <p className="text-xs text-slate-300/80">Supply Chain Intelligence</p>
                            </div>
                        </div>
                        <div className="hidden items-center gap-8 text-sm text-slate-200 md:flex">
                            <a href="#solutions" className="transition hover:text-emerald-300">Solutions</a>
                            <a href="#ecosystem" className="transition hover:text-emerald-300">Ecosystem</a>
                            <a href="#pricing" className="transition hover:text-emerald-300">Pricing</a>
                            <a href="/login" className="transition hover:text-emerald-300">Login</a>
                        </div>
                        <div className="hidden md:block">
                            <a
                                href="/register"
                                className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(45,90,39,0.35)] transition hover:bg-emerald-400"
                            >
                                Join the Hub
                            </a>
                        </div>
                    </nav>

                    <div className="relative mx-auto flex min-h-[calc(100vh-180px)] max-w-7xl items-center px-6 pb-24 pt-10 sm:px-8 lg:py-24">
                        <div className="max-w-3xl space-y-8">
                            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-emerald-200/90">
                                AGRITECH · SUPPLY CHAIN · INTELLIGENCE
                            </div>
                            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                                INTELLIGENCE IN EVERY GRAIN.
                                <span className="block text-emerald-300">Digitizing the Rice Supply Chain.</span>
                            </h1>
                            <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                                Rice-Connect brings modern logistics, traceability and secure analytics to rice farmers, millers, retailers and drivers across the Philippines.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <a
                                    href="#logistics"
                                    className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-7 py-3 text-base font-semibold text-white shadow-[0_18px_45px_rgba(45,90,39,0.35)] transition hover:bg-emerald-400 sm:w-auto"
                                >
                                    Join the Hub
                                </a>
                                <a
                                    href="#features"
                                    className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-3 text-base text-slate-100 transition hover:border-emerald-400 sm:w-auto"
                                >
                                    View Features
                                </a>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200">
                                    <p className="text-base font-semibold text-white">99.8%</p>
                                    <p className="mt-1 text-slate-400">Delivery reliability</p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200">
                                    <p className="text-base font-semibold text-white">0.5s</p>
                                    <p className="mt-1 text-slate-400">Real-time trace updates</p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200">
                                    <p className="text-base font-semibold text-white">4 hubs</p>
                                    <p className="mt-1 text-slate-400">Operational in Iloilo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
                    <div className="mb-12 max-w-3xl text-center">
                        <p className="text-sm uppercase tracking-[0.4em] text-emerald-300/80">Platform capabilities</p>
                        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                            Built for modern rice logistics.
                        </h2>
                        <p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">
                            A unified dashboard for supply chain operators, powered by AI-assisted tracing, inventory automation and secure logistics.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {featureCards.map((feature) => (
                            <article
                                key={feature.title}
                                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-6 text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-emerald-400/40 hover:shadow-[0_30px_90px_rgba(45,90,39,0.28)]"
                            >
                                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-200 ring-1 ring-white/10">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="logistics" className="mx-auto max-w-7xl px-6 pb-20 sm:px-8">
                    <div className="mb-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                        <div>
                            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/80">Logistics Hub</p>
                            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                                Iloilo Logistics Hub.
                            </h2>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                                A dedicated operations center with route optimization, pricing intelligence and logistics formula visibility for fast, secure rice delivery across Iloilo.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                            <div className="flex flex-wrap items-center justify-between gap-4 pb-5">
                                <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/80">Hub snapshot</p>
                                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                                    Live pricing
                                </span>
                            </div>
                            <div className="mt-6 space-y-4 rounded-3xl bg-[#0f1410]/90 p-5 ring-1 ring-white/10">
                                <div>
                                    <p className="text-sm text-slate-400">Pickup route</p>
                                    <p className="mt-1 text-lg font-semibold text-white">{selectedRoute}</p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="rounded-3xl bg-white/5 p-4 text-sm">
                                        <p className="text-slate-400">Weight (kg)</p>
                                        <p className="mt-2 text-xl font-semibold text-white">{weight}</p>
                                    </div>
                                    <div className="rounded-3xl bg-white/5 p-4 text-sm">
                                        <p className="text-slate-400">Distance (km)</p>
                                        <p className="mt-2 text-xl font-semibold text-white">{distance}</p>
                                    </div>
                                    <div className="rounded-3xl bg-emerald-500/10 p-4 text-sm text-emerald-100">
                                        <p className="text-slate-300">Estimated cost</p>
                                        <p className="mt-2 text-2xl font-semibold">₱{cost}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm text-slate-400">Route</label>
                                    <select
                                        value={selectedRoute}
                                        onChange={(event) => setSelectedRoute(event.target.value)}
                                        className="w-full rounded-3xl border border-white/10 bg-[#0d120f] px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                                    >
                                        <option>Pavia Hub - Santa Barbara</option>
                                        <option>Iloilo City - Leganes</option>
                                        <option>Zarraga Hub - New Lucena</option>
                                        <option>Bingawan Hub - San Dionisio</option>
                                    </select>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="block text-sm text-slate-400">
                                        Weight (kg)
                                        <input
                                            type="number"
                                            value={weight}
                                            min="200"
                                            onChange={(event) => setWeight(Number(event.target.value))}
                                            className="mt-2 w-full rounded-3xl border border-white/10 bg-[#0d120f] px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                                        />
                                    </label>
                                    <label className="block text-sm text-slate-400">
                                        Distance (km)
                                        <input
                                            type="number"
                                            value={distance}
                                            min="5"
                                            onChange={(event) => setDistance(Number(event.target.value))}
                                            className="mt-2 w-full rounded-3xl border border-white/10 bg-[#0d120f] px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                                        />
                                    </label>
                                </div>
                                <div className="rounded-3xl bg-[#0b100d] p-4 text-sm text-slate-300 ring-1 ring-white/10">
                                    <p className="font-semibold text-white">Logistics Formula</p>
                                    <p className="mt-2 leading-7">
                                        Cost = base fee + (weight / 50) + (distance × 1.7)
                                        <span className="block text-emerald-300">Base fee = ₱150, minimum cost ₱180</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:p-8">
                        <div className="flex items-center justify-between gap-4 pb-5 md:flex-row md:items-end">
                            <div>
                                <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/80">Route pricing</p>
                                <h3 className="mt-2 text-2xl font-semibold text-white">Iloilo route list</h3>
                            </div>
                            <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                                Updated daily
                            </span>
                        </div>
                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#07100e]">
                            <table className="min-w-full divide-y divide-white/10 text-sm text-slate-300">
                                <thead className="bg-white/3 text-left text-xs uppercase tracking-[0.18em] text-slate-400">
                                    <tr>
                                        <th className="px-5 py-4">Route</th>
                                        <th className="px-5 py-4">Estimated fare</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    <tr className="transition hover:bg-white/5">
                                        <td className="px-5 py-5">Pavia Hub - Santa Barbara</td>
                                        <td className="px-5 py-5 text-emerald-200">₱200.00</td>
                                    </tr>
                                    <tr className="transition hover:bg-white/5">
                                        <td className="px-5 py-5">Iloilo City - Leganes</td>
                                        <td className="px-5 py-5 text-emerald-200">₱180.00</td>
                                    </tr>
                                    <tr className="transition hover:bg-white/5">
                                        <td className="px-5 py-5">Zarraga Hub - New Lucena</td>
                                        <td className="px-5 py-5 text-emerald-200">₱235.00</td>
                                    </tr>
                                    <tr className="transition hover:bg-white/5">
                                        <td className="px-5 py-5">Bingawan Hub - San Dionisio</td>
                                        <td className="px-5 py-5 text-emerald-200">₱255.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
