<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function adminLoginShow()
    {
        return Inertia::render('admin/Auth/AdminLogin');
    }

    public function adminLogin(Request $request)
    {
        $credit = $request->validate([
            'email' => [
                'required',
                'email',
            ],
            'password' => [
                'required',
                'string',
            ],
        ]);

        if (Auth::guard('admin')->attempt($credit)) {
            $request->session()->regenerate();

            return redirect()->route('admin.dashboard');
        }

        return back()->withErrors([
            'error' => 'The provided credentials do not match our records.',
        ]);
    }

    public function adminLogout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }

    public function adminForgetPasswordShow()
    {
        return Inertia::render('admin/Auth/AdminResetPassword');
    }

    public function adminsavePassword(Request $request)
    {
        $request->validate([
            'token' => [
                'required',
            ],
            'email' => [
                'required',
                'email',
            ],
            'password' => [
                'required',
                'string',
                'min:6',
                'confirmed',
            ],
        ]);

        $credentials = [
            'email' => $request->email,
            'password' => $request->password,
            'token' => $request->token,
            'password_confirmation' => $request->confirm_password,
        ];

        $status = Password::broker('admin')->reset(
            $credentials,
            function ($admin, $password) {
                $admin->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new \Illuminate\Auth\Events\PasswordReset($admin));
            }
        );

        return $status === Password::PASSWORD_RESET
        ? redirect()->route('admin.login')->with('status', __($status))
        : back()->withErrors(['email' => [__($status)]]);
    }

    public function AdminSendRestLink(Request $request)
    {
        $request->validate([
            'email' => [
                'required',
                'email',
            ],
        ]);

        $lastSent = session('last_reset_sent_at');
        $attempts = session('reset_attempts', 0);
        $baseCooldown = 60;
        $cooldownForThisStep = $baseCooldown * ($attempts + 1);

        if ($lastSent) {
            $diff = time() - $lastSent;
            if ($diff < $cooldownForThisStep) {
                $remaining = $cooldownForThisStep - $diff;

                return back()->withErrors([
                    'email' => 'Too many requests. Please wait '.ceil($remaining).' seconds.',
                ]);
            }
        }

        $status = Password::broker('admin')->sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            session([
                'last_reset_sent_at' => time(),
                'reset_attempts' => $attempts + 1,
                'active_cooldown' => $cooldownForThisStep,
            ]);

            return redirect()->route('admin.email.send')->with('user_email', $request->email);
        }

        return back()->withErrors(['email' => __($status)]);
    }

    public function showResetFormShow(Request $request, $token)
    {
        $tokenExists = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (! $tokenExists || ! Hash::check($token, $tokenExists->token)) {
            abort(403, 'This password reset link is invalid or has already been used.');
        }

        $expiresAt = Carbon::parse($tokenExists->created_at)->addMinutes(config('auth.passwords.admin.expire'));

        if (Carbon::now()->greaterThan($expiresAt)) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            abort(403, 'This password reset link has expired.');
        }

        return Inertia::render('admin/Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->email,
        ]);
    }

    public function adminResetCodeSendSuccessShow()
    {
        return Inertia::render('admin/Auth/EmailSentSuccess', [
            'email' => session('user_email'),
        ]);
    }

    public function AdminUpdateProfile(Request $request)
    {
        $admin = auth()->guard('admin')->user();

        $request->validate([
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('profile_image')) {

            if ($admin->profile_image_path) {
                Storage::disk('public')->delete($admin->profile_image_path);
            }

            $path = $request->file('profile_image')->store('admin/profiles', 'public');

            $admin->profile_image_path = $path;

        }
        $admin->save();

        return back()->with('success', 'Profile photo updated successfully!');
    }

    public function adminUpdatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password:admin'],
            'new_password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $admin = auth()->guard('admin')->user();

        $admin->update([
            'password' => Hash::make($request->new_password),
        ]);

        return back()->with('success', 'Password changed successfully!');
    }

    /*
    ================================================================================================================
    ================================================================================================================
    ================================================================================================================
    */

    public function webloginShow()
    {
        return Inertia::render('web/Auth/Login');
    }

    public function webLogin(Request $request)
    {
        $credit = $request->validate([
            'email' => [
                'required',
                'email',
            ],
            'password' => [
                'required',
                'string',
            ],
        ]);

        if (Auth::guard('user')->attempt($credit)) {
            $request->session()->regenerate();
            $user = auth()->guard('user')->user();

            return redirect()->intended(route('home'))
                ->with('success', "Welcome back, {$user->full_name}! Let's explore Dambulla today. 🚀");
        }

        return back()->withErrors([
            'error' => 'The provided credentials do not match our records.',
        ]);

    }

    public function webSignupShow()
    {
        return Inertia::render('web/Auth/Signup');
    }

    public function webSignUp(Request $request)
    {
        $request->validate([
            'email' => [
                'required',
                'email',
                'unique:users',
            ],
            'password' => [
                'required',
                'min:6',
                'string',
                'same:confirm_password',
            ],
            'full_name' => [
                'required',
                'string',
            ],
            'confirm_password' => [
                'required',
            ],
        ]);

        $user = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('home')->with('success', 'Accuount Create Successfull');
    }

    public function webLogout(Request $request)
    {
        $userName = Auth::guard('user')->user()->full_name;

        Auth::guard('user')->logout();

        return redirect()->route('home')
            ->with('error', 'Logged out successfully. See you soon, '.$userName.'! 👋');
    }

    public function webPasswordResetCodeSend(Request $request)
    {
        $request->validate([
            'email' => [
                'required',
                'email',
            ],
        ]);

        $lastSend = session('user_reset_send_at');
        $atemp = session('user_reset_atemp', 0);
        $baseCoundDown = 60;
        $coundDownNextStep = $baseCoundDown * ($atemp + 1);

        if ($lastSend) {
            $diff = time() - $lastSend;
            if ($diff < $coundDownNextStep) {
                $remaning = $coundDownNextStep - $diff;

                return back()->withErrors([
                    'email' => 'Too many requests. Please wait '.ceil($remaning).' seconds.',
                ]);
            }
        }

        $status = Password::broker('users')->sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            session([
                'user_reset_send_at' => time(),
                'user_reset_atemp' => $atemp + 1,
                'user_count_down' => $coundDownNextStep,
            ]);

            return redirect()->route('email.send')->with('web_email', $request->email);
        }

        return back()->withErrors(['email' => __($status)]);
    }

    public function webForgetPasswordShow()
    {
        return Inertia::render('web/Auth/ResetPassword');
    }

    public function webChangePasswordPageShow(Request $request, $token)
    {
        $tokenExite = DB::table('password_reset_tokens')
            ->where('email', $request->email)->first();

        if (! $tokenExite || ! Hash::check($token, $tokenExite->token)) {
            abort(403, 'This password reset link is invalid or has already been used.');
        }

        $expiresAt = Carbon::parse($tokenExite->created_at)->addMinutes(config('auth.passwords.users.expire'));

        if (Carbon::now()->greaterThan($expiresAt)) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            abort(403, 'This password reset link has expired.');
        }

        return Inertia::render('web/Auth/UpdatePasswordForm', [
            'token' => $token,
            'email' => $request->email,
        ]);
    }

    public function webPasswordResetSaved(Request $request)
    {
        $request->validate([
            'token' => [
                'required',
            ],
            'email' => [
                'required',
                'email',
            ],
            'password' => [
                'required',
                'string',
                'min:6',
                'confirmed',
            ],
        ]);

        $credentials = [
            'email' => $request->email,
            'password' => $request->password,
            'token' => $request->token,
            'password_confirmation' => $request->confirm_password,
        ];

        $status = Password::broker('users')->reset(
            $credentials,
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new \Illuminate\Auth\Events\PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
        ? redirect()->route('login')->with('status', __($status))
        : back()->withErrors(['email' => [__($status)]]);
    }

    public function updateUser(Request $request)
    {
        $user = auth()->guard('user')->user();

        $request->validate([
            'full_name' => 'required|string|max:255',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:5048',
        ], [
            'full_name.required' => 'Please enter your full name.',
            'profile_image.image' => 'The selected file must be an image.',
            'profile_image.mimes' => 'Only JPG, JPEG, and PNG images are allowed.',
            'profile_image.max' => 'The image size must not exceed > 5MB.',
        ]);

        if ($request->hasFile('profile_image')) {
            if ($user->profile_image_path && Storage::disk('public')->exists($user->profile_image_path)) {
                Storage::disk('public')->delete($user->profile_image_path);
            }

            $path = $request->file('profile_image')->store('profiles', 'public');
            $user->profile_image_path = $path;
        }

        $user->full_name = $request->full_name;
        $user->save();

        return back()->with('success', 'Profile updated successfully!');
    }

    public function webResetLinkSendShow()
    {
        return Inertia::render('web/Auth/ResetSend', [
            'email' => session('web_email'),
        ]);
    }
}
