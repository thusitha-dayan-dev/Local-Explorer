import { Place } from '@/types/web';
import { faComments } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import AddTripModal from '../../model/AddTripModal';
import SuccessToast from '../../notification/SuccessToast';
import { route } from 'ziggy-js';

const PlaceDetailsShow = ({ place }: { place: Place }) => {
    const otherImages = place.media?.slice(0, 4).map((m: any) => m.media_path) || [];
    const allImages = [place.main_image_path, ...otherImages];

    const [addTripModel, setAddTripModel] = useState({
        place: [],
        isOpen: false,
    });

    const {userInfore} = usePage<any>().props;

    const [showToast, setShowToast] = useState(false);


    const handelModelClose = () => {
        setAddTripModel({ ...AddTripModal, isOpen: false, place: [] });
    };

    const handelModelOpen = (places: any) => {
        if (!userInfore.id) {
            router.visit(route('login'));
        } else{

            setAddTripModel({ ...AddTripModal, isOpen: true, place: places });
        }
    };

    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="modern_p_details_root">
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
                            <Link className="review" href={'#review'}>
                                <FontAwesomeIcon icon={faComments} className="icon" />
                                Share Your Feedback
                            </Link>
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
                        <Link className="nav" href={'#review'}>
                            Reviews
                        </Link>
                    </div>

                    <div className="tab_body_content">
                        {activeTab === 'overview' ? (
                            <div className="fade_in">
                                <article className="description">
                                    <h3>About this Destination</h3>
                                    <p className="lead_txt">{place.short_description}</p>
                                    <div className="body_txt" dangerouslySetInnerHTML={{ __html: place.description }} />
                                </article>
                                <div className="tags_cloud">
                                    {place.search_tags?.split(',').map((tag: string, i: number) => (
                                        <span key={i} className="tag">
                                            #{tag.trim()}
                                        </span>
                                    ))}
                                </div>
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

                    <aside className="booking_sidebar">
                        <div className="booking_glass_card">
                            <div className="price_header">
                                <h3>
                                    {place.local_ticket_price ? (
                                        <>
                                    Rs. {place.local_ticket_price}
                                        </>
                                    ): (
                                        <span style={{ color:'#1a8820', fontSize:'1.15rem' }}>Free of charge</span>
                                    )}
                                    <span>/ local</span>
                                </h3>
                            </div>
                            <div className="data_table">
                                <div className="d_row">
                                    <span>Foreigner</span>
                                    {place.foreign_ticket_price ? (

                                        <strong>Rs. {place.foreign_ticket_price}</strong>
                                    ): (
                                        <strong>Free of charge</strong>
                                    )}
                                </div>
                                <div className="d_row">
                                    <span>Hours</span>
                                    {place.opening_time === place.closing_time ? (
                                        <strong>Open 24 hours</strong>
                                    ): (

                                    <strong>
                                        {place.opening_time} - {place.closing_time}
                                    </strong>
                                    )}
                                </div>
                                <div className="d_row">
                                    <span>Best Visit</span>
                                    <strong>{place.best_visit_time || 'Anytime'}</strong>
                                </div>
                                {place.website_url && (
                                    <div className="d_row">
                                        <span>View on web site</span>
                                        <a href={place.website_url} target="_blank" rel="noopener noreferrer">
                                            <strong>See details</strong>
                                        </a>
                                    </div>
                                )}
                            </div>
                            <button className="add_to_planner_btn" onClick={() => handelModelOpen(place)}>
                                Add to Trip Planner
                            </button>
                            <p className="contact_small">Support: {place.contact_number}</p>
                        </div>
                    </aside>
                </div>
            </div>
            <AddTripModal isOpen={addTripModel.isOpen} onClose={handelModelClose} place={addTripModel.place}  />
            <SuccessToast show={showToast} message="Added to your trip plan!" onClose={() => setShowToast(false)} />
        </div>
    );
};

export default PlaceDetailsShow;
