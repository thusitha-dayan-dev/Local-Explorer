<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'admins';

    protected $fillable = [
        'user_name',
        'email',
        'password',
        'password_confirmation',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function sendPasswordResetNotification($token)
    {
        $url = route('admin.password.reset', [
            'token' => $token,
            'email' => $this->getEmailForPasswordReset(),
        ]);

        $this->notify(new class($url) extends \Illuminate\Notifications\Notification
        {
            protected $url;

            public function __construct($url)
            {
                $this->url = $url;
            }

            public function via($notifiable)
            {
                return ['mail'];
            }

            public function toMail($notifiable)
            {
                return (new \Illuminate\Notifications\Messages\MailMessage)
                    ->line('You are receiving this email because we received a password reset request for your account.')
                    ->action('Reset Password', $this->url)
                    ->line('If you did not request a password reset, no further action is required.');
            }
        });
    }
}
