import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LayoutGrid, Navigation, CheckCircle2, CloudSun } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faCloudSun, faCloud, faCloudShowersHeavy, faBolt, faWind } from '@fortawesome/free-solid-svg-icons';
import { WeatherData } from '@/types/web';

interface PageProps {
    cardData: Card;
}

interface Card {
    all: number;
    onGoing: number;
    complete: number;
}

const TripPlanCard = ({ cardData }: PageProps) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);

    useEffect(() => {
        const getWeather = async () => {
            try {
                const response = await axios.get('/api/weather', { params: { lat: 7.87, lon: 80.65 } });
                setWeather(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        getWeather();
    }, []);

    const getWeatherIcon = (iconCode: string) => {
        const iconProps = { className: 'weather_svg' };
        switch (iconCode) {
            case '01d':
                return <FontAwesomeIcon icon={faSun} {...iconProps} style={{ color: '#ffca2c' }} beat />;
            case '10d':
                return <FontAwesomeIcon icon={faCloudShowersHeavy} {...iconProps} style={{ color: '#17a2b8' }} bounce />;
            default:
                return <FontAwesomeIcon icon={faCloudSun} {...iconProps} style={{ color: '#48a111' }} />;
        }
    };

    const stats = [
        { label: 'Total Plans', count: cardData.all, icon: <LayoutGrid size={24} />, cls: 'primary' },
        { label: 'Ongoing', count: cardData.onGoing, icon: <Navigation size={24} />, cls: 'success' },
        { label: 'Completed', count: cardData.complete, icon: <CheckCircle2 size={24} />, cls: 'info' },
    ];

    return (
        <section className="stats_container">
            {stats.map((item, i) => (
                <div key={i} className={`stat_card_new ${item.cls}`}>
                    <div className="icon_box">{item.icon}</div>
                    <div className="info_box">
                        <span className="label">{item.label}</span>
                        <h2 className="value">{item.count.toString().padStart(2, '0')}</h2>
                    </div>
                </div>
            ))}

            <div className="stat_card_new weather_card_premium">
                <div className="info_box">
                    <span className="label">Dambulla Now</span>
                    <h2 className="value">{weather ? `${Math.round(weather.main.temp)}°C` : '--°C'}</h2>
                    <p className="desc">{weather?.weather[0].description || 'Updating...'}</p>
                </div>
                <div className="weather_visual">{weather ? getWeatherIcon(weather.weather[0].icon) : <CloudSun className="shimmer_icon" />}</div>
            </div>
        </section>
    );
};

export default TripPlanCard;
