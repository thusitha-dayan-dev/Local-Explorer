import { Head, Link, router } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import SideNavigation from './components/SideNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faCheck, faMapMarkerAlt, faPlus, faStar, faTimes, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ReviewPaginate } from '@/types/admin';
import NoReviews from '../web/loding/NoReviews';
import NoReviewYey from './model/NoReviewYey';
import NosearchReview from './model/NosearchReview';
import ConfirmationModal from './model/ConfirmationModal';
import { route } from 'ziggy-js';
import DynamicSuccessModal from './model/DynamicSuccessModal';

interface PageProps {
    reviews: ReviewPaginate;
    filters: {
        search: string;
        type: string;
        order: string;
    }
}

const reviewType = [
    {
        id: 1,
        key: '',
        value: 'All Reviews',
    },
    {
        id: 2,
        key: 'approved',
        value: 'Approved'
    },
    {
        id: 3,
        key: 'rejected',
        value: 'Rejected'
    }
];

const OrderBy = [
    {
        id: 1,
        key: 'desc',
        value: 'Newest First',
    },
    {
        id: 2,
        key: 'asc',
        value: 'Oldest First',
    }
];

const ManageReviews = ({ reviews, filters }: PageProps) => {

    const [filter, setFilter] = useState({
        search: filters.search ||  '',
        type: filters.type ||  '',
        order: filters.order || '',
    });

    const isFiltering = filter.search.length > 0 || filter.type.length > 0;
    const [activeBtn, setActiveBtn] = useState(1)
    const [orederBy, setOrdereBy] = useState(1);
    const [successModal, setSuccessModal] = useState({
        isOpen: false,
        title: '',
        message: '',
    });

    useEffect(()=> {
        const filterBtn = reviewType.find((rev) => rev.key === filter.type)?.id;

        if (filterBtn != activeBtn) {
            setActiveBtn(filterBtn || 1);
        }
    }, [filter.type, activeBtn]);

    useEffect(()=> {
        const activBtn = OrderBy.find((btn) => btn.key === filter.order)?.id;

        if (activBtn != orederBy) {
            setOrdereBy(activBtn || 1);
        }
    }, [filter.order, orederBy])

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'approve' | 'reject' | 'delete';
        targetId: number | null;
    }>({
        isOpen: false,
        type: 'approve',
        targetId: null
    });

    const openModal = (id: number, actionType: 'approve' | 'reject' | 'delete') => {
        setModalConfig({
            isOpen: true,
            type: actionType,
            targetId: id
        });
    };

    const handleAction = (id: any, type: 'approve' | 'reject' | 'delete') => {
        if (!id) return;

        if (type === 'approve') {

            router.post(route('admin.approve.review', id),
                {},
                {
                    onSuccess: () => {
                        setModalConfig({ ...modalConfig, isOpen: false });
                        console.log('success');
                    },
                    onError: (error: any) => {
                        setModalConfig({ ...modalConfig, isOpen: false });
                    },
                    preserveScroll: true,
                }
            );
        }

        if (type === 'delete') {

            router.delete(route('admin.delete.review', id),
                {
                    onSuccess: () => {
                        setModalConfig({ ...modalConfig, isOpen: false });
                        setSuccessModal({ ...successModal, title: 'Success', message: 'Review deleted successfully!', isOpen: true });
                    }, onError: () => {
                        setModalConfig({ ...modalConfig, isOpen: false });
                        console.log('error');
                    },
                    preserveScroll: true,
                });
        }

        if (type === 'reject') {

            router.post(route('admin.reject.review', id), {}, {
                onSuccess: () => {
                    setModalConfig({ ...modalConfig, isOpen: false });
                    setSuccessModal({ ...successModal, title: 'Success', message: 'Review Rejected successfully!', isOpen: true });
                },
                onError: (error: any) => {
                    setModalConfig({ ...modalConfig, isOpen: false });
                    console.log(error);
                }
            })
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('admin.manage.review'), {
                search: filter.search,
                type: filter.type,
                order: filter.order,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 500);

        return () => {
            clearTimeout(timer);
        }
    }, [filter])

    return <section className="admin_dashboard_main">
        <Head title="Manage Reviews" />
        <SideNavigation />
        <main className="content_page">
            <section className="content">
                <div className="hedd">
                    <div className="main_nav">
                        <h1>Manage Place Reviews</h1>
                        <div className="link_gorup">
                            <Link className="link" href={'/admin/dashboard'}>
                                Dashboard
                            </Link>
                            <FontAwesomeIcon icon={faAngleRight} className="icon" />
                            <span>Manage Place Reviews</span>
                        </div>
                    </div>
                </div>
                <div className="main_page_content">
                    <div className="revew_main_layout">
                        <div className="filter_group">
                            <h1>
                                <FontAwesomeIcon icon={faStar} className='icon' />
                                Place Reviews
                            </h1>
                            <div className="sider_filter">
                                <input type="search" id="search" placeholder='Search review title....' className='search' value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })} />
                                <div className="button_holder">
                                    {reviewType.map((btn) => (
                                        <button key={btn.id} className={`btn ${activeBtn === btn.id ? 'active' : ''}`} onClick={() => {
                                            setFilter({ ...filter, type: btn.key });
                                            setActiveBtn(btn.id);
                                        }}>{btn.value}</button>
                                    ))}
                                </div>
                                <div className="button_holder">
                                    {OrderBy.map((btn) => (
                                        <button key={btn.id} onClick={() => {
                                            setOrdereBy(btn.id);
                                            setFilter({ ...filter, order: btn.key });
                                        }} className={`btn ${orederBy === btn.id ? 'active' : ''}`}>{btn.value}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="review_layout">

                            {reviews.data.length <= 0 && isFiltering ? (
                                <NosearchReview onClear={() => {
                                    setFilter({ ...filter, search: '', type: '' });
                                    setActiveBtn(1);
                                }} />
                            ) : (
                                <>{reviews.data.length <= 0 ? (
                                    <><NoReviewYey /></>
                                ) : (
                                    <div className="review_table_container">
                                        <div className="review_table_wrapper">
                                            <table className="review_table">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>User Details</th>
                                                        <th>Review Info</th>
                                                        <th>Gallery</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {reviews.data.map((rev) => (
                                                        <tr key={rev.id}>
                                                            <td className="id_col">#{rev.id}</td>

                                                            <td>
                                                                <div className="user_profile_box">
                                                                    {rev.user.profile_image_path ? (
                                                                        <img src={`/storage/${rev.user.profile_image_path}`} alt="user" />
                                                                    ) : (
                                                                        <div className="temp_avatar">
                                                                            {rev.user.full_name.charAt(0).toUpperCase()}
                                                                        </div>
                                                                    )}
                                                                    <div className="user_meta">
                                                                        <span className="name">{rev.user.full_name}</span>
                                                                        <span className="email">{rev.user.email}</span>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                <div className="review_info_col">
                                                                    <span className="place_name_badge">
                                                                        <FontAwesomeIcon icon={faMapMarkerAlt} /> {rev.place?.place_name || 'Unknown Place'}
                                                                    </span>
                                                                    <h4 className="title_text">{rev.title}</h4>
                                                                    <p className="message_text">{rev.message}</p>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                <div className="media_grid_layout">
                                                                    {rev.place_review_media && rev.place_review_media.length > 0 ? (
                                                                        rev.place_review_media.slice(0, 4).map((img, idx) => (
                                                                            <div key={idx} className="grid_item">
                                                                                <img src={`/storage/${img.media_path}`} alt="review" />
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <span className="no_img">No Media</span>
                                                                    )}
                                                                </div>
                                                            </td>

                                                            <td>
                                                                <span className={`status_pill ${rev.status.toLowerCase()}`}>
                                                                    {rev.status}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <div className="action_btn_wrap">
                                                                    <button className="btn approve" onClick={() => openModal(rev.id, 'approve')} title="Approve"><FontAwesomeIcon icon={faCheck} /></button>
                                                                    <button className="btn reject" onClick={() => openModal(rev.id, 'reject')} title="Reject"><FontAwesomeIcon icon={faXmark} /></button>
                                                                    <button className="btn delete" onClick={() => openModal(rev.id, 'delete')} title="Delete"><FontAwesomeIcon icon={faTrashCan} /></button>
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
                                                {reviews.links.map((link, index) => {

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
                                )}</>
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
            title={
                modalConfig.type === 'approve' ? 'Approve Review' :
                    modalConfig.type === 'reject' ? 'Reject Review' : 'Delete Review'
            }
            message={
                modalConfig.type === 'delete'
                    ? 'Are you sure you want to permanently delete this review? This action cannot be undone.'
                    : `Are you sure you want to ${modalConfig.type} this user review?`
            }
            onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
            onConfirm={() => {
                handleAction(modalConfig.targetId, modalConfig.type);
            }}
        />

    </section>;
};

export default ManageReviews;
