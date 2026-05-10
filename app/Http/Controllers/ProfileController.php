<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'design_css_url' => '/design/rice-connect-dashboard/styles.css',
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        // 1. Split the full name into First and Last if provided as 'name'
        if ($request->has('name')) {
            $nameParts = explode(' ', $request->name, 2);
            $user->first_name = $nameParts[0] ?? '';
            $user->last_name = $nameParts[1] ?? '';
        }

        // 2. Fill other fields and SYNC Municipality ID
        $user->fill($request->safe()->except(['name']));

        if ($request->has('municipality')) {
            $muniRec = \Illuminate\Support\Facades\DB::table('municipalities')
                ->where('name', $request->municipality)
                ->first();
            if ($muniRec) {
                $user->municipality_id = $muniRec->id;
            }
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // 3. Save to database
        $user->save();

        // 4. Redirect to Dashboard as requested
        return Redirect::route('dashboard')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
