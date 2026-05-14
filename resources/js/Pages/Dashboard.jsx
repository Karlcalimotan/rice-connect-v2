import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    // Use a function to safely get the route, or return '#' if it fails
    const safeRoute = (name) => {
        try {
            return route(name);
        } catch (e) {
            console.error(`Route ${name} not found`, e);
            return '#';
        }
    };

    const moduleLinks = {
        farmer: {
            title: 'Farmer Portal',
            description: 'Manage your harvests and view offers from millers.',
            link: safeRoute('farmer.harvest'),
            color: 'bg-green-600',
        },
        miller: {
            title: 'Miller Station',
            description: 'Browse palay marketplace and manage your rice inventory.',
            link: safeRoute('miller.marketplace'),
            color: 'bg-blue-600',
        },
        retailer: {
            title: 'Retailer Store',
            description: 'Order rice stocks and track your purchases.',
            link: safeRoute('retailer.marketplace'),
            color: 'bg-orange-600',
        },
        driver: {
            title: 'Logistics Dashboard',
            description: 'View your delivery assignments and update shipment status.',
            link: safeRoute('driver.dashboard'),
            color: 'bg-purple-600',
        },
    };

    const currentModule = user && user.role ? moduleLinks[user.role] : null;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Welcome back, {user?.first_name || 'User'}!
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Role-Specific Quick Access */}
                        {currentModule && (
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border-l-4 border-indigo-500">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900">Your Module Access</h3>
                                    <p className="mt-2 text-gray-600">{currentModule.description}</p>
                                    <Link
                                        href={currentModule.link}
                                        className={`mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${currentModule.color} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                    >
                                        Enter {currentModule.title}
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* System Status / Profile Info */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900">Account Status</h3>
                                <div className="mt-4 flex items-center">
                                    <div className="flex-shrink-0">
                                        <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{user?.email}</div>
                                        <div className="text-sm text-gray-500 capitalize">Role: {user?.role}</div>
                                    </div>
                                </div>
                                <div className="mt-6 border-t border-gray-100 pt-4">
                                    <Link href={safeRoute('profile.edit')} className="text-sm text-indigo-600 hover:text-indigo-900">
                                        Edit Profile Settings →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
