<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\FinishedRiceStock;
use App\Models\Order;
use App\Models\User;
use App\Models\Wallet;
use App\Services\PaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Farmer\Models\HarvestBatch;
use Tests\TestCase;

class BookingFlowTest extends TestCase
{
    use RefreshDatabase;

    private function makeDriver(array $extra = []): User
    {
        return User::create(array_merge([
            'first_name' => 'Test',
            'last_name' => 'Driver',
            'username' => 'driver_' . uniqid(),
            'email' => uniqid() . '@example.test',
            'contact' => '09123456789',
            'password' => bcrypt('password'),
            'role' => 'driver',
            'is_verified_driver' => true,
        ], $extra));
    }

    private function makeUser(string $role, string $prefix): User
    {
        return User::create([
            'first_name' => $prefix,
            'last_name' => ucfirst($role),
            'username' => $prefix . '_' . uniqid(),
            'email' => $prefix . uniqid() . '@example.test',
            'contact' => '09123456780',
            'password' => bcrypt('password'),
            'role' => $role,
        ]);
    }

    private function makeOrder(User $retailer, User $miller): Order
    {
        $stock = FinishedRiceStock::create([
            'miller_id' => $miller->id,
            'rice_variety' => 'NSIC Rc 222',
            'total_sacks' => 100,
            'unpacked_weight_kg' => 5000,
            'price_per_sack' => 1000,
        ]);

        return Order::create([
            'retailer_id' => $retailer->id,
            'miller_id' => $miller->id,
            'stock_id' => $stock->id,
            'rice_variety' => 'NSIC Rc 222',
            'sacks' => 5,
            'total_weight' => 250,
            'total_price' => 5000,
            'shipping_method' => 'delivery',
            'fulfillment_type' => 'delivery',
            'delivery_fee' => 150,
            'delivery_status' => 'Pending',
            'delivery_type' => 'rice',
            'status' => 'pending_preparation',
        ]);
    }

    private function makePalayBatch(User $farmer, User $miller): HarvestBatch
    {
        return HarvestBatch::create([
            'user_id' => $farmer->id,
            'buyer_id' => $miller->id,
            'rice_variety' => 'NSIC Rc 222',
            'harvest_date' => now()->toDateString(),
            'condition' => 'fresh',
            'location' => 'Dingle, Iloilo',
            'total_sacks' => 10,
            'number_of_bags' => 10,
            'status' => 'accepted',
            'delivery_status' => 'Pending',
            'delivery_type' => 'palay',
            'total_weight' => 0,
            'price_per_kg' => 0,
        ]);
    }

    public function test_driver_can_accept_a_pending_booking_and_it_leaves_the_pool(): void
    {
        $driver = $this->makeDriver();
        $retailer = $this->makeUser('retailer', 'rita');
        $miller = $this->makeUser('miller', 'manny');
        $order = $this->makeOrder($retailer, $miller);

        $booking = Booking::create([
            'bookable_type' => User::class,
            'bookable_id' => $miller->id,
            'origin_address' => 'Pototan, Iloilo',
            'destination_address' => 'Iloilo City',
            'total_weight_kg' => 250,
            'estimated_sacks' => 5,
            'status' => BookingStatus::Pending->value,
            'order_id' => $order->id,
        ]);

        $this->actingAs($driver)
            ->from('/driver/dashboard')
            ->post(route('bookings.accept', $booking->id))
            ->assertRedirect('/driver/dashboard')
            ->assertSessionHas('message');

        $this->assertSame(BookingStatus::Assigned->value, $booking->fresh()->status);
        $this->assertSame($driver->id, $booking->fresh()->driver_id);
        $this->assertSame($driver->id, $order->fresh()->driver_id);
        $this->assertDatabaseMissing('bookings', [
            'id' => $booking->id,
            'status' => BookingStatus::Pending->value,
        ]);
    }

