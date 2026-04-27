import React, { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeCircleCheck, faRotateBack, faSpinner, faArrowLeft, faLightbulb, faInbox } from '@fortawesome/free-solid-svg-icons';

interface PageProps {
    user_auth_cooldown: number;
    [key: string]: any;
}

const ShowEmailSend = ({ email }: any) => {
    const [Email, setEmail] = useState(email);
    const [isResent, setIsResent] = useState(false);
    const { user_auth_cooldown } = usePage<PageProps>().props;
    const [timer, setTimer] = useState(0);

    const { data, setData, post, processing } = useForm({
        email: Email,
    });

    const [isDesable, setIsDesable] = useState(true);

    useEffect(() => {
        setTimer(user_auth_cooldown > 0 ? Math.floor(user_auth_cooldown) : 0);
    }, [user_auth_cooldown]);

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        setIsDesable(!data.email || timer > 0);
    }, [data.email, timer]);

    useEffect(() => {
        const savedEmail = email || localStorage.getItem('user_reset_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setData('email', savedEmail);
            if (email) localStorage.setItem('user_reset_email', email);
        }
    }, [email]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/forget-password-send', {
            onSuccess: () => setIsResent(true),
        });
    };

    return (
        <section className="bento_auth_container">
            <Head title="Check Your Email | Local Explorer" />

            <div className="auth_glass_panel email_sent_layout">
                <div className="visual_section_compact email_bg">
                    <div className="image_overlay"></div>
                    <div className="floating_status_box">
                        <div className="icon_circle green">
                            <FontAwesomeIcon icon={faInbox} />
                        </div>
                        <div className="text_info">
                            <strong>Inbox Waiting</strong>
                            <span>Check your mail now</span>
                        </div>
                    </div>
                </div>

                <div className="form_section_main">
                    <div className="loging_page_main text_center">
                        <div className="success_icon_wrapper">
                            <FontAwesomeIcon icon={faEnvelopeCircleCheck} className="main_success_icon" />
                        </div>

                        <div className="hedder">
                            <h1>Check your email</h1>
                            <p>We've {isResent ? <b className="highlight_text">resent</b> : 'sent'} a password reset link to:</p>
                            <span className="user_email_display">{Email}</span>
                        </div>

                        <div className="page_main_layout">
                            <form className="resend_action" onSubmit={handleSubmit}>
                                <button
                                    type="submit"
                                    disabled={processing || isDesable}
                                    className={isDesable || processing ? 'desabled_btn' : 'resend_btn'}
                                >
                                    {processing ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} spin /> Resending...
                                        </>
                                    ) : timer > 0 ? (
                                        <>Resend in {timer}s</>
                                    ) : (
                                        <>
                                            Request a new one <FontAwesomeIcon icon={faRotateBack} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="premium_info_box">
                                <FontAwesomeIcon icon={faLightbulb} className="tip_icon" />
                                <p>
                                    <strong>Tip:</strong> If you don't see the email, please check your <b>Spam</b> or <b>Junk</b> folder.
                                </p>
                            </div>
                        </div>

                        <div className="switch_massage mt_30">
                            <span className="switcher">
                                Wrong email?{' '}
                                <Link href={'/forget-password'} className="link_text">
                                    Change it
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShowEmailSend;
