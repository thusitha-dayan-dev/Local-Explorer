import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faAngleDown, faAngleRight, faDownload, faFolderTree, faGripLines, faL, faList, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { getDateTime } from '@/lib/utils';
import type { Category } from '@/types/web';
import notDataImage from '../../../assect/not_found.svg';
import serachImage from '../../../assect/search.svg';
import SideNavigation from './components/SideNavigation';
import AddCategoryModel from './model/AddCategoryModel';
import DeleteConfirmationModal from './model/DeleteModel';
import DynamicSuccessModal from './model/DynamicSuccessModal';
import EditeCategoryModel from './model/EditeCategoryModel';

interface PageProps {
    categories: Category[];
    count: { catCount: number; subCateCount: number };
    filters: {
        search?: string;
        sort?: string;
    };
}

const ManageCategory = ({ categories, count, filters }: PageProps) => {
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
        if (categories && categories.length > 0) {
            const latest = new Date(Math.max(...categories.map((c) => new Date(String(c.updated_at)).getTime())));
            setLastUplate(latest.toISOString().split('T')[0]);
        }
    }, [categories]);

    const [openRow, setOpenRow] = useState<number[]>([]);

    const toggleRow = (id: number) => {
        if (openRow.includes(id)) {
            setOpenRow(openRow.filter((rowId) => rowId !== id));
        } else {
            setOpenRow([...openRow, id]);
        }
    };

    const [value, setValue] = useState({
        oderBy: filters.sort || 'Newest First',
        name: filters.search || '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const { data, setData, post, reset, processing, errors, setError, clearErrors } = useForm({
        category_name: '',
        category_id: null,
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        post('/admin/create-category', {
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
        category_name: '',
        category_id: '',
    });

    const onEdite = (category: any) => {
        editForm.setData({
            id: category.id,
            category_name: category.category_name || category.sub_category_name,
            category_id: category.category_id,
        });
        setIsEditeModelOpen(true);
    };

    const handelEdite = (e: any) => {
        e.preventDefault();
        editForm.put(`/admin/manage-category/${editForm.data.id}`, {
            onSuccess: () => {
                setIsEditeModelOpen(false);
                editForm.reset();
                setIsSuccessOpen(true);
            },
        });
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [deleteType, setDeleteType] = useState<'main' | 'sub'>('main');

    const openDeleteModal = (item: any, type: 'main' | 'sub') => {
        setSelectedItem(item);
        setDeleteType(type);
        setIsDeleteModalOpen(true);
    };

    const { delete: destroy } = useForm();

    const handleConfirmDelete = () => {
        if (!selectedItem) return;

        destroy(`/admin/delete-category/${selectedItem.id}/${deleteType}`, {
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
                '/admin/manage-category',
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

    const downloadCategoryPDF = () => {
        const url = `http://localhost:8000/admin/download-pdf?type=categories`;
        window.open(url, '_blank');
    };

    return (
        <section className="admin_dashboard_main">
            <Head title="Manage Category" />
            <SideNavigation />
            <main className="page_main_content_layout">
                <section className="page_content_layout">
                    <div className="page_hedder">
                        <div className="page_nav">
                            <h1>Manage Categories</h1>
                            <div className="nav">
                                <Link href={'/admin/dashboard'} className="link">
                                    Dashboard
                                </Link>
                                <FontAwesomeIcon icon={faAngleRight} className="icon" />
                                <span className="name">Manage Category</span>
                            </div>
                        </div>
                        <div className="grop_button">
                            <button className="btn sub" onClick={() => setIsModalOpen(true)}>
                                Add Categories
                            </button>
                        </div>
                    </div>
                    <div className="page_content">
                        <div className="manage_category_group">
                            <div className="data_hedder">
                                <h1>
                                    <FontAwesomeIcon icon={faFolderTree} className="icon" />
                                    Category & Sub Category Data
                                </h1>
                                <div className="filter">
                                    <input
                                        type="search"
                                        name="filter"
                                        id="filter"
                                        placeholder="Find Within Category Name"
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
                                    <button className="btn" onClick={downloadCategoryPDF}>
                                        <FontAwesomeIcon icon={faDownload} className="icon" />
                                        Download Data
                                    </button>
                                </div>
                            </div>
                            {categories.length <= 0 ? (
                                value.name ? (
                                    <div className="empty-state">
                                        <img src={serachImage} alt="No Data" />
                                        <h3>No matches found!</h3>
                                        <p>It looks like we don't have any categories that match your current search. Try clearing the filters!</p>
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
                                        <p>It looks like you haven't added any categories yet. Start by creating one!</p>
                                        <button onClick={() => setIsModalOpen(true)} className="add-btn-primary">
                                            + Add Your First Category
                                        </button>
                                    </div>
                                )
                            ) : (
                                <>
                                    <table className="category_table">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>ID</th>
                                                <th>Category Name</th>
                                                <th>Category Type</th>
                                                <th>Create At</th>
                                                <th>Update At</th>
                                                <th>Place Count</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map((cat) => (
                                                <React.Fragment key={cat.id}>
                                                    <tr className="main_row">
                                                        <td style={{ width: '1%' }}>
                                                            {cat.sub_category.length > 0 ? (
                                                                <FontAwesomeIcon
                                                                    icon={faAngleDown}
                                                                    className="icons"
                                                                    onClick={() => toggleRow(cat.id)}
                                                                />
                                                            ) : (
                                                                <FontAwesomeIcon icon={faGripLines} className="icons sub" />
                                                            )}
                                                        </td>
                                                        <td>{cat.id}</td>
                                                        <td>{cat.category_name}</td>
                                                        <td>
                                                            <span className="main">Main Category</span>
                                                        </td>
                                                        <td>{getDateTime(String(cat.created_at))}</td>
                                                        <td>{getDateTime(String(cat.updated_at))}</td>
                                                        <td>
                                                            <span className="row_input">{`${cat.place_count || '0'} Total`}</span>
                                                        </td>
                                                        <td>
                                                            <div className="button_group">
                                                                <FontAwesomeIcon
                                                                    icon={faTrashCan}
                                                                    className="icon delete"
                                                                    onClick={() => openDeleteModal(cat, 'main')}
                                                                />
                                                                <FontAwesomeIcon icon={faPencil} className="icon" onClick={() => onEdite(cat)} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {openRow.includes(cat.id) &&
                                                        cat.sub_category &&
                                                        cat.sub_category.map((subCat) => (
                                                            <tr className="subRow" key={`${cat.id} - ${subCat.id}`}>
                                                                <td>...</td>
                                                                <td>{`${cat.id}-${subCat.id}`}</td>
                                                                <td> {subCat.sub_category_name}</td>
                                                                <td>
                                                                    <span className="main">Sub Category</span>
                                                                </td>
                                                                <td>{getDateTime(String(subCat.created_at))}</td>
                                                                <td>{getDateTime(String(subCat.updated_at))}</td>
                                                                <td>
                                                                    <span className="row_input">{`${subCat.place_count || 0} places`}</span>
                                                                </td>
                                                                <td>
                                                                    <div className="button_group">
                                                                        <FontAwesomeIcon
                                                                            icon={faTrashCan}
                                                                            className="icon delete"
                                                                            onClick={() => openDeleteModal(subCat, 'sub')}
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faPencil}
                                                                            className="icon"
                                                                            onClick={() => onEdite(subCat)}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="table_footer">
                                        <span className="title">{`Last update: ${lastUpdate}`}</span>
                                        <span className="title">{`Category count: ${count.catCount}`}</span>
                                        <span className="title">{`Sub Category count: ${count.subCateCount}`}</span>
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
                    <AddCategoryModel
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        data={data}
                        errors={errors}
                        setData={setData}
                        onSubmit={handleSubmit}
                        categories={categories || null}
                    />
                    <EditeCategoryModel
                        isOpen={isEditeModelOpen}
                        onClose={() => setIsEditeModelOpen(false)}
                        data={editForm.data}
                        errors={editForm.errors}
                        setData={editForm.setData}
                        onSubmit={handelEdite}
                        categories={categories || null}
                    />
                    <DynamicSuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} message={flash.success} title="Success!" />
                </section>
            </main>
        </section>
    );
};

export default ManageCategory;
