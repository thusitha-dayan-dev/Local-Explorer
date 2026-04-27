import { FormatDate } from '@/lib/utils';
import { CheckCircle, ChevronDown, ChevronUp, FileText, TicketsPlane } from 'lucide-react';
import React, { useState } from 'react';

interface PageProps {
    index: number;
    details: TravelPlan;
    setDetails: (key: any, any: any) => void;
    move: (id: number, details: 'up' | 'down') => void;
    setData: (key: any) => void;
    subIndex: number;
    removePlace: (id: number, time: any) => void;
    removeService: (id: number) => void;
    handelSavePlan: () => void;
    handelDraft: () => void;
    getPlaceTime: (id: number) => void;
}

interface SelectedService {
    selected_order_number: number;
    nearby_service_id: number;
    serviec_name: string;
}

interface SelectedPlace {
    place_id: number;
    selected_order_number: number;
    arrival_time: string;
    user_note: string;
    stay_duration: string;
    place_name: string;
}

const travelMode = [
    { key: 'bike', value: 'On Bike', icon: '🏍️' },
    { key: 'car', value: 'By Car', icon: '🚗' },
    { key: 'van', value: 'By Van', icon: '🚐' },
    { key: 'bus', value: 'By Bus', icon: '🚌' },
    { key: 'train', value: 'By Train', icon: '🚆' },
    { key: 'tuk', value: 'Three-Wheeler', icon: '🛺' },
    { key: 'walk', value: 'Hiking / Walking', icon: '🥾' },
];

interface TripLocation {
    lat: number;
    lng: number;
    tempType: 'place' | 'service';
    selected_order_number: number;
    [key: string]: any;
}

interface TravelPlan {
    id: number | null;
    title: string;
    travel_date: string;
    travel_mode: string;
    selected_places: SelectedPlace[];
    selected_services: SelectedService[];
}

