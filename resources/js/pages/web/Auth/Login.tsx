import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faExclamation, faEye, faEyeSlash, faLock, faRightLong, faSpinner, faX, faCompass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import ErrorToast from '../notification/ErrorToast';

const LoginForm = () => {
    const { data, setData, post, processing, errors, clearErrors } = useForm<any>({
        email: '',
        password: '',
    });

    const {flash} = usePage<any>().props;
    const [errorToast, setErrorTost] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(()=>{
        if (flash.error) {
            setErrorMsg(flash.error);
            setErrorTost(true);
        };

        const params = new URLSearchParams(window.location.search);
        if (params.get('message')) {
            setErrorMsg(params.get('message') as string);
            setErrorTost(true);
        }
    }, [flash.error]);

    const [showPassword, setShowPassword] = useState(false);
    const [isDesable, setIsDesable] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'error' as 'success' | 'error' });

    useEffect(() => {
        setIsDesable(!data.email || !data.password);
    }, [data]);

    useEffect(() => {
        if (errors.error) {
            setAlert({ show: true, message: errors.error, type: 'error' });
        }
    }, [errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login/validate');
    };

    return (
        <section className="bento_auth_container">
            <Head title="Sign In | Local Explorer" />

            <div className="auth_glass_panel">
                <div className="visual_section_compact">
                    <div className="image_overlay"></div>
                    <div className="floating_badge">
                        <FontAwesomeIcon icon={faCompass} />
                        <span>Dambulla Explorer</span>
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
                            <h1>Welcome back</h1>
                            <p>Sign in to your account to continue.</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                            <div>
                                <strong style={{ color: '#0f172a' }}>Demo User:</strong> <span style={{ color: '#64748b' }}>test@example.com</span>
                            </div>
                            <button
                                type="button"
                                style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                                onClick={() => {
                                    setData({ email: 'test@example.com', password: 'user123' });
                                }}
                            >
                                Auto-Fill
                            </button>
                        </div>

                        <div className="login_form_input_main">
                            <div className="input_gorup">
                                <label htmlFor="email">Email Address</label>
                                <div className={`holder ${errors.email ? 'error_border' : ''}`}>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form_input"
                                        placeholder="name@example.com"
                                        onChange={(e) => setData('email', e.target.value)}
                                        value={data.email}
                                    />
                                    <FontAwesomeIcon icon={faEnvelope} className="icons_input" />
                                </div>
                                {errors.email && <span className="field_error_text">{errors.email}</span>}
                            </div>

                            <div className="input_gorup">
                                <label htmlFor="password">Password</label>
                                <div className={`holder ${errors.password ? 'error_border' : ''}`}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        className="form_input"
                                        placeholder="••••••••"
                                        onChange={(e) => setData('password', e.target.value)}
                                        value={data.password}
                                    />
                                    <FontAwesomeIcon icon={faLock} className="icons_input" />
                                </div>
                                {errors.password && <span className="field_error_text">{errors.password}</span>}
                            </div>

                            <div className="remember_gorup">
                                <span className="liner">
                                    <input type="checkbox" id="show_pass" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                                    <label htmlFor="show_pass">Show Password</label>
                                </span>
                                <Link className="link" href={'/forget-password'}>
                                    Forgot?
                                </Link>
                            </div>

                            <div className="sibmit_buttons">
                                <button
                                    type="submit"
                                    disabled={processing || isDesable}
                                    className={isDesable || processing ? 'desabled' : 'active_btn'}
                                >
                                    {processing ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} spin /> Validating...
                                        </>
                                    ) : (
                                        <>
                                            Sign In <FontAwesomeIcon icon={faRightLong} />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="switch_massage">
                                <p>
                                    Don't have an account? <Link href={'/signup'}>Sign Up</Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <ErrorToast onClose={() => setErrorTost(false)} show={errorToast} message={errorMsg}/>
        </section>
    );
};

export default LoginForm;
