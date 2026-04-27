<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\NearbyService;
use App\Models\NearbyServiceReview;
use App\Models\NearbyServiceReviewMedia;
use App\Models\Place;
use App\Models\PlaceReview;
use App\Models\PlaceReviewMedia;
use App\Models\ServiceType;
use App\Models\TripPlan;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TripPlanController extends Controller
{
    public function indexShow(Request $request)
    {
        $userId = Auth::guard('user')->id();

        $query = TripPlan::where('user_id', $userId)->where('status', '!=', 'cancelled');

        if ($request->filled('search')) {
            $query = $query->where('title', 'LIKE', "%{$request->search}%");
        }

        if ($request->filled('type')) {
            if ($request->type === 'planned') {
                $query = $query->whereIn('status', ['planned', 'on-going']);
            } else {
                $query = $query->where('status', $request->type);
            }
        }

        $sortOrder = $request->input('sort', 'desc');
        $query = $query->orderBy('created_at', $sortOrder);

        $placeAvg = PlaceReview::where('user_id', $userId)->avg('rating');
        $serviceAvg = NearbyServiceReview::where('user_id', $userId)->avg('rating');

        $ratings = [];
        if ($placeAvg !== null) {
            $ratings[] = $placeAvg;
        }
        if ($serviceAvg !== null) {
            $ratings[] = $serviceAvg;
        }

        if (count($ratings) > 0) {
            $totalRating = round(array_sum($ratings) / count($ratings), 1);
        } else {
            $totalRating = 0;
        }

        $placeRating = PlaceReview::where('user_id', $userId)
            ->select(DB::raw('CAST(rating AS UNSIGNED) as int_rating'), DB::raw('count(*) as count'))
            ->groupBy('int_rating')
            ->pluck('count', 'int_rating')
            ->toArray();

        $serviceRating = NearbyServiceReview::where('user_id', $userId)
            ->select(DB::raw('CAST(rating AS UNSIGNED) as int_rating'), DB::raw('count(*) as count'))
            ->groupBy('int_rating')
            ->pluck('count', 'int_rating')
            ->toArray();

        $countStar = [];
        for ($i = 5; $i >= 1; $i--) {
            $pCount = $placeRating[$i] ?? 0;
            $sCount = $serviceRating[$i] ?? 0;
            $countStar[$i] = $pCount + $sCount;
        }

        $totalAllReviews = array_sum($countStar);
        $placeRevieCount = PlaceReview::where('user_id', $userId)->count();
        $serviceReviewCount = NearbyServiceReview::where('user_id', $userId)->count();

        $totalDistance = TripPlan::where('user_id', $userId)->where('status', '!=', 'cancelled')->sum('total_distance');

        return Inertia::render('web/TripPlain', [
            'cardData' => [

                'all' => TripPlan::where([
                    ['user_id', '=', $userId],
                    ['status', '!=', 'cancelled'],
                ])->count(),

                'onGoing' => TripPlan::where([
                    ['user_id', '=', $userId],
                    ['status', '=', 'on-going'],
                ])->count(),

                'complete' => TripPlan::where([
                    ['user_id', '=', $userId],
                    ['status', '=', 'completed'],
                ])->count(),
            ],
            'tripPlan' => $query
                ->withCount('selectedPlaces')
                ->withCount('selectedServices')
                ->get(),
            'avarageRating' => $totalRating,
            'review' => [
                'place' => $placeRevieCount,
                'service' => $serviceReviewCount,
                'placeAvg' => $placeAvg,
                'serviceAvg' => $serviceAvg,
                'ratingGroup' => $countStar,
                'total' => $totalAllReviews,
                'distance' => $totalDistance,
            ],
        ]);
    }

    public function creatShow($id = null)
    {
        $oldData = null;
        $userId = Auth::guard('user')->id();

        if ($id) {
            $oldData = TripPlan::findOrFail($id);

            if ($oldData->user_id !== $userId) {
                abort(403, 'Unauthorized access to this trip plan.');
            }

            if (! $oldData && $id !== null) {
                abort(404);
            }

        }

        return Inertia::render('web/CreateTripPlan', [
            'plan' => $oldData,
        ]);
    }

    public function addTripToPlaceShow(Request $request, $id)
    {
        $userId = auth()->guard('user')->id();
        $query = Place::where('status', 'active');
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }
        if ($request->filled('subCategory') && is_array($request->placeSubCategory) && count($request->placeSubCategory) > 0) {
            $query->whereIn('sub_category_id', $request->placeSubCategory);
        }
        if ($request->filled('placeSearch')) {
            $searchTerm = str_replace('#', '', $request->placeSearch);

            $query->where(function ($q) use ($searchTerm) {
                $q->where('place_name', 'like', "%{$searchTerm}%")
                    ->orWhere('search_tags', 'like', "%{$searchTerm}%")
                    ->orWhereHas('category', function ($catQuery) use ($searchTerm) {
                        $catQuery->where('category_name', 'like', "%{$searchTerm}%");
                    });
            });
        }
        if ($request->boolean('wishlist')) {
            $wishlistIds = Wishlist::where('user_id', $userId)->pluck('place_id')->toArray();
            $query->whereIn('id', $wishlistIds);
        }
        $places = $query->with(['category', 'subCategory', 'media'])
            ->withCount(['review' => function ($q) {
                $q->where('status', 'approved');
            }])
            ->withAvg(['review' => function ($q) {
                $q->where('status', 'approved');
            }], 'rating')
            ->orderByDesc('selection_count')
            ->orderByDesc('created_at')
            ->paginate(6)
            ->withQueryString();

        $serviceQuery = NearbyService::query();

        if ($request->filled('serviceType')) {
            $serviceQuery->where('service_type_id', $request->serviceType);
        }

        if ($request->filled('serviceSearch')) {
            $serviceQuery->where('service_name', 'LIKE', "%{$request->serviceSearch}%");
        }

        $serviceQuery->with(['media', 'serviceType'])
            ->withCount(['review' => function ($q) {
                $q->where('status', 'approved');
            }])
            ->withAvg(['review' => function ($q) {
                $q->where('status', 'approved');
            }], 'rating')
            ->orderByDesc('selection_count')
            ->orderByDesc('review_avg_rating')
            ->orderByDesc('created_at');

        $planDetail = TripPlan::where('id', $id)
            ->where('user_id', $userId)
            ->with([
                'selectedPlaces.place',
                'selectedServices',
            ])
            ->first();

        if (! $planDetail) {
            abort(404, 'Trip plan not found or unauthorized access');
        }

        return Inertia::render('web/TripPlanAddDetails', [
            'planDetails' => $planDetail,
            'placesData' => $places,
            'categorys' => Category::with('subCategory')->orderBy('created_at', 'desc')->get(),
            /* 'service' => Inertia::lazy(function () use ($serviceQuery) {
                return $serviceQuery->paginate(10)->withQueryString();
            }),
            */
            'service' => $serviceQuery->paginate(6)->withQueryString(),
            'serviceCount' => NearbyService::count(),
            'serviceType' => ServiceType::get(),
        ]);

    }

    public function draft(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'min:3', 'max:150', 'string'],
            'travel_date' => ['date', 'required'],
            'travel_mode' => ['required', 'string'],
            'id' => ['nullable', 'exists:trip_plans,id'],
        ]);

        $userId = Auth::guard('user')->user()->id;

        $trip = TripPlan::updateOrCreate([
            'id' => $request->id,
            'user_id' => $userId,
        ], array_merge($validated, [
            'status' => 'draft',
        ]));

        return redirect()->route('trip.plan.add.detail', ['id' => $trip->id])
            ->with('success', 'Trip Plan Save Draft successfully!');

    }

    /**
     * Store or Update a trip plan.
     *
     * @param  int|string|null  $id
     */
    public function store(Request $request, $id = null)
    {
        // 1. Validation Logic
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'travel_date' => ['required', 'date', 'after_or_equal:today'],
            'travel_mode' => ['required', 'string'],
            'save_type' => ['required', 'string', 'in:save,draft'],
            'selected_places' => ['required', 'array', 'min:1'],
            'selected_places.*.place_id' => ['required', 'exists:places,id'],
            'selected_places.*.selected_order_number' => ['required', 'integer'],
            'selected_places.*.user_note' => ['nullable', 'string', 'max:250'],
            'selected_services' => ['nullable', 'array'],
            'selected_services.*.nearby_service_id' => ['exists:nearby_services,id', 'required'],
            'selected_services.*.selected_order_number' => ['required', 'integer'],
        ], [
            'selected_places.min' => 'Please select at least one place for your trip.',
            'travel_date.after_or_equal' => 'Travel date cannot be in the past.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $orderedPlaces = collect($request->selected_places)->sortBy('selected_order_number')->values();
        $placeIds = $orderedPlaces->pluck('place_id')->toArray();
        $placeFromDb = \App\Models\Place::whereIn('id', $placeIds)->get()->keyBy('id');

        $totalStayMinutes = 0;
        $totalBudgetLocal = 0;
        $locationsForRouting = [];

        foreach ($orderedPlaces as $p) {
            $dbData = $placeFromDb[$p['place_id']] ?? null;
            if ($dbData) {
                $locationsForRouting[] = [
                    'lat' => (float) $dbData->latitude,
                    'lng' => (float) $dbData->longitude,
                ];

                $estimatedTime = (int) ($dbData->estimated_duration ?? 0);
                $totalStayMinutes += $estimatedTime;

                $totalBudgetLocal += (float) ($dbData->local_ticket_price ?? 0);
            }
        }

        $totalDistanceKm = 0;
        $totalTravelMinutes = 0;

        if (count($locationsForRouting) >= 2) {
            $routingData = $this->getRealRoadDistance($locationsForRouting, $request->travel_mode);

            if ($routingData) {
                $totalDistanceKm = $routingData['distance'];
                $totalTravelMinutes = $routingData['time'];
            }
        }

        $finalTotalTimeMinutes = (int) round($totalStayMinutes + $totalTravelMinutes);

        try {
            DB::beginTransaction();

            $tripPlan = TripPlan::updateOrCreate(
                ['id' => $id],
                [
                    'user_id' => auth()->guard('user')->id(),
                    'title' => $request->title,
                    'travel_date' => $request->travel_date,
                    'travel_mode' => $request->travel_mode,
                    'total_distance' => round($totalDistanceKm, 2),
                    'estimated_duration_time' => $finalTotalTimeMinutes,
                    'estimated_budget' => round($totalBudgetLocal, 2),
                    'status' => ($request->save_type === 'draft') ? 'draft' : 'planned',
                ]
            );

            if ($id) {
                $tripPlan->selectedPlaces()->delete();
                $tripPlan->selectedServices()->delete();
            }

            foreach ($orderedPlaces as $p) {
                $tripPlan->selectedPlaces()->create([
                    'place_id' => $p['place_id'],
                    'selected_order_number' => $p['selected_order_number'],
                    'stay_duration' => $p['stay_duration'] ?? 0,
                    'user_note' => $p['user_note'] ?? null,
                    'trip_plan_id' => $tripPlan->id,
                ]);

                if (! $id) {
                    Place::where('id', $p['place_id'])->increment('selection_count');
                }
            }

            if ($request->has('selected_services')) {
                foreach ($request->selected_services as $s) {
                    $tripPlan->selectedServices()->create([
                        'nearby_service_id' => $s['nearby_service_id'],
                        'selected_order_number' => $s['selected_order_number'],
                        'trip_plan_id' => $tripPlan->id,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('trip.plan')->with('success', 'Trip plan saved successfully!');

        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Store Trip Plan Error: '.$e->getMessage());

            return redirect()->back()->with('error', 'Something went wrong: '.$e->getMessage());
        }
    }

    public function show($id)
    {
        $plan = TripPlan::where('id', $id)
            ->where('user_id', Auth::guard('user')->id())
            ->firstOrFail();

        $plan->load([
            'selectedPlaces' => function ($query) {
                $query->orderBy('selected_order_number', 'asc')->with('place');
            },
            'selectedServices' => function ($query) {
                $query->orderBy('selected_order_number', 'asc')->with('nearbyService');
            },
        ]);

        return inertia('web/ShowTripPlan', [
            'tripPlan' => $plan,
        ]);
    }

    private function getRealRoadDistance($locations, $travelMode = 'car')
    {
        $apiKey = env('VITE_GEOAPIFY_API_KEY');

        $waypoints = collect($locations)->map(function ($loc) {
            return $loc['lat'].','.$loc['lng'];
        })->implode('|');

        $mode = ($travelMode === 'bike') ? 'bicycle' : 'drive';

        $url = "https://api.geoapify.com/v1/routing?waypoints={$waypoints}&mode={$mode}&apiKey={$apiKey}";

        try {
            /** @var \Illuminate\Http\Client\Response $response */
            $response = Http::timeout(10)->get($url);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['features'][0]['properties'])) {
                    $properties = $data['features'][0]['properties'];

                    return [
                        'distance' => $properties['distance'] / 1000,
                        'time' => $properties['time'] / 60,
                    ];
                }
            }
        } catch (\Exception $e) {
            \Log::error('Geoapify API Call Failed: '.$e->getMessage());
        }

        return null;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $plan = TripPlan::findOrFail($id);
            $plan->delete();

            return redirect()->back()->with('success', 'Plan deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong. Please try again.');
        }
    }

    public function reviewStore(Request $request)
    {
        $request->validate([
            'place_id' => 'required|exists:places,id|numeric',
            'title' => 'required|max:100|string',
            'message' => 'required|max:1000|string|min:10',
            'rating' => 'required|numeric|min:1|max:5',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5048',
        ], [
            'images.*.max' => 'One or more images are larger than 5MB.',
            'images.*.image' => 'All files must be valid images.',
        ]);

        $user = Auth::guard('user')->user();
        if (! $user) {
            return redirect()->route('login')->with('error', 'Please login first');
        }

        $uploadedPaths = [];

        try {
            DB::beginTransaction();

            $review = PlaceReview::create([
                'title' => $request->title,
                'message' => $request->message,
                'rating' => $request->rating,
                'place_id' => $request->place_id,
                'user_id' => $user->id,
                'user_name' => $user->full_name,
                'status' => 'approved',
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $path = $file->store("places/review/{$review->id}/gallery", 'public');
                    $uploadedPaths[] = $path;

                    PlaceReviewMedia::create([
                        'place_review_id' => $review->id,
                        'media_path' => $path,
                        'media_type' => 'image',
                    ]);
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Review saved successfully!');

        } catch (\Exception $e) {
            DB::rollback();
            foreach ($uploadedPaths as $path) {
                Storage::disk('public')->delete($path);
            }

            \Log::error('Review Store Error: '.$e->getMessage());

            return redirect()->back()->with('error', 'Something went wrong: '.$e->getMessage());
        }
    }

    public function ServicesreviewStore(Request $request)
    {

        $request->validate([
            'service_id' => 'required|exists:nearby_services,id|numeric',
            'title' => 'required|max:100|string',
            'message' => 'required|max:500|string|min:10',
            'rating' => 'required|numeric|min:1|max:5',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:5048',
        ], [
            'images.*.max' => 'One or more images are larger than 5MB.',
            'images.*.image' => 'All files must be valid images.',
        ]);

        $user = Auth::guard('user')->user();
        if (! $user) {
            return redirect()->route('login')->with('error', 'Please login first');
        }

        $uploadedPaths = [];

        try {
            DB::beginTransaction();

            $review = NearbyServiceReview::create([
                'title' => $request->title,
                'message' => $request->message,
                'rating' => $request->rating,
                'nearby_service_id' => $request->service_id,
                'user_id' => $user->id,
                'status' => 'approved',
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $path = $file->store("service/review/{$review->id}/gallery", 'public');
                    $uploadedPaths[] = $path;

                    NearbyServiceReviewMedia::create([
                        'nearby_service_review_id' => $review->id,
                        'media_path' => $path,
                        'media_type' => 'image',
                    ]);
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Review saved successfully!');

        } catch (\Exception $e) {
            DB::rollback();
            foreach ($uploadedPaths as $path) {
                Storage::disk('public')->delete($path);
            }

            \Log::error('Review Store Error: '.$e->getMessage());

            return redirect()->back()->with('error', 'Something went wrong: '.$e->getMessage());
        }
    }

    public function quickAdd(Request $request)
    {
        $userId = Auth::guard('user')->id();

        $request->validate([
            'placeId' => 'required|exists:places,id',
            'tripPlanId' => 'required|exists:trip_plans,id',
        ]);

        $tripPlan = TripPlan::where('id', $request->tripPlanId)
            ->where('user_id', $userId)
            ->first();

        if (! $tripPlan) {
            return redirect()->back()->with('error', 'Unauthorized access to this trip plan.');
        }

        $alreadyExists = $tripPlan->selectedPlaces()
            ->where('place_id', $request->placeId)
            ->exists();

        if ($alreadyExists) {
            return redirect()->back()->with('error', 'This place is already in your trip plan!');
        }

        try {
            DB::beginTransaction();

            $nextOrder = $tripPlan->selectedPlaces()->max('selected_order_number') + 1;

            $tripPlan->selectedPlaces()->create([
                'place_id' => $request->placeId,
                'selected_order_number' => $nextOrder,
                'trip_plan_id' => $tripPlan->id,
            ]);

            $this->updateTripCalculations($tripPlan);

            Place::where('id', $request->placeId)->increment('selection_count');

            DB::commit();

            return redirect()->back()->with('success', 'Place added to '.$tripPlan->title);

        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Quick Add Error: '.$e->getMessage());

            return redirect()->back()->with('error', 'Something went wrong: '.$e->getMessage());
        }
    }

    private function updateTripCalculations($tripPlan)
    {
        $selectedPlaces = $tripPlan->selectedPlaces()
            ->with('place')
            ->orderBy('selected_order_number')
            ->get();

        $totalStayMinutes = 0;
        $totalBudgetLocal = 0;
        $locations = [];

        foreach ($selectedPlaces as $item) {
            $place = $item->place;
            if ($place) {
                $locations[] = [
                    'lat' => (float) $place->latitude,
                    'lng' => (float) $place->longitude,
                ];
                $totalStayMinutes += (int) ($place->estimated_duration ?? 0);
                $totalBudgetLocal += (float) ($place->local_ticket_price ?? 0);
            }
        }

        $totalDistanceKm = 0;
        $totalTravelMinutes = 0;

        if (count($locations) >= 2) {
            $routingData = $this->getRealRoadDistance($locations, $tripPlan->travel_mode);
            if ($routingData) {
                $totalDistanceKm = $routingData['distance'];
                $totalTravelMinutes = $routingData['time'];
            }
        }

        $tripPlan->update([
            'total_distance' => round($totalDistanceKm, 2),
            'estimated_duration_time' => (int) round($totalStayMinutes + $totalTravelMinutes),
            'estimated_budget' => round($totalBudgetLocal, 2),
        ]);
    }
}
