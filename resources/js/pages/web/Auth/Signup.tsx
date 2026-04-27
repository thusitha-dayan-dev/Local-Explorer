import { faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import { faExclamation, faLock, faRightLong, faSpinner, faCompass, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Head, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { validateEmail } from '@/lib/utils';

const SignupForm = () => {
    const { data, setData, setError, post, processing, errors, clearErrors } = useForm({
        full_name: '',
        email: '',
        password: '',
        confirm_password: '',
    });

    useEffect(() => {
        if (data.full_name && data.full_name.length < 3) {
            setError('full_name', 'Name is too short (min 3)');
        } else {
            clearErrors('full_name');
        }

        if (data.email && !validateEmail(data.email)) {
            setError('email', 'Invalid email format');
        } else {
            clearErrors('email');
        }

        if (data.password && data.password.length < 6) {
            setError('password', 'Min 6 characters required');
        } else {
            clearErrors('password');
        }

        if (data.confirm_password && data.password !== data.confirm_password) {
            setError('confirm_password', 'Passwords do not match');
        } else {
            clearErrors('confirm_password');
        }
    }, [data.full_name, data.email, data.password, data.confirm_password]);

    const isFormInvalid = !data.full_name || !data.email || !data.password || !data.confirm_password || Object.keys(errors).length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormInvalid) post('/signup/validate');
    };

    return (
        <section className="bento_auth_container">
            <Head title="Join Local Explorer" />

            <div className="auth_glass_panel signup_layout">
                <div className="visual_section_compact signup_bg">
                    <div className="image_overlay"></div>
                    <div className="floating_status_box">
                        <div className="icon_circle">
                            <FontAwesomeIcon icon={faCompass} />
                        </div>
                        <div className="text_info">
                            <strong>Start Journey</strong>
                            <span>Join our Dambulla community</span>
                        </div>
                    </div>
                </div>

                <div className="form_section_main">
                    <form className="loging_page_main" onSubmit={handleSubmit}>
                        <div className="hedder">
                            <h1>Create account</h1>
                            <p>Fill in your details to get started.</p>
                        </div>

                        <div className="login_form_input_main">
                            <div className="input_gorup">
                                <label>Full Name</label>
                                <div className={`holder ${errors.full_name ? 'error_border' : data.full_name.length >= 3 ? 'success_border' : ''}`}>
                                    <input
                                        type="text"
                                        placeholder="Thusitha"
                                        value={data.full_name}
                                        onChange={(e) => setData('full_name', e.target.value)}
                                    />
                                    <FontAwesomeIcon icon={faUser} className="icons_input" />
                                </div>
                                {errors.full_name && <span className="field_error_text">{errors.full_name}</span>}
                            </div>

                            <div className="input_gorup">
                                <label>Email Address</label>
                                <div className={`holder ${errors.email ? 'error_border' : ''}`}>
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <FontAwesomeIcon icon={faEnvelope} className="icons_input" />
                                </div>
                                {errors.email && <span className="field_error_text">{errors.email}</span>}
                            </div>

                            <div className="password_grid">
                                <div className="input_gorup">
                                    <label>Password</label>
                                    <div className={`holder ${errors.password ? 'error_border' : ''}`}>
                                        <input
                                            type="password"
                                            placeholder="••••••"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        <FontAwesomeIcon icon={faLock} className="icons_input" />
                                    </div>
                                </div>

                                <div className="input_gorup">
                                    <label>Confirm</label>
                                    <div
                                        className={`holder ${errors.confirm_password ? 'error_border' : data.confirm_password && !errors.confirm_password ? 'success_border' : ''}`}
                                    >
                                        <input
                                            type="password"
                                            placeholder="••••••"
                                            value={data.confirm_password}
                                            onChange={(e) => setData('confirm_password', e.target.value)}
                                        />
                                        <FontAwesomeIcon icon={faLock} className="icons_input" />
                                    </div>
                                </div>
                            </div>
                            {(errors.password || errors.confirm_password) && (
                                <span className="field_error_text mb_10">{errors.password || errors.confirm_password}</span>
                            )}

                            <div className="sibmit_buttons">
                                <button
                                    type="submit"
                                    disabled={processing || isFormInvalid}
                                    className={isFormInvalid || processing ? 'desabled' : 'active_btn'}
                                >
                                    {processing ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} spin /> Creating...
                                        </>
                                    ) : (
                                        <>
                                            Create Account <FontAwesomeIcon icon={faRightLong} />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="switch_massage">
                                <p>
                                    Already have an account? <Link href={'/login'}>Log In</Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default SignupForm;
