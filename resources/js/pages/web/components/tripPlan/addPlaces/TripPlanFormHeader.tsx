import { TripPlan } from '@/types/web';
import { faAngleLeft, faAngleRight, faFilePdf, faLocationPinLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';

interface PageProps {
    planDetails: TripPlan;
    index: number;
    event: () => void;
}

export const TripPlanFormHeader = ({ planDetails, index, event }: PageProps) => {
    return (
        <header className={`main_header ${index != 1 ? 'hide' : ''}`}>
            <div className="main_layout">
                <div className="nav_hedder">
                    <span className="main_text">
                        <FontAwesomeIcon icon={faLocationPinLock} className="icon" />
                        Customize Your Itinerary
                    </span>
                    <div className="sub_link">
                        <Link href={route('trip.plan')} className="link">
                            My Plans
                        </Link>
                        /
                        <Link href={route('trip.plan.create', planDetails.id)} className="link">
                            New Trip
                        </Link>
                        /<span className="link sub">Adding Spots</span>
                    </div>
                </div>
                <div className="button_group">
                    <button className="btn-optimize" onClick={event}>
                        ✨ Smart Sort
                    </button>
                </div>
            </div>
        </header>
    );
};

export default TripPlanFormHeader;
