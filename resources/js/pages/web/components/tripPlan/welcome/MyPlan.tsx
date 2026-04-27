import NoTripPlans from '@/pages/web/loding/NoTripPlans';
import TripPlanSkeleton from '@/pages/web/loding/TripPlanSkeleton';
import TripSearchNoResults from '@/pages/web/loding/TripSearchNoResults';
import DeleteModal from '@/pages/web/model/DeleteModal';
import { TripPlan } from '@/types/web';
import { faAngleDown, faBars, faFilter, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    Car,
    Edit3,
    Eye,
    MapPin,
    MoreVertical,
    Navigation,
    Trash2,
    Wallet,
    Clock,
    Loader2,
    CheckCircle2,
    XCircle,
    HelpCircle,
    Star,
    House,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';

interface PageProps {
    plan: TripPlan[];
    avarageRating: number;
    review: Review;
}

interface Review {
    place: number;
    placeAvg: number;
    service: number;
    serviceAvg: number;
    total: number;
    ratingGroup: { [key: number]: number };
    distance: number;
}

const FilterBtns = [
    {
        title: 'All',
        value: '',
        id: 1,
    },
    {
        title: 'Complete',
        value: 'completed',
        id: 2,
    },
    {
        title: 'Planned',
        value: 'planned',
        id: 3,
    },
    {
        title: 'Draft',
        value: 'draft',
        id: 4,
    },
];

const OrdereBtn = [
    {
        id: 1,
        value: 'New Set',
        key: 'desc',
    },
    {
        id: 2,
        value: 'Old set',
        key: 'asc',
    },
];

const MyPlan = ({ plan, avarageRating, review }: PageProps) => {
    const [filter, setFilter] = useState({
        type: '',
        search: '',
        order: 'desc',
    });
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [isActive, setIsActive] = useState(1);
    const [isSiderOpen, setIsSiderOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleteTitle, setDeleteTitle] = useState<string>('');
    const [openRow, setOpenRow] = useState<number[]>([]);
    const [isSearching, setIsSerching] = useState(false);
    const isFirstRender = useRef(true);
    const isFiltering = filter.search.length > 0 || filter.type.length > 0;

    useEffect(()=>{
        const handelClickOutside = (event: MouseEvent) =>{
            const element = document.getElementById('selecter');

            if (element && !element.contains(event.target as Node)) {
                setIsDropDownOpen(false);
            }
        }

        document.addEventListener('mousedown', handelClickOutside);

        return () => {
            document.removeEventListener('mousedown', handelClickOutside);
        }
    }, []);

    useEffect(()=> {
        const clickOutside = (event: MouseEvent) => {
            const siderElement = document.getElementById('sider_main');

            if (siderElement && !siderElement.contains(event.target as Node)) {
                setIsSiderOpen(false);
            }
        }

        document.addEventListener('mousedown', clickOutside);

        return () => {
            document.removeEventListener('mousedown', clickOutside);
        }
    }, []);

    useEffect(()=>{
        const handelClickOutside = (event: MouseEvent) => {
            const element = document.getElementById('menu_list');

            if (element && !element.contains(event.target as Node)) {
                setOpenRow([]);
            }
        }

        document.addEventListener('mousedown', handelClickOutside);

        return () => {
            document.removeEventListener('mousedown', handelClickOutside);
        }
    }, []);

    useEffect(() => {

        if (!isFirstRender.current && isFiltering) {
            setIsSerching(true);
        }

        const delayDebounce = setTimeout(() => {
            if (isFirstRender.current) {
                isFirstRender.current = false;
                return;
            }
            router.get(
                '/trip-plan',
                {
                    search: filter.search,
                    type: filter.type,
                    sort: filter.order,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    onFinish: () => setIsSerching(false),
                },

            );
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [filter]);

    const toggleRow = (id: number) => {
        if (openRow.includes(id)) {
            setOpenRow(openRow.filter((rowId) => rowId !== id));
        } else {
            setOpenRow([...openRow, id]);
        }
    };

    const getIcon = (type: string) => {
        const iconStyle = {
            margin: '0',
            display: 'inline-block',
            verticalAlign: 'middle',
        };

        switch (type) {
            case 'planned':
                return <Clock size={18} style={{ ...iconStyle, color: '#3498db' }} />;

            case 'on-going':
                return <Loader2 size={18} className="animate-spin" style={{ ...iconStyle, color: '#f1c40f' }} />;

            case 'completed':
                return <CheckCircle2 size={18} style={{ ...iconStyle, color: '#2ecc71' }} />;

            case 'cancelled':
                return <XCircle size={18} style={{ ...iconStyle, color: '#e74c3c' }} />;

            default:
                return <HelpCircle size={18} style={{ ...iconStyle, color: '#95a5a6' }} />;
        }
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, index) => {
            const starNumber = index + 1;
            const isFilled = starNumber <= rating;

            return (
                <Star
                    key={index}
                    size={17}
                    fill={isFilled ? '#ffc107' : 'transparent'}
                    stroke={isFilled ? '#ffc107' : '#ccc'}
                    strokeWidth={2}
                    className="star_icon"
                />
            );
        });
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('trip.plan.delete', deleteId), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setDeleteId(null);
                },
            });
        }
    };

    const formatTripTime = (minutes: any): string => {
        if (minutes < 60) {
            return `${Math.round(minutes)} Minutes`;
        }

        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);

        if (mins === 0) {
            return `${hours} ${hours > 1 ? 'Hours' : 'Hour'}`;
        }

        return `${hours}h ${mins}m`;
    };

    return (
        <div className="trip_plan_layout_main">
            <div className="main_content_layout">
                <header className="contenet_hedder">
                    <h2 className="main_hedder">My Trip Plans</h2>
                    <div className={`filter_group_main ${isSiderOpen ? 'open' : ''}`}>
                        <div className="filter_group" id='sider_main'>
                            <nav className="mobile_hedder">
                                <span className="text_main">
                                    <FontAwesomeIcon icon={faFilter} className="icon" />
                                    Filter
                                </span>
                                <FontAwesomeIcon icon={faX} className="togal_mobile" onClick={() => setIsSiderOpen(false)} />
                            </nav>
                            <div className="input_group">
                                <label htmlFor="search" className="lb">
                                    Search
                                </label>
                                <input
                                    type="search"
                                    value={filter.search}
                                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                    id="search"
                                    className="input"
                                    placeholder="Search by trip plan title"
                                />
                            </div>
                            <div className="input_button_group">
                                <span className="lb">Select plan type</span>
                                <div className="btn_group">
                                    {FilterBtns.map((fb) => (
                                        <button
                                            className={`btn ${isActive === fb.id ? 'active' : ''}`}
                                            onClick={() => {
                                                setIsActive(fb.id);
                                                setFilter({ ...filter, type: fb.value });
                                            }}
                                            key={fb.id}
                                        >
                                            {fb.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="input_group">
                                <label htmlFor="order" className="lb">
                                    Order by
                                </label>
                                <div className="holder">
                                    <input
                                        type="text"
                                        id="order"
                                        value={OrdereBtn.find((val) => val.key === filter.order)?.value || ''}
                                        readOnly
                                        className="input subs"
                                        onClick={() => (isDropDownOpen ? setIsDropDownOpen(false) : setIsDropDownOpen(true))}
                                    />
                                    <FontAwesomeIcon icon={faAngleDown} className="holder_icon" />
                                    {isDropDownOpen && (
                                        <ul className="selector" id='selecter'>
                                            {OrdereBtn.map((ob) => (
                                                <li
                                                    key={ob.id}
                                                    onClick={() => {
                                                        setFilter({ ...filter, order: ob.key });
                                                        setIsDropDownOpen(false);
                                                    }}
                                                >
                                                    {ob.value}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <p className="copy">© 2026 Local Explorer</p>
                        </div>
                    </div>
                    <FontAwesomeIcon
                        icon={faBars}
                        className="open_togal"
                        onClick={() => (isSiderOpen ? setIsSiderOpen(false) : setIsSiderOpen(true))}
                    />
                </header>
                {isSearching ? (
                    <div className="skeleton-list">
                        {[1, 2].map(i => <TripPlanSkeleton key={i} />)}
                    </div>
                ) : (

                    <div className="trip_palan_contener">
                        {plan.length <= 0 && isFiltering ? (
                            <TripSearchNoResults onClear={() => {
                                setFilter({ ...filter, search: '', type: '', });
                                setIsActive(1)
                            }} />
                        ) : (
                            <>
                                {plan.length <= 0 ? (
                                    <NoTripPlans />
                                ) : (
                                    <>
                                        {plan.map((plan) => (
                                            <div className="modern_trip_card" key={plan.id}>
                                                <div className="card_top">
                                                    <div className="title_area">
                                                        <span className={`status_dot ${plan.status}`}></span>
                                                        <h3>{plan.title}</h3>
                                                    </div>
                                                    <div className="action_dropdown">
                                                        <button className="more_btn" onClick={() => toggleRow(plan.id)}>
                                                            <MoreVertical size={20} className="icon" />
                                                        </button>
                                                        {openRow.includes(plan.id) && (
                                                            <ul className="menu_list" id='menu_list'>
                                                                <li
                                                                    onClick={() => {
                                                                        setDeleteId(plan.id);
                                                                        setDeleteTitle(plan.title);
                                                                        setIsDeleteModalOpen(true);
                                                                        toggleRow(plan.id);
                                                                    }}
                                                                >
                                                                    <span>Delete</span>
                                                                </li>
                                                                <li onClick={() => toggleRow(plan.id)}>
                                                                    <Link href={route('trip.plan.view', `${plan.id}`)}>View</Link>
                                                                </li>
                                                                <li onClick={() => toggleRow(plan.id)}>
                                                                    <Link href={route('trip.plan.create', `${plan.id}`)}>Edit</Link>
                                                                </li>
                                                            </ul>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="card_mid">
                                                    <div className="location">
                                                        <MapPin size={14} className="icon" />
                                                        <span>{plan.start_location || 'Dambulla, Sri Lanka'}</span>
                                                    </div>
                                                    <div className="date_badge">
                                                        <Calendar size={14} />
                                                        <span>{plan.travel_date || 'Set Date'}</span>
                                                    </div>
                                                </div>

                                                <div className="stats_row">
                                                    <div className="stat">
                                                        <label>Budget</label>
                                                        <p>{plan.estimated_budget ? `Rs.${Math.round(plan.estimated_budget)}` : 'N/A'}</p>
                                                    </div>
                                                    <div className="stat">
                                                        <label>Distance</label>
                                                        <p>{plan.total_distance ? `${plan.total_distance}km` : 'N/A'}</p>
                                                    </div>
                                                    <div className="stat">
                                                        <label>Duration</label>
                                                        <p>{formatTripTime(plan.estimated_duration_time) || 'N/A'}</p>
                                                    </div>
                                                    <div className="stat">
                                                        <label>Place Count</label>
                                                        <p>{plan.selected_places_count || 'N/A'}</p>
                                                    </div>
                                                    <div className="stat">
                                                        <label>Service Count</label>
                                                        <p>{plan.selected_services_count || 'N/A'}</p>
                                                    </div>
                                                </div>

                                                <div className="card_bottom">
                                                    <div className="mode_tag">
                                                        <div className="mode_icon">{getIcon(plan.status)}</div>
                                                        <span>{plan.status || 'planned'}</span>
                                                    </div>
                                                    <Link className="view_plan_btn" href={route('trip.plan.view', `${plan.id}`)}>
                                                        View Details <ArrowRight size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="review_content">
                <div className="review_main">
                    <h3 className="review_title">Ratings Summary</h3>

                    <div className="rating_overview">
                        <div className="left_score">
                            <span className="big_num">{avarageRating}</span>
                            <div className="stars">{renderStars(avarageRating)}</div>
                            <p>Total {review.total} Reviews</p>
                        </div>

                        <div className="right_bars">
                            {[5, 4, 3, 2, 1].map((starNum) => {
                                const count = review.ratingGroup[starNum] || 0;
                                const presentage = review.total > 0 ? (count / review.total) * 100 : 0;

                                return (
                                    <div className="bar_item" key={starNum}>
                                        <span>{starNum}</span>
                                        <div className="bar_bg">
                                            <div className="bar_fill" style={{ width: `${presentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="category_stats">
                        <div className="cat_item">
                            <label>Place Ratings</label>
                            <p>{Number(review.placeAvg).toFixed(1)} / 5.0</p>
                        </div>
                        <div className="cat_item">
                            <label>Service Ratings</label>
                            <p>{Number(review.serviceAvg).toFixed(1)} / 5.0</p>
                        </div>
                    </div>

                    <div className="quick_actions">
                        <h4 className="action_title">Quick Actions</h4>
                        <div className="action_buttons">
                            <Link href={route('trip.plan.create')} className="action_btn primary">
                                <Edit3 size={16} />
                                <span>Create New Plan</span>
                            </Link>
                            <Link href={'/#all-places-section'} className="action_btn secondary">
                                <MapPin size={16} />
                                <span>Explore Places</span>
                            </Link>
                            <Link href={route('home')} className="action_btn outline">
                                <House size={16} />
                                <span>Back to Home</span>
                            </Link>
                        </div>
                    </div>


                </div>
            </div>
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteId(null);
                }}
                onConfirm={handleDelete}
                title={`Delete "${deleteTitle}"?`}
                message="Are you sure you want to remove this trip plan? This action cannot be undone."
            />
        </div>
    );
};

export default MyPlan;
