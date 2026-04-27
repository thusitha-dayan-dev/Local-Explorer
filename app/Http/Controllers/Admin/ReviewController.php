<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NearbyServiceReview;
use App\Models\PlaceReview;

class ReviewController extends Controller
{
    public function deletePlaceReview($id)
    {
        $review = PlaceReview::findOrFail($id);

        $review->delete();

        return redirect()->back()->with('success', 'Review deleted successfully!');
    }

    public function approvePlaceReview($id)
    {
        $review = PlaceReview::findOrFail($id);

        if ($review->status === 'approved') {
            return redirect()->back()->with('error', 'Review is already approved!');
        }

        $review->update([
            'status' => 'approved',
        ]);

        return redirect()->back()->with('success', 'Review approved successfully!');
    }

    public function rejectPlaceReview($id)
    {
        $review = PlaceReview::findOrFail($id);

        if ($review->status === 'rejected') {
            return redirect()->back()->with('error', 'Review is already rejected!');
        }

        $review->update([
            'status' => 'rejected',
        ]);

        return redirect()->back()->with('success', 'Review Rejected successfully!');

    }

    public function deleteServiceReview($id)
    {
        $review = NearbyServiceReview::findOrFail($id);

        $review->delete();

        return redirect()->back()->with('success', 'Review deleted successfully!');
    }

    public function approveServiceReview($id)
    {
        $review = NearbyServiceReview::findOrFail($id);

        if ($review->status === 'approved') {
            return redirect()->back()->with('error', 'Review is already approved!');
        }

        $review->update([
            'status' => 'approved',
        ]);

        return redirect()->back()->with('success', 'Review approved successfully!');
    }

    public function rejectServiceReview($id)
    {
        $review = NearbyServiceReview::findOrFail($id);

        if ($review->status === 'rejected') {
            return redirect()->back()->with('error', 'Review is already rejected!');
        }

        $review->update([
            'status' => 'rejected',
        ]);

        return redirect()->back()->with('success', 'Review Rejected successfully!');

    }
}
