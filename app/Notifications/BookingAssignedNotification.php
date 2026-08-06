<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class BookingAssignedNotification extends Notification
{
    use Queueable;

    public $orderId;
    public $driverName;
    public $retailerName;

    public function __construct($order)
    {
        $this->orderId = $order->id;
        $this->driverName = $order->driver ? trim($order->driver->first_name . ' ' . $order->driver->last_name) : 'A driver';
        $this->retailerName = $order->retailer ? trim($order->retailer->first_name . ' ' . $order->retailer->last_name) : 'A retailer';
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        $isDriver = $notifiable instanceof \App\Models\User && $notifiable->role === 'driver';

        return [
            'message' => $isDriver
                ? $this->retailerName . " booked you for Rice Order #" . $this->orderId . "."
                : $this->retailerName . " booked " . $this->driverName . " for Rice Order #" . $this->orderId . ".",
            'type' => 'logistics',
            'driver_name' => $this->driverName,
            'retailer_name' => $this->retailerName,
            'id' => $this->orderId,
        ];
    }
}
