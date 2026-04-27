import { faClock, faEye, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight, faBars, faDownload, faLongArrowLeft, faPencil, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import image from '../../../../assect/bear_icon.png';
import emptyTable from '../../../../assect/nodata-table.svg';
import notDataImage from '../../../../assect/not_found.svg';

interface placesprops {
    placeData: places[] | null;
    placeCount: number;
}

interface places {
    id: number;
    place_name: string;
    selection_count: number;
    created_at: string;
    updated_at: string;
    main_image_path: string;
    category_name: string;
    slug: string;
}

const TopTenPlace = ({ placeData, placeCount }: placesprops) => {
    const [lastUpdate, setLastUpdate] = useState('');

    useEffect(() => {
        if (placeData && placeData.length > 0) {
            const latest = new Date(Math.max(...placeData.map((p) => new Date(p.updated_at).getTime())));
            setLastUpdate(latest.toISOString().split('T')[0]);
        }
    }, [placeData]);

    return (
        <div className="place_table_layout">
            <div className="place_table_hedder">
                <h1>
                    <FontAwesomeIcon icon={faBars} className="icon" />
                    Recently Added Places
                </h1>
                <div className="buttons_gorup">
                    <Link className="nav_buttons sub" href={'/admin/add-place'}>
                        Add new place
                    </Link>

                    <Link className="nav_buttons" href={'/admin/manage-place'}>
                        View All
                        <FontAwesomeIcon icon={faArrowRight} className="icon" />
                    </Link>
                </div>
            </div>
            {!placeData || placeData.length === 0 ? (
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
                    <table className="place_table">
                        <thead>
                            <tr className="tabe_row">
                                <th>ID</th>
                                <th>Place Name</th>
                                <th>Category</th>
                                <th>Selections</th>
                                <th>Create At</th>
                                <th>Update At </th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {placeData &&
                                placeData.map((place, index) => (
                                    <tr key={index}>
                                        <td>{place.id}</td>
                                        <td>{place.place_name}</td>
                                        <td>{place.category_name}</td>
                                        <td>
                                            <span className="lite">{place.selection_count} Users</span>
                                        </td>
                                        <td>{place.created_at}</td>
                                        <td>{place.updated_at}</td>
                                        <td>
                                            <img src={`/storage/${place.main_image_path}`} alt={place.place_name} />
                                        </td>
                                        <td>
                                            <div className="action_button">
                                                <Link className="btn" href={`/admin/manage-place?search=${place.place_name}`}>
                                                    <FontAwesomeIcon icon={faEye} className="icon" />
                                                </Link>
                                                <Link className="btn" href={`/admin/edit-place/${place.id}/${place.slug}`}>
                                                    <FontAwesomeIcon icon={faPencil} className="icon" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <div className="table_footer">
                        <div className="update">
                            <FontAwesomeIcon icon={faClock} className="icon" />
                            <span>
                                Last update: <span>{lastUpdate}</span>
                            </span>
                        </div>
                        <div className="other_data">
                            <span>Total Places Count: {placeCount}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TopTenPlace;
