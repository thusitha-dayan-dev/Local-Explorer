import { Head, Link, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import SideNavigation from './components/SideNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faCheck, faBriefcase, faMapMarkerAlt, faStar, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ReviewPaginate } from '@/types/admin';
import NoReviewYey from './model/NoReviewYey';
import NosearchReview from './model/NosearchReview';
import ConfirmationModal from './model/ConfirmationModal';
import { route } from 'ziggy-js';
import DynamicSuccessModal from './model/DynamicSuccessModal';

interface PageProps {
    reviews: any;
    filters: {
        search: string;
        type: string;
        order: string;
    }
}

const reviewType = [
    { id: 1, key: '', value: 'All Reviews' },
    { id: 2, key: 'approved', value: 'Approved' },
    { id: 3, key: 'rejected', value: 'Rejected' }
];

const OrderBy = [
    { id: 1, key: 'desc', value: 'Newest First' },
    { id: 2, key: 'asc', value: 'Oldest First' }
];

const ManageServiceReviews = ({ reviews, filters }: PageProps) => {
    const [filter, setFilter] = useState({
        search: filters.search || '',
        type: filters.type || '',
        order: filters.order || '',
    });

    const isFiltering = filter.search.length > 0 || filter.type.length > 0;
    const [activeBtn, setActiveBtn] = useState(1);
    const [orederBy, setOrdereBy] = useState(1);
    const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'approve' | 'reject' | 'delete';
        targetId: number | null;
    }>({ isOpen: false, type: 'approve', targetId: null });

    useEffect(() => {
        const fBtn = reviewType.find((rev) => rev.key === filter.type)?.id;
        setActiveBtn(fBtn || 1);
        const oBtn = OrderBy.find((btn) => btn.key === filter.order)?.id;
        setOrdereBy(oBtn || 1);
    }, [filter.type, filter.order]);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('admin.manage.services.review'), filter, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [filter]);

    const handleAction = (id: any, type: 'approve' | 'reject' | 'delete') => {
        if (!id) return;

        if (type === 'approve') {
            router.post(route('admin.approve.service.review', id), {}, {
                onSuccess: () => {
                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                    setSuccessModal({ isOpen: true, title: 'Success', message: 'Review Approved successfully!' });
                },
                onError: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
                preserveScroll: true,
            });
        }

        if (type === 'reject') {
            router.post(route('admin.reject.service.review', id), {}, {
                onSuccess: () => {
                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                    setSuccessModal({ isOpen: true, title: 'Success', message: 'Review Rejected successfully!' });
                },
                onError: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
                preserveScroll: true,
            });
        }

        if (type === 'delete') {
            router.delete(route('admin.delete.service.review', id), {
                onSuccess: () => {
                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                    setSuccessModal({ isOpen: true, title: 'Success', message: 'Review Deleted successfully!' });
                },
                onError: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
                preserveScroll: true,
            });
        }
    }

    return (
        <section className="admin_dashboard_main">
            <Head title="Manage Service Reviews" />
            <SideNavigation />
            <main className="content_page">
                <section className="content">
                    <div className="hedd">
                        <div className="main_nav">
                            <h1>Manage Service Reviews</h1>
                            <div className="link_gorup">
                                <Link className="link" href={'/admin/dashboard'}>Dashboard</Link>
                                <FontAwesomeIcon icon={faAngleRight} className="icon" />
                                <span>Manage Service Reviews</span>
                            </div>
                        </div>
                    </div>

                    <div className="main_page_content">
                        <div className="revew_main_layout">
                            <div className="filter_group">
                                <h1><FontAwesomeIcon icon={faBriefcase} className='icon' /> Service Reviews</h1>
                                <div className="sider_filter">
                                    <input type="search" placeholder='Search service review...' className='search' value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })} />
                                    <div className="button_holder">
                                        {reviewType.map((btn) => (
                                            <button key={btn.id} className={`btn ${activeBtn === btn.id ? 'active' : ''}`} onClick={() => setFilter({ ...filter, type: btn.key })}>{btn.value}</button>
                                        ))}
                                    </div>
                                    <div className="button_holder">
                                        {OrderBy.map((btn) => (
                                            <button key={btn.id} onClick={() => setFilter({ ...filter, order: btn.key })} className={`btn ${orederBy === btn.id ? 'active' : ''}`}>{btn.value}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="review_layout">
                                {reviews.data.length <= 0 ? (
                                    isFiltering ? <NosearchReview onClear={() => setFilter({ search: '', type: '', order: '' })} /> : <NoReviewYey />
                                ) : (
                                    <div className="review_table_container">
                                        <div className="review_table_wrapper">
                                            <table className="review_table">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>User Details</th>
                                                        <th>Service & Review</th>
                                                        <th>Gallery</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {reviews.data.map((rev: any) => (
                                                        <tr key={rev.id}>
                                                            <td className="id_col">#{rev.id}</td>
                                                            <td>
                                                                <div className="user_profile_box">
                                                                    <div className="user_meta">
                                                                        <span className="name">{rev.user.full_name}</span>
                                                                        <span className="email">{rev.user.email}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="review_info_col">
                                                                    <span className="place_name_badge">
                                                                        <FontAwesomeIcon icon={faBriefcase} /> {rev.nearby_service?.service_name || 'Unknown Service'}
                                                                    </span>
                                                                    <h4 className="title_text">{rev.title}</h4>
                                                                    <p className="message_text">{rev.message}</p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="media_grid_layout">
                                                                    {rev.nearby_service_review_media?.length > 0 ? (
                                                                        rev.nearby_service_review_media.slice(0, 4).map((img: any, idx: number) => (
                                                                            <div key={idx} className="grid_item">
                                                                                <img src={`/storage/${img.media_path}`} alt="review" />
                                                                            </div>
                                                                        ))
                                                                    ) : <span className="no_img">No Media</span>}
                                                                </div>
                                                            </td>
                                                            <td><span className={`status_pill ${rev.status.toLowerCase()}`}>{rev.status}</span></td>
                                                            <td>
                                                                <div className="action_btn_wrap">
                                                                    <button className="btn approve" onClick={() => setModalConfig({ isOpen: true, type: 'approve', targetId: rev.id })}><FontAwesomeIcon icon={faCheck} /></button>
                                                                    <button className="btn reject" onClick={() => setModalConfig({ isOpen: true, type: 'reject', targetId: rev.id })}><FontAwesomeIcon icon={faXmark} /></button>
                                                                    <button className="btn delete" onClick={() => setModalConfig({ isOpen: true, type: 'delete', targetId: rev.id })}><FontAwesomeIcon icon={faTrashCan} /></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="paginate_data">
                                            {reviews.prev_page_url ? (
                                                <Link
                                                    href={reviews.prev_page_url}
                                                    data={filter}
                                                    preserveScroll
                                                    className="link"
                                                >
                                                    <FontAwesomeIcon icon={faAngleLeft} />
                                                </Link>
                                            ) : (
                                                <span className="link disabled">
                                                    <FontAwesomeIcon icon={faAngleLeft} />
                                                </span>
                                            )}

                                            <div className="other_link">
                                                {reviews.links.map((link: { url: any; active: any; label: any; }, index: React.Key | null | undefined) => {

                                                    if (index !== 0 && index !== reviews.links.length - 1) {
                                                        return (
                                                            <Link
                                                                key={index}
                                                                href={link.url || '#'}
                                                                data={filter}
                                                                preserveScroll
                                                                className={`link ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>

                                            {reviews.next_page_url ? (
                                                <Link
                                                    href={reviews.next_page_url}
                                                    data={filter}
                                                    preserveScroll
                                                    className="link"
                                                >
                                                    <FontAwesomeIcon icon={faAngleRight} />
                                                </Link>
                                            ) : (
                                                <span className="link disabled">
                                                    <FontAwesomeIcon icon={faAngleRight} />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <DynamicSuccessModal isOpen={successModal.isOpen} onClose={() => setSuccessModal({ ...successModal, isOpen: false })} title={successModal.title} message={successModal.message} />
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                type={modalConfig.type}
                title={modalConfig.type === 'delete' ? 'Delete Service Review' : 'Confirm Action'}
                message={`Are you sure you want to ${modalConfig.type} this service review?`}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={() => handleAction(modalConfig.targetId, modalConfig.type)}
            />
        </section>
    );
};

export default ManageServiceReviews;
