import { PlaceReview } from '@/types/web';
import { faClock, faEye, faEyeSlash, faStar } from '@fortawesome/free-regular-svg-icons';
import {
    faEnvelopeOpenText,
    faKey,
    faChartLine,
    faMapMarkedAlt,
    faShieldAlt,
    faSync,
    faUserShield,
    faTools,
    faUserCheck,
    faRedo,
    faUserLock,
} from '@fortawesome/free-solid-svg-icons';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { number } from 'framer-motion';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const countrys = ['Sri Lanka', 'Other'];

export const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
};

//utils.ts
export const signupPageData = {
    hedder: 'Explore Day Out near Dambulla Sri Lanka',
    title: 'Create your Explore Lanka account today and curate your ultimate getaway in the heart of Dambulla, Sri Lanka.',
    list: [
        {
            icon: faMapMarkedAlt,
            hed: 'Top Rated Locations',
            massage: 'Curated list of Dambulla’s best secret and popular spots.',
            iconColor: '#ea3636',
        },
        {
            icon: faClock,
            hed: 'Instant Itinerary',
            massage: 'Generate your personalized Dambulla trip in seconds.',
            iconColor: '#f3e928',
        },
    ],
};

export const logingPageData = {
    hedder: 'Welcome Back to Local Explore',
    title: 'Log in to access your personalized itineraries and saved gems in Dambulla.',
    list: [
        {
            icon: faShieldAlt,
            hed: 'Secure Access',
            massage: 'Your account is protected with industry-standard encryption to keep your travel data safe.',
            iconColor: '#22c55e',
        },
        {
            icon: faSync,
            hed: 'Personalized Trips',
            massage: 'Pick up right where you left off and manage your upcoming adventures in Dambulla.',
            iconColor: '#3b82f6',
        },
        {
            icon: faStar,
            hed: 'Exclusive Offers',
            massage: 'Access special discounts and local offers available only to our registered explorers.',
            iconColor: '#f59e0b',
        },
    ],
};

export const forgetPasswordData = {
    hedder: 'Reset Access to Local Explore Account',
    title: "Don't worry, it happens to the best of us. We'll help you get back into your account in no time.",
    list: [
        {
            icon: faKey,
            hed: 'Account Recovery',
            massage: 'Lost your access? Don’t worry, we’ll help you secure your account and set a new password in minutes.',
            iconColor: '#22d3ee',
        },
        {
            icon: faEnvelopeOpenText,
            hed: 'Magic Link Sent',
            massage: 'Check your inbox for a secure verification link to verify your identity and regain access instantly.',
            iconColor: '#f3e928',
        },
        {
            icon: faUserShield,
            hed: 'Privacy Guaranteed',
            massage: 'Your recovery process is protected with multi-layer security to ensure only you can access your account.',
            iconColor: '#22c55e',
        },
    ],
};

export const adminLoginData = {
    hedder: 'Admin Control Center Explore Account',
    title: "Welcome back, Admin. Log in to your secure dashboard to manage the heart of Dambulla's adventures and platform operations.",
    list: [
        {
            icon: faUserShield,
            hed: 'Authorized Access Only',
            massage: 'Secure administrative portal. Please verify your credentials to manage the Explore Lanka platform.',
            iconColor: '#22d3ee',
        },
        {
            icon: faChartLine,
            hed: 'Platform Insights',
            massage: 'Monitor real-time analytics, user bookings, and trending spots across Dambulla.',
            iconColor: '#f3e928',
        },
        {
            icon: faTools,
            hed: 'Full Control',
            massage: 'Manage content, update itineraries, and oversee system configurations seamlessly.',
            iconColor: '#22c55e',
        },
    ],
};

