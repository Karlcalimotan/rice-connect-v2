<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class WeightLoggedNotification extends Notification
{
    use Queueable;

    public $batchId;
    public $weightKg;
    public $pricePerKg;

    public function __construct($batchId, $weightKg, $pricePerKg)
    {
        $this->batchId = $batchId;
        $this->weightKg = $weightKg;
        $this->pricePerKg = $pricePerKg;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Your palay was weighed: ' . $this->weightKg . ' kg @ ₱' . $this->pricePerKg . '/kg. Awaiting Miller payment authorization.',
            'type' => 'logistics',
            'weight_kg' => $this->weightKg,
            'price_per_kg' => $this->pricePerKg,
            'id' => $this->batchId,
        ];
    }
}
