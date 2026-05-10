import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const inventoryMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jul', 'Aug'];
const inventoryValues = [126, 188, 144, 164, 156, 184, 176];

const statusItems = [
    { label: 'Today', value: 143, icon: 'rice' },
    { label: 'Local Rice', value: 20, icon: 'leaf' },
    { label: 'Privacy Store', value: 21, icon: 'basket' },
    { label: 'Byset', value: 7, icon: 'tool' },
];

const fulfillmentBars = [54, 102, 168, 142];
const fulfillmentLabels = ['Rev.', 'Sep', 'Rov.', 'Dec'];
const orderBars = [84, 42, 58, 69, 89];
const orderLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

const marketSeriesA = [68, 82, 73, 96, 118, 109, 132, 145];
const marketSeriesB = [55, 91, 104, 88, 97, 76, 101, 95];
const marketLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', ''];

function CardShell({ title, action, className = '', children }) {
    return (
        <article
            className={`rounded-[1.4rem] border border-rice-mutedOlive/35 bg-rice-parchment shadow-[0_14px_30px_rgba(7,30,24,0.18)] ${className}`}
            style={{
                backgroundImage:
                    'radial-gradient(circle at top left, rgba(255,255,255,0.55), transparent 26%), linear-gradient(180deg, rgba(245,243,236,0.98), rgba(236,229,212,0.98))',
            }}
        >
            <div className="flex items-start justify-between gap-4 px-5 pt-4">
                <h3 className="font-['Playfair_Display',serif] text-[1.05rem] text-rice-ink">{title}</h3>
                {action}
            </div>
            <div className="px-4 pb-4 pt-3">{children}</div>
        </article>
    );
}

