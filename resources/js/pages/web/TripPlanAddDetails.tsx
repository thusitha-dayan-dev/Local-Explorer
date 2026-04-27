import { Category, NearbyService, Place, ServiceType, SubCategory, TripPlan } from '@/types/web';
import { useForm, usePage, router } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import { Planer } from './components/tripPlan/addPlaces/Planer';
import { AddedPlanDetails } from './components/tripPlan/addPlaces/AddedPlanDetails';
import { MapView } from './components/tripPlan/addPlaces/MapView';
import TripPlanFormHeader from './components/tripPlan/addPlaces/TripPlanFormHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faClipboard, faMap } from '@fortawesome/free-regular-svg-icons';
import { PlacePaginate, ServicePaginate } from '@/types/admin';
import { route } from 'ziggy-js';
import WelcomeSuccessToast from './notification/WelcomeSuccessToast';

interface PageProps {
    planDetails: TripPlan;
    placesData: PlacePaginate;
    categorys: Category[];
    service: ServicePaginate | null;
    serviceType: ServiceType[];
    serviceCount: number;
}
interface Filter {
    placeCategory: number | null;
    placeSubCategory: number[];
    placeSearch: string;
    wishlist: boolean;
    serviceSearch: string;
    serviceType: number | null;
}

interface Location {
    lat: number;
    lng: number;
    name: string;
    image: string;
    id: number;
    place_id: number;
}

interface SelectedService {
    selected_order_number: number;
    nearby_service_id: number;
    serviec_name: string;
    lat: number;
    lng: number;
}

interface SelectedPlace {
    place_id: number;
    selected_order_number: number;
    arrival_time: string;
    user_note: string;
    stay_duration: string;
    place_name: string;
}

interface TravelPlan {
    id: number | null;
    title: string;
    travel_date: string;
    travel_mode: string;
    selected_places: SelectedPlace[];
    selected_services: SelectedService[];
    totalDistance: string;
    totalTime: string;
    save_type: string;
}

