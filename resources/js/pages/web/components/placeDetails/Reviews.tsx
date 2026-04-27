import { FormatDate } from '@/lib/utils';
import { PlaceReviewPaginate } from '@/types/paginate';
import { Place, User } from '@/types/web';
import { faComments } from '@fortawesome/free-regular-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router } from '@inertiajs/react';
import { Star } from 'lucide-react';
import React, { useState } from 'react';
import ReviewModal from '../../model/ReviewModal';
import { route } from 'ziggy-js';
import NoReviews from '../../loding/NoReviews';

interface Page {
    reviews: PlaceReviewPaginate;
    count: number;
    avarage: number;
    place: Place;
    userInfore: User;
}

const Reviews = ({ reviews, count, avarage, place, userInfore }: Page) => {
    const [openRow, setOpenRow] = useState<number[]>([]);

    const [revieModel, setRevieModel] = useState({
        isOpen: false,
        placeId: place.id,
        placeName: '',
    });

    const handelClose = () => {
        setRevieModel({ ...revieModel, isOpen: false, placeId: 0, placeName: '' });
    };

    const toggleRow = (id: number) => {
        if (openRow.includes(id)) {
            setOpenRow(openRow.filter((rowId) => rowId !== id));
        } else {
            setOpenRow([...openRow, id]);
        }
    };

    const handelModelOpen = () => {
        if (!userInfore.id) {
            router.visit(route('login'), {
                data: { error: 'Please login to continue' },
                method: 'get',
            });
        } else {
            setRevieModel({ ...revieModel, isOpen: true, placeId: place?.id, placeName: place.place_name });
        }
    };


    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, index) => {
            const starNumber = index + 1;
            const isFilled = starNumber <= rating;

            return (
                <Star
                    key={index}
                    size={18}
                    fill={isFilled ? '#ffc107' : 'transparent'}
                    stroke={isFilled ? '#ffc107' : '#ccc'}
                    strokeWidth={2}
                    className="star_icon"
                />
            );
        });
    };

    return (
        <section className="review_main_layout" id="review">
            <div className="review_main">
                <header className="nav_hedder">
                    <h1>Reviews</h1>
                    <div className="detail_box">
                        <button className="review" onClick={handelModelOpen}>
                            <FontAwesomeIcon icon={faPen} className="icon" />
                            Write a Review
                        </button>
                        <span className="main">
                            <FontAwesomeIcon icon={faComments} className="icon" />
                            <span className="count">{count} users</span>
                        </span>
                        <div className="rate_box">
                            <div className="star_box">{renderStars(avarage)}</div>
                            <span className="sub">{Number(avarage).toFixed(2)}</span>
                        </div>
                    </div>
                </header>
                {reviews.data.length <= 0 ? (
                    <>
                    <NoReviews onWriteReview={handelModelOpen}/>
                    </>
                ): (

                <div className="reviews_contener">
                    {reviews.data.map((rv) => (
                        <div className={`review_card ${openRow.includes(rv.id) ? 'open' : ''}`} key={rv.id}>
                            <div className="card_hedder">
                                <div className="pp_box">
                                    <div className="profile">
                                        {rv.user.profile_image_path ? (
                                            <img src={`/storage/${rv.user.profile_image_path}`} alt={rv.user.full_name} />
                                        ) : (
                                            <span className="temp_profile">{rv.user.full_name.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div className="text_box">
                                        <span className="user_type">{rv.user_name}</span>
                                        <span className="rate_box">{renderStars(rv.rating)}
                                            <span style={{ marginLeft:'10px', fontSize:'0.8rem' }}>
                                            + {rv.place_review_media?.length} image
                                            </span>
                                            </span>
                                    </div>
                                </div>
                                <span className="creater">{FormatDate(rv.created_at)}</span>
                            </div>
                            <div className="card_content">
                                <span className="title">{rv.title}</span>
                                <span className={`message ${!openRow.includes(rv.id) ? 'close' : ''}`}>{rv.message}</span>
                            </div>
                            {rv.place_review_media && (
                                <div className={`media_contener ${!openRow.includes(rv.id) ? 'close' : ''}`}>
                                    {rv.place_review_media.map((media) => (
                                        <img src={`/storage/${media.media_path}`} alt={`place Image`} />
                                    ))}
                                </div>
                            )}
                            {!openRow.includes(rv.id) ? (
                                <span className="more_mg" onClick={() => toggleRow(rv.id)}>
                                    Read more..
                                </span>
                            ) : (
                                <span className="more_mg" onClick={() => toggleRow(rv.id)}>
                                    Read lees..
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                )}
                {reviews.links.length > 3 && (
                <div className="pagination_container">
                    {reviews.links.map((link: any, i: number) => (
                        <button
                            key={i}
                            type="button"
                            disabled={!link.url || link.active}
                            className={`page_node ${link.active ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                if (link.url && !link.active) {
                                    router.get(
                                        link.url,
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                            onFinish: () => {
                                                const element = document.getElementById('review');
                                                if (element) {
                                                    setTimeout(() => {
                                                        element.scrollIntoView({
                                                            behavior: 'smooth',
                                                            block: 'start',
                                                        });
                                                    }, 100);
                                                }
                                            },
                                        },
                                    );
                                }
                            }}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
                )}
            </div>
            <ReviewModal isOpen={revieModel.isOpen} onClose={handelClose} placeId={revieModel.placeId} placeName={revieModel.placeName} />
        </section>
    );
};

export default Reviews;
