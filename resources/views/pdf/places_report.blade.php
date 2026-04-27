<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Places Report</title>
    <style>
        @page {
            margin: 100px 25px;
        }

        header {
            position: fixed;
            top: -60px;
            left: 0;
            right: 0;
            height: 50px;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }

        footer {
            position: fixed;
            bottom: -60px;
            left: 0;
            right: 0;
            height: 50px;
            text-align: center;
            font-size: 10px;
            color: #999;
        }

        body {
            font-family: 'Helvetica', sans-serif;
            font-size: 11px;
            color: #333;
            line-height: 1.5;
        }

        .title-section {
            text-align: center;
            margin-bottom: 20px;
        }

        .title-section h1 {
            margin: 0;
            color: #ef4444;
            text-transform: uppercase;
            font-size: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            table-layout: fixed;
        }

        th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: bold;
            text-align: left;
            padding: 8px;
            border: 1px solid #e2e8f0;
            text-transform: uppercase;
            font-size: 9px;
        }

        td {
            padding: 8px;
            border: 1px solid #e2e8f0;
            vertical-align: top;
            word-wrap: break-word;
        }

        .img-box {
            width: 50px;
            height: 50px;
            border-radius: 4px;
            overflow: hidden;
        }

        .img-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .badge {
            display: inline-block;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
            background: #fef2f2;
            color: #ef4444;
            margin-bottom: 3px;
        }

        .price-tag {
            color: #059669;
            font-weight: bold;
        }

        .text-muted {
            color: #64748b;
            font-size: 10px;
        }

        .status-active {
            color: #10b981;
            font-weight: bold;
        }

        .status-inactive {
            color: #ef4444;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <header>
        Travel Guide Admin System - Official Report
    </header>

    <footer>
        Copyright &copy; {{ date('Y') }} Travel Guide. Page {PAGENO}
    </footer>

    <div class="title-section">
        <h1>Places Summary Report</h1>
        <p>Generated on: {{ date('Y-m-d H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="12%">Preview</th>
                <th width="28%">Place & Location</th>
                <th width="20%">Category & Info</th>
                <th width="20%">Ticket Prices</th>
                <th width="20%">Timing & Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($results as $place)
                <tr>
                    <td>
                        <div class="img-box">
                            @if (isset($place->base64))
                                <img src="{{ $place->base64 }}" alt="">
                            @else
                                <div
                                    style="background: #eee; height: 100%; text-align: center; padding-top: 15px; font-size: 8px;">
                                    No Image</div>
                            @endif
                        </div>
                    </td>

                    <td>
                        <strong>{{ $place->place_name }}</strong><br>
                        <span class="text-muted">{{ Str::limit($place->address, 50) }}</span><br>
                        <small>📍 {{ $place->latitude }}, {{ $place->longitude }}</small>
                    </td>

                    <td>
                        <span class="badge">{{ $place->category->category_name ?? 'Main' }}</span><br>
                        @if ($place->subCategory)
                            <small class="text-muted">Sub: {{ $place->subCategory->category_name }}</small><br>
                        @endif
                        <small>Crowd: <strong>{{ ucfirst($place->crowd_level) }}</strong></small><br>
                        <small>Dist: {{ $place->base_distance }}</small>
                    </td>

                    <td>
                        <span class="price-tag">Local: {{ number_format($place->local_ticket_price, 2) }}</span><br>
                        <span class="price-tag">Foreign:
                            {{ number_format($place->foreign_ticket_price, 2) }}</span><br>
                        <small class="text-muted">Duration: {{ $place->estimated_duration }} min</small>
                    </td>

                    <td>
                        <small>Open: {{ date('h:i A', strtotime($place->opening_time)) }}</small><br>
                        <small>Close: {{ date('h:i A', strtotime($place->closing_time)) }}</small><br>
                        <small>Status:
                            <span class="{{ $place->status == 'active' ? 'status-active' : 'status-inactive' }}">
                                {{ strtoupper($place->status) }}
                            </span>
                        </small>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
