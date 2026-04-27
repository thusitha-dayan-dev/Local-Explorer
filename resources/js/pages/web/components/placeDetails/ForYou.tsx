import { calculateTotalRating } from '@/lib/utils';
import { Place } from '@/types/web';
import { faComment, faStar, faClock, faStarHalfAlt } from '@fortawesome/free-regular-svg-icons';
import { faAngleRight, faLocationDot, faUsers, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react';

interface PageProps {
    places: Place[];
}

const ForYou = ({ places }: PageProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const gap = 20;

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
        const numericRating = parseFloat(rating || 0);

        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(numericRating)) {
                stars.push(<FontAwesomeIcon key={i} icon={faStar} className="star_filled" />);
            } else if (i === Math.ceil(numericRating) && numericRating % 1 >= 0.5) {
                stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="star_half" />);
            } else {
                stars.push(<FontAwesomeIcon key={i} icon={faStar} className="star_empty" />);
            }
        }
        return stars;
    };

    return (
        <section className="popular_places_section" style={{ marginTop: '0px' }}>
            <div className="section_header">
                <div className="title_area">
                    <h2 className="main_title">Tailored Just For You</h2>
                    <p className="sub_title">Must-visit spots in Dambulla, picked by our experts.</p>
                </div>
            </div>

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

                                <div className="price_grid">
                                    <div className="price_item">
                                        <span className="label">Local</span>
                                        <span className="value">{plc.local_ticket_price ? `Rs.${plc.local_ticket_price}` : 'Free'}</span>
                                    </div>
                                    <div className="price_item">
                                        <span className="label">Foreign</span>
                                        <span className="value">{plc.foreign_ticket_price ? `Rs.${plc.foreign_ticket_price}` : 'Free'}</span>
                                    </div>
                                </div>

                                <div className="button_group">
                                    <Link href={`/place/${plc.slug}`} className="btn_secondary">
                                        Details
                                    </Link>
                                    <Link href={`/create-trip-plan/${plc.slug}/${plc.id}`} className="btn_primary">
                                        Add to Trip
                                    </Link>
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
        </section>
    );
};

export default ForYou;
