import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const createCustomIcon = (color: string) => {
    return new L.DivIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color};" class="marker-pin"></div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
    });
};

const icons = {
    place: createCustomIcon('#ef4444'),
    service: createCustomIcon('#3b82f6'),
};

const Routing = ({ locations, setSummary, mod }: { locations: any[]; setSummary: any; mod: any }) => {
    const map = useMap();
    const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

    const routeKey = JSON.stringify(locations.map((loc) => ({ lat: loc.lat, lng: loc.lng })));
    const mode = mod === 'bike' ? 'bicycle' : 'drive';

    useEffect(() => {
        if (!map || locations.length < 2) {
            setSummary(null);
            return;
        }

        const points = locations.map((loc) => `${loc.lat},${loc.lng}`).join('|');
        const url = `https://api.geoapify.com/v1/routing?waypoints=${points}&mode=${mode}&apiKey=${API_KEY}`;

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
                        color: '#6366f1',
                        weight: 4,
                        lineJoin: 'round',
                        lineCap: 'round',
                        opacity: 0.8,
                    }).addTo(map);

                    const properties = feature.properties;
                    setSummary({
                        distance: (properties.distance / 1000).toFixed(1),
                        time: Math.round(properties.time / 60),
                    });

                    if (allCoords.length > 0) {
                        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
                    }
                }
            })
            .catch((err) => console.error('Routing error:', err));

        return () => {
            if (polyline) map.removeLayer(polyline);
        };
    }, [map, routeKey]);

    return null;
};

const MapResizer = ({ activeIndex }: { activeIndex: number }) => {
    const map = useMap();

    useEffect(() => {
        map.invalidateSize();

        const timers = [setTimeout(() => map.invalidateSize(), 200), setTimeout(() => map.invalidateSize(), 600)];

        return () => timers.forEach((t) => clearTimeout(t));
    }, [activeIndex, map]);

    return null;
};

export const MapView = ({ activeIndex, data, subIndex, setData }: { activeIndex: number; data: any; subIndex: number; setData: ({}) => void }) => {
    const [summary, setSummary] = useState<{ distance: string; time: number } | null>(null);

    useEffect(() => {
        const newDistance = summary?.distance || 0;
        const newTime = summary?.time || 0;

        if (data.totalDistance !== newDistance || data.totalTime !== newTime) {
            setData((prev: any) => ({
                ...prev,
                totalTime: newTime,
                totalDistance: newDistance,
            }));
        }
    }, [summary]);

    const defaultPosition: [number, number] = [7.8731, 80.7718];

    const combinedLocations = useMemo(() => {
        const places = (data.selected_places || []).map((p: any) => ({
            ...p,
            type: 'place',
            name: p.place_name,
            order: p.selected_order_number,
        }));
        const services = (data.selected_services || []).map((s: any) => ({
            ...s,
            type: 'service',
            name: s.serviec_name,
            order: s.selected_order_number,
        }));

        return [...places, ...services].filter((loc) => loc.lat && loc.lng).sort((a, b) => a.order - b.order);
    }, [data]);

    return (
        <div className={`trip-map-container ${activeIndex === 2 ? 'active' : subIndex === 2 ? 'active' : ''}`}>
            {summary && (
                <div className="trip-info-card">
                    <div className="info-block">
                        <span className="label">Total Trip</span>
                        <span className="value">{summary.distance} km</span>
                    </div>
                    <div className="divider"></div>
                    <div className="info-block">
                        <span className="label">Drive Time</span>
                        <span className="value">{summary.time} mins</span>
                    </div>
                </div>
            )}

            <MapContainer center={defaultPosition} zoom={9} style={{ height: '100%', width: '100%', display: 'block' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap" />

                <MapResizer activeIndex={activeIndex} />
                <Routing locations={combinedLocations} setSummary={setSummary} mod={data.travel_mode} />

                {combinedLocations.map((loc, idx) => (
                    <Marker
                        key={`${loc.type}-${idx}`}
                        position={[loc.lat, loc.lng]}
                        icon={loc.type === 'place' ? icons.place : icons.service}
                        zIndexOffset={1000 - loc.order}
                    >
                        <Tooltip permanent direction="top" offset={[0, -32]} className={`trip-tooltip ${loc.type}-tip`}>
                            <div className="tooltip-wrap">
                                <span className="order-no">{loc.order}</span>
                                <span className="place-name">{loc.name}</span>
                            </div>
                        </Tooltip>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;
