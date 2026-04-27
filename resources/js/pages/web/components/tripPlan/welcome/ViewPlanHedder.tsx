import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Download, Navigation, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export const ViewPlanHedder = ({ data }: { data: any }) => {
    const { props } = usePage<any>();
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const url = props.flash?.pdf_url;
        if (url && isDownloading) {
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Trip-Plan-${data.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            setIsDownloading(false);
        }
    }, [props.flash?.pdf_url]);

    const handleExportPDF = () => {
        setIsDownloading(true);
        router.post(
            route('trip.plan.export', data.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    
                },
                onError: (err) => {
                    console.error('Export Error:', err);
                    setIsDownloading(false);
                },
            },
        );
    };
    return (
        <header className="trip_view_header">
            <div className="header_top">
                <div className="left_side">
                    <Link href={route('trip.plan')} className="back_icon_btn">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="trip_info">
                        <span className="breadcrumb">My Plans / Trip Details</span>
                        <h1 className="trip_main_title">{data.title}</h1>
                    </div>
                </div>

                <div className="right_side">
                    <button className="secondary_btn" onClick={handleExportPDF}>
                        <Download size={13} />
                        Export PDF
                    </button>
                    <button className="primary_btn">
                        <Pencil size={13} />
                        <Link href={route('trip.plan.create', data.id)}>Edit Plan</Link>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default ViewPlanHedder;
