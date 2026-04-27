<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Nearby Services Report</title>
    <style>
        @page {
            margin: 80px 25px;
        }

        header {
            position: fixed;
            top: -50px;
            left: 0;
            right: 0;
            height: 40px;
            text-align: center;
            border-bottom: 2px solid #059669;
            color: #059669;
            font-weight: bold;
        }

        footer {
            position: fixed;
            bottom: -50px;
            left: 0;
            right: 0;
            height: 40px;
            text-align: center;
            font-size: 10px;
            color: #64748b;
        }

        body {
            font-family: 'Helvetica', sans-serif;
            font-size: 11px;
            color: #1e293b;
            line-height: 1.4;
        }

        .title-section {
            text-align: center;
            margin-bottom: 20px;
        }

        .title-section h1 {
            margin: 0;
            color: #065f46;
            font-size: 22px;
            text-transform: uppercase;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: bold;
            text-align: left;
            padding: 10px 8px;
            border: 1px solid #cbd5e1;
            font-size: 10px;
        }

        td {
            padding: 10px 8px;
            border: 1px solid #cbd5e1;
            vertical-align: top;
            word-wrap: break-word;
        }

        .img-box {
            width: 50px;
            height: 50px;
            border-radius: 5px;
            background: #f1f5f9;
            overflow: hidden;
        }

        .img-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .type-badge {
            font-size: 9px;
            color: #2563eb;
            background: #eff6ff;
            padding: 2px 6px;
            border-radius: 4px;
            display: inline-block;
            margin-top: 4px;
        }

        .price {
            color: #dc2626;
            font-weight: bold;
        }

        .contact-info {
            font-size: 9px;
            color: #64748b;
            margin-top: 5px;
        }
    </style>
</head>

<body>
    <header>TRAVEL GUIDE - NEARBY SERVICES DIRECTORY</header>
    <footer>Generated on: {{ $date }} | Page {PAGENO}</footer>

    <div class="title-section">
        <h1>Detailed Services Report</h1>
        <p>List of all nearby services and amenities registered in the system</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="12%">Image</th>
                <th width="28%">Service Details</th>
                <th width="35%">Description & Location</th>
                <th width="15%">Pricing</th>
                <th width="10%">Timing</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($results as $service)
                <tr>
                    <td>
                        <div class="img-box">
                            @if ($service->base64)
                                <img src="{{ $service->base64 }}" alt="">
                            @else
                                <div style="text-align: center; padding-top: 15px; font-size: 7px; color: #94a3b8;">No
                                    Image</div>
                            @endif
                        </div>
                    </td>

                    <td>
                        <div style="font-weight: bold; font-size: 12px; color: #1e293b;">{{ $service->service_name }}
                        </div>
                        <span class="type-badge">{{ $service->serviceType->service_type_name ?? 'N/A' }}</span>
                        <div class="contact-info">
                            📞 {{ $service->contact_number ?? 'No Contact' }}<br>
                            🌐 {{ $service->website_url ? 'Website Available' : 'No Website' }}
                        </div>
                    </td>

                    <td>
                        <div style="font-size: 10px; margin-bottom: 5px;">{{ $service->short_description }}</div>
                        <div style="font-size: 9px; color: #64748b; font-style: italic;">
                            📍 {{ $service->address }}
                        </div>
                    </td>

                    <td class="price" style="text-align: center;">
                        {{ $service->price_range ?? 'N/A' }}
                    </td>

                    <td style="text-align: center; font-size: 9px;">
                        <span style="color: #059669;">{{ $service->opening_time }}</span><br>to<br>
                        <span style="color: #dc2626;">{{ $service->close_time }}</span>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
