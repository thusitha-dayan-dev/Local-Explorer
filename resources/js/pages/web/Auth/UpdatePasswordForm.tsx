import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLock, faRotate, faShieldHalved, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Head, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

const UpadtePasswordForm = ({ token, email }: any) => {
    const { data, setData, setError, post, processing, errors, clearErrors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (data.password && data.password.length < 6) {
            setError('password', 'Password must be at least 6 characters');
        } else {
            clearErrors('password');
        }
        if (data.password_confirmation && data.password !== data.password_confirmation) {
            setError('password_confirmation', 'Passwords do not match');
        } else {
            clearErrors('password_confirmation');
        }
    }, [data.password, data.password_confirmation]);

    const isFormInvalid = !data.password || !data.password_confirmation || Object.keys(errors).length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/password-reset-save');
    };

    return (
        <div className="final_bento_fix">
            <Head title="Update Password | Local Explorer" />
            <div className="bento_card">
                <div className="bento_side">
                    <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize: '60px', marginBottom: '20px' }} />
                    <h2 style={{ color: '#159c17' }}>Secure Access</h2>
                    <p style={{ color: 'yellow' }}>Enter your new password to regain access to your "Local Explorer" account.</p>
                </div>

                <div className="bento_form_side">
                    <form onSubmit={handleSubmit}>
                        <div className="bento_header">
                            <h1>New Password</h1>
                            <p>Update your credentials securely.</p>
                        </div>

                        <div style={{ marginTop: '30px' }}>
                            <div className="input_wrap">
                                <label>Target Email</label>
                                <div className="input_holder">
                                    <input type="email" value={data.email} readOnly style={{ backgroundColor: '#f8fafc', color: '#94a3b8' }} />
                                    <FontAwesomeIcon icon={faEnvelope} className="icon_fix" />
                                </div>
                            </div>

                            <div className="input_wrap">
                                <label>New Password</label>
                                <div className="input_holder">
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        onChange={(e) => setData('password', e.target.value)}
                                        value={data.password}
                                        style={{ borderColor: errors.password ? '#ef4444' : '#e2e8f0' }}
                                    />
                                    <FontAwesomeIcon icon={faLock} className="icon_fix" />
                                </div>
                            </div>

                            <div className="input_wrap">
                                <label>Confirm Password</label>
                                <div className="input_holder">
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        value={data.password_confirmation}
                                        style={{ borderColor: errors.password_confirmation ? '#ef4444' : '#e2e8f0' }}
                                    />
                                    <FontAwesomeIcon icon={faLock} className="icon_fix" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || isFormInvalid}
                                className={`bento_btn ${isFormInvalid || processing ? 'btn_disabled' : 'btn_active'}`}
                            >
                                {processing ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} spin /> Updating...
                                    </>
                                ) : (
                                    <>
                                        Update Password <FontAwesomeIcon icon={faRotate} />
                                    </>
                                )}
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <Link href="/login" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpadtePasswordForm;
