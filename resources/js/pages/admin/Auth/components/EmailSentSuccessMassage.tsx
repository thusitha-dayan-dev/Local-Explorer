import React, { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
('@fortawesome/react-fontawesome');
import { faEnvelope, faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';
import { faEnvelopeCircleCheck, faLeftLong, faRotateBack, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface PageProps {
    auth_cooldown: number;
    [key: string]: any;
}

const EmailSentSuccessMassage = ({ email }: any) => {
    const [Email, setEmail] = useState(email);
    const [isResent, setIsResent] = useState(false);
    const { auth_cooldown } = usePage<PageProps>().props;
    const [timer, setTimer] = useState(0);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: Email,
    });

    const [isDesable, setIsDesable] = useState(true);

    useEffect(() => {
        if (auth_cooldown > 0) {
            setTimer(Math.floor(auth_cooldown));
        } else {
            setTimer(0);
        }
    }, [auth_cooldown]);
    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [timer > 0]);

    useEffect(() => {
        const isFormEmpty = !data.email || timer > 0;

        if (isFormEmpty) {
            setIsDesable(true);
        } else {
            setIsDesable(false);
        }
    }, [data, errors]);

    useEffect(() => {
        const savedEmail = email || localStorage.getItem('reset_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setData('email', savedEmail);
            if (email) localStorage.setItem('reset_email', email);
        }
    }, [email, timer]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/forget-password-send', {
            onSuccess: () => {
                setIsResent(true);
            },
        });
    };

    return (
        <section className="center_form">
            <Head title="Check Your Email" />
            <div className="loging_page_main">
                <div className="hedder">
                    <h2>Check your email</h2>
                    <span className="title">You didn't receive the message Click Request a new one.</span>
                </div>
                <div className="page_main_layout">
                    <div className="icon_send_massage">
                        <FontAwesomeIcon icon={faEnvelopeCircleCheck} className="email_icon" />
                        <p className="massage">
                            {isResent ? (
                                <>
                                    <span>
                                        We've <b style={{ color: '#121bbc' }}>resent</b> the password reset link to:
                                    </span>
                                </>
                            ) : (
                                <>We've sent a password reset link to:</>
                            )}
                            <span className="user_email">{Email}</span>
                        </p>
                    </div>

                    <form className="resend_massage" onSubmit={handleSubmit}>
                        <button type="submit" disabled={processing || isDesable} className={isDesable || processing ? 'desabled' : ''}>
                            {processing ? (
                                <>
                                    Resending Email
                                    <FontAwesomeIcon
                                        icon={faSpinner}
                                        className="rotet_icon_main"
                                        style={{ marginLeft: '10px', fontSize: '1.2rem' }}
                                    />
                                </>
                            ) : isDesable ? (
                                <>Resend in {timer}s</>
                            ) : (
                                <>
                                    <span>Request a new one</span>
                                    <FontAwesomeIcon icon={faRotateBack} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="info_box">
                        <span className="main_span">
                            <span>💡</span>
                            <span>
                                <b>Tip:</b> If you don't see the email, please check your <b>Spam</b> or <b>Junk</b> folder.
                            </span>
                        </span>
                    </div>
                </div>
                <div className="switch_massage">
                    <span className="switcher">
                        <span>Wrong email?</span>
                        <Link href={'/admin/forget-password'} className="link">
                            Change it
                        </Link>
                    </span>
                </div>
            </div>
        </section>
    );
};

export default EmailSentSuccessMassage;
