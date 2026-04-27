import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Head, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

const AdminUpdatePasswordForm = ({ token, email }: any) => {
    const { data, setData, setError, post, processing, errors, clearErrors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const isFormInvalid = !data.password || !data.password_confirmation || Object.keys(errors).length > 0;

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/rest-password/save');
    };

    return (
        <section className="center_form">
            <Head title="Admin Reset Password" />
            <form className="loging_page_main" onSubmit={handleSubmit}>
                <div className="hedder">
                    <h1>Update New Password</h1>
                    <span className="title">Fill infor for secure rest flow</span>
                </div>
                <div className="login_form_input_main">
                    <div className="input_gorup">
                        <label htmlFor="email" key={'email'}>
                            Email Address
                        </label>
                        <div className="holder">
                            <input
                                type="email"
                                className="form_input"
                                name="email"
                                id="email"
                                placeholder="Email Address"
                                value={data.email}
                                readOnly={true}
                            />
                            <FontAwesomeIcon icon={faEnvelope} className="icons_input" />
                        </div>
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <div className="input_gorup">
                        <label htmlFor="password">New Password</label>
                        <div className="holder">
                            <input
                                type="password"
                                className="form_input"
                                name="password"
                                id="password"
                                placeholder="New Password"
                                onChange={(e) => setData('password', e.target.value)}
                                value={data.password}
                            />
                            <FontAwesomeIcon icon={faLock} className="icons_input" />
                        </div>
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    <div className="input_gorup">
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <div className="holder">
                            <input
                                type="password"
                                className="form_input"
                                name="confirm_password"
                                id="confirm_password"
                                placeholder="Confirm Password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                value={data.password_confirmation}
                            />
                            <FontAwesomeIcon icon={faLock} className="icons_input" />
                        </div>
                        {errors.password_confirmation && <span className="error">{errors.password_confirmation}</span>}
                    </div>
                    <div className="sibmit_buttons">
                        <button type="submit" disabled={processing || isFormInvalid} className={isFormInvalid || processing ? 'desabled' : ''}>
                            {processing ? 'Updating Password...' : 'Update New Password'}
                        </button>
                    </div>
                    <div className="switch_massage">
                        <span className="switcher">
                            Remember your password?{' '}
                            <Link className="link" href={'/login'}>
                                Log in
                            </Link>
                        </span>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default AdminUpdatePasswordForm;
