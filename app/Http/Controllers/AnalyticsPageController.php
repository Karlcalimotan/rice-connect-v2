<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AnalyticsPageController
{
    public function farmer(Request $request)
    {
        $user = $request->user();
        if (! $user || ($user->role !== 'farmer' && $user->role !== 'admin')) {
            abort(403);
        }

        return Inertia::render('Analytics/FarmerDashboard');
    }

    public function miller(Request $request)
    {
        $user = $request->user();
        if (! $user || ($user->role !== 'miller' && $user->role !== 'admin')) {
            abort(403);
        }

        return Inertia::render('Analytics/MillerDashboard');
    }

    public function retailer(Request $request)
    {
        $user = $request->user();
        if (! $user || ($user->role !== 'retailer' && $user->role !== 'admin')) {
            abort(403);
        }

        return Inertia::render('Analytics/RetailerDashboard');
    }

    public function admin(Request $request)
    {
        $user = $request->user();
        if (! $user || $user->role !== 'admin') {
            abort(403);
        }

        return Inertia::render('Analytics/AdminDashboard');
    }
}
