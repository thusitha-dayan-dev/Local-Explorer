<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Place;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PlaceController extends Controller
{
    public function create(Request $request)
    {
        $validated = $request->validate([
            'place_name' => ['required', 'string', 'min:5', 'max:100', 'unique:places,place_name'],
            'description' => ['required', 'string', 'min:100', 'max:7000'],
            'short_description' => ['required', 'string', 'min:20', 'max:400'],
            'address' => ['required', 'string', 'min:10', 'max:250'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'base_distance' => ['required', 'numeric', 'min:0'],
            'local_ticket_price' => ['nullable', 'numeric', 'min:0'],
            'foreign_ticket_price' => ['nullable', 'numeric', 'min:0'],
            'estimated_duration' => ['required', 'string'],
            'opening_time' => ['required', 'date_format:H:i'],
            'closing_time' => ['required', 'date_format:H:i'],
            'best_visit_time' => ['nullable', 'string'],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'website_url' => ['nullable', 'url'],
            'main_image_path' => ['required', 'image', 'mimes:png,jpg,jpeg,webp', 'max:5120'],
            'search_tags' => ['required', 'string'],
            'selection_count' => ['nullable', 'integer'],
            'crowd_level' => ['required', 'in:low,medium,high'],
            'category_id' => ['required', 'exists:categories,id'],
            'sub_category_id' => ['required', 'exists:sub_categories,id'],
            'media_path' => ['nullable', 'array', 'max:4'],
            /*
            'media_path.*.file' => [
                'required',
                'file',
                'mimes:png,jpg,jpeg,mp4,mov,webp',
                'max:10240',
            ],
            'media_path.*.type' => ['required', 'string', 'in:image,video'],
            */
        ]);

        $tempSavedFiles = [];

        try {
            return DB::transaction(function () use ($request, $validated, $tempSavedFiles) {
                if ($request->hasFile('main_image_path')) {
                    $mainImagePath = $request->file('main_image_path')->store('places/main', 'public');
                    $tempSavedFiles[] = $mainImagePath;
                }

                $place = Place::create(array_merge($validated, [
                    'main_image_path' => $mainImagePath ?? null,
                    'slug' => str($request->place_name)->slug().uniqid(),
                ]));

                if ($request->has('media_path')) {
                    foreach ($request->file('media_path') as $index => $mediaItem) {
                        $file = $mediaItem['file'];
                        $type = $request->input("media_path.$index.type", 'image');

                        $folder = ($type === 'video') ? 'videos' : 'gallery';
                        $path = $file->store("places/{$place->id}/{$folder}", 'public');

                        $uploadedPaths[] = $path;

                        $place->media()->create([
                            'media_path' => $path,
                            'media_type' => $type,
                            'place_id' => $place->id,
                        ]);
                    }
                }

                return redirect()->route('admin.add.place')->with('success', 'Place created successfully!');

            });
        } catch (\Exception $e) {

            foreach ($tempSavedFiles as $path) {
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }

            return back()->withErrors(['error' => 'Something went wrong: '.$e->getMessage()]);
        }
    }

    public function destory($id)
    {
        try {
            $place = Place::findOrFail($id);
            $placeName = $place->place_name;
            $place->delete();

            return redirect()->back()->with('success', "{$placeName} Deleted successfully!");

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong or Place not found!');
        }
    }

    public function edit($id, $slug)
    {
        try {
            $plc = Place::With('media')->findOrFail($id);

            return Inertia::render('admin/EditePlace', [
                'category' => Category::all('id', 'category_name'),
                'subCategory' => SubCategory::all('id', 'sub_category_name', 'category_id')->groupBy('category_id'),
                'placeData' => $plc,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Something went wronge or Place not found!');
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'place_name' => "required|string|max:255|min:5|unique:places,place_name,{$id}",
            'description' => ['required', 'string', 'min:100', 'max:7000'],
            'short_description' => ['required', 'string', 'min:20', 'max:400'],
            'address' => ['required', 'string', 'min:10', 'max:250'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'base_distance' => ['required', 'numeric', 'min:0'],
            'local_ticket_price' => ['nullable', 'numeric', 'min:0'],
            'foreign_ticket_price' => ['nullable', 'numeric', 'min:0'],
            'estimated_duration' => ['required', 'string'],
            'opening_time' => ['required', 'date_format:H:i'],
            'closing_time' => ['required', 'date_format:H:i'],
            'best_visit_time' => ['nullable', 'string'],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'website_url' => ['nullable', 'url'],
            'search_tags' => ['required', 'string'],
            'selection_count' => ['nullable', 'integer'],
            'crowd_level' => ['required', 'in:low,medium,high'],
            'category_id' => ['required', 'exists:categories,id'],
            'sub_category_id' => ['required', 'exists:sub_categories,id'],
            'main_image_path' => ['required'],
            'deleted_media_ids' => ['nullable', 'array'],
            'media_path' => ['nullable', 'array', 'max:4'],
            /*
            'media_path.*.file' => ['required', 'file', 'mimes:png,jpg,jpeg,mp4,mov,webp', 'max:10240'],
            'media_path.*.type' => ['required', 'string', 'in:image,video'],
            */
        ]);

        try {
            return DB::transaction(function () use ($id, $request, $validated) {
                $plc = Place::findOrFail($id);

                if ($request->has('deleted_media_ids')) {
                    foreach ($request->deleted_media_ids as $mediaId) {
                        $media = $plc->media()->find($mediaId);
                        if ($media) {
                            Storage::disk('public')->delete($media->media_path);
                            $media->delete();
                        }
                    }
                }

                $existingImagesCount = $plc->media()->where('media_type', 'image')->count();
                $existingVideoCount = $plc->media()->where('media_type', 'video')->count();

                $newImages = collect($request->media_path)->where('type', 'image')->count();
                $newVideos = collect($request->media_path)->where('type', 'video')->count();

                if (($existingImagesCount + $newImages) > 4) {
                    throw new \Exception('The total number of images cannot exceed 4.');
                }

                if (($existingVideoCount + $newVideos) > 1) {
                    throw new \Exception('Only one video can be uploaded.');
                }

                $mainImagePath = $plc->main_image_path;
                if ($request->hasFile('main_image_path')) {
                    $request->validate(['main_image_path' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048']]);
                    if ($plc->main_image_path) {
                        Storage::disk('public')->delete($plc->main_image_path);
                    }
                    $mainImagePath = $request->file('main_image_path')->store('places/main', 'public');
                }

                $plc->update(array_merge($validated, [
                    'main_image_path' => $mainImagePath,
                    'slug' => str($request->place_name)->slug().'-'.substr(uniqid(), -5),
                ]));

                if ($request->has('media_path')) {
                    foreach ($request->media_path as $index => $mediaItem) {
                        if ($request->hasFile("media_path.{$index}.file")) {
                            $file = $request->file("media_path.{$index}.file");
                            $type = $mediaItem['type'];

                            $folder = ($type === 'video') ? 'videos' : 'gallery';
                            $path = $file->store("places/{$plc->id}/{$folder}", 'public');

                            $plc->media()->create([
                                'media_path' => $path,
                                'media_type' => $type,
                            ]);
                        }
                    }
                }

                return to_route('admin.manage.place')->with('success', 'Place updated successfully!');
            });

        } catch (\Exception $th) {
            return back()->with('error', $th->getMessage() ?: 'Something went wrong!');
        }
    }

    public function createShow()
    {
        return Inertia::render('admin/AddPlace', [
            'category' => Category::all('id', 'category_name'),
            'subCategory' => SubCategory::all('id', 'sub_category_name', 'category_id')->groupBy('category_id'),
        ]);
    }
}
