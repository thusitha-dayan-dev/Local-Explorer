import { faBolt, faLayerGroup, faMapMarkerAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { router } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import backgroundImage from '../../../../assect/user.jpg';
import AdminProfileModal from '../model/AdminProfileModal';

interface pageProps {
    data: any;
}

const Hedder = ({ data }: pageProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (data) {
            if (data.profile_image_path) {
                setPreviewUrl(`/storage/${data.profile_image_path}`);
            } else {
                setPreviewUrl(`https://ui-avatars.com/api/?name=${data.user_name}&background=6366f1&color=fff`);
            }
        }
    }, [data]);

    useEffect(() => {
        if (searchValue.length > 1) {
            const delayDebounce = setTimeout(async () => {
                try {
                    const response = await axios.get('/admin/global-search', {
                        params: { query: searchValue },
                    });
                    setResults(response.data);
                    setShowDropdown(true);
                } catch (error) {
                    console.error('Search failed', error);
                }
            }, 400);
            return () => clearTimeout(delayDebounce);
        } else {
            setResults([]);
            setShowDropdown(false);
        }
    }, [searchValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigate = (url: string) => {
        setShowDropdown(false);
        setSearchValue('');
        router.get(url);
    };

    return (
        <nav className="hedders">
            <div className="main_hedder">
                <h2>DASHBOARD OVERVIEW</h2>
            </div>

            <div className="other_hedder" ref={dropdownRef}>
                <form className="serach_form">
                    <div className="serch_holder">
                        <input
                            type="search"
                            name="seracher"
                            id="seracher"
                            placeholder="Search Any thing"
                            className="input"
                            onChange={(e) => setSearchValue(e.target.value)}
                            value={searchValue}
                            onFocus={() => searchValue.length > 1 && setShowDropdown(true)}
                        />
                        {showDropdown && searchValue.length > 1 && (
                            <ul className="custom_dropdown">
                                {results.length > 0 ? (
                                    <>
                                        {results.map((item: any, index: number) => (
                                            <li key={index} onClick={() => handleNavigate(item.url)}>
                                                <div className="item_content">
                                                    <span className={`type_icon ${item.type.toLowerCase().replace(' ', '-')}`}>
                                                        {item.type === 'Place' && <FontAwesomeIcon icon={faMapMarkerAlt} />}
                                                        {item.type === 'Category' && <FontAwesomeIcon icon={faLayerGroup} />}
                                                        {item.type === 'Action' && <FontAwesomeIcon icon={faBolt} />}
                                                    </span>
                                                    <div className="texts">
                                                        <p className="label">{item.label}</p>
                                                        <small className="type">{item.type}</small>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </>
                                ) : (
                                    <li className="no-results">
                                        <p>No results found for "{searchValue}"</p>
                                        <small>Try searching for Places, Services or Actions</small>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                </form>
                <div className="profile_inform">
                    <span className="system_profile" onClick={() => setIsOpen(true)} style={{ cursor: 'pointer' }}>
                        <img src={previewUrl || backgroundImage} alt="admin profile" />
                    </span>
                </div>
            </div>
            <AdminProfileModal isOpen={isOpen} onClose={() => setIsOpen(false)} admin={data} />
        </nav>
    );
};

export default Hedder;