export const adminResetPassword = {
    hedder: 'Admin Control Center Account Reset Password',
    title: "We’ve initiated the recovery process for your Explore Lanka account. Follow the instructions in the email to regain access to Dambulla's best experiences.",
    list: [
        {
            icon: faEnvelopeOpenText,
            hed: 'Check Your Inbox',
            massage: 'We’ve sent a secure password reset link to your email address. Please check your inbox and spam folder.',
            iconColor: '#22d3ee',
        },
        {
            icon: faUserCheck,
            hed: 'Verify Identity',
            massage: 'Click on the link inside the email to verify it’s you and proceed to create your new password.',
            iconColor: '#22c55e',
        },
        {
            icon: faRedo,
            hed: 'Didn’t get the email?',
            massage: 'Wait a few minutes before requesting another link, or ensure your email address was entered correctly.',
            iconColor: '#f3e928',
        },
    ],
};

export const adminUpdatePassword = {
    hedder: 'Admin Control Center Secure Password Update',
    title: "You're just one step away from securing your account. Create a new, strong password to protect access.",
    list: [
        {
            icon: faKey,
            hed: 'Strong Password',
            massage: 'Use at least 6 characters with a mix of letters, numbers, and symbols to ensure your account stays secure.',
            iconColor: '#22d3ee',
        },
        {
            icon: faShieldAlt,
            hed: 'Privacy Guaranteed',
            massage: 'Your password is encrypted with multi-layer security. We never share your credentials with anyone.',
            iconColor: '#22c55e',
        },
        {
            icon: faUserLock,
            hed: 'Account Safety',
            massage: 'Updating your password will secure your account and grant you instant access to the dashboard.',
            iconColor: '#f3e928',
        },
    ],
};

export const userUpdatePassword = {
    hedder: 'User Control Center Secure Password Update',
    title: "You're just one step away from securing your account. Create a new, strong password to protect access.",
    list: [
        {
            icon: faKey,
            hed: 'Strong Password',
            massage: 'Use at least 6 characters with a mix of letters, numbers, and symbols to ensure your account stays secure.',
            iconColor: '#22d3ee',
        },
        {
            icon: faShieldAlt,
            hed: 'Privacy Guaranteed',
            massage: 'Your password is encrypted with multi-layer security. We never share your credentials with anyone.',
            iconColor: '#22c55e',
        },
        {
            icon: faUserLock,
            hed: 'Account Safety',
            massage: 'Updating your password will secure your account and grant you instant access to the dashboard.',
            iconColor: '#f3e928',
        },
    ],
};

export const WebResetPassword = {
    hedder: 'User Control Center Account Reset Password',
    title: "We’ve initiated the recovery process for your Explore Lanka account. Follow the instructions in the email to regain access to Dambulla's best experiences.",
    list: [
        {
            icon: faEnvelopeOpenText,
            hed: 'Check Your Inbox',
            massage: 'We’ve sent a secure password reset link to your email address. Please check your inbox and spam folder.',
            iconColor: '#22d3ee',
        },
        {
            icon: faUserCheck,
            hed: 'Verify Identity',
            massage: 'Click on the link inside the email to verify it’s you and proceed to create your new password.',
            iconColor: '#22c55e',
        },
        {
            icon: faRedo,
            hed: 'Didn’t get the email?',
            massage: 'Wait a few minutes before requesting another link, or ensure your email address was entered correctly.',
            iconColor: '#f3e928',
        },
    ],
};

export const userProfileCreater = (fullName: string): string => {
    const firstLetter = fullName.charAt(0).toUpperCase();
    const secondLetter = fullName.trimStart().charAt(0).toLocaleUpperCase();
    return firstLetter + secondLetter;
};

export const getDateTime = (isoString: string): string => {
    const dateObj = new Date(isoString);

    const date = dateObj.toLocaleDateString('en-CA');

    const time = dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    return `${date} | ${time}`;
};

export const UseClickOutSide = (ref: any, handler: any) => {
    useEffect(() => {
        const listener = (event: any) => {
            if (!ref.current || ref.current.contains(event.traget)) {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

export const calculateTotalRating = (reviews: PlaceReview[]): number => {
    if (!reviews || reviews.length === 0) {
        return 0;
    }
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);

    const avarage = total / reviews.length;

    return Math.round(avarage * 10) / 10;
};

export const FormatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return new Date(dateString).toLocaleDateString('en-US', options);
};

export const FormatDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
    }
    return `${minutes}m`;
};