    public function test_non_driver_cannot_accept_a_job(): void
    {
        $retailer = $this->makeUser('retailer', 'rita');
        $miller = $this->makeUser('miller', 'manny');
        $order = $this->makeOrder($retailer, $miller);

        $booking = Booking::create([
            'bookable_type' => User::class,
            'bookable_id' => $miller->id,
            'origin_address' => 'Pototan, Iloilo',
            'destination_address' => 'Iloilo City',
            'total_weight_kg' => 250,
            'estimated_sacks' => 5,
            'status' => BookingStatus::Pending->value,
            'order_id' => $order->id,
        ]);

        $this->actingAs($retailer)
            ->from('/retailer/orders')
            ->post(route('bookings.accept', $booking->id))
            ->assertSessionHasErrors();

        $this->assertSame(BookingStatus::Pending->value, $booking->fresh()->status);
    }

    public function test_a_job_cannot_be_claimed_twice(): void
    {
        $driverA = $this->makeDriver();
        $driverB = $this->makeDriver();
        $retailer = $this->makeUser('retailer', 'rita');
        $miller = $this->makeUser('miller', 'manny');
        $order = $this->makeOrder($retailer, $miller);

        $booking = Booking::create([
            'bookable_type' => User::class,
            'bookable_id' => $miller->id,
            'origin_address' => 'Pototan, Iloilo',
            'destination_address' => 'Iloilo City',
            'total_weight_kg' => 250,
            'estimated_sacks' => 5,
            'status' => BookingStatus::Pending->value,
            'order_id' => $order->id,
        ]);

        $this->actingAs($driverA)->from('/driver/dashboard')->post(route('bookings.accept', $booking->id));

        $this->actingAs($driverB)
            ->from('/driver/dashboard')
            ->post(route('bookings.accept', $booking->id))
            ->assertSessionHasErrors();

        $this->assertSame($driverA->id, $booking->fresh()->driver_id);
    }

    public function test_status_transitions_are_forward_only(): void
    {
        $driver = $this->makeDriver();
        $retailer = $this->makeUser('retailer', 'rita');
        $miller = $this->makeUser('miller', 'manny');
        $order = $this->makeOrder($retailer, $miller);

        $booking = Booking::create([
            'bookable_type' => User::class,
            'bookable_id' => $miller->id,
            'origin_address' => 'Pototan, Iloilo',
            'destination_address' => 'Iloilo City',
            'total_weight_kg' => 250,
            'estimated_sacks' => 5,
            'status' => BookingStatus::Pending->value,
            'order_id' => $order->id,
        ]);

        $this->actingAs($driver)->from('/driver/dashboard')->post(route('bookings.accept', $booking->id));

        // Skipping a stage is rejected
        $this->actingAs($driver)
            ->from('/driver/dashboard')
            ->post(route('bookings.update_status', $booking->id), ['status' => 'delivered'])
            ->assertSessionHasErrors();

        // Forward steps work
        $this->actingAs($driver)->from('/driver/dashboard')->post(route('bookings.update_status', $booking->id), ['status' => 'at_pickup']);
        $this->actingAs($driver)->from('/driver/dashboard')->post(route('bookings.update_status', $booking->id), ['status' => 'in_transit']);
        $this->actingAs($driver)->from('/driver/dashboard')->post(route('bookings.update_status', $booking->id), ['status' => 'delivered']);

        $this->assertSame(BookingStatus::Delivered->value, $booking->fresh()->status);
        $this->assertSame('Delivered', $order->fresh()->delivery_status);
    }

