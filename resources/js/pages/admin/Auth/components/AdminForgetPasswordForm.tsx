import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import {
    faExclamation,
    faEye,
    faEyeSlash,
    faLeftLong,
    faLock,
    faLongArrowLeft,
    faRightLong,
    faSpinner,
    faX,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface PageProps {
    auth_cooldown: number;
    [key: string]: any;
}

const AdminForgetPasswordFrom = () => {
    const { data, setData, post, processing, errors, clearErrors } = useForm<any>({
        email: '',
    });

    const [isDesable, setIsDesable] = useState(true);

    useEffect(() => {
        const isFormEmpty = !data.email;

        if (isFormEmpty) {
            setIsDesable(true);
        } else {
            setIsDesable(false);
        }
    }, [data, errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/forget-password-send');
    };

    const [alert, setAlert] = useState({
        show: false,
        message: '',
        type: 'success' as 'success' | 'error',
    });

    useEffect(() => {
        if (errors.error) {
            setAlert({ show: true, message: errors.error, type: 'error' });
           
        }
    }, [errors]);

    return (
        <section className="center_form">
            <form className="loging_page_main" onSubmit={handleSubmit}>
                {alert.show && (
                    <div className="main_error">
                        <FontAwesomeIcon icon={faX} className="close_btn" onClick={() => setAlert((prev) => ({ ...prev, show: false }))} />
                        <div className="massage">
                            <FontAwesomeIcon icon={faExclamation} />
                            <span className="main_error_massage">{alert.message}</span>
                        </div>
                    </div>
                )}
                <div className="hedder">
                    <h1>Reset password</h1>
                    <span className="title">Enter your email address and we'll send you instructions to reset your password.</span>
                </div>
                <div className="login_form_input_main">
                    <div className="input_gorup">
                        <label htmlFor="email">Email Address</label>
                        <div className="holder">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="form_input"
                                placeholder="Email Address"
                                onChange={(e) => setData('email', e.target.value)}
                                value={data.email}
                            />
                            <FontAwesomeIcon icon={faEnvelope} className="icons_input" />
                        </div>
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>

                    <div className="sibmit_buttons">
                        <button type="submit" disabled={processing || isDesable} className={isDesable || processing ? 'desabled' : ''}>
                            {processing ? (
                                <>
                                    Sending Email
                                    <FontAwesomeIcon
                                        icon={faSpinner}
                                        className="rotet_icon_main"
                                        style={{ marginLeft: '10px', fontSize: '1.2rem' }}
                                    />
                                </>
                            ) : (
                                <>
                                    Send Email
                                    <FontAwesomeIcon icon={faRightLong} style={{ marginLeft: '10px' }} />
                                </>
                            )}
                        </button>
                    </div>
                    <div className="switch_massage">
                        <span className="switcher">
                            <Link href={'/admin/login'} className="nav_link">
                                <FontAwesomeIcon icon={faLongArrowLeft} />
                                Back to Sigh in
                            </Link>
                        </span>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default AdminForgetPasswordFrom;
