<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NearbyService;
use App\Models\ServiceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NearbyServiceController extends Controller
{
    public function create(Request $request)
    {
        $validated = $request->validate([
            'service_name' => 'required|string|min:5|max:100|unique:nearby_services,service_name',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'description' => 'required|string|min:100|max:7000',
            'short_description' => 'required|string|min:20|max:250',
            'price_range' => 'required|in:low,medium,high,none',
            'main_image_path' => 'required|image|mimes:png,jpg,jpeg|max:5120',
            'website_url' => 'nullable|url',
            'contact_number' => 'nullable|string|max:20',
            'opening_time' => 'required|date_format:H:i',
            'close_time' => 'required|date_format:H:i',
            'address' => 'required|string|min:10|max:250',
            'search_tags' => 'required|string',
            'service_type_id' => 'required|exists:service_types,id',
            'media_path' => 'nullable|array|max:5',
            'media_path.*' => 'image|mimes:png,jpg,jpeg|max:10240',
        ]);

        $tempSavedFiles = [];

        try {
            return DB::transaction(function () use ($request, $validated, &$tempSavedFiles) {

                $mainImagePath = $request->file('main_image_path')->store('service/main', 'public');
                $tempSavedFiles[] = $mainImagePath;

                $service = NearbyService::create(array_merge($validated, [
                    'main_image_path' => $mainImagePath,
                    'slug' => str($request->service_name)->slug().'-'.uniqid(),
                ]));

                if ($request->hasFile('media_path')) {
                    foreach ($request->file('media_path') as $file) {
                        $path = $file->store("places/{$service->id}/gallery", 'public');
                        $tempSavedFiles[] = $path;

                        $service->media()->create([
                            'media_path' => $path,
                            'media_type' => 'image',
                            'nearby_service_id' => $service->id,
                        ]);
                    }
                }

                return redirect()->route('admin.add.service')->with('success', 'Place created successfully!');
            });

        } catch (\Exception $e) {
            foreach ($tempSavedFiles as $path) {
                Storage::disk('public')->delete($path);
            }

            return back()->withErrors(['error' => 'Something went wrong: '.$e->getMessage()]);
        }
    }

    public function destory($id)
    {
        try {
            $Service = NearbyService::findOrFail($id);
            $placeName = $Service->service_name;
            $Service->delete();

            return redirect()->back()->with('success', "{$placeName} Deleted successfully!");

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong or Place not found!');
        }
    }

    public function editeShow($id)
    {

        try {
            $service = NearbyService::with('media')->findOrFail($id);

            return Inertia::render('admin/EditServices', [
                'serviceData' => $service,
                'serviceType' => ServiceType::all('id', 'service_type_name'),
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Something went wronge or Place not found!');
        }
    }

    public function editStore(Request $request, $id)
    {
        $validated = $request->validate([
            'service_name' => 'required|string|min:5|max:100|unique:nearby_services,service_name,'.$id,
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'description' => 'required|string|min:100|max:7000',
            'short_description' => 'required|string|min:20|max:250',
            'price_range' => 'required|in:low,medium,high',
            'main_image_path' => 'required',
            'website_url' => 'nullable|url',
            'contact_number' => 'nullable|string|max:20',
            'opening_time' => 'required',
            'close_time' => 'required',
            'address' => 'required|string|min:10|max:250',
            'search_tags' => 'required|string',
            'service_type_id' => 'required|exists:service_types,id',
            'media_path' => 'nullable|array|max:5',
            'media_path.*' => 'image|mimes:png,jpg,jpeg|max:10240',
            'deleted_media_ids' => 'nullable|array',
            'deleted_media_ids.*' => 'exists:nearby_service_medias,id',
        ]);

        try {
            return DB::transaction(function () use ($id, $request, $validated) {
                $service = NearbyService::findOrFail($id);

                if ($request->filled('deleted_media_ids')) {
                    $mediaToDelete = $service->media()->whereIn('id', $request->deleted_media_ids)->get();
                    foreach ($mediaToDelete as $media) {
                        Storage::disk('public')->delete($media->media_path);
                        $media->delete();
                    }
                }

                $existingImagesCount = $service->media()->count();
                $newImagesCount = $request->hasFile('media_path') ? count($request->file('media_path')) : 0;

                if (($existingImagesCount + $newImagesCount) > 4) {
                    throw new \Exception('The total number of gallery images cannot exceed 4.');
                }

                $mainImagePath = $service->main_image_path;

                if ($request->hasFile('main_image_path')) {
                    $request->validate([
                        'main_image_path' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
                    ]);

                    if ($service->main_image_path) {
                        Storage::disk('public')->delete($service->main_image_path);
                    }
                    $mainImagePath = $request->file('main_image_path')->store('service/main', 'public');
                }

                $slug = $service->slug;
                if ($service->service_name !== $request->service_name) {
                    $slug = str($request->service_name)->slug().'-'.substr(uniqid(), -5);
                }

                $dataToUpdate = collect($validated)->except(['main_image_path', 'media_path', 'deleted_media_ids'])->toArray();

                $service->update(array_merge($dataToUpdate, [
                    'main_image_path' => $mainImagePath,
                    'slug' => $slug,
                ]));

                if ($request->hasFile('media_path')) {
                    foreach ($request->file('media_path') as $file) {
                        $path = $file->store("places/{$service->id}/gallery", 'public');

                        $service->media()->create([
                            'media_path' => $path,
                            'media_type' => 'image',
                        ]);
                    }
                }

                return to_route('admin.manage.service')->with('success', 'Nearby service updated successfully!');
            });

        } catch (\Exception $th) {
            return back()->with('error', $th->getMessage() ?: 'Something went wrong!');
        }
    }

    public function show()
    {
        return Inertia::render('admin/AddNewService', [
            'serviceType' => ServiceType::all('id', 'service_type_name'),
        ]);
    }
}
