import { Head } from '@inertiajs/react';
import React from 'react';
import Nav from './components/welcome/Nav';
import { NearbyServiceReview, PlaceReview, User } from '@/types/web';
import TripPlanCard from './components/tripPlan/welcome/TripPlanCard';
import MyPlan from './components/tripPlan/welcome/MyPlan';
import Footer from './components/welcome/Footer';

interface PageProps {
    userInfore: User;
    cardData: any;
    tripPlan: any;
    placeReview: PlaceReview[];
    serviceReview: NearbyServiceReview[];
    avarageRating: number;
    review: any;
}

const TripPlain = ({ userInfore, cardData, tripPlan, avarageRating, review }: PageProps) => {
    return (
        <main className="main_content">
            <Head title="Trip Plan" />
            <Nav index={3} userInfore={userInfore} />
            <TripPlanCard cardData={cardData} />
            <MyPlan plan={tripPlan} avarageRating={avarageRating} review={review} />
            <Footer />
        </main>
    );
};

export default TripPlain;
