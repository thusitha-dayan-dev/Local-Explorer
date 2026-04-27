import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import Content from './components/Content';
import SideNavigation from './components/SideNavigation';

interface props {
    email: string;
    CategoryChartData: { name: string; count: number }[];
    placesCount: number;
    usersCount: number;
    reviewsCount: number;
    topPlace: [];
    auth: {
        user: any;
    };
}

const Dashboard = ({ CategoryChartData, placesCount, usersCount, reviewsCount, topPlace, auth }: props) => {
    return (
        <section className="admin_dashboard_main">
            <Head title="Admin Dashboard" />
            <SideNavigation />
            <Content user={auth.user} chartData={CategoryChartData} PlaceCount={placesCount} cardData={[usersCount, reviewsCount]} place={topPlace} />
        </section>
    );
};

export default Dashboard;
