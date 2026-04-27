import { calculateTotalRating } from '@/lib/utils';
import { Place } from '@/types/web';
import { faComment, faClock, faStarHalfAlt } from '@fortawesome/free-regular-svg-icons';
import { faAngleRight, faStar, faLocationDot, faUsers, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, router, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import { route } from 'ziggy-js';
import AddTripModal from '../../model/AddTripModal';
import SuccessToast from '../../notification/SuccessToast';
import PlaceSkeleton from '../../loding/PlaceSkeleton';
import axios from 'axios';

interface PageProps {
    wishlistIds: any[];
}

const MostPopularPlace = ({  wishlistIds }: PageProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const gap = 20;
    const [loading, setLoading] = useState(true);
    const [places, setPlaces] = useState<Place[]>([]);

    const fetchPlace = async () => {
        setLoading(true);
        try{
            const response = await axios.get(route('api.get.popular.places'));
            setPlaces(response.data);
        } catch (error) {
            console.error('Error fetching places:', error);
        } finally{
            setLoading(false);
        }
    }

    useEffect(()=> {
        fetchPlace();
    }, [])

    useEffect(() => {
        if (places.length > 0) {
          setLoading(false);
        }
    }, [places])

    const [addTripModel, setAddTripModel] = useState({
        place: [],
        isOpen: false,
    });

    const { userInfore } = usePage<any>().props;

    const handelModelClose = () => {
        setAddTripModel({ ...AddTripModal, isOpen: false, place: [] });
    };

    const handelModelOpen = (places: any) => {
        if (!userInfore.id) {
            router.visit(route('login'), {
                data: { message: 'Please sign in to plan your trip.' }
            });
        } else {
            setAddTripModel({ ...AddTripModal, isOpen: true, place: places });
        }
    };

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const visibleCards = windowWidth >= 1400 ? 4 : windowWidth >= 1200 ? 4 : windowWidth >= 992 ? 3 : windowWidth >= 576 ? 2 : 1;
    const dotsCount = Math.ceil(places.length / visibleCards);

    const handleScroll = () => {
        if (scrollRef.current) {
            const firstCard = scrollRef.current.querySelector('.place_card') as HTMLElement;
            if (firstCard) {
                const cardTotalWidth = firstCard.offsetWidth + gap;
                const scrollStep = cardTotalWidth * visibleCards;
                const index = Math.round(scrollRef.current.scrollLeft / scrollStep);
                setActiveIndex(index);
            }
        }
    };

    const scrollToIndex = (index: number) => {
        if (scrollRef.current) {
            const firstCard = scrollRef.current.querySelector('.place_card') as HTMLElement;
            if (firstCard) {
                const container = scrollRef.current;
                const cardTotalWidth = firstCard.offsetWidth + gap;
                const isLastDot = index === dotsCount - 1;
                let scrollDistance = cardTotalWidth * visibleCards * index;

                if (isLastDot) {
                    scrollDistance = container.scrollWidth - container.clientWidth;
                }

                container.scrollTo({
                    left: scrollDistance,
                    behavior: 'smooth',
                });
                setActiveIndex(index);
            }
        }
    };

    const renderStars = (rating: any) => {
        const stars = [];
        const num = parseFloat(rating || 0);
        for (let i = 1; i <= 5; i++) {
            stars.push(<FontAwesomeIcon key={i} icon={faStar} className={i <= Math.round(num) ? 'star_active ' : 'star_inactive'} />);
        }
        return stars;
    };

    const checkWishlistIds = (id: number): boolean => {
        return wishlistIds.includes(id);
    };

    return (
        <section className="popular_places_section">
            <div className="section_header">
                <div className="title_area">
                    <h2 className="main_title">Most Popular Destinations</h2>
                    <p className="sub_title">Handpicked gems in the heart of Dambulla</p>
                </div>
            </div>
            {loading ? (

                <div className="skeleton-grid_most">
                    {[...Array(visibleCards)].map((_, i) => (
                        <PlaceSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="scroll_container" ref={scrollRef} onScroll={handleScroll}>
                        <div className="cards_wrapper">
                            {places.map((plc) => (
                                <div className="place_card" key={plc.id}>
                                    <div className="image_wrapper">
                                        <img src={`/storage/${plc.main_image_path}`} alt={plc.place_name} loading="lazy" />
                                        <div className="badge_container">
                                            <span className={`crowd_badge ${plc.crowd_level.toLowerCase()}`}>
                                                <FontAwesomeIcon icon={faUsers} /> {plc.crowd_level} Crowd
                                            </span>
                                        </div>
                                        <Link
                                            href={route('wishlist.toggle')}
                                            method="post"
                                            data={{ place_id: plc.id }}
                                            as="button"
                                            preserveScroll
                                            className="wishlist-btn"
                                        >
                                            <Heart size={20} className={`heart-icon ${checkWishlistIds(plc.id) ? 'active' : 'inactive'}`} />
                                        </Link>
                                    </div>

                                    <div className="card_body">
                                        <div className="rating_row">
                                            <div className="stars">{renderStars(plc.review_avg_rating || 0)}</div>
                                            <span className="review_count">
                                                {plc.review_avg_rating ? parseFloat(plc.review_avg_rating).toFixed(1) : '0.0'}
                                            </span>
                                        </div>

                                        <h3 className="place_name">{plc.place_name}</h3>

                                        <div className="info_item">
                                            <FontAwesomeIcon icon={faLocationDot} className="icon" />
                                            <span className="text">{plc.address}</span>
                                        </div>

                                        <div className="info_item">
                                            <FontAwesomeIcon icon={faClock} className="icon" />
                                            <span className="text">{plc.estimated_duration} mins visit</span>
                                        </div>

                                        <p className="description">{plc.short_description}</p>

                                        <div className="button_group">
                                            <Link href={`/place/${plc.slug}`} className="btn_secondary">
                                                Details
                                            </Link>
                                            <button className="btn_primary" onClick={() => handelModelOpen(plc)}>
                                                Add to Trip
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {dotsCount > 1 && (
                        <div className="pagination_dots">
                            {[...Array(dotsCount)].map((_, i) => (
                                <button
                                    key={i}
                                    className={`dot_btn ${activeIndex === i ? 'active' : ''}`}
                                    onClick={() => scrollToIndex(i)}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
            <AddTripModal isOpen={addTripModel.isOpen} onClose={handelModelClose} place={addTripModel.place} />
        </section>
    );
};

export default MostPopularPlace;
