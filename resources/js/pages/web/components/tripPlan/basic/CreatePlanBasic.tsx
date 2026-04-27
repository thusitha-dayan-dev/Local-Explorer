import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import backGround from '../../../../../../assect/hero_image.jpg';

interface CreatePlanBasicProps {
    data: {
        title: string;
        travel_date: string;
        travel_mode: string;
    };
    setData: (key: any, value: any) => void;
    errors: any;
    onDraft: (type: string) => void;
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

export const CreatePlanBasic: React.FC<CreatePlanBasicProps> = ({ data, setData, errors, onDraft }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(()=>{
        const handelClickoutside = (event: MouseEvent) => {

            const element = document.getElementById('item_element');

            if (element && !element.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handelClickoutside);

        return () => {
            document.removeEventListener('mousedown', handelClickoutside);
        }
    }, []);


    return (
        <div className="split-screen-container">
            <Head title="Create Trip Plan - Basic Info" />
            <div className="hero-side" style={{ backgroundImage: `url(${backGround})` }}>
                <div className="overlay">
                    <div className="welcome-content">
                        <span className="badge">Plan Your Adventure</span>
                        <h1>
                            Explore the Heart of <br />
                            <span>Dambulla</span>
                        </h1>
                        <p className="desktop-only">
                            Experience the magic of the cultural triangle. Start your journey by creating a personalized itinerary tailored to your
                            interests and pace.
                        </p>

                        <div className="step-indicator desktop-only">
                            <div className="step active">
                                <span>1</span>
                                <div className="step-text">
                                    <h6>Step 01</h6>
                                    <p>Basic Info</p>
                                </div>
                            </div>
                            <div className="line"></div>
                            <div className="step">
                                <span>2</span>
                                <div className="step-text">
                                    <h6>Step 02</h6>
                                    <p>Select Places</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-side">
                <div className="form-wrapper">
                    <nav className="breadcrumb-nav">
                        <Link href={route('trip.plan')} className="root">
                            Trip Plan
                        </Link>
                        <span className="separator">/</span>
                        <span className="current">Create New</span>
                    </nav>
                    <div className="mobile-progress-bar">
                        <div className="m-step active">01. Basic Info</div>
                        <div className="m-step">02. Select Places</div>
                    </div>

                    <div className="form-header">
                        <h2>Trip Details</h2>
                        <p>Fill in the basic information to start your journey.</p>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="basic-form">
                        <div className="input-group">
                            <label>Trip Title</label>
                            <input
                                type="text"
                                placeholder="e.g. My Dambulla Expedition"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            {errors.title && <span className="error">{errors.title}</span>}
                        </div>

                        <div className="input-group">
                            <label>Travel Mode</label>
                            <div className="holder">
                                <input
                                    type="text"
                                    placeholder="Select"
                                    readOnly
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        isOpen ? setIsOpen(false) : setIsOpen(true);
                                    }}
                                    value={(() => {
                                        const selected = travelMode.find((mod) => mod.key === data.travel_mode);
                                        return selected ? `${selected.icon} ${selected.value}` : '';
                                    })()}
                                />
                                <FontAwesomeIcon icon={faAngleDown} className="icon" />
                                {isOpen && (
                                    <ul className="selector" id='item_element'>
                                        {travelMode.map((tm, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    setData('travel_mode', tm.key);
                                                    setIsOpen(false);
                                                }}
                                            >
                                                {tm.value} {tm.icon}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {errors.travel_mode && <span className="error">{errors.travel_mode}</span>}
                        </div>

                        <div className="input-group">
                            <label>Travel Date</label>
                            <input type="date" value={data.travel_date} onChange={(e) => setData('travel_date', e.target.value)} />
                            {errors.travel_date && <span className="error">{errors.travel_date}</span>}
                        </div>

                        <div className="button-group">
                            <Link className="btn-skip-save" href={route('trip.plan')}>
                                Back to page
                            </Link>
                            <button
                                type="button"
                                className="btn-save-continue"
                                onClick={() => {
                                    onDraft('save');
                                }}
                            >
                                Save & Continue
                            </button>
                        </div>
                    </form>

                    <p className="footer-note">Your progress is being saved as a draft automatically.</p>
                </div>
            </div>
        </div>
    );
};
