<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class DriverAssignedNotification extends Notification
{
    use Queueable;

    protected $shipment;
    public $entityId;
    public $driverName;

    /**
     * Create a new notification instance.
     *
     * @param  mixed  $shipment  HarvestBatch or Order
     */
    public function __construct($shipment, $driverId)
    {
        $this->shipment = $shipment;
        $this->entityId = $shipment->id;

        $driver = $shipment->driver()->first();
        $this->driverName = $driver
            ? trim($driver->first_name . ' ' . $driver->last_name)
            : 'A driver';
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        $kind = $this->shipment instanceof \Modules\Farmer\Models\HarvestBatch ? 'palay' : 'rice';
        $actionUrl = $this->shipment instanceof \Modules\Farmer\Models\HarvestBatch ? route('farmer.harvest') : route('retailer.orders');

        return [
            'message' => $this->driverName . " has been assigned to your " . $kind . " delivery (Ref #" . $this->entityId . ").",
            'title' => 'Driver Assigned',
            'action_url' => $actionUrl,
            'type' => 'logistics',
            'driver_name' => $this->driverName,
            'id' => $this->entityId,
        ];
    }
}
