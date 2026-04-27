<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        if (Auth::guard('user')->check()) {
            $userInfor = Auth::guard('user')->user();
        } else {
            $userInfor = (object) [];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'authEmail' => Auth::guard('admin')->user()?->email,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'pdf_url' => fn () => $request->session()->get('pdf_url'),
            ],
            'auth_cooldown' => function () {
                $lastSent = session('last_reset_sent_at');
                $activeCooldown = session('active_cooldown', 0);

                if ($lastSent && $activeCooldown > 0) {
                    $diff = time() - $lastSent;
                    if ($diff < $activeCooldown) {
                        return (int) ceil($activeCooldown - $diff);
                    }
                }

                return 0;
            },
            'user_auth_cooldown' => function () {
                $userSendAt = session('user_reset_send_at');
                $userActiveCoundDown = session('user_count_down');

                if ($userSendAt && $userActiveCoundDown > 0) {
                    $userDiff = time() - $userSendAt;
                    if ($userDiff < $userActiveCoundDown) {
                        return (int) ceil($userActiveCoundDown - $userDiff);
                    }
                }

                return 0;
            },
            'userInfore' => $userInfor,
            'old' => $request->session()->get('_old_input'),

        ];
    }
}
