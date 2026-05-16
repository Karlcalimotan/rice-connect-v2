import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const supplyPulse = [
    { day: 'Mon', harvest: 32, milling: 20, dispatch: 14 },
    { day: 'Tue', harvest: 38, milling: 24, dispatch: 16 },
    { day: 'Wed', harvest: 44, milling: 29, dispatch: 20 },
    { day: 'Thu', harvest: 52, milling: 34, dispatch: 26 },
    { day: 'Fri', harvest: 49, milling: 40, dispatch: 31 },
    { day: 'Sat', harvest: 57, milling: 46, dispatch: 35 },
    { day: 'Sun', harvest: 61, milling: 48, dispatch: 38 },
];

const routeMix = [
    { name: 'Parchment Stock', value: 38, color: '#6b8f5c' },
    { name: 'Fresh Intake', value: 27, color: '#c08b43' },
    { name: 'Dispatch Queue', value: 21, color: '#8d5d39' },
    { name: 'Reserve Ledger', value: 14, color: '#c3a153' },
];

const roleStats = {
    farmer: [
        { label: 'Open Harvest Lots', value: '18', note: 'Tagged for collection' },
        { label: 'Active Offers', value: '06', note: 'Awaiting review' },
        { label: 'Weather Window', value: '72h', note: 'Best harvesting span' },
        { label: 'Traceability', value: '96%', note: 'Ledger completeness' },
    ],
    miller: [
        { label: 'Incoming Palay', value: '84t', note: 'In receiving bays' },
        { label: 'Queue Depth', value: '12', note: 'Batches waiting' },
        { label: 'Finished Stock', value: '41t', note: 'Ready for dispatch' },
        { label: 'Utilization', value: '88%', note: 'Mill capacity used' },
    ],
    retailer: [
        { label: 'Stock Watch', value: '26', note: 'Rice varieties live' },
        { label: 'Orders in Transit', value: '09', note: 'Arriving this week' },
        { label: 'Restock Alerts', value: '04', note: 'Low shelf lanes' },
        { label: 'Fill Rate', value: '93%', note: 'Demand coverage' },
    ],
    driver: [
        { label: 'Routes Active', value: '14', note: 'Assigned today' },
        { label: 'Stops Remaining', value: '22', note: 'Across four towns' },
        { label: 'On-Time Rate', value: '97%', note: 'Last 30 days' },
        { label: 'Verified Handoffs', value: '31', note: 'Signed ledgers' },
    ],
    admin: [
        { label: 'Regions Tracked', value: '12', note: 'Live municipalities' },
        { label: 'Bottlenecks', value: '04', note: 'Needs attention' },
        { label: 'Volume Moved', value: '1.8k', note: 'Tons this month' },
        { label: 'Health Index', value: '89%', note: 'Network status' },
    ],
};

const roleCards = {
    farmer: {
        title: 'Farmer Portal',
        description: 'Manage harvests, inspect offers, and keep the field ledger aligned with market demand.',
        link: 'farmer.harvest',
        accent: '#6b8f5c',
        icon: '◌',
    },
    miller: {
        title: 'Miller Station',
        description: 'Balance the intake queue, market supply, and processed stock from a single working surface.',
        link: 'miller.marketplace',
        accent: '#8d5d39',
        icon: '≋',
    },
    retailer: {
        title: 'Retailer Store',
        description: 'Watch the stock room, place replenishment orders, and trace every movement to the shelf.',
        link: 'retailer.marketplace',
        accent: '#c08b43',
        icon: '▣',
    },
    driver: {
        title: 'Logistics Dashboard',
        description: 'View route assignments, delivery handoffs, and the next transfer in the corridor.',
        link: 'driver.dashboard',
        accent: '#6d7f4f',
        icon: '⇄',
    },
    admin: {
        title: 'Administration Archive',
        description: 'Review network health, regional bottlenecks, and the flow between all supply chain actors.',
        link: 'admin.analytics',
        accent: '#6b8f5c',
        icon: '⌂',
    },
};

function RiceSprigIcon() {
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path strokeWidth="1.8" d="M12 21V4" />
            <path strokeWidth="1.8" d="M12 9c-2.3-1.5-3.9-3.1-4.9-4.9" />
            <path strokeWidth="1.8" d="M12 11.5c-2.8-.8-4.8-2.4-6-4.6" />
            <path strokeWidth="1.8" d="M12 14c2.3-1.5 3.9-3.1 4.9-4.9" />
            <path strokeWidth="1.8" d="M12 16.5c2.8-.8 4.8-2.4 6-4.6" />
        </svg>
    );
}

