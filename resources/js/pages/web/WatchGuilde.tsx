import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { MousePointer2 } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { route } from 'ziggy-js';

import img1 from '../../../assect/img/cave_temple.jpg';
import img2 from '../../../assect/img/sigiriya_image.jpg';
import img3 from '../../../assect/img/sunrise.jpg';
import img4 from '../../../assect/img/traditional_food.jpg';
import img5 from '../../../assect/img/wild_elephant.jpg';
import Nav from './components/welcome/Nav';
import Footer from './components/welcome/Footer';

export default function WatchGuide({ userInfore }: any) {
    const mosaicImages = [
        { src: img2, alt: 'Sigiriya Rock', tag: 'The Ancient Fortress' },
        { src: img1, alt: 'Cave Temple', tag: 'Spiritual Heritage' },
        { src: img5, alt: 'Wildlife', tag: 'Nature Unfiltered' },
        { src: img4, alt: 'Traditional Food', tag: 'Village Flavors' },
        { src: img3, alt: 'Sunrise View', tag: 'Golden Hour' },
    ];

    return (
        <section className="main_section">
            <Head title="Visual Guide" />

            <Nav index={4} userInfore={userInfore} />

            <div className="premium_mosaic_container">
                <header className="v_header">
                    <span className="v_tag">Experience Dambulla</span>
                    <h1>
                        A Visual <span className="green_txt">Masterpiece</span>
                    </h1>
                    <p>From rock fortresses to wild safaris, discover Dambulla through our curated lens. No videos, just moments.</p>
                    <div className="scroll_indicator">
                        <MousePointer2 size={16} /> <span>Scroll down to explore</span>
                    </div>
                </header>
                <section className="v_mosaic_grid">
                    <div className="grid_mosaic">
                        <div className="mosaic_item m_hero">
                            <img src={mosaicImages[0].src} alt={mosaicImages[0].alt} />
                            <div className="item_overlay">
                                <div className="item_tag">{mosaicImages[0].tag}</div>
                            </div>
                        </div>

                        <div className="mosaic_item m_stack_1">
                            <img src={mosaicImages[1].src} alt={mosaicImages[1].alt} />
                            <div className="item_overlay">
                                <div className="item_tag">{mosaicImages[1].tag}</div>
                            </div>
                        </div>

                        <div className="mosaic_item m_stack_2">
                            <img src={mosaicImages[2].src} alt={mosaicImages[2].alt} />
                            <div className="item_overlay">
                                <div className="item_tag">{mosaicImages[2].tag}</div>
                            </div>
                        </div>

                        <div className="mosaic_item m_wide">
                            <img src={mosaicImages[3].src} alt={mosaicImages[3].alt} />
                            <div className="item_overlay">
                                <div className="item_tag">{mosaicImages[3].tag}</div>
                            </div>
                        </div>

                        <div className="mosaic_item m_square">
                            <img src={mosaicImages[4].src} alt={mosaicImages[4].alt} />
                            <div className="item_overlay">
                                <div className="item_tag">{mosaicImages[4].tag}</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="v_cta">
                    <div className="cta_card">
                        <h2>Inspired by what you see?</h2>
                        <p>Build your own personalized, unforgettable 24-hour adventure in Dambulla.</p>
                        <Link className="v_btn_primary hero_para" href={route('trip.plan')}>
                            Start Planning <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                </section>
            </div>

            <Footer />
        </section>
    );
}
