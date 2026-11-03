<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DownloadController;
use App\Http\Controllers\Web\PageController;
use App\Http\Controllers\Web\TripPlanController;
use App\Http\Controllers\Web\WishlistController;
use Illuminate\Support\Facades\Route;

Route::group([], function () {
    Route::group([], function () {

        Route::get('/', [PageController::class, 'home'])
            ->name('home');

        Route::get('/about', [PageController::class, 'about'])
            ->name('about');

        Route::get('/signup', [AuthController::class, 'webSignupShow'])
            ->name('signup');

        Route::get('/login', [AuthController::class, 'webloginShow'])
            ->name('login');

        Route::get('/forget-password', [AuthController::class, 'webForgetPasswordShow'])
            ->name('restet.password');

        Route::get('/reset-link-send', [AuthController::class, 'webResetLinkSendShow'])
            ->name('email.send');

        Route::get('/forget-password/{token}', [AuthController::class, 'webChangePasswordPageShow'])
            ->name('password.reset');

        Route::get('/watch-guide', [PageController::class, 'guide'])
            ->name('guide');

        Route::get('/place/{slug}', [PageController::class, 'placeDeatail'])
            ->name('place.detail');
    });

    Route::group([], function () {
        Route::post('/signup/validate', [AuthController::class, 'webSignUp'])
            ->name('WSignupValidate');

        Route::post('/login/validate', [AuthController::class, 'webLogin'])
            ->name('WLoginValidate');

        Route::post('/forget-password-send', [AuthController::class, 'webPasswordResetCodeSend'])
            ->name('code.send.email');

        Route::post('/logout', [AuthController::class, 'webLogout'])
            ->name('logout');

        Route::post('/password-reset-save', [AuthController::class, 'webPasswordResetSaved'])
            ->name('new.password.set');
    });
});

Route::middleware(['user.auth'])->group(function () {
    Route::group([], function () {
        Route::get('/trip-plan', [TripPlanController::class, 'indexShow'])
            ->name('trip.plan');

        Route::get('/trip-plan/create/{id?}', [TripPlanController::class, 'creatShow'])
            ->name('trip.plan.create');

        Route::get('/trip-plan/view/{id}', [TripPlanController::class, 'show'])
            ->name('trip.plan.view');

        Route::get('/trip-plan/create/add-places/{id}', [TripPlanController::class, 'addTripToPlaceShow'])
            ->name('trip.plan.add.detail');
    });

    Route::group([], function () {

        Route::post('/trip-plan/save-draft', [TripPlanController::class, 'draft'])
            ->name('trip.plan.save.draft');

        Route::post('/save-my-trip-plan/{id?}', [TripPlanController::class, 'store'])
            ->name('trip.plan.save');

        Route::post('/review/store', [TripPlanController::class, 'reviewStore'])
            ->name('reviews.store');

        Route::post('/service-review/store', [TripPlanController::class, 'ServicesreviewStore'])
            ->name('service.review.store');

        Route::post('/quick-add', [TripPlanController::class, 'quickAdd'])
            ->name('quick.add.trip');

        Route::post('/trip-plan/{id}/export', [DownloadController::class, 'exportTripPlan'])
            ->name('trip.plan.export');

        Route::post('/add-wishlist', [WishlistController::class, 'toggle'])
            ->name('wishlist.toggle');

    });

    Route::group([], function () {

        Route::put('/update-profile', [AuthController::class, 'updateUser'])
            ->name('profile.update');
    });

    Route::group([], function () {

        Route::delete('/delete/plan/{id}', [TripPlanController::class, 'destroy'])
            ->name('trip.plan.delete');
    });
});