export const AddedPlanDetails = ({
    index,
    details,
    setData,
    move,
    subIndex,
    removePlace,
    removeService,
    handelSavePlan,
    handelDraft,
    getPlaceTime,
}: PageProps) => {
    const returnTravelMode = (mod: string) => {
        const selected = travelMode.find((m) => m.key === mod);
        if (!selected) return 'Not Selected';
        return `${selected.icon}  ${selected.value}`;
    };
    const [isOpenPlace, setIsOpenPlace] = useState(false);
    const [isOpenService, setIsOpenService] = useState(false);
    const [openRow, setOpenRow] = useState<number[]>([]);

    const optimizeMyTrip = () => {
        const allItems: TripLocation[] = [...(details.selected_places || []).map((p: any) => ({ ...p, tempType: 'place' }))];
        if (allItems.length < 2) return;
        let unvisited = [...allItems];
        let optimized: TripLocation[] = [];
        let current = unvisited.shift()!;
        optimized.push(current);
        while (unvisited.length > 0) {
            let closestIndex = 0;
            let minDistance = Infinity;
            for (let i = 0; i < unvisited.length; i++) {
                const d = Math.sqrt(Math.pow(current.lat - unvisited[i].lat, 2) + Math.pow(current.lng - unvisited[i].lng, 2));

                if (d < minDistance) {
                    minDistance = d;
                    closestIndex = i;
                }
            }
            current = unvisited.splice(closestIndex, 1)[0];
            optimized.push(current);
        }
        const finalPlaces = optimized
            .filter((item) => item.tempType === 'place')
            .map((item) => {
                const newOrder = optimized.indexOf(item) + 1;
                return { ...item, selected_order_number: newOrder };
            });

        setData({
            ...details,
            selected_places: finalPlaces,
        });
    };

    const removeOpen = (id: number) => {
        const filterRow = openRow.filter((row) => row != id);
        setOpenRow(filterRow);
    };

    const handleNoteChange = (placeId: number, newNote: string) => {
        const updatedPlaces = details.selected_places.map((place) => (place.place_id === placeId ? { ...place, user_note: newNote } : place));

        setData({
            ...details,
            selected_places: updatedPlaces,
        });
    };

    return (
        <div className={`details_form_layout ${index === 3 ? 'show' : subIndex === 1 ? 'subShow' : ''}`}>
            <div className="scrow_heigth">
                <header className="trip_paln_header">
                    <div className="header_row">
                        <TicketsPlane className="icon" size={20} />
                        <div className="hedear_colom">
                            <span className="main_text">My Trip Plan</span>
                            <span className="title">{details.title}</span>
                        </div>
                        <div className="button_group">
                            <button onClick={optimizeMyTrip} className="btn-optimize">
                                ✨ Smart Sort
                            </button>
                        </div>
                    </div>
                    <div className="second_row">
                        <div className="helight_row">
                            <span className="date">start: {FormatDate(details.travel_date)}</span>
                            <span className="mod">{returnTravelMode(details.travel_mode)}</span>
                        </div>
                        <div className="helight_row">
                            <span className="select_count">{details.selected_places.length} Place Selected</span>
                            <span className="select_count">{details.selected_services.length} Service selected</span>
                        </div>
                    </div>
                </header>
                <div className="selection_contener">
                    <div className="selection_header">
                        <div className="title_row">
                            <span className="main_text">Place To Visit</span>
                            <span className="sub_title">{details.selected_places.length} place selected</span>
                        </div>
                        <ChevronDown
                            className={`icon ${isOpenPlace ? 'active' : ''}`}
                            size={27}
                            onClick={() => (isOpenPlace ? setIsOpenPlace(false) : setIsOpenPlace(true))}
                        />
                    </div>
                    <div className={`card_contener ${isOpenPlace ? 'open' : ''}`}>
                        <div className="cards_wrapper">
                            {details.selected_places.map((place, index) => (
                                <div className="selected_card_layout" key={index}>
                                    <div className="selected_card">
                                        <div className="coutnter">{place.selected_order_number}</div>
                                        <div className="place_details">
                                            <span className="selected_name">{place.place_name}</span>
                                            <div className="details_row">
                                                {openRow.includes(place.place_id) ? (
                                                    <button
                                                        className="detail_add_btn"
                                                        style={{ color: '#f04444' }}
                                                        onClick={() => removeOpen(place.place_id)}
                                                    >
                                                        close
                                                    </button>
                                                ) : (
                                                    <button className="detail_add_btn" onClick={() => setOpenRow([...openRow, place.place_id])}>
                                                        Add note
                                                    </button>
                                                )}
                                                <button className="remove" onClick={() => removePlace(place.place_id, getPlaceTime(place.place_id))}>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                        <div className="togal_bar">
                                            <ChevronUp
                                                className={`icon ${index === 0 ? 'disabled' : ''}`}
                                                onClick={() => move(place.place_id, 'up')}
                                            />
                                            <ChevronDown
                                                className={`icon ${index === details.selected_places.length - 1 ? 'disabled' : ''}`}
                                                onClick={() => move(place.place_id, 'down')}
                                            />
                                        </div>
                                    </div>
                                    <div className={`card_data ${openRow.includes(place.place_id) ? 'open' : ''}`}>
                                        <div className="cards_wrapper">
                                            <div className="input_group">
                                                <label htmlFor="note" className="lb">
                                                    Special Note
                                                </label>
                                                <input
                                                    type="text"
                                                    name="note"
                                                    id="note"
                                                    placeholder='Ex: We should visit here before 10 AM"'
                                                    value={place.user_note || ''}
                                                    onChange={(e) => handleNoteChange(place.place_id, e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="selection_contener">
                    <div className="selection_header">
                        <div className="title_row">
                            <span className="main_text">Service For You</span>
                            <span className="sub_title">{details.selected_services.length} service selected</span>
                        </div>
                        <ChevronDown
                            className={`icon ${isOpenService ? 'active' : ''}`}
                            size={27}
                            onClick={() => (isOpenService ? setIsOpenService(false) : setIsOpenService(true))}
                        />
                    </div>
                    <div className={`card_contener ${isOpenService ? 'open' : ''}`}>
                        <div className="cards_wrapper">
                            {details.selected_services.map((service, index) => (
                                <div className="selected_card_layout" key={index}>
                                    <div className="selected_card">
                                        <div className="coutnter">{service.selected_order_number}</div>
                                        <div className="place_details">
                                            <span className="selected_name">{service.serviec_name}</span>
                                            <div className="details_row">
                                                <button className="detail_add_btn">Add note</button>
                                                <button className="remove" onClick={() => removeService(service.nearby_service_id)}>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                        <div className="togal_bar">
                                            <ChevronUp className={`icon ${index === 0 ? 'disabled' : ''}`} />
                                            <ChevronDown className={`icon ${index === details.selected_places.length - 1 ? 'disabled' : ''}`} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="place_submit">
                    <button className="btn_draft" onClick={handelDraft}>
                        <FileText size={18} />
                        Save Draft
                    </button>
                    <button className="btn_save" onClick={handelSavePlan}>
                        <CheckCircle size={18} />
                        Save Plan
                    </button>
                </div>
            </div>
        </div>
    );
};
