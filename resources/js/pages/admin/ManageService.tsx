import { faEye, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faAngleLeft, faAngleRight, faDownload, faLocationDot, faPen, faPlus, faShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';
import { getDateTime } from '@/lib/utils';
import type { ServicePaginate } from '@/types/admin';
import type { ServiceType } from '@/types/web';
import notDataImage from '../../../assect/not_found.svg';
import serachImage from '../../../assect/search.svg';
import SideNavigation from './components/SideNavigation';
import DeletePlaceModel from './model/DeletePlaceModel';
import DynamicSuccessModal from './model/DynamicSuccessModal';

interface propsData {
    services: ServicePaginate;
    serviceTypes: ServiceType[];
    filters: {
        search?: string;
        category?: number;
        subCategory?: number;
        sort?: string;
    } | null;
}

interface FilterValue {
    search: string;
    category: number | null;
    sort: string;
}

const ManageService = ({ services, serviceTypes, filters }: propsData) => {
    const [isFilterTypeOpen, setIsFilterTypeOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropDownOpen] = useState(false);
    const [lastUpdate, setLastUpdate] = useState('');
    const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);
    const [seletedItem, setSelectedItem] = useState<{ id: number; service_name: string | null }>();
    const [isSuccessModelOpen, setIsSuccessModelOpen] = useState(false);
    const { flash } = usePage().props as any;

    const pageNumbers = [];
    for (let i = 1; i <= services.last_page; i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        if (flash.success) {
            setIsSuccessModelOpen(true);
        }
    }, [flash]);

    useEffect(() => {
        if (services.data && services.data.length > 0) {
            const latest = new Date(Math.max(...services.data.map((p) => new Date(p.updated_at).getTime())));
            setLastUpdate(latest.toISOString().split('T')[0]);
        }
    }, [services]);

    const [value, setValue] = useState<FilterValue>({
        search: filters?.search || '',
        category: filters?.category ? Number(filters.category) : null,
        sort: filters?.sort || 'desc',
    });

    const isFirstRender = useRef(true);
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (isFirstRender.current) {
                isFirstRender.current = false;
                return;
            }
            router.get(
                '/admin/manage-service',
                {
                    search: value.search,
                    category: value.category,
                    sort: value.sort,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [value]);

    const sort = [
        {
            key: 'desc',
            values: 'Newest First',
        },
        {
            key: 'asc',
            values: 'Oldest First',
        },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.custom_droper')) {
                setIsCategoryDropDownOpen(false);
                setIsFilterTypeOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const openDeleteModal = (id: number, service_name: string) => {
        setSelectedItem({ id, service_name });
        setIsDeleteModelOpen(true);
    };

    const { delete: destroy } = useForm();


    const handelDelete = () => {
        if (!seletedItem) return;

        destroy(`/admin/delete-service/${seletedItem.id}`, {
            onSuccess: () => {
                setIsDeleteModelOpen(false);
                setIsSuccessModelOpen(true);
            },
            preserveScroll: true,
        });
    };

    const downloadPDF = () => {
        const url = route('admin.download.pdf', { type: 'services' });
        window.open(url, '_blank');
    };

    return (
        <section className="admin_dashboard_main">
            <SideNavigation />
            <Head title="Manage Services" />
            <main className="content_page">
                <section className="content">
                    <div className="hedd">
                        <div className="main_nav">
                            <h1>Manage Nearby Service</h1>
                            <div className="link_gorup">
                                <Link className="link" href={'/admin/dashboard'}>
                                    Dashboard
                                </Link>
                                <FontAwesomeIcon icon={faAngleRight} className="icon" />
                                <span>Manage Nearby Service</span>
                            </div>
                        </div>
                        <div className="right_content">
                            <div className="serch_bar_layout">
                                <input
                                    type="search"
                                    name="placeSearch"
                                    id="placeSearch"
                                    placeholder="Fiend YourNearby Service"
                                    onChange={(e) => setValue({ ...value, search: e.target.value })}
                                    value={value.search}
                                />
                            </div>
                            <div className="short_cut">
                                <Link className="link" href={'/admin/add-service'}>
                                    <FontAwesomeIcon icon={faPlus} className="icon" />
                                    Add New Service
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="main_page_content">
                        <section className="manage_place_table">
                            <div className="table_hedder">
                                <h1>
                                    <FontAwesomeIcon icon={faShield} className="icon" />
                                    Nearby Service data
                                </h1>
                                <div className="filter">
                                    <div className="filter_group">
                                        <div className="custom_droper">
                                            <input
                                                type="text"
                                                name="categoryBy"
                                                id="categoryBy"
                                                placeholder="All Category"
                                                readOnly={true}
                                                value={serviceTypes.find((data) => data.id === value.category)?.service_type_name || ''}
                                                onClick={() =>
                                                    isCategoryDropdownOpen ? setIsCategoryDropDownOpen(false) : setIsCategoryDropDownOpen(true)
                                                }
                                            />

                                            {isCategoryDropdownOpen && (
                                                <ul className="selector">
                                                    {serviceTypes.length <= 0 ? (
                                                        <li style={{ color: 'red' }} onClick={() => setIsCategoryDropDownOpen(false)}>
                                                            Service Type Not found !
                                                        </li>
                                                    ) : (
                                                        <li
                                                            onClick={() => {
                                                                setIsCategoryDropDownOpen(false);
                                                                setValue({ ...value, category: null });
                                                            }}
                                                        >
                                                            All Service Type
                                                        </li>
                                                    )}
                                                    {serviceTypes.map((sev) => (
                                                        <li
                                                            key={sev.id}
                                                            onClick={() => {
                                                                isCategoryDropdownOpen
                                                                    ? setIsCategoryDropDownOpen(false)
                                                                    : setIsCategoryDropDownOpen(false);
                                                                setValue({ ...value, category: sev.id });
                                                            }}
                                                        >
                                                            {sev.service_type_name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <div className="custom_droper">
                                            <input
                                                type="text"
                                                name="ascOrDsc"
                                                value={sort.find((data) => value.sort === data.key)?.values || ''}
                                                id="ascOrDsc"
                                                placeholder="Select filter type"
                                                readOnly={true}
                                                className="sub_input"
                                                onClick={() => {
                                                    isFilterTypeOpen ? setIsFilterTypeOpen(false) : setIsFilterTypeOpen(true);
                                                }}
                                            />
                                            {isFilterTypeOpen && (
                                                <ul className="selector">
                                                    {sort.map((data) => (
                                                        <li
                                                            key={data.key}
                                                            onClick={() => {
                                                                setValue({ ...value, sort: data.key });
                                                                setIsFilterTypeOpen(false);
                                                            }}
                                                        >
                                                            {data.values}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                    <button className="downlaod" onClick={downloadPDF}>
                                        <FontAwesomeIcon icon={faDownload} className="icon" />
                                        Download Data
                                    </button>
                                </div>
                            </div>

                            {services.data.length <= 0 ? (
                                value.search || value.category ? (
                                    <div className="empty-state">
                                        <img src={serachImage} alt="No Data" />
                                        <h3>No matches found!</h3>
                                        <p>
                                            It looks like we don't have any Nearby Service that match your current search. Try clearing the filters!
                                        </p>
                                        <button
                                            onClick={() => setValue({ ...value, search: '', category: null })}
                                            className="add-btn-primary"
                                            style={{ background: '#64748b' }}
                                        >
                                            Clear Search
                                        </button>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <img src={notDataImage} alt="No Data" />
                                        <h3>No Nearby Serivice Found</h3>
                                        <p>It looks like you haven't added any nearby service yet. Start by creating one!</p>
                                        <Link className="add-btn-primary" href={route('admin.add.service')}>
                                            Add New Service
                                        </Link>
                                    </div>
                                )
                            ) : (
                                <>
                                    <table className="place_table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Service Name</th>
                                                <th>Helight</th>
                                                <th>Nearby Service Type</th>
                                                <th>Selections</th>
                                                <th>Main Image</th>
                                                <th>Create & Update at</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {services.data.map((sev) => (
                                                <tr key={sev.id}>
                                                    <td>{sev.id}</td>
                                                    <td>
                                                        <span className="name">{sev.service_name}</span>
                                                    </td>
                                                    <td>
                                                        <span className="desc">{sev.short_description}</span>
                                                    </td>
                                                    <td>
                                                        <span>{sev.service_type.service_type_name}</span>
                                                    </td>
                                                    <td>
                                                        <span className="selection">{sev.selection_count} Users</span>
                                                    </td>
                                                    <td>
                                                        <img src={`/storage/${sev.main_image_path}`} alt={sev.service_name} />
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                            <span style={{ fontWeight: '400' }}>
                                                                Create :{' '}
                                                                <b style={{ fontSize: '0.9rem', fontWeight: '600' }}>{getDateTime(sev.created_at)}</b>
                                                            </span>
                                                            <span style={{ fontWeight: '400' }}>
                                                                Update :{' '}
                                                                <b style={{ fontSize: '0.9rem', fontWeight: '600' }}>{getDateTime(sev.updated_at)}</b>
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="action">
                                                            <Link className="icon" href={`/admin/edit-service/${sev.id}/${sev.slug}`}>
                                                                <FontAwesomeIcon icon={faPen} className="icon" />
                                                            </Link>
                                                            <FontAwesomeIcon
                                                                icon={faTrashCan}
                                                                className="icon delete"
                                                                style={{ color: 'red' }}
                                                                onClick={() => openDeleteModal(sev.id, sev.service_name)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="table_footer">
                                        <div className="all">
                                            <span>
                                                Last update: <span className="helight">{lastUpdate}</span>
                                            </span>
                                        </div>
                                        <div className="paginate_data">
                                            {services.prev_page_url == null ? (
                                                <span className="link desable">
                                                    <FontAwesomeIcon icon={faAngleLeft} />
                                                </span>
                                            ) : (
                                                <Link href={`${services.prev_page_url}`} className="link">
                                                    <FontAwesomeIcon icon={faAngleLeft} />
                                                </Link>
                                            )}
                                            <div className="other_link">
                                                {pageNumbers.map((nb) => (
                                                    <Link
                                                        key={nb}
                                                        href={route('admin.manage.place', { ...filters, page: nb })}
                                                        className={`link ${nb == services.current_page ? 'active' : ''}`}
                                                    >
                                                        {nb}
                                                    </Link>
                                                ))}
                                            </div>
                                            {services.next_page_url == null ? (
                                                <span className="link desable">
                                                    <FontAwesomeIcon icon={faAngleRight} />
                                                </span>
                                            ) : (
                                                <Link href={`${services.next_page_url}`} className="link">
                                                    <FontAwesomeIcon icon={faAngleRight} />
                                                </Link>
                                            )}
                                        </div>
                                        <div className="all_data">
                                            <span>
                                                All Nearby Service: <span className="helight">{services.total} Servicess</span>
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </section>
                    </div>
                    <DeletePlaceModel
                        isOpen={isDeleteModelOpen}
                        onClose={() => setIsDeleteModelOpen(false)}
                        onConfirm={handelDelete}
                        seletedItem={seletedItem}
                    />
                    <DynamicSuccessModal
                        isOpen={isSuccessModelOpen}
                        onClose={() => setIsSuccessModelOpen(false)}
                        message={flash.success}
                        title="Success!"
                    />
                </section>
            </main>
        </section>
    );
};

export default ManageService;
