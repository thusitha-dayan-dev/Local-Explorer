import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt, faEnvelope, faPhoneAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="premium_footer">
            <div className="footer_top">
                <div className="custom_container">
                    <div className="footer_grid">
                        <div className="footer_col brand_col">
                            <h2 className="footer_logo">
                                Local<span>Explorer</span>
                            </h2>
                            <p className="brand_desc">
                                Discover the hidden gems of Dambulla. We provide the best day-trip planning experience for local and foreign
                                travelers.
                            </p>
                            <div className="social_links">
                                <a href="#">
                                    <FontAwesomeIcon icon={faFacebookF} />
                                </a>
                                <a href="#">
                                    <FontAwesomeIcon icon={faInstagram} />
                                </a>
                                <a href="#">
                                    <FontAwesomeIcon icon={faTwitter} />
                                </a>
                                <a href="#">
                                    <FontAwesomeIcon icon={faYoutube} />
                                </a>
                            </div>
                        </div>
                        <div className="footer_col">
                            <h4 className="col_title">Quick Links</h4>
                            <ul className="footer_links">
                                <li>
                                    <a href="/">Home</a>
                                </li>
                                <li>
                                    <a href="#all-places-section">Destinations</a>
                                </li>
                                <li>
                                    <a href="/about">About Us</a>
                                </li>
                                <li>
                                    <Link href={route('trip.plan')}>Plan a Trip</Link>
                                </li>
                                <li>
                                    <Link href={route('guide')}>Watch Guide</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer_col">
                            <h4 className="col_title">Contact Us</h4>
                            <ul className="contact_list">
                                <li>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                    <span>Dambulla, Sri Lanka</span>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faPhoneAlt} />
                                    <span>+94 66 228 4567</span>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    <span>hello@localexplorer.lk</span>
                                </li>
                            </ul>
                        </div>
                        <div className="footer_col newsletter_col">
                            <h4 className="col_title">Stay Updated</h4>
                            <p>Subscribe to get the latest travel updates and offers.</p>
                            <form className="newsletter_form" onSubmit={(e) => e.preventDefault()}>
                                <input type="email" placeholder="Your Email" />
                                <button type="submit">
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer_bottom">
                <div className="custom_container">
                    <div className="bottom_inner">
                        <p>&copy; {currentYear} Local Explorer. All Rights Reserved.</p>
                        <p>Designed with Thusitha Dayan</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
