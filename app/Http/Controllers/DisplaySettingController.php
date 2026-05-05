<?php

namespace App\Http\Controllers;

use App\Models\UserSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DisplaySettingController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $settings = UserSetting::firstOrCreate(
            ['user_id' => $userId],
            [
                'theme' => 'light',
                'font_size' => 'medium',
                'language' => 'id',
                'reduced_motion' => false,
                'density' => 'comfortable',
            ]
        );

        return Inertia::render('Settings/Display', [
            'settings' => [
                'theme' => $settings->theme,
                'font_size' => $settings->font_size,
                'language' => $settings->language,
                'reduced_motion' => $settings->reduced_motion,
                'density' => $settings->density,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'theme' => 'nullable|in:light,dark,system',
            'font_size' => 'nullable|in:small,medium,large',
            'language' => 'nullable|in:id,en',
            'reduced_motion' => 'nullable|boolean',
            'density' => 'nullable|in:comfortable,compact',
        ]);

        UserSetting::updateOrCreate(
            ['user_id' => Auth::id()],
            $validated
        );

        return back()->with('success', 'Pengaturan tampilan disimpan.');
    }
}
