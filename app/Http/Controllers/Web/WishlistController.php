<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'place_id' => 'required|exists:places,id',
        ]);

        if (! auth()->guard('user')->check()) {
            return redirect()->route('login')->with('error', 'Please login first to add favorites!');
        }

        $userId = auth()->guard('user')->id();
        $placeId = $request->place_id;
        $wishlist = Wishlist::where('user_id', $userId)->where('place_id', $placeId);

        if ($wishlist->exists()) {
            $wishlist->delete();
            $message = 'Removed from wishlist';
        } else {
            Wishlist::create([
                'user_id' => $userId,
                'place_id' => $placeId,
            ]);
            $message = 'Added to wishlist';
        }

        return back()->with('success', $message);

    }
}
