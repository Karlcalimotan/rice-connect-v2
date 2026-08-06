<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PickupScheduledNotification extends Notification
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
            'message' => "Your palay pick-up is scheduled for " . $this->date . ".",
            'title' => 'Pickup Scheduled',
            'action_url' => route('farmer.harvest'),
            'type' => 'logistics',
            'date' => $this->date,
            'id' => $this->entityId,
        ];
    }
}
