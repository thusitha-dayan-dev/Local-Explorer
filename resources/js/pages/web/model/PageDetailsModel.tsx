import { Place } from '@/types/web';
import { faComments } from '@fortawesome/free-regular-svg-icons';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';

interface PageProps {
    place: Place | null;
    onClose: () => void;
    isOpen: boolean;
    addPlace: (place: any) => void;
    removePlace: (id: any, time: any) => void;
    checkHasPlan: (id: any) => boolean;
}

export const PageDetailsModel = ({ place, onClose, isOpen, addPlace, removePlace, checkHasPlan }: PageProps) => {
    const otherImages = place?.media?.slice(0, 4).map((m: any) => m.media_path) || [];
    const allImages = [place?.main_image_path, ...otherImages].filter((img) => img !== undefined && img !== null);
    const [activeTab, setActiveTab] = useState('overview');

    if (!place || Object.keys(place).length === 0) {
        return null;
    }

    return (
        <div className={`model_overlayer ${isOpen ? 'open' : ''}`}>
            <div className="model_hedder">
                <FontAwesomeIcon icon={faReply} className="icon" onClick={onClose} />
                {checkHasPlan(place.id) ? (
                    <button className="btn add_btn remove" onClick={() => removePlace(place.id, place.estimated_duration)}>
                        <FontAwesomeIcon icon={faBookmarkSolid} className="icons" />
                        Remove <span className="sub">from Trip</span>
                    </button>
                ) : (
                    <button className="btn add_btn" onClick={() => addPlace(place)}>
                        <FontAwesomeIcon icon={faBookmarkRegular} className="icons" />
                        Add to Trip
                    </button>
                )}
            </div>
            <div className="model_content">
                <div className="details_split_container container_1440">
                    <div className="left_visual_column">
                        <div className="sticky_wrapper">
                            <div className="main_image_frame">
                                <img src={`/storage/${allImages[0]}`} alt={place.place_name} className="main_hero_img" />
                            </div>
                            <div className="other_images_grid">
                                {allImages.slice(1, 5).map((img, i) => (
                                    <div key={i} className="other_img_box">
                                        <img src={`/storage/${img}`} alt={`Other Image ${i}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="right_info_column">
                        <header className="info_header">
                            <div className="category_label">
                                {place.category?.category_name} • <span>{place.crowd_level} Crowd</span>
                            </div>
                            <h1>{place.place_name}</h1>
                            <p className="address">
                                <i className="fa-solid fa-location-dot"></i> {place.address}
                            </p>
                        </header>

                        <div className="rating_stats">
                            <div className="r_item">
                                <i className="fa-solid fa-star"></i> {Number(place.review_avg_rating).toFixed(1)}{' '}
                                <span>({place.review_count} Reviews)</span>
                            </div>
                            <div className="r_item">
                                <i className="fa-solid fa-route"></i> {place.base_distance} <span>Dist.</span>
                            </div>
                            <div className="r_item">
                                <i className="fa-solid fa-clock"></i> {place.estimated_duration}m <span>Time</span>
                            </div>
                        </div>

                        <div className="tabs_nav">
                            <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
                                Overview
                            </button>
                            <button className={activeTab === 'map' ? 'active' : ''} onClick={() => setActiveTab('map')}>
                                Location Map
                            </button>
                        </div>

                        <div className="tab_body_content">
                            {activeTab === 'overview' ? (
                                <div className="fade_in">
                                    <article className="description">
                                        <h3>About this Destination</h3>
                                        <p className="lead_txt">{place.short_description}</p>
                                        <div className="body_txt" dangerouslySetInnerHTML={{ __html: place.description }} />
                                    </article>
                                </div>
                            ) : (
                                <div className="map_frame fade_in">
                                    <iframe
                                        title={`Map of ${place.place_name}`}
                                        width="100%"
                                        height="400"
                                        style={{ border: 0, borderRadius: '20px' }}
                                        loading="lazy"
                                        allowFullScreen
                                        src={`https://maps.google.com/maps?q=${place.latitude},${place.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageDetailsModel;