function ArchiveLeafIcon() {
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path strokeWidth="1.8" d="M5 7.5h14v11H5z" />
            <path strokeWidth="1.8" d="M7.5 7.5V5h9v2.5" />
            <path strokeWidth="1.8" d="M10 12.2c1.8-.1 3.2.5 4.5 1.9" />
            <path strokeWidth="1.8" d="M11.2 14.8c-1.4-.5-2.5-1.4-3.4-2.8" />
        </svg>
    );
}

function FieldTrailIcon() {
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path strokeWidth="1.8" d="M3.5 18.5c2.8-6 5.9-9.5 9.5-11 3.2-1.4 5.8-1.4 7.5-.7" />
            <path strokeWidth="1.8" d="M17 6.8c.6 1.3 1.1 2.8 1.3 4.5" />
            <path strokeWidth="1.8" d="M13.4 8.6c.7 1.2 1.3 2.8 1.5 4.8" />
        </svg>
    );
}

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    const safeRoute = (name) => {
        try {
            return route(name);
        } catch (error) {
            console.error(`Route ${name} not found`, error);
            return '#';
        }
    };

    const moduleLinks = {
        farmer: {
            title: 'Farmer Portal',
            description: 'Manage your harvests and view offers from millers.',
            link: safeRoute('farmer.harvest'),
            color: '#6b8f5c',
        },
        miller: {
            title: 'Miller Station',
            description: 'Browse palay marketplace and manage your rice inventory.',
            link: safeRoute('miller.marketplace'),
            color: '#8d5d39',
        },
        retailer: {
            title: 'Retailer Store',
            description: 'Order rice stocks and track your purchases.',
            link: safeRoute('retailer.marketplace'),
            color: '#c08b43',
        },
        driver: {
            title: 'Logistics Dashboard',
            description: 'View your delivery assignments and update shipment status.',
            link: safeRoute('driver.dashboard'),
            color: '#6d7f4f',
        },
        admin: {
            title: 'Administration Archive',
            description: 'Monitor network health and regional bottlenecks.',
            link: safeRoute('admin.analytics'),
            color: '#6b8f5c',
        },
    };

    const currentModule = user && user.role ? moduleLinks[user.role] : null;
    const stats = roleStats[user?.role] || roleStats.admin;
    const roleCard = roleCards[user?.role] || roleCards.admin;
    const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.trim() || 'RC';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-['Playfair_Display',serif] text-xl font-semibold leading-tight text-[#17362b]">
                    Welcome back, {user?.first_name || 'User'}
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-8">
                <section className="relative overflow-hidden rounded-[2.25rem] border border-[#c3a153]/22 bg-[linear-gradient(135deg,rgba(18,56,46,0.98),rgba(10,36,29,0.94))] p-8 text-[#f7efd6] shadow-[0_32px_80px_rgba(14,33,24,0.25)] lg:p-10">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#c3a153]/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-1/3 translate-y-1/3 rounded-full border border-[#c3a153]/20" />
                    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.45em] text-[#d8c79a]">
                                <ArchiveLeafIcon />
                                Supply Chain Ledger
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-[0.45em] text-[#d7c59a]">Rice Connect</p>
                                <h1 className="mt-3 max-w-3xl font-['Playfair_Display',serif] text-4xl font-semibold tracking-tight text-white lg:text-6xl">
                                    A scholarly command deck for the rice supply chain.
                                </h1>
                            </div>
                            <p className="max-w-2xl text-sm leading-7 text-[#efe4c7] lg:text-base">
                                A dark-academia workspace for farmers, millers, retailers, and logistics teams. Track movement, verify ledgers, and move between modules with a muted green archive aesthetic.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={safeRoute('profile.edit')}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#c3a153]/35 bg-[rgba(255,248,230,0.08)] px-5 py-3 text-sm font-medium text-[#f8eed0] transition hover:-translate-y-0.5 hover:bg-[rgba(255,248,230,0.13)]"
                                >
                                    <FieldTrailIcon />
                                    Edit profile
                                </Link>
                                {currentModule && (
                                    <Link
                                        href={currentModule.link}
                                        className="inline-flex items-center gap-2 rounded-full bg-[#c3a153] px-5 py-3 text-sm font-semibold text-[#102820] transition hover:-translate-y-0.5 hover:bg-[#d0b15c]"
                                    >
                                        <RiceSprigIcon />
                                        Enter {currentModule.title}
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,248,230,0.08)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                            <div className="flex items-center gap-4 border-b border-white/10 pb-5">
                                <div className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-[#f7eed2] text-xl font-black text-[#12352a] shadow-inner">
                                    {initials}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#d7c59a]">Account ledger</p>
                                    <p className="mt-2 font-['Playfair_Display',serif] text-2xl text-white">{user?.first_name} {user?.last_name}</p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[#e4d8b8]">{user?.role} access</p>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Username', value: user?.email || '—' },
                                    { label: 'Role', value: user?.role || '—' },
                                    { label: 'Current Node', value: currentModule?.title || 'Archive' },
                                    { label: 'Session', value: 'Verified' },
                                ].map((item) => (
                                    <div key={item.label} className="rounded-[1.15rem] border border-white/8 bg-black/10 p-3">
                                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d7c59a]">{item.label}</p>
                                           <p className="mt-2 text-sm text-[#fbf1da] break-words break-all whitespace-normal">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat, index) => (
                        <article key={stat.label} className="rc-stat relative overflow-hidden rounded-[1.75rem] p-5">
                            <div className="absolute right-4 top-4 h-10 w-10 rounded-full bg-[#c3a153]/10" />
                            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#7c6840]">0{index + 1}</p>
                            <h3 className="mt-4 text-sm font-medium text-[#5d4b34]">{stat.label}</h3>
                            <p className="mt-3 font-['Playfair_Display',serif] text-4xl font-semibold text-[#12382e]">{stat.value}</p>
                            <p className="mt-2 text-sm text-[#6d5a40]">{stat.note}</p>
                        </article>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
                    <article className="rc-chart-frame rounded-[2rem] p-6 lg:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#7c6840]">Operational rhythm</p>
                                <h2 className="rc-section-title mt-2 text-3xl text-[#12382e]">Supply pulse over seven days</h2>
                            </div>
                            <span className="rc-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em]">Earth-tone chart</span>
                        </div>

                        <div className="mt-6 h-[340px] rounded-[1.5rem] border border-[#c3a153]/18 bg-[rgba(250,244,230,0.7)] p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={supplyPulse}>
                                    <defs>
                                        <linearGradient id="harvestFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6b8f5c" stopOpacity={0.42} />
                                            <stop offset="95%" stopColor="#6b8f5c" stopOpacity={0.04} />
                                        </linearGradient>
                                        <linearGradient id="millingFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#c08b43" stopOpacity={0.34} />
                                            <stop offset="95%" stopColor="#c08b43" stopOpacity={0.03} />
                                        </linearGradient>
                                        <linearGradient id="dispatchFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8d5d39" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8d5d39" stopOpacity={0.03} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid stroke="rgba(122,98,57,0.18)" strokeDasharray="4 6" />
                                    <XAxis dataKey="day" tick={{ fill: '#6d5a40', fontSize: 12 }} axisLine={{ stroke: 'rgba(122,98,57,0.2)' }} tickLine={false} />
                                    <YAxis tick={{ fill: '#6d5a40', fontSize: 12 }} axisLine={{ stroke: 'rgba(122,98,57,0.2)' }} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#f7efd7',
                                            border: '1px solid rgba(195,161,83,0.3)',
                                            borderRadius: '16px',
                                            color: '#1d1a16',
                                        }}
                                        cursor={{ stroke: 'rgba(195,161,83,0.25)', strokeWidth: 1 }}
                                    />
                                    <Legend wrapperStyle={{ color: '#5d4b34' }} />
                                    <Area type="monotone" dataKey="harvest" stroke="#6b8f5c" fill="url(#harvestFill)" strokeWidth={2.5} />
                                    <Area type="monotone" dataKey="milling" stroke="#c08b43" fill="url(#millingFill)" strokeWidth={2.5} />
                                    <Area type="monotone" dataKey="dispatch" stroke="#8d5d39" fill="url(#dispatchFill)" strokeWidth={2.5} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </article>

                    <article className="rc-chart-frame rounded-[2rem] p-6 lg:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#7c6840]">Archive balance</p>
                                <h2 className="rc-section-title mt-2 text-3xl text-[#12382e]">Ledger composition</h2>
                            </div>
                            <span className="rc-chip rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em]">Muted gold</span>
                        </div>

                        <div className="mt-6 h-[280px] rounded-[1.5rem] border border-[#c3a153]/18 bg-[rgba(250,244,230,0.7)] p-3">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#f7efd7',
                                            border: '1px solid rgba(195,161,83,0.3)',
                                            borderRadius: '16px',
                                            color: '#1d1a16',
                                        }}
                                    />
                                    <Pie data={routeMix} dataKey="value" innerRadius={58} outerRadius={92} paddingAngle={4}>
                                        {routeMix.map((entry) => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-5 space-y-3">
                            {routeMix.map((entry) => (
                                <div key={entry.name} className="flex items-center justify-between rounded-[1.15rem] border border-[#c3a153]/16 bg-[rgba(255,249,236,0.7)] px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                        <span className="text-sm text-[#2a241d]">{entry.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#5d4b34]">{entry.value}%</span>
                                </div>
                            ))}
                        </div>
                    </article>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <article className="rc-panel rounded-[2rem] p-6 lg:p-7">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#7c6840]">Module access</p>
                                <h2 className="rc-section-title mt-2 text-3xl text-[#12382e]">Structural elements carried over</h2>
                            </div>
                            <RiceSprigIcon />
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {Object.entries(moduleLinks).map(([key, module]) => {
                                const isCurrent = user?.role === key;
                                return (
                                    <article
                                        key={module.title}
                                        className={`rc-card rounded-[1.5rem] p-5 transition-transform duration-200 hover:-translate-y-1 ${isCurrent ? 'ring-1 ring-[#c3a153]/35' : ''}`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl font-bold text-[#f7efd6]" style={{ backgroundColor: module.color }}>
                                                    {module.title.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7c6840]">{module.title}</p>
                                                    <h3 className="mt-1 font-['Playfair_Display',serif] text-xl text-[#12382e]">{module.title}</h3>
                                                </div>
                                            </div>
                                            <span className="text-2xl text-[#7c6840]">{roleCard.icon}</span>
                                        </div>

                                        <p className="mt-4 text-sm leading-6 text-[#5d4b34]">{module.description}</p>
                                        <Link
                                            href={module.link}
                                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#12382e] transition hover:text-[#6b8f5c]"
                                        >
                                            Open archive
                                            <span aria-hidden="true">→</span>
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>
                    </article>

                    <article className="rc-panel rounded-[2rem] p-6 lg:p-7">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#7c6840]">Current workspace</p>
                                <h2 className="rc-section-title mt-2 text-3xl text-[#12382e]">{roleCard.title}</h2>
                            </div>
                            <span className="rounded-full border border-[#c3a153]/18 bg-[#f3e4bf] px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-[#6b521b]">{user?.role}</span>
                        </div>

                        <div className="mt-5 rounded-[1.5rem] border border-[#c3a153]/18 bg-[linear-gradient(180deg,rgba(248,241,227,0.96),rgba(242,231,205,0.94))] p-5">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#12382e] text-2xl font-black text-[#f7eed1] shadow-inner">
                                    {roleCard.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#7c6840]">Role focus</p>
                                    <p className="mt-2 font-['Playfair_Display',serif] text-2xl text-[#12382e]">{roleCard.title}</p>
                                </div>
                            </div>

                            <p className="mt-4 text-sm leading-6 text-[#5d4b34]">{roleCard.description}</p>

                            {currentModule && (
                                <Link
                                    href={currentModule.link}
                                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#12382e] px-5 py-3 text-sm font-semibold text-[#f7eed6] transition hover:-translate-y-0.5 hover:bg-[#184333]"
                                >
                                    Enter {currentModule.title}
                                    <span aria-hidden="true">→</span>
                                </Link>
                            )}
                        </div>

                        <div className="mt-5 space-y-3">
                            {[
                                'Soft shadows keep the panels tactile without turning glossy.',
                                'Muted green replaces the previous bright accents across the authenticated UI.',
                                'The sidebar remains vertical and organized for faster module switching.',
                            ].map((note) => (
                                <div key={note} className="flex items-start gap-3 rounded-[1.1rem] border border-[#c3a153]/15 bg-[rgba(255,249,236,0.8)] px-4 py-3 text-sm text-[#5d4b34]">
                                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#6b8f5c]" />
                                    <span>{note}</span>
                                </div>
                            ))}
                        </div>
                    </article>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
