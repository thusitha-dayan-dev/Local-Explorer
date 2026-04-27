<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\NearbyServiceController;
use App\Http\Controllers\Admin\PlaceController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\ServiceTypeController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DownloadController;
use Illuminate\Support\Facades\Route;

Route::group([], function () {

    Route::get('/login', [AuthController::class, 'adminLoginShow'])
        ->name('login');

    Route::get('/forget-password', [AuthController::class, 'adminForgetPasswordShow'])
        ->name('reset.password');

    Route::get('/forget-password/{token}', [AuthController::class, 'showResetFormShow'])
        ->name('password.reset');

    Route::get('/reset-code/send', [AuthController::class, 'adminResetCodeSendSuccessShow'])
        ->name('email.send');

});

Route::group([], function () {
    Route::post('/forget-password-send', [AuthController::class, 'AdminSendRestLink'])
        ->name('password.email');

    Route::post('/login/verification', [AuthController::class, 'adminLogin'])
        ->name('login.verification');

    Route::post('/rest-password/save', [AuthController::class, 'adminsavePassword'])
        ->name('save.password');

    Route::post('/update/password', [AuthController::class, 'adminUpdatePassword'])
        ->name('update.password');

});

Route::middleware(['admin.auth'])->group(function () {
    Route::group([], function () {
        Route::get('/manage-place', [DashboardController::class, 'managePlace'])
            ->name('manage.place');

        Route::get('/add-place', [PlaceController::class, 'createShow'])
            ->name('add.place');

        Route::get('/edit-place/{id}/{slug}', [PlaceController::class, 'edit'])
            ->name('edit.place');

        Route::get('/manage-category', [DashboardController::class, 'manageCategory'])
            ->name('manage.category');

        Route::get('/manage-review', [DashboardController::class, 'manageReview'])
            ->name('manage.review');

        Route::get('/dashboard', [DashboardController::class, 'dashboard'])
            ->name('dashboard');

        Route::get('/manage-service', [DashboardController::class, 'manageService'])
            ->name('manage.service');

        Route::get('/manage-service-types', [DashboardController::class, 'manageServiceType'])
            ->name('manage.service.type');

        Route::get('/add-service', [NearbyServiceController::class, 'show'])
            ->name('add.service');

        Route::get('/edit-service/{id}/{slug}', [NearbyServiceController::class, 'editeShow'])
            ->name('edit.service');

        Route::get('/global-search', [DashboardController::class, 'globalSearch'])
            ->name('global.search');

        Route::get('/download-pdf', [DownloadController::class,  'downloadPDF'])
            ->name('download.pdf');

        Route::get('/manage-service/reviews', [DashboardController::class, 'manageServiceReview'])->name('manage.services.review');

        Route::get('/clear-all', function () {
            Artisan::call('config:clear');
            Artisan::call('cache:clear');

            return 'All cache cleared!';
        });
    });

    Route::group([], function () {
        Route::delete('/delete-place/{id}', [PlaceController::class, 'destory'])
            ->name('delete.place');

        Route::delete('/delete-category/{id}/{type}', [CategoryController::class, 'destory'])
            ->name('delete.category');

        Route::delete('/delete-service-type/{id}', [ServiceTypeController::class, 'destory'])
            ->name('delete.service.type');

        Route::delete('/delete-service/{id}', [NearbyServiceController::class, 'destory'])
            ->name('delete.services');

        Route::delete('/delete/review/{id}', [ReviewController::class, 'deletePlaceReview'])
            ->name('delete.review');

        Route::delete('/delete/service-review/{id}', [ReviewController::class, 'deleteServiceReview'])
            ->name('delete.service.review');
    });

    Route::group([], function () {
        Route::post('/create-place', [PlaceController::class, 'create'])
            ->name('place.create');

        Route::post('/edit-place/{id}', [PlaceController::class, 'update'])
            ->name('update.place');

        Route::post('/logout', [AuthController::class, 'adminLogout'])
            ->name('logout');

        Route::post('/create-category', [CategoryController::class, 'create'])
            ->name('create.category');

        Route::post('/create-service', [NearbyServiceController::class, 'create'])
            ->name('service.create');

        Route::post('/create-service-type', [ServiceTypeController::class, 'create'])
            ->name('service.type.create');

        Route::post('/edit-service/save/{id}', [NearbyServiceController::class, 'editStore'])
            ->name('update.service');

        Route::post('/profile/update', [AuthController::class, 'AdminUpdateProfile'])
            ->name('update.profile');

        Route::post('/review/approve/{id}', [ReviewController::class, 'approvePlaceReview'])->name('approve.review');

        Route::post('/reject/review/{id}', [ReviewController::class, 'rejectPlaceReview'])->name('reject.review');

        Route::post('/approve/service-review/{id}', [ReviewController::class, 'approveServiceReview'])->name('approve.service.review');

        Route::post('/reject/service-review/{id}', [ReviewController::class, 'rejectServiceReview'])->name('reject.service.review');
    });

    Route::group([], function () {
        Route::put('/manage-category/{id}', [CategoryController::class, 'edite'])
            ->name('edit.category');

        Route::put('/manage-service-type/{id}', [ServiceTypeController::class, 'edit'])
            ->name('edit.service.type');
    });
});
