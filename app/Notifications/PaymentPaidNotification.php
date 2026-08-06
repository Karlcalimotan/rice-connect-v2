<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PaymentPaidNotification extends Notification
{
    use Queueable;

    public $entityId;
    public $amount;

    public function __construct($entityId, $amount)
    {
        $this->entityId = $entityId;
        $this->amount = $amount;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Payment received! ₱' . number_format($this->amount, 2) . ' has been credited to your wallet (Ref #' . $this->entityId . ').',
            'type' => 'payment',
            'amount' => $this->amount,
            'id' => $this->entityId,
        ];
    }
}
