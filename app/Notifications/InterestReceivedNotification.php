<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class InterestReceivedNotification extends Notification
{
    use Queueable;

    protected $millerName;
    protected $batchId;
    protected $variety;

    /**
     * Create a new notification instance.
     */
    public function __construct($millerName, $batchId, $variety)
    {
        $this->millerName = $millerName;
        $this->batchId = $batchId;
        $this->variety = $variety;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'id' => $this->batchId,
            'title' => 'New Interest Received',
            'message' => "Miller {$this->millerName} is interested in your {$this->variety} harvest batch.",
            'type' => 'interest_received',
            'action_url' => route('farmer.offers')
        ];
    }
}
