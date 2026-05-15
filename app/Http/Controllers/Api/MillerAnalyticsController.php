<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MillerProcessingLog;
use App\Models\MillerStorageCapacity;
use App\Models\MillingQueue;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MillerAnalyticsController extends Controller
{
    /**
     * Get processing efficiency metrics
     */
    public function processingEfficiency(): JsonResponse
    {
        $miller = Auth::user();
        
        $data = MillerProcessingLog::where('user_id', $miller->id)
            ->where('status', 'completed')
            ->selectRaw('
                DATE(processing_end) as date,
                AVG(recovery_rate) as avg_recovery,
                AVG(processing_efficiency) as avg_efficiency,
                COUNT(*) as batches_processed,
                SUM(output_rice_kg) as total_output
            ')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get()
            ->map(function ($log) {
                return [
                    'date' => $log->date,
                    'recovery_rate' => round($log->avg_recovery, 2),
                    'efficiency' => round($log->avg_efficiency, 2),
                    'batches' => $log->batches_processed,
                    'output_kg' => $log->total_output,
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    /**
     * Get recovery rates breakdown
     */
    public function recoveryRates(): JsonResponse
    {
        $miller = Auth::user();
        
        $data = MillerProcessingLog::where('user_id', $miller->id)
            ->where('status', 'completed')
            ->selectRaw('
                recovery_rate,
                COUNT(*) as batch_count,
                SUM(input_palay_kg) as total_input,
                SUM(output_rice_kg) as total_output,
                SUM(husk_waste_kg) as total_husk
            ')
            ->groupBy('recovery_rate')
            ->orderBy('recovery_rate', 'desc')
            ->get();

        $summary = [
            'avg_recovery' => MillerProcessingLog::where('user_id', $miller->id)
                ->where('status', 'completed')
                ->avg('recovery_rate'),
            'best_recovery' => MillerProcessingLog::where('user_id', $miller->id)
                ->where('status', 'completed')
                ->max('recovery_rate'),
            'total_input_kg' => MillerProcessingLog::where('user_id', $miller->id)
                ->where('status', 'completed')
                ->sum('input_palay_kg'),
            'total_waste_kg' => MillerProcessingLog::where('user_id', $miller->id)
                ->where('status', 'completed')
                ->sum('husk_waste_kg'),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $data,
            'summary' => $summary,
        ]);
    }

    /**
     * Get storage capacity utilization
     */
    public function storageUtilization(): JsonResponse
    {
        $miller = Auth::user();
        
        $storage = MillerStorageCapacity::where('user_id', $miller->id)->first();

        if (!$storage) {
            return response()->json([
                'status' => 'success',
                'data' => null,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_capacity_kg' => $storage->total_capacity_kg,
                'current_stock_kg' => $storage->current_stock_kg,
                'available_capacity_kg' => $storage->available_capacity_kg,
                'utilization_rate' => round($storage->utilization_rate, 2),
                'status' => match(true) {
                    $storage->utilization_rate >= 90 => 'critical',
                    $storage->utilization_rate >= 75 => 'warning',
                    default => 'normal',
                },
            ],
        ]);
    }

    /**
     * Get milling queue status
     */
    public function millingQueue(): JsonResponse
    {
        $miller = Auth::user();
        
        $queue = MillingQueue::where('miller_id', $miller->id)
            ->selectRaw('
                status,
                COUNT(*) as count,
                SUM(palay_kg) as total_kg,
                AVG(priority) as avg_priority
            ')
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        $pending = MillingQueue::where('miller_id', $miller->id)
            ->where('status', 'pending')
            ->selectRaw('
                id,
                palay_kg,
                priority,
                queued_at,
                TIMESTAMPDIFF(HOUR, queued_at, NOW()) as hours_waiting
            ')
            ->orderBy('priority', 'asc')
            ->orderBy('queued_at', 'asc')
            ->limit(10)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'summary' => [
                    'pending' => $queue->get('pending')?->count ?? 0,
                    'processing' => $queue->get('processing')?->count ?? 0,
                    'completed' => $queue->get('completed')?->count ?? 0,
                ],
                'pending_queue' => $pending,
            ],
        ]);
    }

    /**
     * Get miller summary statistics
     */
    public function summary(): JsonResponse
    {
        $miller = Auth::user();
        
        $totalProcessed = MillerProcessingLog::where('user_id', $miller->id)
            ->where('status', 'completed')
            ->sum('output_rice_kg');
        
        $avgRecovery = MillerProcessingLog::where('user_id', $miller->id)
            ->where('status', 'completed')
            ->avg('recovery_rate');
        
        $queuedBatches = MillingQueue::where('miller_id', $miller->id)
            ->where('status', '!=', 'completed')
            ->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_processed_kg' => $totalProcessed,
                'avg_recovery_rate' => round($avgRecovery, 2),
                'queued_batches' => $queuedBatches,
            ],
        ]);
    }
}
