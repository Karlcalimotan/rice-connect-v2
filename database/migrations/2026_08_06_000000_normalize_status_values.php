<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * One-time normalization of status values to the canonical vocabulary
 * defined in app/Enums/*. Idempotent and safe to run on empty databases.
 *
 * Canonical sources:
 *   - harvest_batches.status -> App\Enums\HarvestBatchStatus (lowercase)
 *   - orders.status          -> App\Enums\OrderStatus (lowercase)
 *   - *.delivery_status      -> App\Enums\DeliveryStatus (Title Case)
 *   - bookings.status        -> App\Enums\BookingStatus (lowercase)
 */
return new class extends Migration
{
    public function up(): void
    {
        // harvest_batches.status: collapse legacy casing/values into canonical form.
        DB::table('harvest_batches')
            ->whereIn('status', ['Accepted', 'milling'])
            ->update(['status' => DB::raw("CASE status
                WHEN 'Accepted' THEN 'accepted'
                WHEN 'milling' THEN 'milled'
                ELSE status END")]);

        // Defensive: any leftover whitespace in batch status.
        DB::table('harvest_batches')
            ->where('status', 'LIKE', '% %')
            ->update(['status' => DB::raw('TRIM(status)')]);

        // delivery_status columns: collapse lowercase variants to Title Case.
        $deliveryMap = [
            'pending' => 'Pending',
            'in transit' => 'In Transit',
            'payment pending' => 'Payment Pending',
            'payment authorized' => 'Payment Authorized',
            'received' => 'Received',
            'confirmed received' => 'Confirmed Received',
            'delivered' => 'Delivered',
            'completed' => 'Completed',
        ];
        foreach (['harvest_batches', 'orders'] as $table) {
            foreach ($deliveryMap as $from => $to) {
                DB::table($table)
                    ->where('delivery_status', '=', $from)
                    ->update(['delivery_status' => $to]);
            }
        }
    }

    public function down(): void
    {
        // Reverse mappings are intentionally NOT applied; this is a one-time,
        // forward-only data normalization.
        Schema::table('harvest_batches', function (Blueprint $table) {
            //
        });
    }
};
