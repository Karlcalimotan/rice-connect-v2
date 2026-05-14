<?php

namespace Modules\Retailer\Http\Controllers;

use Modules\Farmer\Models\HarvestBatch; 
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia; 
use Inertia\Response; 

class RetailerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $listings = DB::table('finished_rice_stocks')
            ->join('users', 'finished_rice_stocks.miller_id', '=', 'users.id')
            ->leftJoin('miller_delivery_settings', 'finished_rice_stocks.miller_id', '=', 'miller_delivery_settings.miller_id')
            ->leftJoin('municipalities', 'users.municipality_id', '=', 'municipalities.id')
            ->select(
                'finished_rice_stocks.rice_variety',
                DB::raw('SUM(finished_rice_stocks.total_sacks) as total_sacks'),
                DB::raw('MIN(finished_rice_stocks.price_per_sack) as price_per_sack'),
                DB::raw('MIN(finished_rice_stocks.miller_id) as miller_id'),
                'users.first_name as miller_first_name',
                'users.last_name as miller_last_name',
                'users.municipality as miller_location',
                'miller_delivery_settings.base_delivery_fee',
                'miller_delivery_settings.extra_fee_per_municipality',
                'municipalities.distance_index as miller_municipality_index'
            )
            ->whereNotNull('finished_rice_stocks.price_per_sack')
            ->where('finished_rice_stocks.total_sacks', '>', 0)
            ->groupBy(
                'finished_rice_stocks.rice_variety', 
                'finished_rice_stocks.miller_id', 
                'users.first_name', 
                'users.last_name', 
                'users.municipality',
                'miller_delivery_settings.base_delivery_fee',
                'miller_delivery_settings.extra_fee_per_municipality',
                'municipalities.distance_index'
            )
            ->get();

        $retailerMun = DB::table('municipalities')
            ->where('id', auth()->user()->municipality_id)
            ->first();

        return Inertia::render('Retailer::Marketplace', [
            'available_rice' => $listings,
            'retailer_municipality' => $retailerMun ? $retailerMun->name : 'Iloilo City'
        ]);
    }

    /**
     * Handle placing an order and auto-deleting if stock is exhausted.
     */
    public function placeOrder(Request $request)
    {
        $request->validate([
            'rice_variety' => 'required|string',
            'sacks' => 'required|integer|min:1',
            'shipping_method' => 'required|in:pickup,delivery',
        ]);

        $requestedSacks = (int) $request->sacks;

        $batch = \App\Models\FinishedRiceStock::where('rice_variety', $request->rice_variety)
            ->whereNotNull('price_per_sack')
            ->where('total_sacks', '>', 0)
            ->first();

        if (!$batch || $batch->total_sacks < $requestedSacks) {
            return back()->withErrors(['message' => 'Insufficient stock!']);
        }

        $pricePerSack = (float) ($batch->price_per_sack ?? 0);
        $deliveryCharge = 0;

        if ($request->shipping_method === 'delivery') {
            $deliveryCharge = \App\Helpers\MunicipalityHelper::calculateFee($batch->miller_id, auth()->user()->municipality_id);
        }

        $totalPrice = ($requestedSacks * $pricePerSack) + $deliveryCharge;

        DB::transaction(function () use ($request, $batch, $requestedSacks, $deliveryCharge, $totalPrice, $pricePerSack) {
            $decrementKg = $requestedSacks * 50;

            $batch->decrement('total_sacks', $requestedSacks);
            $batch->decrement('unpacked_weight_kg', $decrementKg);

            DB::table('orders')->insert([
                'retailer_id' => auth()->id(),
                'miller_id' => $batch->miller_id,
                'stock_id' => $batch->id,
                'rice_variety' => $batch->rice_variety,
                'sacks' => $requestedSacks,
                'total_weight' => $decrementKg,
                'total_price' => $totalPrice,
                'shipping_method' => $request->shipping_method,
                'delivery_fee' => $deliveryCharge,
                'delivery_status' => 'Pending',
                'delivery_type' => 'rice',
                'status' => 'pending_preparation',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        return redirect()->route('retailer.purchases')->with('message', 'Order placed successfully!');
    }

    public function myOrders(): Response
    {
        $orders = DB::table('orders')
            ->where('retailer_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Retailer::MyOrders', [
            'orders' => $orders
        ]);
    }

    public function myPurchases(): Response
    {
        $orders = DB::table('orders')
            ->join('users', 'orders.miller_id', '=', 'users.id')
            ->select('orders.*', 'users.first_name as miller_first_name', 'users.last_name as miller_last_name')
            ->where('orders.retailer_id', auth()->id())
            ->orderByDesc('orders.created_at')
            ->get();

        return Inertia::render('Retailer::MyPurchases', [
            'orders' => $orders
        ]);
    }

    /**
     * Retailer confirms they have received the rice.
     */
    public function confirmReceived($id)
    {
        $order = \App\Models\Order::where('retailer_id', auth()->id())
            ->findOrFail($id);

        if ($order->delivery_status !== 'Delivered') {
            return redirect()->back()->withErrors('Cannot confirm receipt until the order is officially Delivered.');
        }

        $order->update([
            'delivery_status' => 'Confirmed Received',
            'status' => 'completed',
            'updated_at' => now()
        ]);

        return redirect()->back()->with('message', 'Delivery confirmed and signed! Order completed.');
    }
}
