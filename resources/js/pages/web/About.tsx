import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faRoute, faUsers, faHeart } from '@fortawesome/free-solid-svg-icons';
import Nav from './components/welcome/Nav';
import Footer from './components/welcome/Footer';
import { User } from '@/types/web';
import { Head, router } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface PageProps {
    userInfore: User;
}

const About = ({ userInfore }: PageProps) => {
    const [data, setData] = useState({
        place_count: 0,
        trip_count: 0,
     });

    const fetchDetails = async () => {
        try{
            const response = await fetch(route('api.get.details'));
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result);
        } catch(error){
            console.error('Error fetching details:', error);
        }
    }

    useEffect(()=>{
        fetchDetails();
    },[]);


    return (
        <div className="about_premium_page">
            <Head title="About" />
            <Nav index={5} userInfore={userInfore} />
            <section className="about_hero">
                <div className="custom_container">
                    <h1>
                        Connecting You to the <span>Heart of Dambulla</span>
                    </h1>
                    <p>We are more than just a travel guide; we are your local companion in discovering the soul of Sri Lanka's cultural triangle.</p>
                </div>
            </section>
            <section className="mission_section">
                <div className="custom_container">
                    <div className="mission_grid">
                        <div className="mission_text">
                            <h2>Our Story</h2>
                            <p>
                                Started in the heart of Dambulla, <strong>Local Explorer</strong> was born out of a passion to showcase the authentic
                                beauty of our hometown to the world. We realized that many travelers miss out on hidden gems because they lack a
                                proper guide or a plan.
                            </p>
                            <p>
                                Our platform simplifies travel by providing a smart day-visit planner, ensuring you spend less time searching and more
                                time experiencing.
                            </p>
                        </div>
                        <div className="mission_stats">
                            <div className="stat_card">
                                <FontAwesomeIcon icon={faMapMarkedAlt} />
                                <h3>{data.place_count}+</h3>
                                <p>Destinations</p>
                            </div>
                            <div className="stat_card">
                                <FontAwesomeIcon icon={faRoute} />
                                <h3>{data.trip_count}+</h3>
                                <p>Trips Planned</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="why_us_section">
                <div className="custom_container">
                    <div className="section_header">
                        <h2>Why Choose Local Explorer?</h2>
                        <p>Built by locals, for the world.</p>
                    </div>
                    <div className="features_grid">
                        <div className="feature_item">
                            <div className="icon_box">
                                <FontAwesomeIcon icon={faUsers} />
                            </div>
                            <h4>Expert Local Knowledge</h4>
                            <p>Every location on our platform is personally verified by residents of Dambulla.</p>
                        </div>
                        <div className="feature_item">
                            <div className="icon_box">
                                <FontAwesomeIcon icon={faHeart} />
                            </div>
                            <h4>Sustainable Tourism</h4>
                            <p>We promote eco-friendly travel and support local small businesses in the area.</p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default About;
