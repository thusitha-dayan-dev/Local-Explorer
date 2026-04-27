import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faAngleRight, faDownload, faFolderTree, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { getDateTime } from '@/lib/utils';
import type { ServiceType } from '@/types/web';
import notDataImage from '../../../assect/not_found.svg';
import serachImage from '../../../assect/search.svg';
import SideNavigation from './components/SideNavigation';
import AddServiceTypeModel from './model/AddServiceTypeModel';
import DeleteConfirmationModal from './model/DeleteModel';
import DynamicSuccessModal from './model/DynamicSuccessModal';

interface PageProps {
    serviceType: ServiceType[];
    count: number;
    filters: {
        search?: string;
        sort?: string;
    };
}

const ManageServiceType = ({ serviceType, count, filters }: PageProps) => {
    const { flash } = usePage().props as any;

    const [isSelecterOpen, setIsSelecterOpen] = useState({
        type: false,
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.custom_drop_holder')) {
                setIsSelecterOpen({ ...isSelecterOpen, type: false });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [lastUpdate, setLastUplate] = useState('');

    useEffect(() => {
        if (serviceType && serviceType.length > 0) {
            const latest = new Date(Math.max(...serviceType.map((c) => new Date(String(c.updated_at)).getTime())));
            setLastUplate(latest.toISOString().split('T')[0]);
        }
    }, [serviceType]);

    const [value, setValue] = useState({
        oderBy: filters.sort || 'Newest First',
        name: filters.search || '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const { data, setData, post, reset, processing, errors, setError, clearErrors } = useForm({
        service_type_name: '',
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        post('/admin/create-service-type', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                setIsSuccessOpen(true);
            },
        });
    };

    const [isEditeModelOpen, setIsEditeModelOpen] = useState(false);

    const editForm = useForm({
        id: '',
        service_type_name: '',
    });

    const onEdite = (service: any) => {
        editForm.setData({
            id: service.id,
            service_type_name: service.service_type_name,
        });
        setIsEditeModelOpen(true);
    };

    const handelEdite = (e: any) => {
        e.preventDefault();
        editForm.put(`/admin/manage-service-type/${editForm.data.id}`, {
            onSuccess: () => {
                setIsEditeModelOpen(false);
                editForm.reset();
                setIsSuccessOpen(true);
            },
        });
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [deleteType, setDeleteType] = useState<'main' | 'sub' | 'service'>('main');

    const openDeleteModal = (item: any, type: 'main' | 'sub' | 'service') => {
        setSelectedItem(item);
        setDeleteType(type);
        setIsDeleteModalOpen(true);
    };

    const { delete: destroy } = useForm();

    const handleConfirmDelete = () => {
        if (!selectedItem) return;

        destroy(`/admin/delete-service-type/${selectedItem.id}/`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setIsSuccessOpen(true);
            },
            preserveScroll: true,
        });
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(
                '/admin/manage-service-types',
                {
                    search: value.name,
                    sort: value.oderBy,
                },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [value]);

    return (
        <section className="admin_dashboard_main">
            <Head title="Manage Service Type" />
            <SideNavigation />
            <main className="page_main_content_layout">
                <section className="page_content_layout">
                    <div className="page_hedder">
                        <div className="page_nav">
                            <h1>Manage Service Type</h1>
                            <div className="nav">
                                <Link href={'/admin/dashboard'} className="link">
                                    Dashboard
                                </Link>
                                <FontAwesomeIcon icon={faAngleRight} className="icon" />
                                <span className="name">Manage Service Type</span>
                            </div>
                        </div>
                        <div className="grop_button">
                            <button className="btn sub" onClick={() => setIsModalOpen(true)}>
                                Add Service Type
                            </button>
                        </div>
                    </div>
                    <div className="page_content">
                        <div className="manage_category_group">
                            <div className="data_hedder">
                                <h1>
                                    <FontAwesomeIcon icon={faFolderTree} className="icon" />
                                    Service Type Data
                                </h1>
                                <div className="filter">
                                    <input
                                        type="search"
                                        name="filter"
                                        id="filter"
                                        placeholder="Find Within Service Type Name"
                                        className="main_search"
                                        value={value.name}
                                        onChange={(e) => {
                                            setValue({ ...value, name: e.target.value });
                                        }}
                                    />

                                    <div className="custom_drop_holder">
                                        <input
                                            type="text"
                                            name="typedsc"
                                            id="typedsc"
                                            className="main_search sub"
                                            placeholder="Newest First"
                                            readOnly={true}
                                            onClick={() => {
                                                setIsSelecterOpen((prev) => ({ ...prev, type: !prev.type }));
                                            }}
                                            value={value.oderBy}
                                        />
                                        {isSelecterOpen.type && (
                                            <ul className="selector">
                                                <li
                                                    onClick={() => {
                                                        setValue({ ...value, oderBy: 'Newest First' });
                                                        setIsSelecterOpen({ ...isSelecterOpen, type: false });
                                                    }}
                                                >
                                                    Newest First
                                                </li>
                                                <li
                                                    onClick={() => {
                                                        setValue({ ...value, oderBy: 'Oldest First' });
                                                        setIsSelecterOpen({ ...isSelecterOpen, type: false });
                                                    }}
                                                >
                                                    Oldest First
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {serviceType.length <= 0 ? (
                                value.name ? (
                                    <div className="empty-state">
                                        <img src={serachImage} alt="No Data" />
                                        <h3>No matches found!</h3>
                                        <p>It looks like we don't have any service type that match your current search. Try clearing the filters!</p>
                                        <button
                                            onClick={() => setValue({ ...value, name: '' })}
                                            className="add-btn-primary"
                                            style={{ background: '#64748b' }}
                                        >
                                            Clear Search
                                        </button>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <img src={notDataImage} alt="No Data" />
                                        <h3>No Categories Found</h3>
                                        <p>It looks like you haven't added any service type yet. Start by creating one!</p>
                                        <button onClick={() => setIsModalOpen(true)} className="add-btn-primary">
                                            + Add Your First Service Type
                                        </button>
                                    </div>
                                )
                            ) : (
                                <>
                                    <table className="category_table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Service Type Name</th>
                                                <th>Service Type</th>
                                                <th>Create At</th>
                                                <th>Update At</th>
                                                <th>Service Count</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {serviceType.map((cat) => (
                                                <React.Fragment key={cat.id}>
                                                    <tr className="main_row">
                                                        <td>{cat.id}</td>
                                                        <td>{cat.service_type_name}</td>
                                                        <td>
                                                            <span className="main">Nearby Service</span>
                                                        </td>
                                                        <td>{getDateTime(String(cat.created_at))}</td>
                                                        <td>{getDateTime(String(cat.updated_at))}</td>
                                                        <td>
                                                            <span className="row_input">{`${cat.nearby_service_count || '0'} Services`}</span>
                                                        </td>
                                                        <td>
                                                            <div className="button_group">
                                                                <FontAwesomeIcon
                                                                    icon={faTrashCan}
                                                                    className="icon delete"
                                                                    onClick={() => openDeleteModal(cat, 'service')}
                                                                />
                                                                <FontAwesomeIcon icon={faPencil} className="icon" onClick={() => onEdite(cat)} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="table_footer">
                                        <span className="title">{`Last update: ${lastUpdate}`}</span>
                                        <span className="title">{`Service Type count: ${count}`}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleConfirmDelete}
                        item={selectedItem}
                        type={deleteType}
                    />
                    <AddServiceTypeModel
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        data={data}
                        errors={errors}
                        setData={setData}
                        onSubmit={handleSubmit}
                    />
                    <AddServiceTypeModel
                        isOpen={isEditeModelOpen}
                        onClose={() => setIsEditeModelOpen(false)}
                        data={editForm.data}
                        errors={editForm.errors}
                        setData={editForm.setData}
                        onSubmit={handelEdite}
                    />

                    <DynamicSuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} message={flash.success} title="Success!" />
                </section>
            </main>
        </section>
    );
};

export default ManageServiceType;
