<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\NearbyService;
use App\Models\NearbyServiceReview;
use App\Models\Place;
use App\Models\PlaceReview;
use App\Models\ServiceType;
use App\Models\SubCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $admin = auth()->guard('admin')->user();

        $placeReviewCount = PlaceReview::where('status', '!=', 'rejected')->count();
        $serviceReviewCount = NearbyServiceReview::where('status', '!=', 'rejected')->count();

        $categories = Category::withCount('place')->orderBy('place_count', 'desc')->get();
        $top7 = $categories->take(7);
        $othersCount = $categories->skip(7)->sum('place_count');
        $chartData = $top7->map(function ($cat) {
            return [
                'name' => $cat->category_name,
                'count' => $cat->place_count,
            ];
        });

        if ($othersCount > 0) {
            $chartData->push([
                'name' => 'Other',
                'count' => (int) $othersCount,
            ]);
        }
        $topPlace = Place::with('category:id,category_name')->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'place_name', 'selection_count', 'created_at', 'updated_at', 'main_image_path', 'category_id', 'slug'])
            ->map(function ($place) {
                return [
                    'id' => $place->id,
                    'place_name' => $place->place_name,
                    'selection_count' => $place->selection_count,
                    'category_name' => $place->category ? $place->category->category_name : 'No Category',
                    'main_image_path' => $place->main_image_path,
                    'created_at' => $place->created_at->format('Y-m-d'),
                    'updated_at' => $place->updated_at->format('Y-m-d'),
                    'slug' => $place->slug,
                ];
            });

        return Inertia::render('admin/Dashboard', [
            'auth' => [
                'user' => $admin,
            ],
            'email' => $admin ? $admin->email : null,
            'placesCount' => Place::count(),
            'usersCount' => User::count(),
            'reviewsCount' => $placeReviewCount + $serviceReviewCount,
            'CategoryChartData' => $chartData,
            'topPlace' => $topPlace,
        ]);
    }

    public function managePlace(Request $request)
    {
        $query = Place::query();

        if ($request->filled('search')) {
            $query->where('place_name', 'like', "%{$request->search}%");
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('subCategory')) {
            $query->where('sub_category_id', $request->subCategory);
        }

        $sortOrder = $request->input('sort', 'desc');
        $query->orderBy('created_at', $sortOrder);

        return Inertia::render('admin/ManagePlace', [
            'places' => $query->with('category', 'subCategory')->paginate(5)->withQueryString(),
            'filters' => $request->only(['search', 'category', 'sort', 'subCategory']),
            'category' => Category::all('id', 'category_name'),
            'subCategory' => SubCategory::all('id', 'sub_category_name', 'category_id')->groupBy('category_id'),
        ]);
    }

    public function manageCategory(Request $request)
    {
        $query = Category::with(['subCategory' => function ($q) {
            $q->withCount('place');
        }])->withCount('place');

        if ($request->filled('search')) {
            $term = $request->search;

            $query->where(function ($q) use ($term) {
                $q->where('category_name', 'LIKE', "%{$term}%")
                    ->orWhereHas('subCategory', function ($sq) use ($term) {
                        $sq->where('sub_category_name', 'LIKE', "%{$term}%");
                    });
            });
        }

        if ($request->sort === 'Oldest First') {
            $query->oldest();
        } else {
            $query->latest();
        }

        $categories = $query->get();
        $categoriesCount = Category::count();
        $subCategoryCount = SubCategory::count();

        return Inertia::render('admin/ManageCategory', [
            'categories' => $categories,
            'count' => [
                'catCount' => $categoriesCount,
                'subCateCount' => $subCategoryCount,
            ],
            'filters' => $request->only(['search', 'sort']),
        ]);
    }

    public function manageReview(Request $request)
    {
        $query = PlaceReview::query();

        if ($request->filled('search')) {
            $query->where('title', 'LIKE', "%{$request->search}%");
        }

        if ($request->filled('type')) {
            $query->where('status', $request->type);
        }

        if ($request->filled('order')) {
            $query->orderBy('created_at', $request->order);
        } else {
            $query->latest();
        }

        $reviews = $query->with(['place'])->with(['placeReviewMedia'])->with('user')->paginate(10)->withQueryString();

        return Inertia::render('admin/ManageReviews', [
            'reviews' => $reviews,
            'filters' => $request->only(['search', 'type', 'order']),
        ]);
    }

    public function manageService(Request $request)
    {
        $query = NearbyService::query();

        if ($request->filled('search')) {
            $query->where('service_name', 'like', "%{$request->search}%");
        }

        if ($request->filled('category')) {
            $query->where('service_type_id', $request->category);
        }

        $sortOrder = $request->input('sort', 'desc');
        $query->orderBy('created_at', $sortOrder);

        return Inertia::render('admin/ManageService', [
            'services' => $query->with('serviceType')->paginate(10)->withQueryString(),
            'serviceTypes' => ServiceType::select('id', 'service_type_name')->get(),
            'filters' => $request->only(['search', 'category', 'sort']),
        ]);
    }

    public function manageServiceType(Request $request)
    {
        $query = ServiceType::withCount('nearbyService');

        if ($request->filled('search')) {
            $term = $request->search;
            $query->where('service_type_name', 'LIKE', "%{$term}%");
        }

        if ($request->sort === 'Oldest First') {
            $query->oldest();
        } else {
            $query->latest();
        }

        $serviceType = $query->get();
        $serviceTypeCount = ServiceType::count();

        return Inertia::render('admin/ManageServiceType', [
            'serviceType' => $serviceType,
            'count' => $serviceTypeCount,
            'filters' => $request->only(['search', 'sort']),
        ]);
    }

    public function globalSearch(Request $request)
    {
        $query = $request->input('query');
        if (! $query) {
            return response()->json([]);
        }

        $cleanQuery = strtolower(trim($query));
        $keywords = explode(' ', $cleanQuery);

        $place = Place::where('place_name', 'LIKE', "%{$query}%")->limit(5)->get()
            ->map(fn ($p) => [
                'label' => $p->place_name,
                'type' => 'Place',
                'url' => route('admin.manage.place', ['search' => $p->place_name]),
            ]);

        $service = NearbyService::where('service_name', 'LIKE', "%{$query}%")->limit(5)->get()
            ->map(fn ($s) => [
                'label' => $s->service_name,
                'type' => 'Nearby Service',
                'url' => route('admin.manage.service', ['search' => $s->service_name]),
            ]);

        $category = Category::where('category_name', 'LIKE', "%{$query}%")->limit(5)->get()
            ->map(fn ($cat) => [
                'label' => $cat->category_name,
                'type' => 'Category',
                'url' => route('admin.manage.category', ['search' => $cat->category_name]),
            ]);

        $subCategory = SubCategory::where('sub_category_name', 'LIKE', "%{$query}%")->limit(5)->get()
            ->map(fn ($sub) => [
                'label' => $sub->sub_category_name,
                'type' => 'Sub Category',
                'url' => route('admin.manage.category', ['search' => $sub->sub_category_name]),
            ]);

        $staticLinks = collect([
            ['label' => 'Manage Places', 'type' => 'Action', 'url' => route('admin.manage.place')],
            ['label' => 'Manage Category', 'type' => 'Action', 'url' => route('admin.manage.category')],
            ['label' => 'Manage Service', 'type' => 'Action', 'url' => route('admin.manage.service')],
            ['label' => 'Manage Service Type', 'type' => 'Action', 'url' => route('admin.manage.service.type')],
            ['label' => 'Manage Users Reviews', 'type' => 'Action', 'url' => route('admin.manage.review')],
            ['label' => 'Add New Place', 'type' => 'Action', 'url' => route('admin.add.place')],
            ['label' => 'Add New Service', 'type' => 'Action', 'url' => route('admin.add.service')],
            ['label' => 'Add New Service Type', 'type' => 'Action', 'url' => route('admin.manage.service.type')],
            ['label' => 'Add New Ctegory', 'type' => 'Action', 'url' => route('admin.manage.category')],
            ['label' => 'Add New Sub Ctegory', 'type' => 'Action', 'url' => route('admin.manage.category')],
        ])->filter(function ($link) use ($keywords) {
            $label = strtolower($link['label']);

            return collect($keywords)->every(fn ($word) => str_contains($label, $word));
        });

        $results = collect()
            ->merge($place)
            ->merge($service)
            ->merge($category)
            ->merge($subCategory)
            ->merge($staticLinks)
            ->values();

        return response()->json($results);
    }

    public function manageServiceReview(Request $request)
    {
        $query = NearbyServiceReview::query();

        // Filters
        if ($request->filled('search')) {
            $query->where('title', 'LIKE', "%{$request->search}%");
        }

        if ($request->filled('type')) {
            $query->where('status', $request->type);
        }

        if ($request->filled('order')) {
            $query->orderBy('created_at', $request->order);
        } else {
            $query->latest();
        }

        $reviews = $query->with(['nearbyService', 'nearbyServiceReviewMedia', 'user'])
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/ManageServiceReviews', [
            'reviews' => $reviews,
            'filters' => $request->only(['search', 'type', 'order']),
        ]);
    }
}
