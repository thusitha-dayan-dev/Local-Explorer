import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { TripPlan } from '@/types/web';
import { FormatDuration } from '@/lib/utils';

// --- Custom Marker Icons ---
const createCustomIcon = (color: string) => {
    return new L.DivIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: ${color};" class="marker-dot"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });
};

const icons = {
    place: createCustomIcon('#22c55e'),
    service: createCustomIcon('#2563eb'),
};

// --- Routing Logic Component ---
const Routing = ({ locations, setSummary }: { locations: any[]; setSummary: any }) => {
    const map = useMap();
    const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
    const routeKey = JSON.stringify(locations.map((loc) => ({ lat: loc.lat, lng: loc.lng })));

    useEffect(() => {
        if (!map || locations.length < 2) {
            setSummary(null);
            return;
        }

        const points = locations.map((loc) => `${loc.lat},${loc.lng}`).join('|');
        const url = `https://api.geoapify.com/v1/routing?waypoints=${points}&mode=drive&apiKey=${API_KEY}`;

        let polyline: L.Polyline | null = null;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (data.features && data.features.length > 0) {
                    const feature = data.features[0];
                    const geometry = feature.geometry;
                    let allCoords: [number, number][] = [];

                    if (geometry.type === 'LineString') {
                        allCoords = geometry.coordinates.map((c: any) => [c[1], c[0]]);
                    } else if (geometry.type === 'MultiLineString') {
                        allCoords = geometry.coordinates.flat(1).map((c: any) => [c[1], c[0]]);
                    }

                    if (allCoords.length > 0) {
                        allCoords.unshift([locations[0].lat, locations[0].lng]);
                        const lastLoc = locations[locations.length - 1];
                        allCoords.push([lastLoc.lat, lastLoc.lng]);
                    }

                    if (polyline) map.removeLayer(polyline);

                    polyline = L.polyline(allCoords, {
                        color: '#22c55e',
                        weight: 2,
                        lineJoin: 'round',
                        lineCap: 'round',
                        opacity: 0.6,
                    }).addTo(map);

                    const properties = feature.properties;
                    setSummary({
                        distance: (properties.distance / 1000).toFixed(1),
                        time: Math.round(properties.time / 60),
                    });

                    map.fitBounds(polyline.getBounds(), { padding: [80, 80] });
                }
            })
            .catch((err) => console.error('Routing error:', err));

        return () => {
            if (polyline) map.removeLayer(polyline);
        };
    }, [map, routeKey]);

    return null;
};

// --- Auto-Resize Support ---
const MapResizer = () => {
    const map = useMap();
    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => map.invalidateSize());
        resizeObserver.observe(map.getContainer());
        map.invalidateSize();
        return () => resizeObserver.disconnect();
    }, [map]);
    return null;
};

export const PlanMap = ({ data }: { data: TripPlan }) => {
    const [summary, setSummary] = useState<{ distance: string; time: number } | null>(null);
    const defaultPosition: [number, number] = [7.8731, 80.7718];

    const combinedLocations = useMemo(() => {
        const places = (data.selected_places || []).map((p: any) => ({
            lat: p.place?.latitude,
            lng: p.place?.longitude,
            type: 'place',
            name: p.place?.place_name,
            order: p.selected_order_number,
        }));
        const services = (data.selected_services || []).map((s: any) => ({
            lat: s.nearby_service?.latitude,
            lng: s.nearby_service?.longitude,
            type: 'service',
            name: s.nearby_service?.service_name,
            order: s.selected_order_number,
        }));

        return [...places, ...services].filter((loc) => loc.lat && loc.lng).sort((a, b) => a.order - b.order);
    }, [data]);

    return (
        <div className="trip_map_wrapper">
            {summary && (
                <div className="map_floating_stats">
                    <div className="stat_box">
                        <span className="label">DISTANCE</span>
                        <span className="val">{data.total_distance} km</span>
                    </div>
                    <div className="v_divider"></div>
                    <div className="stat_box">
                        <span className="label">DRIVE TIME</span>
                        <span className="val">{FormatDuration(Number(data.estimated_duration_time))}</span>
                    </div>
                </div>
            )}

            <MapContainer center={defaultPosition} zoom={10} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                <MapResizer />
                <Routing locations={combinedLocations} setSummary={setSummary} />

                {combinedLocations.map((loc, idx) => (
                    <Marker key={`${loc.type}-${idx}`} position={[loc.lat, loc.lng]} icon={loc.type === 'place' ? icons.place : icons.service}>
                        <Tooltip
                            permanent
                            direction="top"
                            offset={[0, -10]}
                            className={`custom_map_tooltip ${loc.type === 'service' ? 'service_tip' : ''}`}
                        >
                            <div className="tip_content">
                                <span className="no">{loc.order}</span>
                                <span className="txt">{loc.name}</span>
                            </div>
                        </Tooltip>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default PlanMap;
