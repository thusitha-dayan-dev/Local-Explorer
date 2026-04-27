import React from 'react';
import { PageSiderProps, SiderPageData } from '@/types/page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';

const PageSider = ({ signupPageData }: PageSiderProps) => {
    return (
        <div className="page_sider">
            <div className="page_logo">
                <FontAwesomeIcon icon={faFire} className="icon" />
                <span className="logo">
                    Local <span className="other">Explore</span>
                </span>
            </div>

            <div className="page_main_hedder">
                <h1 className="main_hedder">
                    {signupPageData.hedder == 'Welcome Back to Local Explore' ? (
                        <>
                            Welcome Back to <span className="blue">Local Explore!</span>
                        </>
                    ) : signupPageData.hedder == 'Reset Access to Local Explore Account' ? (
                        <>
                            Reset Access to <span className="blue">Local Explore Account</span>
                        </>
                    ) : signupPageData.hedder == 'Admin Control Center Explore Account' ? (
                        <>
                            Admin Control Center <span className="blue"> Explore Account</span>
                        </>
                    ) : signupPageData.hedder == 'Admin Control Center Account Reset Password' ? (
                        <>
                            Admin Control Center <span className="blue">Local Explore Account </span>
                        </>
                    ) : signupPageData.hedder == 'Admin Control Center Secure Password Update' ? (
                        <>
                            Admin Control Center <span className="blue">Secure Password Update</span>
                        </>
                    ) : signupPageData.hedder == 'User Control Center Account Reset Password' ? (
                        <>
                            User Control Center <span className="blue"> Explore Account</span>
                        </>
                    ) : signupPageData.hedder == 'User Control Center Secure Password Update' ? (
                        <>
                            User Control Center <span className="blue">Secure Password Update</span>
                        </>
                    ) : (
                        <>
                            Explore Day Out near <span className="blue">Dambulla Sri Lanka</span>
                        </>
                    )}
                </h1>
                <span className="discription_massage">{signupPageData.title}</span>
            </div>

            <ul className="fetches_list">
                {signupPageData.list.map((item, index) => (
                    <li key={index}>
                        <div className="icon">
                            <FontAwesomeIcon icon={item.icon} style={{ color: `${item.iconColor}` }} />
                        </div>
                        <div className="other_details">
                            <span className="heder_massage">{item.hed}</span>
                            <span className="title_massage">{item.massage}</span>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="footer_massage">© 2024 LocalExplora Inc. All rights reserved.</div>
        </div>
    );
};

export default PageSider;
