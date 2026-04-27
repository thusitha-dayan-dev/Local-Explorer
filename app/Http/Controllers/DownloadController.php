<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\NearbyService;
use App\Models\Place;
use App\Models\TripPlan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class DownloadController extends Controller
{
    public function downloadPDF(Request $request)
    {
        $type = $request->query('type');
        $search = $request->query('search');
        $categoryId = $request->query('category');
        $limit = $request->query('limit', 50);

        if ($type === 'places') {
            $query = Place::with(['category', 'subCategory']);

            if (! empty($search)) {
                $query->where('place_name', 'LIKE', "%{$search}%");
            }

            if (! empty($categoryId)) {
                $query->where('category_id', $categoryId);
            }

            if ($limit !== 'all') {
                $query->limit((int) $limit);
            }

            $results = $query->latest()->get();
            $view = 'pdf.places_report';
            $title = 'Places_Report_'.date('Ymd');

        } elseif ($type === 'categories') {
            $results = Category::with('subCategory')->latest()->get();
            $view = 'pdf.categories_report';
            $title = 'Categories_List_'.date('Ymd');
        } elseif ($type === 'services') {
            $results = NearbyService::with('serviceType')->latest()->get();
            $view = 'pdf.services_report';
            $title = 'Nearby_Services_List_'.date('Ymd');
        }

        if ($results->isEmpty()) {
            abort(404, 'No data found for this report.');
        }

        $results->transform(function ($item) {
            if ($item->main_image_path) {
                $fullPath = storage_path('app/public/'.$item->main_image_path);

                if (file_exists($fullPath)) {
                    $imgData = base64_encode(file_get_contents($fullPath));
                    $extension = pathinfo($fullPath, PATHINFO_EXTENSION);
                    $item->base64 = 'data:image/'.$extension.';base64,'.$imgData;
                } else {
                    $item->base64 = null;
                }
            }

            return $item;
        });

        $pdf = Pdf::loadView($view, [
            'results' => $results,
            'date' => now()->format('Y-m-d H:i A'),
        ])
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'defaultFont' => 'sans-serif',
                'debugLayout' => false,
            ]);

        return $pdf->download($title.'.pdf');

    }

    public function exportTripPlan(Request $request, $id)
    {
        $trip = TripPlan::with(['selectedPlaces.place'])->findOrFail($id);

        $markers = $trip->selectedPlaces->map(function ($item) {
            return $item->place->latitude.','.$item->place->longitude;
        })->implode('|');

        $first = $trip->selectedPlaces->first()->place;

        $staticMapUrl = "https://staticmaps.cloud66.com/staticmap.php?center={$first->latitude},{$first->longitude}&zoom=12&size=800x400&markers=|{$markers}";

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.trip-plan', compact('trip', 'staticMapUrl'))
            ->setPaper('a4', 'portrait');

        $fileName = 'Trip-Plan-'.time().'.pdf';
        $path = public_path('exports/'.$fileName);

        if (! file_exists(public_path('exports'))) {
            mkdir(public_path('exports'), 0777, true);
        }
        $pdf->save($path);

        return redirect()->back()->with('pdf_url', asset('exports/'.$fileName));
    }
}
