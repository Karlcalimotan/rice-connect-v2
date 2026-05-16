<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification
{
    use Queueable;

    protected $riceVariety;
    protected $stockId;
    protected $remainingSacks;

    /**
     * Create a new notification instance.
     */
    public function __construct($riceVariety, $stockId, $remainingSacks)
    {
        $this->riceVariety = $riceVariety;
        $this->stockId = $stockId;
        $this->remainingSacks = $remainingSacks;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'low_stock',
            'message' => "Low stock alert for {$this->riceVariety}. Only {$this->remainingSacks} sacks remaining.",
            'stock_id' => $this->stockId,
            'remaining_sacks' => $this->remainingSacks,
            'rice_variety' => $this->riceVariety,
        ];
    }
}
