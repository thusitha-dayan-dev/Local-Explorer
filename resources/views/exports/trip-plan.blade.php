<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style>
        @page {
            margin: 0;
        }

        body {
            font-family: 'Helvetica', sans-serif;
            color: #334155;
            margin: 0;
            padding: 0;
            background: #f8fafc;
        }

        .header {
            background: #10b981;
            color: white;
            padding: 40px 50px;
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
            text-transform: uppercase;
        }

        .stats-bar {
            background: #ffffff;
            margin: -30px 50px 30px;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: table;
            width: 85%;
        }

        .stat-item {
            display: table-cell;
            text-align: center;
            width: 25%;
            border-right: 1px solid #e2e8f0;
        }

        .stat-item:last-child {
            border-right: none;
        }

        .stat-label {
            font-size: 10px;
            color: #64748b;
            text-transform: uppercase;
            display: block;
        }

        .stat-value {
            font-size: 15px;
            font-weight: bold;
            color: #0f172a;
        }

        .container {
            padding: 0 50px 50px;
        }

        .place-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            border: 1px solid #e2e8f0;
            margin-bottom: 40px;
        }

        .place-name {
            font-size: 22px;
            font-weight: bold;
            color: #10b981;
            margin: 0 0 15px 0;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 10px;
        }

        /* Information Grid */
        .info-table {
            display: table;
            width: 100%;
            margin-bottom: 15px;
        }

        .info-row {
            display: table-row;
        }

        .info-cell {
            display: table-cell;
            padding: 10px 5px;
            border-bottom: 1px solid #f8fafc;
        }

        .label {
            font-size: 11px;
            color: #94a3b8;
            font-weight: bold;
            text-transform: uppercase;
        }

        .value {
            font-size: 13px;
            color: #1e293b;
        }

        .description {
            font-size: 13px;
            line-height: 1.7;
            color: #475569;
            margin: 15px 0;
            text-align: justify;
        }

        .map-link-container {
            margin-top: 20px;
            text-align: right;
        }

        .map-btn {
            display: inline-block;
            background: #0f172a;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 8px;
            font-size: 12px;
            font-weight: bold;
        }

        .footer {
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
            margin-top: 50px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>{{ $trip->title }}</h1>
        <p>Your Ultimate Travel Plan by Local Explorer • {{ date('M d, Y') }}</p>
    </div>

    @php
        $coords = $trip->selectedPlaces
            ->map(function ($item) {
                return $item->place->latitude . ',' . $item->place->longitude;
            })
            ->implode('/');

        $fullRouteUrl = 'https://www.google.com/maps/dir/' . $coords;
    @endphp

    <div class="stats-bar">
        <div class="stat-item">
            <span class="stat-label">Travel Date</span>
            <span class="stat-value">{{ $trip->travel_date }}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Total Distance</span>
            <span class="stat-value">{{ $trip->total_distance }} KM</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Travel Mode</span>
            <span class="stat-value" style="text-transform: capitalize;">{{ $trip->travel_mode }}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Est. Budget</span>
            <span class="stat-value">Rs. {{ number_format($trip->estimated_budget, 2) }}</span>
        </div>
    </div>

    <div class="container">
        <h2 style="color: #0f172a; margin-bottom: 25px;">📍 Detailed Itinerary</h2>

        @foreach ($trip->selectedPlaces as $index => $item)
            <div class="place-card">
                <div class="place-name">{{ $index + 1 }}. {{ $item->place->place_name }}</div>

                <div class="info-table">
                    <div class="info-row">
                        <div class="info-cell">
                            <span class="label">Ticket Price:</span><br>
                            <span class="value" style="color: #10b981; font-weight: bold;">Rs.
                                {{ number_format($item->place->local_ticket_price, 2) }}</span>
                        </div>
                        <div class="info-cell">
                            <span class="label">Crowd Level:</span><br>
                            <span class="value">{{ ucfirst($item->place->crowd_level) }}</span>
                        </div>
                        <div class="info-cell">
                            <span class="label">Best Visit Time:</span><br>
                            <span class="value">{{ $item->place->best_visit_time ?? 'Morning/Evening' }}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-cell">
                            <span class="label">Open/Close:</span><br>
                            <span class="value">07:00 AM - 06:00 PM</span>
                        </div>
                        <div class="info-cell" colspan="2">
                            <span class="label">Address:</span><br>
                            <span class="value">{{ $item->place->address }}</span>
                        </div>
                    </div>
                </div>

                <div class="description">
                    {{ strip_tags($item->place->description) }}
                </div>

                <div class="map-link-container">
                    <a href="https://www.google.com/maps/search/?api=1&query={{ $item->place->latitude }},{{ $item->place->longitude }}"
                        class="map-btn">
                        🗺️ View Location on Map
                    </a>
                </div>
            </div>
        @endforeach

        <div style="margin: 0 50px 30px; text-align: center;">
            <a href="{{ $fullRouteUrl }}"
                style="display: block; background: #10b981; color: white; padding: 18px;
              text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px;
              box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); border: 1px solid #059669;">
                📍 CLICK HERE TO VIEW FULL TRAVEL ROUTE ON GOOGLE MAPS
            </a>
        </div>

        <div class="footer">
            This travel plan was generated based on your preferences. Enjoy your trip and stay safe!<br>
            <strong>Local Explorer - Dambulla Day Trip Planner</strong>
        </div>
    </div>
</body>

</html>
