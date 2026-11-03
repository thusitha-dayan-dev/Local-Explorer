import { useWindowWidth } from '@/lib/useWindowWidth';
import { User } from '@/types/web';
import { faCalendar, faHome, faImage, faUser } from '@fortawesome/free-regular-svg-icons';
import { faBars, faFire, faInfoCircle, faMapMarkedAlt, faStar, faXmark, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { route } from 'ziggy-js';
import UserSettingsModal from '../../model/UserSettingsModal';
import SuccessToast from '../../notification/SuccessToast';

interface PageProps {
    index: any;
    userInfore: User;
}

const Nav = ({ index, userInfore }: PageProps) => {

    useEffect(()=> {
        const handelClickOutside = (event: MouseEvent) => {
            const dropDownElement = document.getElementById('profile_dropDown');

            if (dropDownElement && !dropDownElement.contains(event.target as Node)) {
                setIsopenSetting(false);
            }
        }
        document.addEventListener('mousedown', handelClickOutside);

        return () => {
            document.removeEventListener('mousedown', handelClickOutside);
        }
    }, []);

    const [userInfor, setUserInfor] = useState({
        userName: userInfore?.full_name ?? '',
        email: userInfore?.email ?? '',
        profile_image_path: userInfore?.profile_image_path ?? '',
    });

    const [isOpenSetting, setIsopenSetting] = useState(false);
    const [isSettingModelOpen, setIsSettingModelOpen] = useState(false);

    const [showToast, setShowToast] = useState(false);

    const handelSuccess = () => {
        setShowToast(true);
    };

    useEffect(() => {
        setUserInfor({
            userName: userInfore?.full_name ?? '',
            email: userInfore?.email ?? '',
            profile_image_path: userInfore?.profile_image_path ?? '',
        });
    }, [userInfore]);

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
        <nav className={`main_navigation ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav_container">
                <Link href="/" className="logo">
                    <div className="logo_icon">
                        <FontAwesomeIcon icon={faFire} />
                    </div>
                    <span className="logo_text">
                        Local<span className="sub">Explorer</span>
                    </span>
                </Link>
                <div className={`nav_link_group ${isOpen ? 'open' : ''}`}>
                    <div className="mobile_header">
                        <div className="user_profile">
                            <div className="avatar_circle">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <span className="user_name">{userInfor.userName ? userInfor.userName : 'Guest Explorer'}</span>
                        </div>
                        <button className="close_btn" onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>

                    <ul className="link_list">
                        <li>
                            <Link href="/" className={`nav_item ${index === 1 ? 'active' : ''}`}>
                                <FontAwesomeIcon icon={faHome} className="m_icon" />
                                <span>Home</span>
                            </Link>
                        </li>
                        {index === 5 || index === 4 || index === 3 || index === -1 || index === -2 ? (
                            <li>
                                <Link href="/#all-places-section" className={`nav_item ${index === 2 ? 'active' : ''}`}>
                                    <FontAwesomeIcon icon={faMapMarkedAlt} className="m_icon" />
                                    <span>Destinations</span>
                                </Link>
                            </li>
                        ) : (
                            <li>
                                <a href="#all-places-section" className={`nav_item ${index === 2 ? 'active' : ''}`}>
                                    <FontAwesomeIcon icon={faMapMarkedAlt} className="m_icon" />
                                    <span>Destinations</span>
                                </a>
                            </li>
                        )}

                        <li>
                            <Link href={route('trip.plan')} className={`nav_item ${index === 3 ? 'active' : ''}`}>
                                <FontAwesomeIcon icon={faCalendar} className="m_icon" />
                                <span>Plan a Trip</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={route('guide')} className={`nav_item ${index === 4 ? 'active' : ''}`}>
                                <FontAwesomeIcon icon={faImage} className="m_icon" />
                                <span>Watch Guide</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className={`nav_item ${index === 5 ? 'active' : ''}`}>
                                <FontAwesomeIcon icon={faInfoCircle} className="m_icon" />
                                <span>About</span>
                            </Link>
                        </li>
                    </ul>

                    <div className="mobile_footer">
                        {!userInfor.email ? (
                            <div className="auth_buttons">
                                <Link href="/login" className="btn_login">
                                    Sign In
                                </Link>
                                <Link href="/signup" className="btn_signup">
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <div className="auth_buttons">
                                <button
                                    className="btn_login"
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsSettingModelOpen(true);
                                    }}
                                >
                                    Settings
                                </button>
                                <Link href="/logout" method="post" as="button" className="btn_signup" onClick={() => setIsOpen(false)}>
                                    Logout
                                </Link>
                            </div>
                        )}
                        <p className="copy">© 2026 Local Explorer</p>
                    </div>
                </div>
                <div className="nav_actions">
                    {!userInfor.email ? (
                        <Link href="/login" className="desktop_signin_btn">
                            <FontAwesomeIcon icon={faUser} className="icon" />
                            <span>Sign In</span>
                        </Link>
                    ) : (
                        <div className="user_profile_dropdown">
                            <div className="profile_trigger" onClick={() => (isOpenSetting ? setIsopenSetting(false) : setIsopenSetting(true))}>
                                {userInfor.profile_image_path ? (
                                    <img src={`/storage/${userInfor.profile_image_path}`} alt={userInfor.userName} className="nav_avatar" />
                                ) : (
                                    <div className="nav_temp_avatar">{userInfor.userName ? userInfor.userName.charAt(0).toUpperCase() : 'U'}</div>
                                )}
                                <span className="nav_user_name">{userInfor.userName.split(' ')[0]}</span>
                            </div>
                            <div className={`dropdown_content ${isOpenSetting ? 'open' : ''}`} id='profile_dropDown'>
                                <Link href={route('trip.plan')} className="dropdown_item">
                                    Trip Plan
                                </Link>

                                <button
                                    className="dropdown_item"
                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                                    onClick={() => setIsSettingModelOpen(true)}
                                >
                                    Settings
                                </button>
                                <hr />
                                <Link href="/logout" method="post" as="button" className="dropdown_item logout_txt">
                                    Logout
                                </Link>
                            </div>
                        </div>
                    )}

                    <button className="menu_toggle" onClick={() => setIsOpen(!isOpen)}>
                        <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
                    </button>
                </div>
            </div>
        </nav>
            {isOpen && <div className="nav_overlay" onClick={() => setIsOpen(false)}></div>}
            <SuccessToast show={showToast} message="Profile updated successfully!" onClose={() => setShowToast(false)} />
            <UserSettingsModal isOpen={isSettingModelOpen} onClose={() => setIsSettingModelOpen(false)} handelSuccess={handelSuccess} />
        </>
    );
};

export default Nav;
