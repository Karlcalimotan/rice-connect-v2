<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DeliveryScheduledNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $date;
    public $entityId;

    public function __construct($date, $entityId)
    {
        $this->date = $date;
        $this->entityId = $entityId;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => "Your rice delivery is scheduled for " . $this->date . ". Please prepare storage.",
            'type' => 'logistics',
            'date' => $this->date,
            'id' => $this->entityId,
        ];
    }
}
