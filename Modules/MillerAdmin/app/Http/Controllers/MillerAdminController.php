<?php

namespace Modules\MillerAdmin\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Municipality;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class MillerAdminController extends Controller
{
    /**
     * Display the Global Logistics & Municipality Manager Dashboard.
     */
    public function index(): Response
    {
        $users = User::select('id', 'first_name', 'last_name', 'email', 'role', 'municipality', 'province', 'contact', 'created_at')
            ->orderByDesc('created_at')
            ->get();

        $batches = \Modules\Farmer\Models\HarvestBatch::with(['user', 'buyer'])
            ->orderByDesc('created_at')
            ->get();

        $orders = \App\Models\Order::with(['retailer', 'miller'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('MillerAdmin::Dashboard', [
            'users' => $users,
            'batches' => $batches,
            'orders' => $orders,
            'municipalities' => Municipality::orderBy('distance_index')->get()
        ]);
    }

    /**
     * Manage Municipalities.
     */
    public function municipalities(): Response
    {
        return Inertia::render('MillerAdmin::MunicipalitiesManager', [
            'municipalities' => Municipality::orderBy('distance_index')->get()
        ]);
    }

    /**
     * Store a newly created municipality.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:municipalities,name',
            'distance_index' => 'required|integer|unique:municipalities,distance_index'
        ]);

        Municipality::create([
            'name' => $request->name,
            'distance_index' => $request->distance_index,
        ]);

        return redirect()->back()->with('message', 'Municipality added successfully!');
    }

    /**
     * Update the specified municipality.
     */
    public function update(Request $request, $id)
    {
        $municipality = Municipality::findOrFail($id);

        $request->validate([
            'name' => 'required|string|unique:municipalities,name,' . $id,
            'distance_index' => 'required|integer|unique:municipalities,distance_index,' . $id
        ]);

        $municipality->update([
            'name' => $request->name,
            'distance_index' => $request->distance_index,
        ]);

        return redirect()->back()->with('message', 'Municipality updated successfully!');
    }

    /**
     * Remove the specified municipality.
     */
    public function destroy($id)
    {
        $municipality = Municipality::findOrFail($id);

        // Check if users are using this municipality
        $userCount = User::where('municipality_id', $id)->count();
        if ($userCount > 0) {
            return redirect()->back()->withErrors(['error' => 'Cannot delete municipality while it is assigned to users.']);
        }

        $municipality->delete();

        return redirect()->back()->with('message', 'Municipality deleted successfully!');
    }

    /**
     * Administrative deletion of a harvest batch with specific constraints.
     */
    public function destroyHarvestBatch($id)
    {
        $batch = \Modules\Farmer\Models\HarvestBatch::findOrFail($id);

        $hiddenAt = $batch->hidden_at ? \Carbon\Carbon::parse($batch->hidden_at) : null;
        $isHiddenAndOld = $hiddenAt && $hiddenAt->diffInDays(now()) >= 30;
        
        if (!$batch->hidden_from_farmer || !$isHiddenAndOld) {
            return redirect()->back()->withErrors(['error' => 'Condition not met: Record must be hidden by the Farmer for at least 30 days.']);
        }

        $isProcessed = in_array($batch->status, ['milled', 'processed', 'completed']);
        if (!$isProcessed) {
            return redirect()->back()->withErrors(['error' => 'Condition not met: Status must be processed/milled (moved to Finished Rice Stock).']);
        }

        $batch->delete();

        return redirect()->back()->with('message', 'Record permanently deleted.');
    }
}
