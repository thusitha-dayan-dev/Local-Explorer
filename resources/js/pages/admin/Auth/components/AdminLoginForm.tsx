import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faX, faExclamation, faLock, faRightLong, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

const AdminLoginForm = () => {
    const { data, setData, post, processing, errors, clearErrors } = useForm<any>({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isDesable, setIsDesable] = useState(true);
    const { flash } = usePage().props as any;

    useEffect(() => {
        const isFormEmpty = !data.email || !data.password;

        if (isFormEmpty) {
            setIsDesable(true);
        } else {
            setIsDesable(false);
        }
    }, [data, errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/login/verification');
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
            <Head title="Admin Login" />
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
                    <h1>Welcome back</h1>
                    <span className="title">Sign in to your admin account to continue.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                    <div>
                        <strong style={{ color: '#0f172a' }}>Demo Admin:</strong> <span style={{ color: '#64748b' }}>admin@localexplorer.com</span>
                    </div>
                    <button
                        type="button"
                        style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => {
                            setData('email', 'admin@localexplorer.com');
                            setData('password', 'Admin@123456');
                        }}
                    >
                        Auto-Fill
                    </button>
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
                    <div className="input_gorup">
                        <label htmlFor="password">Password</label>
                        <div className="holder">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                id="password"
                                className="form_input over"
                                placeholder="Password"
                                onChange={(e) => setData('password', e.target.value)}
                                value={data.password}
                            />
                            <FontAwesomeIcon icon={faLock} className="icons_input" />
                        </div>
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    <div className="remember_gorup">
                        <span className="liner">
                            <input
                                type="checkbox"
                                style={{ cursor: 'pointer' }}
                                name="remember_token"
                                id="remember"
                                onClick={(e) => {
                                    if (showPassword) setShowPassword(false);
                                    else setShowPassword(true);
                                }}
                            />
                            <label htmlFor="remember">Show Password</label>
                        </span>
                        <span className="liner">
                            <Link href={'/admin/forget-password'} className="link">
                                Reset Password
                            </Link>
                        </span>
                    </div>
                    <div className="sibmit_buttons">
                        <button type="submit" disabled={processing || isDesable} className={isDesable || processing ? 'desabled' : ''}>
                            {processing ? (
                                <>
                                    Validating Info
                                    <FontAwesomeIcon
                                        icon={faSpinner}
                                        className="rotet_icon_main"
                                        style={{ marginLeft: '10px', fontSize: '1.2rem' }}
                                    />
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <FontAwesomeIcon icon={faRightLong} style={{ marginLeft: '10px' }} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default AdminLoginForm;
