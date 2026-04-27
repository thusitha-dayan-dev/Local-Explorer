import React, { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faMapMarkerAlt,
    faStar,
    faClock,
    faFilter,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { route } from 'ziggy-js';
import { Heart } from 'lucide-react';
import AddTripModal from '../../model/AddTripModal';
import PlaceSkeleton from '../../loding/PlaceSkeleton';
import NoResultsFound from '../../loding/NoResultsFound';

interface Props {
    allPlaces: any;
    categories: any;
    wishlistIds: any[];
}

const AllPlaces = ({ allPlaces, categories, wishlistIds }: Props) => {
    const [search, setSearch] = useState('');
    const [selectedCat, setSelectedCat] = useState<number | null>(null);
    const [selectedSubCats, setSelectedSubCats] = useState<number[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const isFirstRender = useRef(true);
    const [addTripModel, setAddTripModel] = useState({
        place: [],
        isOpen: false,
    });

    const {userInfore} = usePage<any>().props;
    const [loding, setLoding] = useState(false);

    const handelFilterClear =() => {
        setSearch('');
        setSelectedCat(null);
        setSelectedSubCats([]);
    }


    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setLoding(true);
        const delayDebounceFn = setTimeout(() => {
            router.visit(window.location.pathname, {
                method: 'get',
                data: {
                    search: search,
                    category: selectedCat,
                    subCategory: selectedSubCats.length > 0 ? selectedSubCats : null,
                },
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['allPlaces'],
                onFinish: () => setLoding(false),
            });
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, selectedCat, selectedSubCats]);

    const handleSubCatChange = (id: number) => {
        setSelectedSubCats((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const renderStars = (rating: any) => {
        const stars = [];
        const num = parseFloat(rating || 0);
        for (let i = 1; i <= 5; i++) {
            stars.push(<FontAwesomeIcon key={i} icon={faStar} className={i <= Math.round(num) ? 'star_gold' : 'star_grey'} />);
        }
        return stars;
    };

    const checkWishlistIds = (id: number): boolean => {
        return wishlistIds.includes(id);
    };

    const handelModelClose = () => {
        setAddTripModel({ ...AddTripModal, isOpen: false, place: [] });
    };

    const handelModelOpen = (places: any) => {
        if (!userInfore.id) {
            router.visit(route('login'), {
             data: { message: 'Please sign in to plan your trip.' }
        });
        } else{

            setAddTripModel({ ...AddTripModal, isOpen: true, place: places });
        }
    };

    return (
        <section className="all_destinations_premium">
            <div className="custom_container">
                <div className="layout_grid">
                    <aside className={`filter_sidebar ${isFilterOpen ? 'open' : ''}`}>
                        <div className="sidebar_inner">
                            <div className="filter_header">
                                <h3>Filter Options</h3>
                                <button className="close_btn" onClick={() => setIsFilterOpen(false)}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="filter_group">
                                <label>Search Name</label>
                                <div className="sidebar_search">
                                    <FontAwesomeIcon icon={faSearch} />
                                    <input type="text" placeholder="e.g. Sigiriya..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                </div>
                            </div>
                            <div className="filter_group">
                                <label>Main Category</label>
                                <div className="category_options">
                                    <div
                                        className={`opt_item ${selectedCat === null ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedCat(null);
                                            setSelectedSubCats([]);
                                        }}
                                    >
                                        All Destinations
                                    </div>
                                    {categories?.map((cat: any) => (
                                        <div
                                            key={cat.id}
                                            className={`opt_item ${selectedCat === cat.id ? 'active' : ''}`}
                                            onClick={() => {
                                                setSelectedCat(cat.id);
                                                setSelectedSubCats([]);
                                            }}
                                        >
                                            {cat.category_name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {selectedCat && categories.find((c: any) => c.id === selectedCat)?.sub_category?.length > 0 && (
                                <div className="filter_group">
                                    <label>Specific Types</label>
                                    <div className="subcat_list">
                                        {categories
                                            .find((c: any) => c.id === selectedCat)
                                            .sub_category.map((sub: any) => (
                                                <label key={sub.id} className="checkbox_container">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSubCats.includes(sub.id)}
                                                        onChange={() => handleSubCatChange(sub.id)}
                                                    />
                                                    <span className="checkmark"></span>
                                                    {sub.sub_category_name}
                                                </label>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                    <main className="places_content">
                        <div className="content_header">
                            <div>
                                <h2>Discover Dambulla</h2>
                                <p>{allPlaces?.total || 0} places found</p>
                            </div>
                            <button className="mobile_filter_btn" onClick={() => setIsFilterOpen(true)}>
                                <FontAwesomeIcon icon={faFilter} /> Filters
                            </button>
                        </div>
                            {loding ? (
                                <div className="skeleton-grid">
                                    {[...Array(6)].map((_, i) => (
                                        <PlaceSkeleton key={i} />
                                    ))}
                                </div>
                            ) : (
                                <>
                                {allPlaces?.data.length <= 0  ? (
                                    <div>
                                        <NoResultsFound onClear={handelFilterClear}/>
                                    </div>
                                ): (
                                     <div className="premium_card_grid">
                                        {allPlaces?.data?.map((plc: any) => (
                                <div className="travel_card_v2" key={plc.id}>
                                    <div className="img_section">
                                        <img src={`/storage/${plc.main_image_path}`} alt={plc.place_name} />
                                        <div className="badge_row">
                                            <span className="crowd_label">Low Crowd</span>
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
                                    <div className="info_section">
                                        <div className="rating_box">
                                            <div className="stars_wrap">{renderStars(plc.review_avg_rating)}</div>
                                            <span className="rate_num">{parseFloat(plc.review_avg_rating || 0).toFixed(1)}</span>
                                        </div>
                                        <h3 className="place_title">{plc.place_name}</h3>
                                        <p className="loc_info">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} /> {plc.address}
                                        </p>
                                        <p className="visit_time">
                                            <FontAwesomeIcon icon={faClock} /> {plc.visit_time || '40'} mins visit
                                        </p>
                                        <p className="short_desc">{plc.short_description || 'A beautiful location to visit in Sri Lanka...'}</p>
                                        <div className="action_row">
                                            <Link className="details_btn" href={route('place.detail', plc.slug)}>
                                                Details
                                            </Link>
                                            <button className="add_btn" onClick={() => handelModelOpen(plc)}>
                                                Add Trip
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                         ))}
                                     </div>
                                )}
                                </>
                            )}
                        {allPlaces?.links?.length > 3 && (
                            <div className="pagination_container">
                                {allPlaces.links.map((link: any, i: number) => (
                                    <button
                                        key={i}
                                        type="button"
                                        disabled={!link.url}
                                        className={`page_node ${link.active ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (link.url) {
                                                router.get(
                                                    link.url,
                                                    {
                                                        search,
                                                        category: selectedCat,
                                                        subCategory: selectedSubCats,
                                                    },
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                        onSuccess: () => {
                                                            const element = document.getElementById('all-places-section');
                                                            if (element) {
                                                                element.scrollIntoView({
                                                                    behavior: 'smooth',
                                                                    block: 'start',
                                                                });
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
                    </main>
                </div>
            </div>
            {isFilterOpen && <div className="dark_overlay" onClick={() => setIsFilterOpen(false)}></div>}
            <AddTripModal isOpen={addTripModel.isOpen} onClose={handelModelClose} place={addTripModel.place} />

        </section>
    );
};

export default AllPlaces;
