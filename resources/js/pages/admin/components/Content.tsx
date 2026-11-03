import { faCloudMoon, faCloudRain, faGlobe, faMap, faMoon, faStar, faUser, faWind } from '@fortawesome/free-solid-svg-icons';
import { faSun, faCloud, faCloudShowersHeavy, faCloudSun, faBolt, faSnowflake, faSmog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import type { WeatherData } from '@/types/web';
import Hedder from './Hedder';
import TopTenPlace from './TopTenPlace';
import VisitorChart from './VisitorChart';

interface ContentProps {
    chartData: { name: string; count: number }[];
    PlaceCount: number;
    cardData: [usersCount: number, reviewsCount: number] | null;
    place: places[];
    user: any;
}

interface places {
    id: number;
    place_name: string;
    selection_count: number;
    created_at: string;
    updated_at: string;
    main_image_path: string;
    category_name: string;
    slug: string;
}

const Content = ({ chartData, PlaceCount, cardData, place, user }: ContentProps) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);

    const getWeather = async () => {
        try {
            const response = await axios.get('/api/weather', {
                params: { lat: 7.87, lon: 80.65 },
            });
            setWeather(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getWeather();
    }, []);

    const getWeatherIcon = (iconCode: string) => {
        const commonStyle = { filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' };

        switch (iconCode) {
            case '01d':
                return <FontAwesomeIcon className="icon" icon={faSun} size="2x" style={{ ...commonStyle, color: '#FFD700' }} beat />;

            case '01n':
                return <FontAwesomeIcon className="icon" icon={faMoon} size="2x" style={{ ...commonStyle, color: '#F0E68C' }} />;

            case '02d':
                return <FontAwesomeIcon className="icon" icon={faCloudSun} size="2x" style={{ ...commonStyle, color: '#FFA500' }} />;

            case '03d':
            case '03n':
            case '04d':
            case '04n':
                return <FontAwesomeIcon className="icon" icon={faCloud} size="2x" style={{ ...commonStyle, color: '#808080' }} />;

            case '09d':
            case '09n':
                return <FontAwesomeIcon className="icon" icon={faCloudRain} size="2x" style={{ ...commonStyle, color: '#4682B4' }} />;

            case '10d':
            case '10n':
                return <FontAwesomeIcon className="icon" icon={faCloudShowersHeavy} size="2x" style={{ ...commonStyle, color: '#0000FF' }} bounce />;

            case '11d':
            case '11n':
                return <FontAwesomeIcon className="icon" icon={faBolt} size="2x" style={{ ...commonStyle, color: '#FFFF00' }} fade />;

            case '13d':
            case '13n':
                return <FontAwesomeIcon className="icon" icon={faSnowflake} size="2x" style={{ ...commonStyle, color: '#ADD8E6' }} spin />;

            case '50d':
            case '50n':
                return <FontAwesomeIcon className="icon" icon={faSmog} size="2x" style={{ ...commonStyle, color: '#D3D3D3' }} />;

            default:
                return <FontAwesomeIcon className="icon" icon={faWind} size="2x" style={{ ...commonStyle, color: '#B0C4DE' }} />;
        }
    };

    return (
        <main className="dashboard_content">
            <Hedder data={user} />
            <main className="content_layout">
                <div className="card_layout">
                    <div className="card">
                        <div className="card_icon">
                            <FontAwesomeIcon icon={faGlobe} className="icon" style={{ color: '#46a0e9' }} />
                        </div>
                        <div className="card_content">
                            <span className="card_hedder">Total Destinations</span>
                            <div className="title_layout">
                                <span className="title">{PlaceCount}</span>
                                <span className="sub_title">Place</span>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card_icon">
                            <FontAwesomeIcon icon={faUser} className="icon" style={{ color: '#2c34d0ff' }} />
                        </div>
                        <div className="card_content">
                            <span className="card_hedder">Total Guides</span>
                            <div className="title_layout">
                                <span className="title">{cardData?.[0]}</span>
                                <span className="sub_title">Guides</span>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card_icon">
                            <FontAwesomeIcon icon={faStar} className="icon" style={{ color: '#f4d825' }} />
                        </div>
                        <div className="card_content">
                            <span className="card_hedder">Total Reviews</span>
                            <div className="title_layout">
                                <span className="title">{cardData?.[1]}</span>
                                <span className="sub_title">Reviews</span>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card_icon">{getWeatherIcon(weather?.weather?.[0]?.icon || '')}</div>
                        <div className="card_content">
                            <span className="card_hedder">Today's Weather</span>
                            <div className="title_layout">
                                <span className="title">{weather?.main?.temp ? `${Math.round(weather.main.temp)}°C` : '--'}</span>
                            </div>
                            <span className="sub_title">
                                {weather && weather.weather && weather.weather.length > 0 ? weather.weather[0].description : 'Loading weather...'}
                            </span>
                        </div>
                    </div>
                </div>
                <VisitorChart data={chartData} placeCount={PlaceCount} />
                <TopTenPlace placeData={place} placeCount={PlaceCount} />
            </main>
        </main>
    );
};

export default Content;
