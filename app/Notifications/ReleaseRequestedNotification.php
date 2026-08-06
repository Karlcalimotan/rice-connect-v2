<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReleaseRequestedNotification extends Notification
{
    use Queueable;

    public $orderId;
    public $retailerName;

    public function __construct($orderId, $retailerName)
    {
        $this->orderId = $orderId;
        $this->retailerName = $retailerName;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => "Retailer " . $this->retailerName . " has placed a self-pickup order #" . $this->orderId . ". Ready for release.",
            'title' => 'Release Requested',
            'action_url' => route('miller.orders'),
            'type' => 'logistics',
            'id' => $this->orderId,
        ];
    }
}
