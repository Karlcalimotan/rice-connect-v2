<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewHarvestPostedNotification extends Notification
{
    use Queueable;

    protected $farmerName;
    protected $batchId;
    protected $variety;
    protected $totalSacks;

    /**
     * Create a new notification instance.
     */
    public function __construct($farmerName, $batchId, $variety, $totalSacks)
    {
        $this->farmerName = $farmerName;
        $this->batchId = $batchId;
        $this->variety = $variety;
        $this->totalSacks = $totalSacks;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'id' => $this->batchId,
            'title' => 'New Harvest Available',
            'message' => "Farmer {$this->farmerName} posted a new harvest: {$this->totalSacks} sacks of {$this->variety}.",
            'type' => 'new_harvest',
            'action_url' => route('miller.marketplace')
        ];
    }
}
