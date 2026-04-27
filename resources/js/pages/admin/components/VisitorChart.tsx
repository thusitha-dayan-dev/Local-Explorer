import { faBorderAll, faChartPie, faChartSimple, faDownload, faGrip, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { route } from 'ziggy-js';
import emptyImage from '../../../../assect/emptychart.svg';
import emptypip from '../../../../assect/nodata-pip.svg';
import notDataImage from '../../../../assect/not_found.svg';

interface dataProps {
    data: { name: string; count: number }[];
    placeCount: number;
}

const CategoryAnalytics = ({ data, placeCount }: dataProps) => {
    const [hasChartData, setHasChartData] = useState(false);

    useEffect(() => {
        if (data.length > 0) {
            setHasChartData(true);
        } else setHasChartData(false);
    }, [data]);

    const hasData = data && data.length > 0;
    const chartData = hasData ? data : [];
    const categories = chartData.map((item) => item.name);
    const seriesData = chartData.map((item) => item.count);
    const barOptions: any = {
        chart: {
            id: 'category-bar',
            toolbar: { show: false },
            parentHeightOffset: 0,
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '40%',
                distributed: true,
            },
        },
        dataLabels: { enabled: false },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B'],
        xaxis: {
            categories: categories,
            axisBorder: {
                show: true,
                color: '#cbd5e1',
                height: 1,
                width: '100%',
            },
            axisTicks: { show: false },
            labels: {
                style: { colors: '#64748b', fontSize: '12px' },
            },
        },
        yaxis: {
            axisBorder: {
                show: true,
                color: '#cbd5e1',
                width: 1,
            },
            labels: {
                style: { colors: '#94a3b8' },
            },
        },
        grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 4,
            padding: {
                left: 10,
            },
        },
        legend: { show: false },
    };

    const donutOptions: any = {
        chart: { id: 'category-donut' },
        labels: categories,
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B'],
        stroke: { show: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        total: { show: true, label: 'Total' },
                    },
                },
            },
        },
        legend: { position: 'bottom' },
        dataLabels: { enabled: false },
    };

    return (
        <section className="chart_layout_main">
            <div className="chart">
                <div className="chart_hedder">
                    <h2 className="chart_hedder">
                        <FontAwesomeIcon icon={faChartSimple} className="icon" />
                        Category Comparison
                    </h2>
                    <span className="title">Breakdown of places by category counts</span>
                </div>
                {!hasChartData ? (
                    <div className="empty-state">
                        <img src={notDataImage} alt="No Data" />
                        <h3>No Categories Found</h3>
                        <p>It looks like you haven't added any categories yet. Start by creating one!</p>
                        <Link className="add-btn-primary" style={{ textDecoration: 'none' }} href={route('admin.manage.category')}>
                            + Add Your First Category
                        </Link>
                    </div>
                ) : (
                    <>
                        {placeCount <= 0 ? (
                            <div className="empty-state">
                                <img src={notDataImage} alt="No Data" />
                                <h3>No Places Found</h3>
                                <p>It looks like you haven't added any Places yet. Start by creating one!</p>
                                <Link className="add-btn-primary" style={{ textDecoration: 'none' }} href={route('admin.add.place')}>
                                    + Add Your First Places
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="layer">
                                    <Chart options={barOptions} series={[{ name: 'Places', data: seriesData }]} type="bar" height={300} />
                                </div>
                                <div className="chart_footer">
                                    <span className="message">
                                        <FontAwesomeIcon icon={faInfoCircle} className="icon" />
                                        y-axis: Places counts
                                    </span>
                                    
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
            <div className="chart">
                <div className="chart_hedder">
                    <h2 className="chart_hedder">
                        <FontAwesomeIcon icon={faChartPie} className="icon" />
                        Distribution
                    </h2>
                    <span className="title">Share of each destination type</span>
                </div>
                {!hasChartData ? (
                    <div className="empty-state">
                        <img src={emptypip} alt="No Data" />
                        <h3>No Places Found</h3>
                        <p>It looks like you haven't added any places yet. Start by creating one!</p>
                        <Link className="add-btn-primary" style={{ textDecoration: 'none' }} href={route('admin.add.place')}>
                            + Add Your First Category
                        </Link>
                    </div>
                ) : (
                    <>
                        {placeCount <= 0 ? (
                            <div className="empty-state">
                                <img src={notDataImage} alt="No Data" />
                                <h3>No Places Found</h3>
                                <p>It looks like you haven't added any Places yet. Start by creating one!</p>
                                <Link className="add-btn-primary" style={{ textDecoration: 'none' }} href={route('admin.add.place')}>
                                    + Add Your First Places
                                </Link>
                            </div>
                        ) : (
                            <div className="layer">
                                <Chart options={donutOptions} series={seriesData} type="donut" height={300} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default CategoryAnalytics;
