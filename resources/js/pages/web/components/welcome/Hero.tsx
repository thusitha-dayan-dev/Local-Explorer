import { faArrowRight, faMapMarkerAlt, faPlayCircle, faCloudSun, faWind, faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import heroImage from '../../../../../assect/hero_image.jpg';
import axios from 'axios';
import type { WeatherData } from '@/types/web';
import { Cloud, Sun, CloudRain, CloudLightning, Wind, CloudSun } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';

const Hero = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const getWeather = async () => {
        try {
            const response = await axios.get('/api/weather', {
                params: { lat: 7.87, lon: 80.65 },
            });
            setWeather(response.data);
        } catch (error) {
        }
    };

    useEffect(() => {
        getWeather();
    }, []);

    const getWeatherIcon = (condition: string) => {
        switch (condition) {
            case 'Clear':
                return <Sun size={48} color="#facc15" strokeWidth={1.5} />;
            case 'Clouds':
                return <CloudSun size={48} color="#94a3b8" strokeWidth={1.5} />;
            case 'Rain':
            case 'Drizzle':
                return <CloudRain size={48} color="#3b82f6" strokeWidth={1.5} />;
            case 'Thunderstorm':
                return <CloudLightning size={48} color="#ef4444" strokeWidth={1.5} />;
            default:
                return <Cloud size={48} color="#64748b" strokeWidth={1.5} />;
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }
        }
    };

    const imageSideVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 1, ease: "easeOut" }
        }
    };

    return (
        <section className="hero_ultra_modern">
            <motion.div
                className="container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="hero_grid">
                    <div className="content_side">
                        <motion.div variants={fadeInUp} className="top_badge">
                            <span className="dot"></span>
                            <span className="text">Dambulla's #1 Trip Planner</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="hero_title">
                            One Day. <br />
                            <span className="gradient_text">Infinite Memories.</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="hero_para">
                            Don't just visit, experience. We've mapped out 28+ iconic destinations within 25km of Dambulla so you can plan the perfect 24-hour escape.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="cta_group">
                            <Link href={route('trip.plan')} className="btn">
                                Start Planning <FontAwesomeIcon icon={faArrowRight} />
                            </Link>
                            <Link className="btn_video btn" href={route('guide')}>
                                <FontAwesomeIcon icon={faPlayCircle} /> <span>Watch Guide</span>
                            </Link>
                        </motion.div>
                    </div>

                    <div className="image_side">
                        <motion.div
                            className="image_wrapper"
                            variants={imageSideVariants}
                        >
                            <div className="organic_shape">
                                <img src={heroImage} alt="Dambulla Landscapes" />
                            </div>

                            {weather && weather.weather?.[0] ? (
                                <motion.div
                                    className="weather_glass_card"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1, duration: 0.8 }}
                                >
                                    <div className="weather_head">
                                        <div className="icon_wrapper">{getWeatherIcon(weather?.weather[0].main || '')}</div>
                                        <div className="weather_info">
                                            <span className="temp">{weather?.main.temp}</span>
                                            <span className="condition">{weather?.weather[0].description}</span>
                                        </div>
                                    </div>
                                    <div className="weather_stats">
                                        <div className="w_stat">
                                            <FontAwesomeIcon icon={faWind} />
                                            <span>{Math.round((weather?.wind?.speed || 0) * 3.6)} km/h</span>
                                        </div>
                                        <div className="w_stat">
                                            <FontAwesomeIcon icon={faTemperatureHigh} />
                                            <span>RealFeel {Math.round(weather?.main?.feels_like || 0)}°</span>
                                        </div>
                                    </div>
                                    <div className="location_label">Dambulla Live</div>
                                </motion.div>
                            ) : (
                                <div className="weather_glass_card">
                                    <p>Loading weather...</p>
                                </div>
                            )}

                            <motion.div
                                className="floating_card top_loc"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
                                <span>28+ Locations</span>
                            </motion.div>

                            <motion.div
                                className="floating_card bottom_social"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                            >
                                <div className="avatars">
                                    <div className="avatar"></div>
                                    <div className="avatar"></div>
                                    <div className="avatar"></div>
                                </div>
                                <span>Join 1k+ Explorers</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
