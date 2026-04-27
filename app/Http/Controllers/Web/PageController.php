<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Place;
use App\Models\SubCategory;
use App\Models\TripPlan;
use App\Models\Wishlist;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function home(Request $request)
    {
        $wishlistIds = [];

        if (auth()->guard('user')->check()) {
            $userId = Auth::guard('user')->id();
            $wishlistIds = Wishlist::where('user_id', $userId)->pluck('place_id')->toArray();
        }

        $query = Place::where('status', 'active');

        if ($request->filled('search')) {
            $searchTerm = str_replace('#', '', $request->search);

            $query->where(function ($q) use ($searchTerm) {
                $q->where('place_name', 'like', "%{$searchTerm}%")
                    ->orWhere('search_tags', 'like', "%{$searchTerm}%")
                    ->orWhereHas('category', function ($catQuery) use ($searchTerm) {
                        $catQuery->where('category_name', 'like', "%{$searchTerm}%");
                    });
            });
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->has('subCategory') && is_array($request->subCategory)) {
            $query->whereIn('sub_category_id', $request->subCategory);
        }

        $sortOrder = $request->input('sort', 'desc');
        $allPlaces = $query->with(['category', 'subCategory'])
            ->withCount(['review' => function ($query) {
                $query->where('status', 'approved');
            }])
            ->withAvg(['review' => function ($query) {
                $query->where('status', 'approved');
            }], 'rating')
            ->orderByRaw('review_avg_rating IS NULL ASC')
            ->orderByDesc('review_avg_rating')
            ->orderBy('base_distance', 'asc')
            ->orderBy('created_at', $sortOrder)
            ->paginate(6)->withQueryString();

        $auth_trips = [];
        if (Auth::guard('user')->check()) {
            $auth_trips = TripPlan::where('user_id', Auth::guard('user')->id())
                ->where('status', '!=', 'cancelled')
                ->withCount('selectedPlaces')
                ->get()
                ->map(function ($plan) {
                    $plan->added_place_ids = $plan->selectedPlaces()->pluck('place_id')->toArray();

                    return $plan;
                });
        }

        return Inertia::render('web/welcome', [
            'allPlaces' => $allPlaces,
            'category' => Category::with('subCategory')->orderBy('created_at', 'desc')->get(),
            'subCategory' => SubCategory::orderBy('created_at', 'desc')->get(),
            'wishlistIds' => $wishlistIds,
            'auth_trips' => $auth_trips,
        ]);
    }

    public function about()
    {
        return Inertia::render('web/About');
    }

    public function guide()
    {
        return Inertia::render('web/WatchGuilde');
    }

    public function placeDeatail($slug)
    {
        $place = Place::where('slug', $slug)
            ->with([
                'category',
                'subCategory',
                'media',
                'review' => function ($q) {
                    $q->where('status', 'approved')->with(['user', 'placeReviewMedia']);
                },

            ])
            ->withAvg('review', 'rating')
            ->withCount(['review as review_count' => function ($query) {
                $query->where('status', 'approved');
            }])
            ->firstOrFail();

        $reviews = $place->review()
            ->where('status', 'approved')
            ->orderByDesc('rating')
            ->orderByDesc('created_at')
            ->with(['user', 'placeReviewMedia'])
            ->latest()
            ->paginate(4);

        $foryou = Place::where('category_id', $place->category_id)
            ->where('id', '!=', $place->id)
            ->limit(4)
            ->get();

        if ($foryou->count() < 4) {
            $needed = 4 - $foryou->count();

            $extraPlaces = Place::where('id', '!=', $place->id)
                ->whereNotIn('id', $foryou->pluck('id'))
                ->inRandomOrder()
                ->limit($needed)
                ->get();

            $foryou = $foryou->concat($extraPlaces);
        }

        $auth_trips = [];
        if (Auth::guard('user')->check()) {
            $auth_trips = TripPlan::where('user_id', Auth::guard('user')->id())
                ->where('status', '!=', 'cancelled')
                ->withCount('selectedPlaces')
                ->get()
                ->map(function ($plan) {
                    $plan->added_place_ids = $plan->selectedPlaces()->pluck('place_id')->toArray();

                    return $plan;
                });
        }

        return Inertia::render('web/PlaceDetail', [
            'place' => $place,
            'reviews' => $reviews,
            'forYou' => $foryou,
            'auth_trips' => $auth_trips,
        ]);
    }
}