function ChartIcon({ kind }) {
    if (kind === 'rice') {
        return (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M12 21V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M12 9c-2.8-.2-4.9-1.8-6.4-4.7 3.4.2 5.8 1.5 6.4 4.7Z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 13c-2.9.3-5.2-.4-6.9-2.5 3-.6 5.2-.3 6.9 2.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8c2.7.1 4.9-1.1 6.4-3.6-3.2-.1-5.5.9-6.4 3.6Z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 13c2.8.5 5 .2 6.6-1.1-3-.9-5.1-.7-6.6 1.1Z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    if (kind === 'leaf') {
        return (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M12 20V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M12 10c-2.8-.3-4.8-1.7-6-4.1 3.3.1 5.5 1.2 6 4.1Z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 14c-2.9.3-5.1-.3-6.7-1.8 3-.7 5.3-.5 6.7 1.8Z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    if (kind === 'basket') {
        return (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M6 9h12l-1.2 10H7.2L6 9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M9 9V7a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path d="M5 7h14M7 7l1 10h8l1-10M8.5 7V5.5M15.5 7V5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function BarChart({ values, labels, barColor = '#d7a24e', barColors, height = 190 }) {
    const max = Math.max(...values);
    return (
        <svg viewBox="0 0 240 170" className="h-[190px] w-full" aria-hidden="true">
            <line x1="30" y1="20" x2="30" y2="145" stroke="rgba(38,53,44,0.18)" />
            <line x1="30" y1="145" x2="225" y2="145" stroke="rgba(38,53,44,0.18)" />
            {[0, 50, 100, 150, 200].map((tick, index) => {
                const y = 145 - (index / 4) * 110;
                return (
                    <g key={tick}>
                        <line x1="30" y1={y} x2="225" y2={y} stroke="rgba(38,53,44,0.09)" />
                        <text x="5" y={y + 4} fill="#31443b" fontSize="9">{tick}</text>
                    </g>
                );
            })}
            <g>
                {values.map((value, index) => {
                    const x = 48 + index * 31;
                    const h = (value / max) * 105;
                    const y = 145 - h;
                    const fill = barColors?.[index] || barColor;
                    return (
                        <g key={`${labels[index]}-${index}`}>
                            <rect x={x} y={y} width="18" height={h} rx="2.8" fill={fill} stroke="rgba(84,67,39,0.35)" />
                            <text x={x + 9} y="160" textAnchor="middle" fill="#2b372f" fontSize="9">{labels[index]}</text>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
}

function LineChart({ seriesA, seriesB, labels, legendA, legendB, strokeA = '#68733a', strokeB = '#c5794c' }) {
    const max = Math.max(...seriesA, ...seriesB);
    const step = 180 / (Math.max(seriesA.length, seriesB.length) - 1);

    const buildPath = (series) => series.map((value, index) => `${index === 0 ? 'M' : 'L'} ${20 + index * step} ${125 - (value / max) * 95}`).join(' ');

    return (
        <svg viewBox="0 0 220 150" className="h-[180px] w-full" aria-hidden="true">
            <line x1="20" y1="130" x2="205" y2="130" stroke="rgba(38,53,44,0.18)" />
            {[30, 60, 90, 120].map((y) => (
                <line key={y} x1="20" y1={y} x2="205" y2={y} stroke="rgba(38,53,44,0.08)" />
            ))}
            <path d={`${buildPath(seriesA)} L 205 130 L 20 130 Z`} fill="rgba(198,117,76,0.12)" />
            <path d={buildPath(seriesA)} fill="none" stroke={strokeA} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d={buildPath(seriesB)} fill="none" stroke={strokeB} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            {labels.map((label, index) => (
                <text key={label} x={20 + index * step} y="144" textAnchor="middle" fill="#2b372f" fontSize="9">{label}</text>
            ))}
            <g>
                <circle cx="40" cy="14" r="2.6" fill={strokeA} />
                <text x="48" y="17" fill="#2b372f" fontSize="9">{legendA}</text>
                <circle cx="128" cy="14" r="2.6" fill={strokeB} />
                <text x="136" y="17" fill="#2b372f" fontSize="9">{legendB}</text>
            </g>
        </svg>
    );
}

export default function Dashboard() {
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Rice Connect Dashboard" />

            <div className="grid gap-5 xl:grid-cols-12">
                <CardShell
                    title="Current Rice Inventory"
                    className="xl:col-span-6"
                    action={
                        <button className="rounded-lg border border-rice-mutedOlive/30 bg-rice-parchment px-3 py-1 text-[11px] text-rice-ink shadow-sm">
                            Add date ▾
                        </button>
                    }
                >
                    <BarChart values={inventoryValues} labels={inventoryMonths} barColor="#d7a54f" />
                </CardShell>

                <CardShell
                    title="Status"
                    className="xl:col-span-2"
                    action={<span className="text-xl leading-none text-rice-ink/60">…</span>}
                >
                    <div className="space-y-4 pt-2">
                        {statusItems.map((item) => (
                            <div key={item.label} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-rice-mutedOlive/20 bg-rice-sideSage text-rice-forest">
                                        <ChartIcon kind={item.icon} />
                                    </span>
                                    <span className="font-['Playfair_Display',serif] text-[14px] text-rice-ink">{item.label}</span>
                                </div>
                                <span className="font-['Playfair_Display',serif] text-[14px] text-rice-ink">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </CardShell>

                <CardShell
                    title="Order Fulfillment Status"
                    className="xl:col-span-4"
                    action={<span className="text-xl leading-none text-rice-ink/60">…</span>}
                >
                    <BarChart values={fulfillmentBars} labels={fulfillmentLabels} barColors={['#cdb28b', '#b59b6d', '#8f764e', '#a68a5b']} />
                </CardShell>

                <CardShell
                    title="Order Fulfillment Status"
                    className="xl:col-span-4"
                    action={<span className="text-xl leading-none text-rice-ink/60">…</span>}
                >
                    <BarChart values={orderBars} labels={orderLabels} barColors={['#c77b56', '#86904d', '#b79b5d', '#d2a648', '#98805d']} />
                </CardShell>

                <CardShell
                    title="Market Price Trend"
                    className="xl:col-span-4"
                    action={<span className="text-xl leading-none text-rice-ink/60">…</span>}
                >
                    <LineChart
                        seriesA={[62, 74, 68, 88, 102, 96, 118]}
                        seriesB={[48, 63, 79, 72, 84, 67, 91]}
                        labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', '']}
                        legendA="Hand Rice"
                        legendB="Average"
                        strokeA="#7c8337"
                        strokeB="#c59652"
                    />
                </CardShell>

                <CardShell
                    title="Market Price Trend"
                    className="xl:col-span-4"
                    action={<span className="text-xl leading-none text-rice-ink/60">…</span>}
                >
                    <LineChart
                        seriesA={[44, 73, 55, 93, 82, 117, 108]}
                        seriesB={[38, 59, 77, 68, 96, 83, 101]}
                        labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', '']}
                        legendA="Foreel.chack"
                        legendB="Cream"
                        strokeA="#7e8a49"
                        strokeB="#c8874f"
                    />
                </CardShell>
            </div>
        </AuthenticatedLayout>
    );
}
