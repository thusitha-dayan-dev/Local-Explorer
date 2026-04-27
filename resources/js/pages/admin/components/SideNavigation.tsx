import { icon } from '@fortawesome/fontawesome-svg-core';
import { faUser, faArrowRightFromBracket, faFire } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, MapPin, MapPinned, FolderPlus, FolderTree, ShieldPlus, ShieldCheck, Star, ListPlus, Layers } from 'lucide-react';
import React, { useState } from 'react';

const SideNavigation = () => {
    const [isSiderOpen, setIsSiderOpen] = useState(false);
    const { authEmail } = usePage<{ authEmail: string }>().props;

    const sections = [
        {
            label: null,
            items: [{ label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' }],
        },
        {
            label: 'Inventory & Places',
            items: [
                { label: 'Manage Places', icon: MapPin, href: '/admin/manage-place' },
                { label: 'Add New Place', icon: MapPinned, href: '/admin/add-place' },
                { label: 'Manage Categories', icon: FolderTree, href: '/admin/manage-category' },
            ],
        },

        {
            label: 'Services',
            items: [
                { label: 'Manage Services', icon: ShieldCheck, href: '/admin/manage-service' },
                { label: 'Add New Service', icon: ShieldPlus, href: '/admin/add-service' },
                { label: 'Manage ServiceType', icon: Layers, href: '/admin/manage-service-types' },
            ],
        },
        {
            label: 'Reviews',
            items: [
                { label: 'Place Reviews', icon: Star, href: '/admin/manage-review' },
                { label: 'Service Reviews', icon: Star, href: '/admin/manage-service/reviews' },
            ],
        },
    ];

    return (
        <nav className={`sider ${isSiderOpen ? 'open' : ''}`} onMouseOver={() => setIsSiderOpen(true)} onMouseLeave={() => setIsSiderOpen(false)}>
            <div className="admin_profile">
                <div className="profile_picture">
                    <FontAwesomeIcon icon={faFire} className="icon" />
                </div>
                <div className="profile_details">
                    <span className="email">{authEmail}</span>
                    <span className="role">Local Explore Admin</span>
                </div>
            </div>

            <div className="link_gorup_container" style={{ overflowY: 'auto', flex: 1 }}>
                {sections.map((section, sIndex) => (
                    <div key={sIndex} className="nav_section">
                        {section.label && <span className="main_lable_link_gorup">{section.label}</span>}
                        <ul className="link_gorup">
                            {section.items.map((item, iIndex) => (
                                <li key={iIndex}>
                                    <Link className="btn" href={item.href}>
                                        <item.icon className="icon" size={20} strokeWidth={2} />
                                        <span className="name">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="nav_footer">
                <div className="user">
                    <FontAwesomeIcon icon={faUser} className="icon" />
                    <span className="user_name">Admin</span>
                </div>
                <Link href={'/admin/logout'} method="post" as="button" className="log_out_btn">
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    <span className="name">Log out</span>
                </Link>
            </div>
        </nav>
    );
};

export default SideNavigation;
