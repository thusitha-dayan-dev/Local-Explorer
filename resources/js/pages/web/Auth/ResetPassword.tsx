import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faExclamation, faLongArrowLeft, faRightLong, faSpinner, faX, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, useForm, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

const ForgetPasswordForm = () => {
    const { data, setData, post, processing, errors } = useForm<any>({
        email: '',
    });

    const [isDesable, setIsDesable] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'error' as 'success' | 'error' });

    useEffect(() => {
        setIsDesable(!data.email);
    }, [data]);

    useEffect(() => {
        if (errors.error) {
            setAlert({ show: true, message: errors.error, type: 'error' });
        }
    }, [errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/forget-password-send');
    };

    return (
        <section className="bento_auth_container">
            <Head title="Reset Password | Local Explorer" />

            <div className="auth_glass_panel">
                <div className="visual_section_compact forget_bg">
                    <div className="image_overlay"></div>
                    <div className="floating_status_box">
                        <div className="icon_circle">
                            <FontAwesomeIcon icon={faKey} />
                        </div>
                        <div className="text_info">
                            <strong>Security First</strong>
                            <span>Secure your account</span>
                        </div>
                    </div>
                </div>

                <div className="form_section_main">
                    <form className="loging_page_main" onSubmit={handleSubmit}>
                        {alert.show && (
                            <div className="main_error_popup">
                                <div className="msg_content">
                                    <FontAwesomeIcon icon={faExclamation} />
                                    <span>{alert.message}</span>
                                </div>
                                <FontAwesomeIcon icon={faX} className="close_x" onClick={() => setAlert({ ...alert, show: false })} />
                            </div>
                        )}

                        <div className="hedder">
                            <h1>Reset password</h1>
                            <p>Enter your email address and we'll send you instructions to reset your password.</p>
                        </div>

                        <div className="login_form_input_main">
                            <div className="input_gorup">
                                <label htmlFor="email">Email Address</label>
                                <div className={`holder ${errors.email ? 'error_border' : ''}`}>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form_input"
                                        placeholder="Enter your email"
                                        onChange={(e) => setData('email', e.target.value)}
                                        value={data.email}
                                    />
                                    <FontAwesomeIcon icon={faEnvelope} className="icons_input" />
                                </div>
                                {errors.email && <span className="field_error_text">{errors.email}</span>}
                            </div>

                            <div className="sibmit_buttons">
                                <button
                                    type="submit"
                                    disabled={processing || isDesable}
                                    className={isDesable || processing ? 'desabled' : 'active_btn'}
                                >
                                    {processing ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} spin /> Sending Email...
                                        </>
                                    ) : (
                                        <>
                                            Send Email <FontAwesomeIcon icon={faRightLong} />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="switch_massage">
                                <Link href={'/login'} className="back_btn">
                                    <FontAwesomeIcon icon={faLongArrowLeft} />
                                    <span>Back to Sign In</span>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ForgetPasswordForm;
