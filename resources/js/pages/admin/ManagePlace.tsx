import { faEye, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faAngleLeft, faAngleRight, faDownload, faLocationDot, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';
import { getDateTime, UseClickOutSide } from '@/lib/utils';
import type { PlacePaginate } from '@/types/admin';
import type { Category, SubCategory } from '@/types/web';
import notDataImage from '../../../assect/not_found.svg';
import serachImage from '../../../assect/search.svg';
import SideNavigation from './components/SideNavigation';
import DeletePlaceModel from './model/DeletePlaceModel';
import PlaceListModel from './model/download/PlaceListModel';
import DynamicSuccessModal from './model/DynamicSuccessModal';

interface propsData {
    places: PlacePaginate;
    category: Category[];
    subCategory: Record<number, SubCategory[]>;
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
    subCategory: number | null;
    sort: string;
}

const ManagePlace = ({ places, category, subCategory, filters }: propsData) => {
    const [isFilterTypeOpen, setIsFilterTypeOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropDownOpen] = useState(false);
    const [isSubCategoryDropDownOpen, setIsSubCategoryDropDownOpen] = useState(false);
    const [lastUpdate, setLastUpdate] = useState('');
    const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);
    const [seletedItem, setSelectedItem] = useState<{ id: number; place_name: string | null }>();
    const [isDownloadModelOpen, setIsDownloadModelOpen] = useState(false);
    const [isSuccessModelOpen, setIsSuccessModelOpen] = useState(false);
    const { flash } = usePage().props as any;

    const pageNumbers = [];
    for (let i = 1; i <= places.last_page; i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        if (flash.success) {
            setIsSuccessModelOpen(true);
        }
    }, [flash]);

    useEffect(() => {
        if (places.data && places.data.length > 0) {
            const latest = new Date(Math.max(...places.data.map((p) => new Date(p.updated_at).getTime())));
            setLastUpdate(latest.toISOString().split('T')[0]);
        }
    }, [places]);

    const [value, setValue] = useState<FilterValue>({
        search: filters?.search || '',
        category: filters?.category ? Number(filters.category) : null,
        subCategory: filters?.subCategory ? Number(filters.subCategory) : null,
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
                '/admin/manage-place',
                {
                    search: value.search,
                    category: value.category,
                    subCategory: value.subCategory,
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
                setIsSubCategoryDropDownOpen(false);
                setIsFilterTypeOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const openDeleteModal = (id: number, place_name: string) => {
        setSelectedItem({ id, place_name });
        setIsDeleteModelOpen(true);
    };

    const { delete: destroy } = useForm();

    const handelDelete = () => {
        if (!seletedItem) return;

        destroy(`/admin/delete-place/${seletedItem.id}`, {
            onSuccess: () => {
                setIsDeleteModelOpen(false);
                setIsSuccessModelOpen(true);
            },
            preserveScroll: true,
        });
    };

    const currentSubCategories = subCategory[value.category || 0] || [];

    return (
        <section className="admin_dashboard_main">
            <SideNavigation />
            <Head title="Manage Places" />
            <main className="content_page">
                <section className="content">
                    <div className="hedd">
                        <div className="main_nav">
                            <h1>Manage Places</h1>
                            <div className="link_gorup">
                                <Link className="link" href={'/admin/dashboard'}>
                                    Dashboard
                                </Link>
                                <FontAwesomeIcon icon={faAngleRight} className="icon" />
                                <span>Manage Place</span>
                            </div>
                        </div>
                        <div className="right_content">
                            <div className="serch_bar_layout">
                                <input
                                    type="search"
                                    name="placeSearch"
                                    id="placeSearch"
                                    placeholder="Fiend Your Placess"
                                    onChange={(e) => setValue({ ...value, search: e.target.value })}
                                    value={value.search}
                                />
                            </div>
                            <div className="short_cut">
                                <Link className="link" href={'/admin/add-place'}>
                                    <FontAwesomeIcon icon={faPlus} className="icon" />
                                    Add New place
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="main_page_content">
                        <section className="manage_place_table">
                            <div className="table_hedder">
                                <h1>
                                    <FontAwesomeIcon icon={faLocationDot} className="icon" />
                                    Places Data
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
                                                value={category.find((data) => data.id === value.category)?.category_name || ''}
                                                onClick={() =>
                                                    isCategoryDropdownOpen ? setIsCategoryDropDownOpen(false) : setIsCategoryDropDownOpen(true)
                                                }
                                            />

                                            {isCategoryDropdownOpen && (
                                                <ul className="selector">
                                                    {category.length <= 0 ? (
                                                        <li style={{ color: 'red' }} onClick={() => setIsCategoryDropDownOpen(false)}>
                                                            Category Not found !
                                                        </li>
                                                    ) : (
                                                        <li
                                                            onClick={() => {
                                                                setIsCategoryDropDownOpen(false);
                                                                setValue({ ...value, category: null, subCategory: null });
                                                            }}
                                                        >
                                                            All Category
                                                        </li>
                                                    )}
                                                    {category.map((cat) => (
                                                        <li
                                                            key={cat.id}
                                                            onClick={() => {
                                                                isCategoryDropdownOpen
                                                                    ? setIsCategoryDropDownOpen(false)
                                                                    : setIsCategoryDropDownOpen(false);
                                                                setValue({ ...value, subCategory: null, category: cat.id });
                                                                setIsSubCategoryDropDownOpen(true);
                                                            }}
                                                        >
                                                            {cat.category_name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <div className="custom_droper">
                                            <input
                                                type="text"
                                                name="categoryBy"
                                                id="categoryBy"
                                                placeholder="All Sub Category"
                                                readOnly={true}
                                                value={currentSubCategories.find((sub) => sub.id === value.subCategory)?.sub_category_name || ''}
                                                onClick={() => {
                                                    isSubCategoryDropDownOpen
                                                        ? setIsSubCategoryDropDownOpen(false)
                                                        : setIsSubCategoryDropDownOpen(true);
                                                }}
                                            />
                                            {isSubCategoryDropDownOpen && (
                                                <ul className="selector">
                                                    {currentSubCategories.length <= 0 ? (
                                                        <li style={{ color: 'red' }} onClick={() => setIsSubCategoryDropDownOpen(false)}>
                                                            First select Category !
                                                        </li>
                                                    ) : (
                                                        <li
                                                            onClick={() => {
                                                                setIsSubCategoryDropDownOpen(false);
                                                                setValue({ ...value, subCategory: null });
                                                            }}
                                                        >
                                                            All Sub Category
                                                        </li>
                                                    )}
                                                    {currentSubCategories.map((subcat) => (
                                                        <li
                                                            key={subcat.id}
                                                            onClick={() => {
                                                                setValue({ ...value, subCategory: subcat.id });
                                                                isSubCategoryDropDownOpen
                                                                    ? setIsSubCategoryDropDownOpen(false)
                                                                    : setIsSubCategoryDropDownOpen(true);
                                                            }}
                                                        >
                                                            {subcat.sub_category_name}
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
                                    <span className="downlaod" style={{ cursor: 'pointer' }} onClick={() => setIsDownloadModelOpen(true)}>
                                        <FontAwesomeIcon icon={faDownload} className="icon" />
                                        Download Data
                                    </span>
                                </div>
                            </div>

                            {places.data.length <= 0 ? (
                                value.search || value.category || value.subCategory ? (
                                    <div className="empty-state">
                                        <img src={serachImage} alt="No Data" />
                                        <h3>No matches found!</h3>
                                        <p>It looks like we don't have any place that match your current search. Try clearing the filters!</p>
                                        <button
                                            onClick={() => setValue({ ...value, search: '', category: null, subCategory: null })}
                                            className="add-btn-primary"
                                            style={{ background: '#64748b' }}
                                        >
                                            Clear Search
                                        </button>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <img src={notDataImage} alt="No Data" />
                                        <h3>No Places Found</h3>
                                        <p>It looks like you haven't added any place yet. Start by creating one!</p>
                                        <Link className="add-btn-primary" href={'/admin/add-place'}>
                                            Add New Place
                                        </Link>
                                    </div>
                                )
                            ) : (
                                <>
                                    <table className="place_table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Place Name</th>
                                                <th>Helight</th>
                                                <th>Category & Sub CateGory</th>
                                                <th>Selections</th>
                                                <th>Main Image</th>
                                                <th>Create & Update at</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {places.data.map((plc) => (
                                                <tr key={plc.id}>
                                                    <td>{plc.id}</td>
                                                    <td>
                                                        <span className="name">{plc.place_name}</span>
                                                    </td>
                                                    <td>
                                                        <span className="desc">{plc.short_description}</span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                            <span className="main_cat">
                                                                Category:{' '}
                                                                <b style={{ fontSize: '0.9rem', fontWeight: '600' }}>{plc.category.category_name}</b>
                                                            </span>
                                                            <span className="sub_cat">
                                                                Sub Category:{' '}
                                                                <b style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                                                                    {plc.sub_category.sub_category_name}
                                                                </b>
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="selection">{plc.selection_count} Users</span>
                                                    </td>
                                                    <td>
                                                        <img src={`/storage/${plc.main_image_path}`} alt={plc.place_name} />
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                            <span style={{ fontWeight: '400' }}>
                                                                Create :{' '}
                                                                <b style={{ fontSize: '0.9rem', fontWeight: '600' }}>{getDateTime(plc.created_at)}</b>
                                                            </span>
                                                            <span style={{ fontWeight: '400' }}>
                                                                Update :{' '}
                                                                <b style={{ fontSize: '0.9rem', fontWeight: '600' }}>{getDateTime(plc.updated_at)}</b>
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="action">
                                                            <Link className="icon" href={`/admin/edit-place/${plc.id}/${plc.slug}`}>
                                                                <FontAwesomeIcon icon={faPen} className="icon" />
                                                            </Link>
                                                            <FontAwesomeIcon
                                                                icon={faTrashCan}
                                                                className="icon delete"
                                                                style={{ color: 'red' }}
                                                                onClick={() => openDeleteModal(plc.id, plc.place_name)}
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
                                            {places.prev_page_url == null ? (
                                                <span className="link desable">
                                                    <FontAwesomeIcon icon={faAngleLeft} />
                                                </span>
                                            ) : (
                                                <Link href={`${places.prev_page_url}`} className="link">
                                                    <FontAwesomeIcon icon={faAngleLeft} />
                                                </Link>
                                            )}
                                            <div className="other_link">
                                                {pageNumbers.map((nb) => (
                                                    <Link
                                                        key={nb}
                                                        href={route('admin.manage.place', { ...filters, page: nb })}
                                                        className={`link ${nb == places.current_page ? 'active' : ''}`}
                                                    >
                                                        {nb}
                                                    </Link>
                                                ))}
                                            </div>
                                            {places.next_page_url == null ? (
                                                <span className="link desable">
                                                    <FontAwesomeIcon icon={faAngleRight} />
                                                </span>
                                            ) : (
                                                <Link href={`${places.next_page_url}`} className="link">
                                                    <FontAwesomeIcon icon={faAngleRight} />
                                                </Link>
                                            )}
                                        </div>
                                        <div className="all_data">
                                            <span>
                                                All Places: <span className="helight">{places.total} places</span>
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
            <PlaceListModel isOpen={isDownloadModelOpen} onClose={() => setIsDownloadModelOpen(false)} categories={category} />
        </section>
    );
};

export default ManagePlace;