    public function test_palay_transit_is_gated_on_miller_payment_authorization(): void
    {
        $driver = $this->makeDriver();
        $farmer = $this->makeUser('farmer', 'karl');
        $miller = $this->makeUser('miller', 'manny');
        $batch = $this->makePalayBatch($farmer, $miller);

        $booking = Booking::create([
            'bookable_type' => User::class,
            'bookable_id' => $farmer->id,
            'origin_address' => 'Dingle, Iloilo',
            'destination_address' => 'Pototan, Iloilo',
            'total_weight_kg' => 500,
            'estimated_sacks' => 10,
            'status' => BookingStatus::Pending->value,
            'harvest_batch_id' => $batch->id,
        ]);

        $this->actingAs($driver)->from('/driver/dashboard')->post(route('bookings.accept', $booking->id));
        $this->actingAs($driver)->from('/driver/dashboard')->post(route('bookings.update_status', $booking->id), ['status' => 'at_pickup']);

        // Without a driver-logged weight + Miller authorization, transit is blocked.
        $this->actingAs($driver)
            ->from('/driver/dashboard')
            ->post(route('bookings.update_status', $booking->id), ['status' => 'in_transit'])
            ->assertSessionHasErrors();

        $this->assertSame(BookingStatus::AtPickup->value, $booking->fresh()->status);

        // Simulate the driver logging weight (requestPickup) and the Miller authorizing.
        $batch->update(['actual_weight_kg' => 480, 'suggested_price_per_kg' => 20, 'delivery_status' => 'Payment Authorized', 'status' => 'payment_authorized']);

        $this->actingAs($driver)->from('/driver/dashboard')->post(route('bookings.update_status', $booking->id), ['status' => 'in_transit']);
        $this->actingAs($driver)->from('/driver/dashboard')->post(route('bookings.update_status', $booking->id), ['status' => 'delivered']);

        $this->assertSame(BookingStatus::Delivered->value, $booking->fresh()->status);
        $this->assertSame('Received', $batch->fresh()->delivery_status);
    }

    public function test_retailer_can_book_a_driver_for_a_pending_delivery_order(): void
    {
        $driver = $this->makeDriver();
        $retailer = $this->makeUser('retailer', 'rita');
        $miller = $this->makeUser('miller', 'manny');
        $order = $this->makeOrder($retailer, $miller);

        $booking = Booking::create([
            'bookable_type' => User::class,
            'bookable_id' => $miller->id,
            'origin_address' => 'Pototan, Iloilo',
            'destination_address' => 'Iloilo City',
            'total_weight_kg' => 250,
            'estimated_sacks' => 5,
            'status' => BookingStatus::Pending->value,
            'order_id' => $order->id,
        ]);

        $this->actingAs($retailer)
            ->from(route('retailer.orders'))
            ->post(route('retailer.order.book_driver', $order->id), ['driver_id' => $driver->id])
            ->assertRedirect(route('retailer.orders'))
            ->assertSessionHas('message');

        $this->assertSame($driver->id, $order->fresh()->driver_id);
        $this->assertSame(BookingStatus::Assigned->value, $booking->fresh()->status);
        $this->assertSame($driver->id, $booking->fresh()->driver_id);
    }

    public function test_miller_finalize_pays_the_farmer_exactly_once(): void
    {
        $farmer = $this->makeUser('farmer', 'karl');
        $miller = $this->makeUser('miller', 'manny');
        $batch = $this->makePalayBatch($farmer, $miller);

        $batch->update([
            'actual_weight_kg' => 480,
            'suggested_price_per_kg' => 20,
            'delivery_status' => 'Received',
            'status' => 'received',
        ]);

        PaymentService::credit($miller->id, 100000, 'Opening Balance (test capital)');
        $balanceBefore = (float) Wallet::where('user_id', $miller->id)->value('balance');

        $this->actingAs($miller)
            ->from('/miller/transport')
            ->post(route('miller.palay.finalize', $batch->id), ['final_price_per_kg' => 25])
            ->assertSessionHas('message');

        $total = 480 * 25;
        $this->assertEqualsWithDelta($total, (float) Wallet::where('user_id', $farmer->id)->value('balance'), 0.001);
        $this->assertEqualsWithDelta($balanceBefore - $total, (float) Wallet::where('user_id', $miller->id)->value('balance'), 0.001);

        // Second attempt must not move funds again (idempotency via reference).
        $this->actingAs($miller)
            ->from('/miller/transport')
            ->post(route('miller.palay.finalize', $batch->id), ['final_price_per_kg' => 25]);

        $this->assertEqualsWithDelta($total, (float) Wallet::where('user_id', $farmer->id)->value('balance'), 0.001);
    }
}