export const TripPlanAddDetails = ({ planDetails, placesData, categorys, service, serviceType, serviceCount }: PageProps) => {
    const tripPlanForm = useForm<TravelPlan>({
        id: planDetails?.id ?? null,
        title: planDetails?.title ?? '',
        travel_date: planDetails?.travel_date ?? '',
        travel_mode: planDetails?.travel_mode ?? '',
        selected_places: planDetails?.selected_places
            ? planDetails.selected_places.map((place: any) => ({
                  place_id: place.place_id,
                  selected_order_number: place.selected_order_number ?? 0,
                  arrival_time: place.arrival_time ?? '',
                  user_note: place.user_note ?? '',
                  stay_duration: place.stay_duration ?? '',
                  place_name: place.place.place_name ?? '',
                  lat: place.place.latitude,
                  lng: place.place.longitude,
              }))
            : [],
        selected_services: planDetails?.selected_services
            ? planDetails.selected_services?.map((service: any) => ({
                  selected_order_number: service.selected_order_number,
                  nearby_service_id: service.nearby_service_id,
                  serviec_name: service.service_name,
                  lat: service.latitude,
                  lng: service.longitude,
              }))
            : [],
        totalTime: '',
        totalDistance: String(planDetails.total_distance) ?? '',
        save_type: 'save',
    });

    const [totalTime, setTotalTime] = useState<number>(Number(planDetails.estimated_duration_time) ?? 0);

    useEffect(() => {
        const totalStayTime = tripPlanForm.data.selected_places.reduce((sum: number, place: any) => {
            const extraStay = Number(place.stay_duration) || 0;
            return sum + extraStay;
        }, 0);

        const travelTime = Number(tripPlanForm.data.totalTime) || 0;

        const finalTime = totalStayTime + travelTime;

        if (Number(tripPlanForm.data.totalTime) !== finalTime) {
            setTotalTime(finalTime);
        }
    }, [tripPlanForm.data.selected_places, tripPlanForm.data.totalTime, placesData, tripPlanForm.data]);

    const [isError, setIsError] = useState({
        error: '',
        isModelOpen: false,
        title: '',
    });

    const isErrorShow = useRef(false);

    let errorTimer: any;

    const handelSubmit = (type = 'save') => {
        tripPlanForm.transform((data) => ({
            ...data,
            save_type: type,
        }));
        tripPlanForm.post(route('trip.plan.save', planDetails?.id), {
            forceFormData: true,
            preserveState: true,
            onSuccess: () => {
            },
            onError: (errors) => {
                const errorKeys = Object.keys(errors);
                if (errorKeys.length > 0) {
                    if (errorTimer) clearTimeout(errorTimer);

                    setIsError({
                        isModelOpen: true,
                        title: 'Form Validation Error',
                        error: errors[errorKeys[0]],
                    });

                    errorTimer = setTimeout(() => {
                        setIsError((prevState) => ({
                            ...prevState,
                            isModelOpen: false,
                        }));
                    }, 3000);
                }
            },
        });
    };

    const handelDraft = () => {
        handelSubmit('draft');
    };

    const handelSavePlan = () => {
        handelSubmit('save');
    };

    useEffect(() => {
        const totalTripTimeMinutes = Number(tripPlanForm.data?.totalTime + totalTime) || 0;
        let timer: any = null;

        if (totalTripTimeMinutes > 720) {
            if (!isErrorShow.current) {
                setIsError({
                    error: 'The 12h limit is exceeded. However, you can continue.',
                    isModelOpen: true,
                    title: 'Time Limit Exceeded',
                });

                isErrorShow.current = true;

                timer = setTimeout(() => {
                    setIsError((prev: any) => ({ ...prev, isModelOpen: false }));
                }, 3000);
            }
        } else {
            isErrorShow.current = false;
            setIsError((prev: any) => ({ ...prev, isModelOpen: false }));
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [tripPlanForm.data]);

    const [filterType, setFilterType] = useState<'place' | 'service'>('place');

    const addPlace = (place: any) => {
        const newPlace = {
            place_id: place.id,
            selected_order_number: tripPlanForm.data.selected_places.length + 1,
            arrival_time: '',
            user_note: '',
            stay_duration: place.estimated_duration,
            place_name: place.place_name,
            lat: place.latitude,
            lng: place.longitude,
        };
        tripPlanForm.setData({
            ...tripPlanForm.data,
            selected_places: [...tripPlanForm.data.selected_places, newPlace],
        });
    };

    const addService = (service: any) => {
        const newService = {
            selected_order_number: tripPlanForm.data.selected_services.length + 1,
            nearby_service_id: service.id,
            serviec_name: service.service_name,
            lat: parseFloat(service.latitude),
            lng: parseFloat(service.longitude),
        };

        tripPlanForm.setData('selected_services', [...tripPlanForm.data.selected_services, newService]);
    };

    const getPlaceTime = (id: number) => {
        const time = placesData.data.find((plc) => id === plc.id)?.estimated_duration;
        return time;
    };

    const removePlace = (id: number, time: any) => {
        const filteredPlaces = tripPlanForm.data.selected_places.filter((place: any) => place.place_id !== id);
        tripPlanForm.setData({
            ...tripPlanForm.data,
            selected_places: filteredPlaces,
        });
    };

    const removeService = (id: number) => {
        const filterdService = tripPlanForm.data.selected_services.filter((service) => service.nearby_service_id != id);
        tripPlanForm.setData('selected_services', filterdService);
    };

    const [activeIndex, setActiveIndex] = useState<number>(1);

    const [placeFilter, setPlaceFilter] = useState<Filter>({
        placeCategory: null,
        placeSubCategory: [],
        placeSearch: '',
        wishlist: false,
        serviceSearch: '',
        serviceType: null,
    });

    const paginate = (link: any) => {
        if (link.url) {
            router.get(
                link.url,
                {
                    category: placeFilter.placeCategory,
                    subCategory: placeFilter.placeSubCategory,
                    placeSearch: placeFilter.placeSearch,
                    wishlist: placeFilter.wishlist,
                    serviceType: placeFilter.serviceType,
                    serviceSearch: placeFilter.serviceSearch,
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
    };

    const [subIndex, setSubIndex] = useState(1);

    const movePlaceById = (placeId: number | string, direction: 'up' | 'down') => {
        const updatedPlaces = [...tripPlanForm.data.selected_places];
        const currentIndex = updatedPlaces.findIndex((p) => p.place_id === placeId);

        if (currentIndex === -1) return;
        if (direction === 'up' && currentIndex > 0) {
            const targetIndex = currentIndex - 1;
            [updatedPlaces[currentIndex], updatedPlaces[targetIndex]] = [updatedPlaces[targetIndex], updatedPlaces[currentIndex]];
        } else if (direction === 'down' && currentIndex < updatedPlaces.length - 1) {
            const targetIndex = currentIndex + 1;
            [updatedPlaces[currentIndex], updatedPlaces[targetIndex]] = [updatedPlaces[targetIndex], updatedPlaces[currentIndex]];
        } else {
            return;
        }
        const reordered = updatedPlaces.map((place, idx) => ({
            ...place,
            selected_order_number: idx + 1,
        }));
        tripPlanForm.setData('selected_places', reordered);
    };

    const isFirstRender = useRef(true);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (isFirstRender.current) {
                isFirstRender.current = false;
                return;
            }
            router.get(
                route('trip.plan.add.detail', planDetails.id),
                {
                    category: placeFilter.placeCategory,
                    subCategory: placeFilter.placeSubCategory,
                    placeSearch: placeFilter.placeSearch,
                    wishlist: placeFilter.wishlist,
                    serviceType: placeFilter.serviceType,
                    serviceSearch: placeFilter.serviceSearch,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onBefore: () => {},
                    replace: true,
                },
            );
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [placeFilter]);

    const handleTabChange = (type: 'place' | 'service') => {
        setFilterType(type);

        if (type === 'service' && !service) {
            router.visit(window.location.pathname, {
                only: ['service'],
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    const [selectedLength, setSelectedLength] = useState(0);

    const [showToast,setShowToast] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const newSelectedLength = tripPlanForm.data.selected_places.length + tripPlanForm.data.selected_services.length;
        if (selectedLength != newSelectedLength) {
            setSelectedLength(newSelectedLength);
        }
    }, [tripPlanForm.data.selected_places, tripPlanForm.data.selected_services]);

    const optimizeMyTrip = () => {
        const allItems = [...(tripPlanForm.data.selected_places || []).map((p: any) => ({ ...p, tempType: 'place' }))];

        if (allItems.length < 2) {
            setIsError({
                error: 'At least 2 places are required to optimize the trip.',
                isModelOpen: true,
                title: 'Optimization Error',
            });
            return
        };

        let unvisited = [...allItems];
        let optimized: any[] = [];

        let current = unvisited.shift()!;
        optimized.push(current);

        while (unvisited.length > 0) {
            let closestIndex = 0;
            let minDistance = Infinity;

            for (let i = 0; i < unvisited.length; i++) {
                const d = Math.sqrt(Math.pow(current.lat - unvisited[i].lat, 2) + Math.pow(current.lng - unvisited[i].lng, 2));

                if (d < minDistance) {
                    minDistance = d;
                    closestIndex = i;
                }
            }
            current = unvisited.splice(closestIndex, 1)[0];
            optimized.push(current);
        }

        const finalPlaces = optimized
            .filter((item) => item.tempType === 'place')
            .map((item) => {
                const newOrder = optimized.findIndex((o) => o.tempType === 'place' && o.place_id === item.place_id) + 1;
                const { tempType, ...rest } = item;
                return { ...rest, selected_order_number: optimized.indexOf(item) + 1 };
            });

        tripPlanForm.setData((prevData: any) => ({
            ...prevData,
            selected_places: finalPlaces,
        }));
        setShowToast(true);
        setTimeout(() => {setShowToast(false)},3000);
        setMessage('Trip optimized successfully!');
    };

    return (
        <section className="planer_main_layout">
            <WelcomeSuccessToast message={message} isVisible={showToast} onClose={()=> setShowToast(false)}/>
            <TripPlanFormHeader planDetails={planDetails} index={activeIndex} event={optimizeMyTrip} />
            {isError.isModelOpen && (
                <div className="error-toast-container">
                    <div className="error-toast">
                        <div className="icon-box">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <div className="content">
                            <p className="title">{isError.title}</p>
                            <p className="message">{isError.error}</p>
                        </div>
                        <button
                            className="close-btn"
                            onClick={() => {
                                setIsError((prev) => ({ ...prev, isModelOpen: false }));
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
            <div className="other_content_main_layout">
                <Planer
                    placeData={placesData}
                    filterValues={placeFilter}
                    onFilterChange={setPlaceFilter}
                    data={tripPlanForm.data}
                    activeIndex={activeIndex}
                    categorys={categorys}
                    addPlace={addPlace}
                    removePlace={removePlace}
                    service={service}
                    filterType={filterType}
                    setFilterType={handleTabChange}
                    serviceType={serviceType}
                    serviceCount={serviceCount}
                    paginate={paginate}
                    addService={addService}
                    removeService={removeService}
                />
                <div className="layout_right_content">
                    <div className="nav_layout">
                        <div className="glass_summary_bar">
                            <button className={`stat_box ${subIndex === 1 ? 'active' : ''}`} onClick={() => setSubIndex(1)}>
                                <span className="lab">My Plan</span>
                            </button>
                            <button className={`stat_box ${subIndex === 2 ? 'active' : ''}`} onClick={() => setSubIndex(2)}>
                                <span className="lab">Map View</span>
                            </button>
                        </div>
                    </div>
                    <AddedPlanDetails
                        index={activeIndex}
                        details={tripPlanForm.data}
                        setDetails={tripPlanForm.setData}
                        move={movePlaceById}
                        setData={tripPlanForm.setData}
                        subIndex={subIndex}
                        removePlace={removePlace}
                        removeService={removeService}
                        handelDraft={handelDraft}
                        handelSavePlan={handelSavePlan}
                        getPlaceTime={getPlaceTime}
                    />
                    <MapView activeIndex={activeIndex} data={tripPlanForm.data} subIndex={subIndex} setData={tripPlanForm.setData} />
                </div>
            </div>
            <div className="footer_nav_mobile">
                <button className={`foter_btn ${activeIndex === 1 ? 'active' : ''}`} onClick={() => setActiveIndex(1)}>
                    <FontAwesomeIcon icon={faLocationDot} className="icon" />
                    Place
                </button>
                <button className={`foter_btn ${activeIndex === 2 ? 'active' : ''}`} onClick={() => setActiveIndex(2)}>
                    <FontAwesomeIcon icon={faMap} className="icon" />
                    Map
                </button>
                <button className={`foter_btn ${activeIndex === 3 ? 'active' : ''}`} onClick={() => setActiveIndex(3)}>
                    <FontAwesomeIcon icon={faClipboard} className="icon" />
                    {selectedLength > 0 && <span className="count">{selectedLength}</span>}
                    My Plan
                </button>
            </div>
        </section>
    );
};

export default TripPlanAddDetails;
