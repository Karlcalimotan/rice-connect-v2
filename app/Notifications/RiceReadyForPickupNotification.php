<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class RiceReadyForPickupNotification extends Notification
{
    use Queueable;

    public $orderId;

    public function __construct($orderId)
    {
        $this->orderId = $orderId;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => "Your rice order #" . $this->orderId . " is ready for pickup! Please proceed to the Miller station.",
            'title' => 'Ready for Pickup',
            'action_url' => route('retailer.orders'),
            'type' => 'logistics',
            'id' => $this->orderId,
        ];
    }
}
