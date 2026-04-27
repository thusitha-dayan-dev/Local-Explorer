type UserData = {
    id: number;
    full_name: string;
    profile_image_path: string | null;
};

export type User = {
    id: number;
    full_name: string;
    email: string;
    profile_image_path: string | null;
};

export type Category = {
    id: number;
    category_name: string;
    created_at?: string;
    updated_at?: string;
    sub_category: SubCategory[];
    place_count: number;
};

export type SubCategory = {
    id: number;
    sub_category_name: string;
    category_id: number;
    created_at?: string;
    updated_at?: string;
    place_count: number;
};

export type ServiceType = {
    id: number;
    service_type_name: string;
    created_at?: string;
    updated_at?: string;
    nearby_service_count: number;
};

export type TripPlan = {
    id: number;
    title: string;
    estimated_budget: number;
    estimated_duration_time: string;
    total_distance: number;
    travel_date: string | null;
    travel_mode: string | null;
    start_location: string | null;
    status: 'planned' | 'on-going' | 'completed' | 'cancelled' | 'draft';
    user_id: number;
    selected_places: SelectedPlace[] | null;
    selected_services: SelectedService[] | null;
    selected_places_count: number;
    selected_services_count: number;
};

export type SelectedPlace = {
    selected_order_number: number | null;
    arrival_time: string | null;
    user_note: string | null;
    stay_duration: number | null;
    place_id: number;
    trip_plan_id: number;
    place: Place;
};

export type SelectedService = {
    selected_order_number: number | null;
    nearby_service_id: number;
    trip_plan_id: number;
    service_name: string;
    nearby_service: NearbyService;
    id: number;
};

export type Place = {
    id: number;
    place_name: string;
    slug: string;
    description: string;
    short_description: string;
    address: string;
    latitude: number;
    longitude: number;
    base_distance: string;
    local_ticket_price: number | null;
    foreign_ticket_price: number | null;
    estimated_duration: number;
    opening_time: string;
    closing_time: string;
    best_visit_time: string | null;
    contact_number: string | null;
    website_url: string | null;
    main_image_path: string;
    search_tags: string;
    selection_count: number;
    crowd_level: 'low' | 'medium' | 'high';
    status: 'active' | 'inactive';
    category_id: number;
    sub_category_id: number;
    media: PlaceMedia[] | null;
    category: Category;
    sub_category: SubCategory;
    created_at: string;
    updated_at: string;
    review: PlaceReview[];
    review_count: number;
    review_avg_rating: any;
};

export type PlaceMedia = {
    id: number;
    place_id: number;
    media_path: string;
    media_type: 'image' | 'video';
};

export type PlaceReview = {
    id: number;
    title: string;
    message: string;
    rating: number;
    place_id: number;
    user: User;
    medias: PlaceReviewMedia[];
    place_review_media: PlaceReviewMedia[];
    user_id: number;
    user_name: string;
    created_at: string;
    updated_at: string;
    status: 'pending' | 'approved' | 'rejected';
    placeReviewMedia: PlaceReviewMedia[] | null;
    userData: UserData | null;
    place_name: string;
    place: Place;
};

type PlaceReviewMedia = {
    id: number;
    media_path: string;
    media_type: 'image' | 'video';
    place_review_id: number;
};

export type NearbyService = {
    id: number;
    service_name: string;
    slug: string;
    latitude: number;
    longitude: number;
    description: string;
    short_description: string;
    price_range: 'high' | 'medium' | 'low';
    main_image_path: string;
    website_url: string | null;
    contact_number: string | null;
    opening_time: string;
    close_time: string;
    address: string;
    search_tags: string;
    selection_count: number;
    service_type_id: number;
    nearbyServiceMedia: NearbyServiceMedia[] | null;
    created_at: string;
    updated_at: string;
    service_type: ServiceType;
    media_path: any[];
    media: NearbyServiceMedia[];
    review_avg_rating: any;
};

type NearbyServiceMedia = {
    id: number;
    media_path: string;
    media_type: 'image' | 'video';
    nearby_service_id: number;
};

export type NearbyServiceReview = {
    id: number;
    title: string;
    service_name: string;
    message: string;
    rating: number;
    status: 'pending' | 'approved' | 'rejected';
    nearby_service_id: number;
    user_id: number;
    userData: UserData | null;
    nearbyServiceReviewMedia: NearbyServiceReviewMedia[] | null;
};

type NearbyServiceReviewMedia = {
    id: number;
    media_path: string;
    media_type: 'image' | 'video';
    nearby_service_review_id: number;
};

export type WeatherData = {
    name: string;
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    wind: {
        speed: number;
        deg: number;
        gust?: number;
    };
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    visibility: number;
    dt: number;
};

export type PlaceData = {
    id: number;
    place_name: string;
    selection_count: number;
};

export type PlaceChartDataProps = {
    topPlaces: PlaceData[];
    otherPlaces: PlaceData[];
};
