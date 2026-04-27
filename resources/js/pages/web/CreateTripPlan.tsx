import { Head, useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import Footer from './components/welcome/Footer';
import { Place, TripPlan, User } from '@/types/web';
import Nav from './components/welcome/Nav';
import { CreatePlanBasic } from './components/tripPlan/basic/CreatePlanBasic';
import { route } from 'ziggy-js';

interface PageProps {
    userInfore: User;
    plan: TripPlan;
}

export const CreateTripPlan = ({ userInfore, plan }: PageProps) => {
    const basikForm = useForm({
        id: plan?.id ?? null,
        title: plan?.title ?? '',
        travel_date: plan?.travel_date ?? '',
        travel_mode: plan?.travel_mode ?? '',
    });

    const handeldraft = (type: string) => {
        basikForm.post(route('trip.plan.save.draft'), {
            forceFormData: true,
            preserveState: true,
            onSuccess: () => {
            },
            onError: (errors) => {
                console.log('Errors:', errors);
            },
        });
    };

    return (
        <main className="main_content" style={{ margin: '0', padding: '0' }}>
            <Head title="Trip Plan Create" />
            <div className="main_layout" style={{ margin: '0', padding: '0' }}>
                <Nav index={3} userInfore={userInfore} />
                <CreatePlanBasic data={basikForm.data} setData={basikForm.setData} errors={basikForm.errors} onDraft={handeldraft} />
            </div>
        </main>
    );
};

export default CreateTripPlan;
