
<?php

use App\Http\Controllers\FamilyController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Toutes les routes protégées par authentification
Route::middleware('auth')->group(function () {

    // Orders
    Route::post('/products/{product}/buy', [OrderController::class, 'store'])
        ->name('orders.store');

    Route::get('/orders', [OrderController::class, 'index'])
        ->name('orders.index');

    // Products CRUD
    Route::resource('products', ProductController::class)
        ->except(['show']);

    // Families
    Route::get('/families/create', [FamilyController::class, 'create'])
        ->name('families.create');

    Route::post('/families', [FamilyController::class, 'store'])
        ->name('families.store');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
        Route::get('/datatable-test', function () {
    return Inertia::render('DataTableTest');
})->name('datatable.test');
});

require __DIR__.'/auth.php';
