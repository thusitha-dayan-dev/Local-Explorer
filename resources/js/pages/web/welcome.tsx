import { Head, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Nav from './components/welcome/Nav';
import Hero from './components/welcome/Hero';
import MostPopularPlace from './components/welcome/MostPopularPlace';
import AllPlaces from './components/welcome/AllPlaces';
import Footer from './components/welcome/Footer';
import { Place, User } from '@/types/web';
import WelcomeSuccessToast from './notification/WelcomeSuccessToast';
import ErrorToast from './notification/ErrorToast';

interface PageProps {
    allPlaces: any;
    category: any;
    subCategory: any;
    userInfore: User;
    wishlistIds: any[];
}

const Welcome = ({ allPlaces, category, userInfore, wishlistIds }: PageProps) => {
    const [activeIndex, setActiveIndex] = useState(1);
    useEffect(() => {
        const sections = [
            { id: 'hero-section', index: 1 },
            { id: 'all-places-section', index: 2 },
        ];
        const observerOptions = {
            root: null,
            threshold: 0,
        };
        const scrollToSection = (id: string) => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        };
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target.id === 'all-places-section') {
                        setActiveIndex(2);
                    } else if (entry.target.id === 'hero-section') {
                        setActiveIndex(1);
                    }
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const [showToast,setShowToast] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState({
        isOpen: false,
        message: '',
    });

    const {flash} = usePage<any>().props;

    useEffect(()=> {
        if (flash.success) {
            setShowToast(true);
            setMessage(flash.success);

            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    useEffect(()=> {
        if (flash.error) {
            setErrorMessage({...errorMessage, isOpen: true, message: flash.error});
        }
    }, [flash.error]);

    return (
        <main className="main_content">
            <WelcomeSuccessToast message={message} isVisible={showToast} onClose={()=> setShowToast(false)}/>
            <ErrorToast message={errorMessage.message} onClose={()=> setErrorMessage({...errorMessage, isOpen: false, message: ''})} show={errorMessage.isOpen}/>
            <Head title="Home" />
            <Nav index={activeIndex} userInfore={userInfore} />

            <div id="hero-section">
                <Hero />
            </div>
            <MostPopularPlace wishlistIds={wishlistIds} />
            <div id="all-places-section">
                <AllPlaces allPlaces={allPlaces} categories={category} wishlistIds={wishlistIds} />
            </div>
            <Footer />
        </main>
    );
};

export default Welcome;
