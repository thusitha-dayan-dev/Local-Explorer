import { PlacePaginate, ServicePaginate } from '@/types/admin';
import { Category, ServiceType, SubCategory } from '@/types/web';
import { faHeart, faPen, faSliders, faUser, faUserGroup, faUsers, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import PageDetailsModel from '../../../model/PageDetailsModel';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { Clock, MapPin, Phone, Star, Ticket, Users } from 'lucide-react';
import { ServiceDetailsModel } from '../../../model/ServiceDetailsModel';
import ServiceReviewModal from '@/pages/web/model/ServiceReviewModal';
import SuccessToast from '@/pages/web/notification/SuccessToast';

interface PlaceFilterState {
    placeCategory: number | null;
    placeSubCategory: number[];
    placeSearch: string;
    wishlist: boolean;
    serviceSearch: string;
    serviceType: number | null;
}

interface PageProps {
    placeData: PlacePaginate;
    filterValues: PlaceFilterState;
    onFilterChange: Dispatch<SetStateAction<PlaceFilterState>>;
    data: {
        id: number | null;
        title: string;
        travel_date: string;
        travel_mode: string;
        selected_places: any[];
        selected_services: any[];
    };
    activeIndex: number;
    categorys: Category[];
    addPlace: (place: any) => void;
    removePlace: (id: any, time: any) => void;
    service: ServicePaginate | null;
    filterType: 'place' | 'service';
    setFilterType: (type: 'place' | 'service') => void;
    serviceType: ServiceType[];
    serviceCount: number;
    paginate: (link: any) => void;
    addService: (service: any) => void;
    removeService: (id: number) => void;
}

export const Planer = ({
    placeData,
    filterValues,
    onFilterChange,
    data,
    activeIndex,
    categorys,
    addPlace,
    removePlace,
    service,
    filterType,
    setFilterType,
    serviceType,
    serviceCount,
    paginate,
    addService,
    removeService,
}: PageProps) => {
    const [isFilterOpen, setIsFiterOpen] = useState(false);
    const [selectdeSubCategory, setSelectedSubCategory] = useState<SubCategory[]>([]);
    const [isPlaceModelOpen, setIsPlaceModelOpen] = useState(false);
    const [isServiceModelOpen, setIsServiceModelOpen] = useState(false);
    const [modelData, setModelData] = useState<any>([]);
    const [serviceModelData, setServiceModelData] = useState<any>([]);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [successModelOpen, setSuccessModelOpen] = useState(false);

    const [reviewModel, setReviewModel] = useState({
        id: 0,
        name: '',
        isOpen:false,
    });

    const openReviewModel =(sid: number, sname: string) =>{
        setReviewModel({...reviewModel, id: sid, name: sname, isOpen: true});
    }

    const handelSuccess =() => {
        setSuccessModelOpen(true);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isFilterOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsFiterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterOpen]);

    const handelSubCategoryChange = (id: number) => {
        const currentSubCategories = filterValues.placeSubCategory;
        const isExist = currentSubCategories.includes(id);
        const updatedSubCategories = isExist ? currentSubCategories.filter((item) => item !== id) : [...currentSubCategories, id];
        onFilterChange({
            ...filterValues,
            placeSubCategory: updatedSubCategories,
        });
    };

    const handelClose = () => {
        if (isPlaceModelOpen) {
            setIsPlaceModelOpen(false);
            setModelData([]);
        }
        if (isServiceModelOpen) {
            setIsServiceModelOpen(false);
            setServiceModelData([]);
        }
    };

    const checkHasPlan = (id: number) => {
        return data.selected_places.some((place: any) => place.place_id === id);
    };

    const checkServiceHasPlan = (id: number) => {
        return data.selected_services.some((service: any) => service.nearby_service_id === id);
    };

    const crowdStatus = {
        low: {
            color: '#22c55e',
            label: 'Low Crowd',
            bg: '#f0fdf4',
        },
        medium: {
            color: '#f59e0b',
            label: 'Medium Crowd',
            bg: '#fffbeb',
        },
        high: {
            color: '#ef4444',
            label: 'High Crowd',
            bg: '#fef2f2',
        },
    };

    return (
        <div className={`place_form_layout ${activeIndex === 1 ? 'active' : ''}`}>
            <div className="scrow_heigth">
                <div className="filter_main_group">
                    <div className="filter_group">
                        <div className="filter_row">
                            {filterType === 'place' ? (
                                <input
                                    type="text"
                                    placeholder="Search places name..."
                                    className="input_main"
                                    onChange={(e) => onFilterChange({ ...filterValues, placeSearch: e.target.value })}
                                    value={filterValues.placeSearch}
                                />
                            ) : (
                                <input
                                    type="text"
                                    placeholder="Search services name..."
                                    className="input_main"
                                    onChange={(e) => onFilterChange({ ...filterValues, serviceSearch: e.target.value })}
                                    value={filterValues.serviceSearch}
                                />
                            )}
                            <div className="toggle_group">
                                <button
                                    className="togal_btn"
                                    onClick={() => {
                                        isFilterOpen ? setIsFiterOpen(false) : setIsFiterOpen(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faSliders} className="icon" />
                                    <span>Filter</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={`sider_menu_overlay ${isFilterOpen ? 'open' : ''}`}>
                        <div className="sider_content_overlayer">
                            <div className="filter_sider_group" ref={sidebarRef}>
                                <div className="section_hedder">
                                    <span className="main_text">Filter Options</span>
                                    <FontAwesomeIcon icon={faX} className="togal_filter_btn" onClick={() => setIsFiterOpen(false)} />
                                </div>
                                <div className="main_filter_box">
                                    <span className="main_text">Show results for</span>
                                    <div className="type_group">
                                        <button
                                            className={`cat_btn ${filterType === 'place' ? 'active' : ''}`}
                                            onClick={() => setFilterType('place')}
                                        >
                                            Explore Places
                                        </button>
                                        <button
                                            className={`cat_btn ${filterType === 'service' ? 'active' : ''}`}
                                            onClick={() => {
                                                setFilterType('service');
                                            }}
                                        >
                                            Find Services
                                        </button>
                                    </div>
                                </div>
                                <div className={`hidder_waper ${filterType === 'place' ? 'open' : ''}`}>
                                    <div className="card_waper">
                                        <div className="category_gorups">
                                            <span className="main_text">Main Category</span>
                                            <div className="cat_btn_layout">
                                                <button
                                                    className={`cat_btn ${filterValues.placeCategory === null && !filterValues.wishlist ? 'active' : ''}`}
                                                    onClick={() => {
                                                        onFilterChange({
                                                            ...filterValues,
                                                            placeCategory: null,
                                                            wishlist: false,
                                                            placeSubCategory: [],
                                                        });
                                                    }}
                                                >
                                                    All Destinations
                                                </button>
                                                <button
                                                    className={`cat_btn ${filterValues.wishlist === true ? 'active' : ''}`}
                                                    onClick={() => {
                                                        onFilterChange({
                                                            ...filterValues,
                                                            wishlist: true,
                                                            placeCategory: null,
                                                            placeSubCategory: [],
                                                        });
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faHeart} className="icon" />
                                                    My Saved Place
                                                </button>
                                                {categorys.map((cat) => (
                                                    <button
                                                        className={`cat_btn ${filterValues.placeCategory === cat.id ? 'active' : ''}`}
                                                        key={cat.id}
                                                        onClick={() => {
                                                            onFilterChange({
                                                                ...filterValues,
                                                                placeCategory: cat.id,
                                                                placeSubCategory: [],
                                                                wishlist: false,
                                                            });
                                                            setSelectedSubCategory(cat.sub_category);
                                                        }}
                                                    >
                                                        {cat.category_name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`hidder_waper ${filterType === 'place' ? 'open' : ''}`}>
                                    <div className="card_waper">
                                        {filterValues.placeCategory && selectdeSubCategory && (
                                            <div className="category_gorups">
                                                <span className="main_text">Specific Types</span>
                                                <div className="subCategory_group">
                                                    {selectdeSubCategory.map((subCat) => (
                                                        <div className="input_group" key={subCat.id}>
                                                            <input
                                                                type="checkbox"
                                                                id={subCat.sub_category_name}
                                                                checked={filterValues.placeSubCategory.includes(subCat.id)}
                                                                onChange={() => handelSubCategoryChange(subCat.id)}
                                                            />
                                                            <label htmlFor={subCat.sub_category_name}>{subCat.sub_category_name}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={`hidder_waper ${filterType === 'service' ? 'open' : ''}`}>
                                    <div className="card_waper">
                                        <div className="category_gorups">
                                            <span className="main_text">Specific Types</span>
                                            <div className="cat_btn_layout">
                                                <button
                                                    className={`cat_btn ${filterValues.serviceType === null ? 'active' : ''}`}
                                                    onClick={() => onFilterChange({ ...filterValues, serviceType: null })}
                                                >
                                                    All Services
                                                </button>
                                                {serviceType.map((type) => (
                                                    <button
                                                        className={`cat_btn ${filterValues.serviceType == type.id ? 'active' : ''}`}
                                                        onClick={() => onFilterChange({ ...filterValues, serviceType: type.id })}
                                                        key={type.id}
                                                    >
                                                        {type.service_type_name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="place_details_overlayer">
                    <div className="results_header_area">
                        <div className="main_title_row">
                            <div className="title_group">
                                <h3>I want to see...</h3>
                                <span className="status_badge">Live Results</span>
                            </div>
                            <p className="subtitle">Discover the best spots for your journey</p>
                        </div>
                        <div className="glass_summary_bar">
                            <button className={`stat_box ${filterType === 'place' ? 'active' : ''}`} onClick={() => setFilterType('place')}>
                                <span className="val">{placeData.total}</span>
                                <span className="lab">Places</span>
                            </button>
                            <button className={`stat_box ${filterType === 'service' ? 'active' : ''}`} onClick={() => setFilterType('service')}>
                                <span className="val">{serviceCount}</span>
                                <span className="lab">Services</span>
                            </button>
                        </div>
                    </div>
                    {filterType === 'place' ? (
                        <>
                        <div className="place_details_layout">
                            {placeData.data.map((data) => (
                                <div className="place-card" key={data.id}>
                                    <div className="card-image">
                                        <img src={`/storage/${data.main_image_path}`} alt={data.place_name} />
                                        <div className="category-badge">{data.category.category_name}</div>
                                    </div>

                                    <div className="card-content">
                                        <div className="top-meta">
                                            <div className="rating">
                                                <Star size={14} fill="#FFD700" color="#FFD700" />
                                                <span>{parseFloat(data.review_avg_rating || 0).toFixed(1)}</span>
                                                <span className="count">({data.review_count})</span>
                                            </div>
                                            <div className="crowd-level" style={{ color: crowdStatus[data.crowd_level].color }}>
                                                <Users size={14} />
                                                <span>{crowdStatus[data.crowd_level].label}</span>
                                            </div>
                                        </div>

                                        <h3 className="place-name">{data.place_name}</h3>

                                        <div className="detail-list">
                                            <div className="detail-item">
                                                <MapPin size={14} />
                                                <span className="truncate">{data.address}</span>
                                            </div>
                                            <div className="detail-item">
                                                <Clock size={14} />
                                                <span>Est. {data.estimated_duration} mins</span>
                                            </div>
                                            <div className="detail-item price">
                                                <Ticket size={14} />
                                                <span>{data.local_ticket_price ? `Rs. ${data.local_ticket_price}` : 'Free Entry'}</span>
                                            </div>
                                        </div>

                                        <p className="short-desc">{data.short_description}</p>

                                        <div className="card-footer">
                                            <div className="action_row">
                                                <button
                                                    className="btn view_btn"
                                                    onClick={() => {
                                                        setIsPlaceModelOpen(true);
                                                        setModelData(data);
                                                    }}
                                                >
                                                    View Info
                                                </button>
                                                {checkHasPlan(data.id) ? (
                                                    <button
                                                        className="btn add_btn remove"
                                                        onClick={() => removePlace(data.id, data.estimated_duration)}
                                                    >
                                                        <FontAwesomeIcon icon={faBookmarkSolid} className="icon" />
                                                        Remove <span className="sub">from Trip</span>
                                                    </button>
                                                ) : (
                                                    <button className="btn add_btn" onClick={() => addPlace(data)}>
                                                        <FontAwesomeIcon icon={faBookmarkRegular} className="icon" />
                                                        Add
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                            {placeData?.links?.length > 3 && (
                                <div className="pagination_container" style={{ padding:'40px' }}>
                                    {placeData.links.map((link: any, i: number) => (
                                        <button
                                            key={i}
                                            type="button"
                                            disabled={!link.url}
                                            className={`page_node ${link.active ? 'active' : ''}`}
                                            onClick={() => paginate(link)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                            <>
                        <div className="place_details_layout">
                            {service?.data.map((svc) => (
                                <div className="service-card" key={svc.id}>
                                    <div className="card-image">
                                        <img src={`/storage/${svc.main_image_path}`} alt={svc.service_name} />
                                        <div className="price-tag">{svc.price_range.toUpperCase()}</div>
                                        <button className="rv_btn" onClick={() =>
                                            openReviewModel(svc.id, svc.service_name)}>
                                            <FontAwesomeIcon icon={faPen} className='icon'/>
                                            Rate now
                                        </button>
                                    </div>

                                    <div className="card-content">
                                        <div className="header-row">
                                            <span className="type-badge">{svc.service_type.service_type_name}</span>
                                            <div className="rating">
                                                <Star className="star-icon" size={14} fill="#FFD700" color="#FFD700" />
                                                <span>{parseFloat(svc.review_avg_rating || 0).toFixed(1)}</span>
                                            </div>
                                        </div>

                                        <h3 className="service-name">{svc.service_name}</h3>

                                        <div className="info-grid">
                                            <div className="info-item">
                                                <MapPin size={14} />
                                                <span className="truncate">{svc.address}</span>
                                            </div>
                                            <div className="info-item">
                                                <Clock size={14} />
                                                <span>
                                                    {svc.opening_time} - {svc.close_time}
                                                </span>
                                            </div>
                                            {svc.contact_number && (
                                                <div className="info-item">
                                                    <Phone size={14} />
                                                    <span>{svc.contact_number}</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="description line-clamp-2">{svc.short_description}</p>

                                        <div className="card-footer">
                                            <div className="action_row">
                                                <button
                                                    className="btn view_btn"
                                                    onClick={() => {
                                                        setIsServiceModelOpen(true);
                                                        setServiceModelData(svc);
                                                    }}
                                                >
                                                    View Info
                                                </button>
                                                {checkServiceHasPlan(svc.id) ? (
                                                    <button className="btn add_btn remove" onClick={() => removeService(svc.id)}>
                                                        <FontAwesomeIcon icon={faBookmarkSolid} className="icon" />
                                                        Remove <span className="sub">from Trip</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn add_btn"
                                                        onClick={() => {
                                                            addService(svc);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faBookmarkRegular} className="icon" />
                                                        Add
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                            {service && service?.links?.length > 3 && (
                                <div className="pagination_container" style={{ padding:'40px' }}>
                                    {service.links.map((link: any, i: number) => (
                                        <button
                                            key={i}
                                            type="button"
                                            disabled={!link.url}
                                            className={`page_node ${link.active ? 'active' : ''}`}
                                            onClick={() => paginate(link)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                            </>
                    )}
                    <PageDetailsModel
                        place={modelData}
                        onClose={handelClose}
                        isOpen={isPlaceModelOpen}
                        removePlace={removePlace}
                        addPlace={addPlace}
                        checkHasPlan={checkHasPlan}
                    />
                    <ServiceDetailsModel
                        service={serviceModelData}
                        onClose={handelClose}
                        isOpen={isServiceModelOpen}
                        removeService={removeService}
                        addService={addService}
                        checkHasPlan={checkServiceHasPlan}
                    />
                    <ServiceReviewModal isOpen={reviewModel.isOpen} serviceId={reviewModel.id}
                    serviceName={reviewModel.name} onClose={() => setReviewModel({...reviewModel, isOpen:false, id: 0, name: ''})} success={handelSuccess}/>
                    <SuccessToast message='Thanks for your feedback ❤️' show={successModelOpen} onClose={()=> setSuccessModelOpen(false)}/>
                </div>
            </div>
        </div>
    );
};
