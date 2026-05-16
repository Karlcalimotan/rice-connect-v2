<?php

namespace Modules\Farmer\Http\Controllers;

use Modules\Farmer\Models\HarvestBatch;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FarmerController extends Controller
{
    /**
     * Display a listing of the harvest.
     */
    public function index(): Response
    {
        $batches = HarvestBatch::with(['buyer', 'interests.miller', 'acceptedMiller'])
            ->where('user_id', Auth::id())
            ->where('hidden_from_farmer', false)
            ->latest()
            ->get();

        return Inertia::render('Farmer::HarvestIndex', [
            'batches' => $batches,
        ]);
    }
    /**
     * Show the form for creating a new harvest batch.
     */
    public function create(): Response
    {
        return Inertia::render('Farmer::CreateHarvest');
    }
    /**
     * Remove the specified harvest from the database.
     */
    public function destroy($id)
    {
        $batch = HarvestBatch::where('user_id', Auth::id())->findOrFail($id);

        // Soft-hide the batch from the Farmer's UI while keeping DB history for Admin audit
        $batch->hidden_from_farmer = true;
        if (is_null($batch->hidden_at)) {
            $batch->hidden_at = now();
        }
        $batch->save();

        return redirect()->back()->with('message', 'Batch removed from your view (record preserved for audit).');
    }

    /**
     * Show the edit form (Optional: We can also use a Modal later)
     */
    public function edit($id): Response
    {
        $batch = HarvestBatch::where('user_id', Auth::id())->findOrFail($id);

        return Inertia::render('Farmer::EditHarvest', [
            'batch' => $batch
        ]);
    }

    public function update(Request $request, $id)
{
    $batch = HarvestBatch::where('user_id', Auth::id())->findOrFail($id);

    $validated = $request->validate([
        'rice_variety' => 'required|string|max:255',
        'harvest_date' => 'required|date',
        'condition' => 'required|in:fresh,ready',
    ]);

    $batch->update($validated);

    return redirect()->route('farmer.harvest')->with('message', 'Harvest updated successfully!');
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'rice_variety'   => 'required|string',
        'harvest_date'   => 'required|date',
        'condition'      => 'required|in:fresh,ready',
        'location'       => 'required|string', // Manual input mandatory
        'total_sacks'    => 'required|integer|min:1',
    ]);

    HarvestBatch::create([
        'user_id'        => auth()->id(),
        'location'       => $validated['location'], 
        'rice_variety'   => $validated['rice_variety'],
        'harvest_date'   => $validated['harvest_date'],
        'condition'      => $validated['condition'],
        'total_sacks'    => $validated['total_sacks'],
        'number_of_bags' => $validated['total_sacks'], // Sync for legacy views
        'status'         => 'available', // INITIAL STATUS
        'delivery_status' => 'Pending',
        'delivery_type'   => 'palay',
        'total_weight'   => 0,
        'price_per_kg'   => 0,
    ]);

    return redirect()->route('farmer.harvest')->with('message', 'Harvest logged successfully! Waiting for pickup.');
}
    public function offers()
{
    $offers = HarvestBatch::with('interests.miller')
        ->where('user_id', auth()->id())
        ->where('status', 'interest_received')
        ->get();

    return Inertia::render('Farmer::Offers', [
        'offers' => $offers
    ]);
}

    /**
     * Phase 3 Handshake: Farmer accepts a specific Miller's interest.
     */
    public function acceptHandshake(Request $request, $id)
    {
        $request->validate([
            'miller_id' => 'required|exists:users,id'
        ]);

        $batch = HarvestBatch::where('user_id', Auth::id())->findOrFail($id);

        $batch->update([
            'status' => 'Accepted',
            'delivery_status' => 'Pending',
            'accepted_miller_id' => $request->miller_id,
            'buyer_id' => $request->miller_id, // Sync for legacy buyer-based queries
        ]);

        return redirect()->back()->with('message', 'Agreement reached! Miller has been accepted.');
    }
}
