import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Nav from './components/welcome/Nav';
import Footer from './components/welcome/Footer';
import { Place, User } from '@/types/web';
import PlaceDetailsShow from './components/placeDetails/PlaceDetailsShow';
import Reviews from './components/placeDetails/Reviews';
import ForYou from './components/placeDetails/ForYou';

interface PageProps {
    place: Place;
    userInfore: User;
    reviews: any;
    rating_distribution: any;
    forYou: Place[];
}

const PlaceDetail = ({ userInfore, place, reviews, rating_distribution, forYou }: PageProps) => {
    return (
        <section className="place_details">
            <Head title={`Place Detail`} />
            <Nav userInfore={userInfore} index={-1} />
            <PlaceDetailsShow place={place} />
            <Reviews reviews={reviews} count={place.review_count} avarage={place.review_avg_rating} place={place} userInfore={userInfore} />
            <div className="holder" style={{ background: '#ffffff', padding: '40px 0px' }}>
                <ForYou places={forYou} />
            </div>
            <Footer />
        </section>
    );
};

export default PlaceDetail;
