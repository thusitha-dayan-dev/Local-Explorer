import { TripPlan } from '@/types/web';
import {
    Banknote,
    Bold,
    Calendar,
    Car,
    ChevronLeft,
    Clock,
    LayoutDashboard,
    List,
    MapPin,
    MousePointer2Off,
    NotebookPen,
    Users,
    Wallet,
} from 'lucide-react';
import React, { useState } from 'react';
import PlanMap from './PlanMap';
import { FormatDate } from '@/lib/utils';

interface PageProps {
    tripPlan: TripPlan;
}

export const ViewPlan = ({ tripPlan }: PageProps) => {
    const [isPlaceListOpen, setIsPlaceListOpen] = useState(false);
    const [isServiceListOpen, setIsServiceListOpen] = useState(false);

    const getCrowdDetails = (level: string) => {
        const status = level?.toLowerCase();

        switch (status) {
            case 'low':
                return { label: 'Low', class: 'crowd-low' };
            case 'medium':
            case 'mid':
                return { label: 'Moderate', class: 'crowd-moderate' };
            case 'high':
                return { label: 'High', class: 'crowd-peak' };
            default:
                return { label: 'Not Specified', class: 'crowd-unknown' };
        }
    };

    const getBusinessHours = (open: string, close: string) => {
        if ((open === '00:00:00' || open === '00:00') && (close === '00:00:00' || close === '00:00')) {
            return 'Open 24 Hours';
        }
        const formatTime = (timeStr: string) => {
            if (!timeStr) return '';
            const [hours, minutes] = timeStr.split(':');
            const h = parseInt(hours);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const formattedHours = h % 12 || 12;
            return `${formattedHours}:${minutes} ${ampm}`;
        };

        return `Open ${formatTime(open)} to ${formatTime(close)}`;
    };

    const getPriceDetails = (range: string) => {
        const status = range?.toLowerCase();
        if (range === 'none') return { label: '24/7 Cash Access', signs: 'Rs.', class: 'price-low' };
        switch (status) {
            case 'low':
                return { label: 'Budget Friendly', signs: 'Rs.', class: 'price-low' };
            case 'medium':
            case 'mid':
                return { label: 'Mid-Range', signs: 'Rs. Rs.', class: 'price-mid' };
            case 'high':
                return { label: 'Premium', signs: 'Rs. Rs. Rs.', class: 'price-high' };
            default:
                return { label: 'Price Not Set', signs: '', class: 'price-unknown' };
        }
    };

    const formatDuration = (totalMinutes: number) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours > 0) {
            return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
        }
        return `${minutes}m`;
    };

    return (
        <div className="my_trip_layout">
            <div className="left_contener">
                <div className="left_contener_main">
                    <div className="card_header">
                        <div className="header_title">
                            <MapPin size={16} className="icon" />
                            <h3>Route Overview</h3>
                        </div>
                        <div className="header_actions">
                            <span className="badge">Dambulla Area</span>
                        </div>
                    </div>
                    <PlanMap data={tripPlan} />
                </div>
            </div>
            <div className="right_contener">
                <div className="place_details_layout">
                    <div className="card_header">
                        <div className="header_title">
                            <List size={16} className="icon" />
                            <h3>Planned Itinerary</h3>
                        </div>
                        <div className="header_actions">
                            <span className="count_badge">{tripPlan.selected_places?.length} Destinations</span>
                            <span className="count_badge sub">{tripPlan.selected_services?.length} services</span>
                        </div>
                    </div>
                    <div className="main_content_layout">
                        <div className="card_main_layout">
                            <div className="selected_card">
                                <div className="main_text_layout">
                                    <span className="main_text">Place To Visit</span>
                                    <span className="sub_text">{`${tripPlan.selected_places?.length} `}place selected</span>
                                </div>
                                <button onClick={() => (isPlaceListOpen ? setIsPlaceListOpen(false) : setIsPlaceListOpen(true))}>
                                    <ChevronLeft className={`togal_btn ${isPlaceListOpen ? 'active' : ''}`} />
                                </button>
                            </div>
                            <div className={`card_contener ${isPlaceListOpen ? 'open' : ''}`}>
                                <div className="cards_wrapper">
                                    <div className="place_card_layout">
                                        {tripPlan.selected_places?.map((places) => (
                                            <div className="card_layout" key={places.place_id}>
                                                <div className="card_heddre">
                                                    <span className="place_name">
                                                        {places.selected_order_number}.{places.place.place_name}
                                                    </span>
                                                </div>
                                                <div className="card_mid">
                                                    <span className="dis">
                                                        <b>About: </b>
                                                        {places.place.short_description}
                                                    </span>
                                                </div>
                                                <div className="card_footer">
                                                    <div className={`crowd_indicator ${getCrowdDetails(places.place.crowd_level).class}`}>
                                                        <div className="icon_wrapper">
                                                            <Users size={14} />
                                                        </div>
                                                        <span className="crowd_label">{getCrowdDetails(places.place.crowd_level).label} Crowd</span>
                                                    </div>
                                                    <div className="time_info">
                                                        <Clock size={14} />
                                                        <span>{getBusinessHours(places.place.opening_time, places.place.closing_time)}</span>
                                                    </div>
                                                </div>
                                                {places.user_note && (
                                                    <div className="user_note_box">
                                                        <div className="note_header">
                                                            <NotebookPen size={14} className="note_icon" />
                                                            <span>Personal Note</span>
                                                        </div>
                                                        <p className="note_content">{places.user_note}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card_main_layout">
                            <div className="selected_card">
                                <div className="main_text_layout">
                                    <span className="main_text">Service For You</span>
                                    <span className="sub_text">{`${tripPlan.selected_services?.length} `}service selected</span>
                                </div>
                                <button onClick={() => (isServiceListOpen ? setIsServiceListOpen(false) : setIsServiceListOpen(true))}>
                                    <ChevronLeft className="togal_btn" />
                                </button>
                            </div>
                            <div className={`card_contener ${isServiceListOpen ? 'open' : ''}`}>
                                <div className="cards_wrapper">
                                    <div className="place_card_layout">
                                        {tripPlan.selected_services?.map((service) => (
                                            <div className="card_layout" key={service.id}>
                                                <div className="card_heddre">
                                                    <span className="place_name">
                                                        {service.selected_order_number}.{service.nearby_service.service_name}
                                                    </span>
                                                </div>
                                                <div className="card_mid">
                                                    <span className="dis">
                                                        <b>About: </b>
                                                        {service.nearby_service.short_description}
                                                    </span>
                                                </div>
                                                <div className="card_footer">
                                                    <div className="time_info">
                                                        <Clock size={14} />
                                                        <span>
                                                            {getBusinessHours(service.nearby_service.opening_time, service.nearby_service.close_time)}
                                                        </span>
                                                    </div>
                                                    <div className={`price_indicator ${getPriceDetails(service.nearby_service.price_range).class}`}>
                                                        <div className="icon_wrapper">
                                                            <Banknote size={14} />
                                                        </div>
                                                        <div className="price_info">
                                                            <span className="price_label">
                                                                {getPriceDetails(service.nearby_service.price_range).label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="trip_summary_card">
                    <div className="card_main_header">
                        <div className="title_area">
                            <h2 className="trip_title">{tripPlan.title}</h2>
                            <div className="start_loc">
                                <MapPin size={12} />
                                <span>Starting from {tripPlan.selected_places?.at(0)?.place.place_name}</span>
                            </div>
                        </div>
                        <span className={`status_badge ${tripPlan.status?.toLowerCase()}`}>{tripPlan.status}</span>
                    </div>

                    <div className="card_divider"></div>

                    <div className="stats_grid">
                        <div className="stat_item">
                            <span className="item_label">DATE</span>
                            <div className="val_box">
                                <Calendar size={14} className="icon" />
                                <span className="val">{FormatDate(tripPlan.travel_date)}</span>
                            </div>
                        </div>

                        <div className="stat_item">
                            <span className="item_label">TRAVEL MODE</span>
                            <div className="val_box">
                                <Car size={14} className="icon" />
                                <span className="val text-capitalize">{tripPlan.travel_mode}</span>
                            </div>
                        </div>

                        <div className="stat_item">
                            <span className="item_label">DISTANCE</span>
                            <div className="val_box">
                                <MousePointer2Off size={14} className="icon" />
                                <span className="val">{(tripPlan.total_distance ?? 0).toFixed(1)} km</span>
                            </div>
                        </div>

                        <div className="stat_item">
                            <span className="item_label">EST. DURATION</span>
                            <div className="val_box">
                                <Clock size={14} className="icon" />
                                <span className="val">{formatDuration(Number(tripPlan.estimated_duration_time))}</span>
                            </div>
                        </div>
                    </div>

                    <div className="budget_section">
                        <div className="budget_info">
                            <span className="budget_label">ESTIMATED BUDGET</span>
                            <h2 className="price">Rs. {new Intl.NumberFormat().format(tripPlan.estimated_budget)}</h2>
                        </div>
                        <div className="icon_circle">
                            <Wallet size={22} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewPlan;
