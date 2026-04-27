"use strict";
exports.__esModule = true;
exports.FormatDuration = exports.FormatDate = exports.calculateTotalRating = exports.UseClickOutSide = exports.getDateTime = exports.userProfileCreater = exports.WebResetPassword = exports.userUpdatePassword = exports.adminUpdatePassword = exports.adminResetPassword = exports.adminLoginData = exports.forgetPasswordData = exports.logingPageData = exports.signupPageData = exports.validateEmail = exports.countrys = exports.cn = void 0;
var free_regular_svg_icons_1 = require("@fortawesome/free-regular-svg-icons");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var clsx_1 = require("clsx");
var react_1 = require("react");
var tailwind_merge_1 = require("tailwind-merge");
function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return tailwind_merge_1.twMerge(clsx_1.clsx(inputs));
}
exports.cn = cn;
exports.countrys = ['Sri Lanka', 'Other'];
exports.validateEmail = function (email) {
    return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
//utils.ts
exports.signupPageData = {
    hedder: 'Explore Day Out near Dambulla Sri Lanka',
    title: 'Create your Explore Lanka account today and curate your ultimate getaway in the heart of Dambulla, Sri Lanka.',
    list: [
        {
            icon: free_solid_svg_icons_1.faMapMarkedAlt,
            hed: 'Top Rated Locations',
            massage: 'Curated list of Dambulla’s best secret and popular spots.',
            iconColor: '#ea3636'
        },
        {
            icon: free_regular_svg_icons_1.faClock,
            hed: 'Instant Itinerary',
            massage: 'Generate your personalized Dambulla trip in seconds.',
            iconColor: '#f3e928'
        },
    ]
};
exports.logingPageData = {
    hedder: 'Welcome Back to Local Explore',
    title: 'Log in to access your personalized itineraries and saved gems in Dambulla.',
    list: [
        {
            icon: free_solid_svg_icons_1.faShieldAlt,
            hed: 'Secure Access',
            massage: 'Your account is protected with industry-standard encryption to keep your travel data safe.',
            iconColor: '#22c55e'
        },
        {
            icon: free_solid_svg_icons_1.faSync,
            hed: 'Personalized Trips',
            massage: 'Pick up right where you left off and manage your upcoming adventures in Dambulla.',
            iconColor: '#3b82f6'
        },
        {
            icon: free_regular_svg_icons_1.faStar,
            hed: 'Exclusive Offers',
            massage: 'Access special discounts and local offers available only to our registered explorers.',
            iconColor: '#f59e0b'
        },
    ]
};
exports.forgetPasswordData = {
    hedder: 'Reset Access to Local Explore Account',
    title: "Don't worry, it happens to the best of us. We'll help you get back into your account in no time.",
    list: [
        {
            icon: free_solid_svg_icons_1.faKey,
            hed: 'Account Recovery',
            massage: 'Lost your access? Don’t worry, we’ll help you secure your account and set a new password in minutes.',
            iconColor: '#22d3ee'
        },
        {
            icon: free_solid_svg_icons_1.faEnvelopeOpenText,
            hed: 'Magic Link Sent',
            massage: 'Check your inbox for a secure verification link to verify your identity and regain access instantly.',
            iconColor: '#f3e928'
        },
        {
            icon: free_solid_svg_icons_1.faUserShield,
            hed: 'Privacy Guaranteed',
            massage: 'Your recovery process is protected with multi-layer security to ensure only you can access your account.',
            iconColor: '#22c55e'
        },
    ]
};
exports.adminLoginData = {
    hedder: 'Admin Control Center Explore Account',
    title: "Welcome back, Admin. Log in to your secure dashboard to manage the heart of Dambulla's adventures and platform operations.",
    list: [
        {
            icon: free_solid_svg_icons_1.faUserShield,
            hed: 'Authorized Access Only',
            massage: 'Secure administrative portal. Please verify your credentials to manage the Explore Lanka platform.',
            iconColor: '#22d3ee'
        },
        {
            icon: free_solid_svg_icons_1.faChartLine,
            hed: 'Platform Insights',
            massage: 'Monitor real-time analytics, user bookings, and trending spots across Dambulla.',
            iconColor: '#f3e928'
        },
        {
            icon: free_solid_svg_icons_1.faTools,
            hed: 'Full Control',
            massage: 'Manage content, update itineraries, and oversee system configurations seamlessly.',
            iconColor: '#22c55e'
        },
    ]
};
exports.adminResetPassword = {
    hedder: 'Admin Control Center Account Reset Password',
    title: "We’ve initiated the recovery process for your Explore Lanka account. Follow the instructions in the email to regain access to Dambulla's best experiences.",
    list: [
        {
            icon: free_solid_svg_icons_1.faEnvelopeOpenText,
            hed: 'Check Your Inbox',
            massage: 'We’ve sent a secure password reset link to your email address. Please check your inbox and spam folder.',
            iconColor: '#22d3ee'
        },
        {
            icon: free_solid_svg_icons_1.faUserCheck,
            hed: 'Verify Identity',
            massage: 'Click on the link inside the email to verify it’s you and proceed to create your new password.',
            iconColor: '#22c55e'
        },
        {
            icon: free_solid_svg_icons_1.faRedo,
            hed: 'Didn’t get the email?',
            massage: 'Wait a few minutes before requesting another link, or ensure your email address was entered correctly.',
            iconColor: '#f3e928'
        },
    ]
};
exports.adminUpdatePassword = {
    hedder: 'Admin Control Center Secure Password Update',
    title: "You're just one step away from securing your account. Create a new, strong password to protect access.",
    list: [
        {
            icon: free_solid_svg_icons_1.faKey,
            hed: 'Strong Password',
            massage: 'Use at least 6 characters with a mix of letters, numbers, and symbols to ensure your account stays secure.',
            iconColor: '#22d3ee'
        },
        {
            icon: free_solid_svg_icons_1.faShieldAlt,
            hed: 'Privacy Guaranteed',
            massage: 'Your password is encrypted with multi-layer security. We never share your credentials with anyone.',
            iconColor: '#22c55e'
        },
        {
            icon: free_solid_svg_icons_1.faUserLock,
            hed: 'Account Safety',
            massage: 'Updating your password will secure your account and grant you instant access to the dashboard.',
            iconColor: '#f3e928'
        },
    ]
};
exports.userUpdatePassword = {
    hedder: 'User Control Center Secure Password Update',
    title: "You're just one step away from securing your account. Create a new, strong password to protect access.",
    list: [
        {
            icon: free_solid_svg_icons_1.faKey,
            hed: 'Strong Password',
            massage: 'Use at least 6 characters with a mix of letters, numbers, and symbols to ensure your account stays secure.',
            iconColor: '#22d3ee'
        },
        {
            icon: free_solid_svg_icons_1.faShieldAlt,
            hed: 'Privacy Guaranteed',
            massage: 'Your password is encrypted with multi-layer security. We never share your credentials with anyone.',
            iconColor: '#22c55e'
        },
        {
            icon: free_solid_svg_icons_1.faUserLock,
            hed: 'Account Safety',
            massage: 'Updating your password will secure your account and grant you instant access to the dashboard.',
            iconColor: '#f3e928'
        },
    ]
};
exports.WebResetPassword = {
    hedder: 'User Control Center Account Reset Password',
    title: "We’ve initiated the recovery process for your Explore Lanka account. Follow the instructions in the email to regain access to Dambulla's best experiences.",
    list: [
        {
            icon: free_solid_svg_icons_1.faEnvelopeOpenText,
            hed: 'Check Your Inbox',
            massage: 'We’ve sent a secure password reset link to your email address. Please check your inbox and spam folder.',
            iconColor: '#22d3ee'
        },
        {
            icon: free_solid_svg_icons_1.faUserCheck,
            hed: 'Verify Identity',
            massage: 'Click on the link inside the email to verify it’s you and proceed to create your new password.',
            iconColor: '#22c55e'
        },
        {
            icon: free_solid_svg_icons_1.faRedo,
            hed: 'Didn’t get the email?',
            massage: 'Wait a few minutes before requesting another link, or ensure your email address was entered correctly.',
            iconColor: '#f3e928'
        },
    ]
};
exports.userProfileCreater = function (fullName) {
    var firstLetter = fullName.charAt(0).toUpperCase();
    var secondLetter = fullName.trimStart().charAt(0).toLocaleUpperCase();
    return firstLetter + secondLetter;
};
exports.getDateTime = function (isoString) {
    var dateObj = new Date(isoString);
    var date = dateObj.toLocaleDateString('en-CA');
    var time = dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    return date + " | " + time;
};
exports.UseClickOutSide = function (ref, handler) {
    react_1.useEffect(function () {
        var listener = function (event) {
            if (!ref.current || ref.current.contains(event.traget)) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return function () {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};
exports.calculateTotalRating = function (reviews) {
    if (!reviews || reviews.length === 0) {
        return 0;
    }
    var total = reviews.reduce(function (sum, review) { return sum + review.rating; }, 0);
    var avarage = total / reviews.length;
    return Math.round(avarage * 10) / 10;
};
exports.FormatDate = function (dateString) {
    if (!dateString)
        return '';
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};
exports.FormatDuration = function (totalMinutes) {
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    if (hours > 0) {
        return hours + "h " + (minutes > 0 ? minutes + "m" : '');
    }
    return minutes + "m";
};
