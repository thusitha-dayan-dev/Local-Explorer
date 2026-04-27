import { Head } from '@inertiajs/react';
import ViewPlan from './components/tripPlan/welcome/ViewPlan';
import ViewPlanHedder from './components/tripPlan/welcome/ViewPlanHedder';

interface PageProps {
    tripPlan: any;
    userInfore: any;
}

export const ShowTripPlan = ({ tripPlan, userInfore }: PageProps) => {
    return (
        <main className="main_content">
            <Head title={`Trip Plan ${tripPlan.title}`} />
            <ViewPlanHedder data={tripPlan} />
            <ViewPlan tripPlan={tripPlan} />
        </main>
    );
};

export default ShowTripPlan;
