<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function markAsRead($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);
        
        $notification->markAsRead(); // Standard Laravel way
        
        // Custom column update as requested
        DB::table('notifications')
            ->where('id', $id)
            ->update(['notification_status' => 'read']);

        return redirect()->back();
    }
}
