<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'category_name' => [
                'required',
                'min:3',
                'max:250',
                'string',
            ],
            'category_id' => [
                'nullable',
                'numeric',
                'exists:categories,id',
            ],
        ]);

        if ($request->category_id) {
            SubCategory::create([
                'sub_category_name' => $request->category_name,
                'category_id' => $request->category_id,
            ]);

            return redirect()->route('admin.manage.category')->with('success', 'Your new category has been added successfully. It is now live in the system.');
        } else {
            Category::create([
                'category_name' => $request->category_name,
            ]);

            return redirect()->route('admin.manage.category')->with('success', 'Your new sub category has been added successfully. It is now live in the system.');
        }

    }

    public function destory($id, $type)
    {
        try {
            if ($type === 'main') {
                $category = Category::findOrFail($id);
                $category->delete();
            } else {
                $subCategory = SubCategory::findOrFail($id);
                $subCategory->delete();
            }

            return redirect()->back()->with('success', 'Deleted successfully!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong!');
        }
    }

    public function edite(Request $request, $id)
    {
        $request->validate([
            'category_name' => ['required', 'string', 'max:250'],
            'category_id' => ['nullable', 'exists:categories,id'],
        ]);

        try {
            if ($request->category_id) {
                $sub = SubCategory::findOrFail($id);

                $sub->update([
                    'sub_category_name' => $request->category_name,
                    'category_id' => $request->category_id,
                ]);

                return redirect()->back()->with('success', 'Sub Category updated successfully!');

            } else {
                $category = Category::findOrFail($id);

                $category->update([
                    'category_name' => $request->category_name,
                ]);

                return redirect()->back()->with('success', 'Category updated successfully!');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong!');
        }
    }
}
