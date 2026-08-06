<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnalyticsDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_unauthenticated(): void
    {
        $this->getJson('/api/analytics/data')->assertUnauthorized();
    }

    public function test_farmer_gets_yield_health_and_prices(): void
    {
        $farmer = User::factory()->create(['role' => 'farmer']);

        $this->actingAs($farmer)->getJson('/api/analytics/data')
            ->assertOk()
            ->assertJsonStructure(['summary', 'yieldData', 'healthData', 'pricesData']);
    }

    public function test_miller_gets_efficiency_recovery_storage_and_queue(): void
    {
        $miller = User::factory()->create(['role' => 'miller']);

        $this->actingAs($miller)->getJson('/api/analytics/data')
            ->assertOk()
            ->assertJsonStructure(['summary', 'efficiencyData', 'recoveryData', 'storageData', 'queueData']);
    }

    public function test_retailer_gets_turnover_heatmap_and_profits(): void
    {
        $retailer = User::factory()->create(['role' => 'retailer']);

        $this->actingAs($retailer)->getJson('/api/analytics/data')
            ->assertOk()
            ->assertJsonStructure(['summary', 'turnoverData', 'heatmapData', 'profitsData']);
    }

    public function test_admin_gets_volume_supply_chain_delivery_and_bottlenecks(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->getJson('/api/analytics/data')
            ->assertOk()
            ->assertJsonStructure(['summary', 'volumeData', 'supplyChain', 'deliveryPerf', 'bottlenecks']);
    }
}
