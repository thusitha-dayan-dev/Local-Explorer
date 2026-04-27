<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use Illuminate\Http\Request;

class ServiceTypeController extends Controller
{
    public function create(Request $request)
    {
        $validated = $request->validate([
            'service_type_name' => [
                'required',
                'min:4',
                'max:250',
                'string',
                'unique:service_types,service_type_name',
            ],
        ]);

        ServiceType::create([
            'service_type_name' => $validated['service_type_name'],
        ]);

        return back()->with('success', 'New Service Type created successfully!');
    }

    public function destory($id)
    {
        try {
            $serviceType = ServiceType::findOrFail($id);
            $serviceName = $serviceType->service_type_name;
            $serviceType->delete();

            return redirect()->back()->with('success', "{$serviceName} Deleted successfully!");
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Something went wrong or Place not found!');
        }
    }

    public function edit(Request $request, $id)
    {
        $validated = $request->validate([
            'service_type_name' => [
                'required',
                'min:4',
                'max:250',
                'string',
                'unique:service_types,service_type_name,'.$id,
            ],
        ]);

        $serviceType = ServiceType::findOrFail($id);

        $serviceType->update([
            'service_type_name' => $validated['service_type_name'],
        ]);

        return back()->with('success', 'Service Type updated successfully!');

    }
}
