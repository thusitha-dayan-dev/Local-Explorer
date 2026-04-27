'use strict';
exports.__esModule = true;
var free_regular_svg_icons_1 = require('@fortawesome/free-regular-svg-icons');
var free_solid_svg_icons_1 = require('@fortawesome/free-solid-svg-icons');
var react_fontawesome_1 = require('@fortawesome/react-fontawesome');
var react_1 = require('@inertiajs/react');
var react_2 = require('react');
var AdminUpdatePasswordForm = function (_a) {
    var token = _a.token,
        email = _a.email;
    var _b = react_1.useForm({
            token: token,
            email: email,
            password: '',
            password_confirmation: '',
        }),
        data = _b.data,
        setData = _b.setData,
        setError = _b.setError,
        post = _b.post,
        processing = _b.processing,
        errors = _b.errors,
        clearErrors = _b.clearErrors;
    var isFormInvalid = !data.password || !data.password_confirmation || Object.keys(errors).length > 0;
    react_2.useEffect(
        function () {
            if (data.password && data.password.length < 6) {
                setError('password', 'Password must be at least 6 characters');
            } else {
                clearErrors('password');
            }
            if (data.password_confirmation && data.password !== data.password_confirmation) {
                setError('password_confirmation', 'Passwords do not match');
            } else {
                clearErrors('password_confirmation');
            }
        },
        [data.password, data.password_confirmation],
    );
    var handleSubmit = function (e) {
        e.preventDefault();
        post('/admin/rest-password/save');
    };
    return react_2['default'].createElement(
        'section',
        { className: 'center_form' },
        react_2['default'].createElement(react_1.Head, { title: 'Admin Reset Password' }),
        react_2['default'].createElement(
            'form',
            { className: 'loging_page_main', onSubmit: handleSubmit },
            react_2['default'].createElement(
                'div',
                { className: 'hedder' },
                react_2['default'].createElement('h1', null, 'Update New Password'),
                react_2['default'].createElement('span', { className: 'title' }, 'Fill infor for secure rest flow'),
            ),
            react_2['default'].createElement(
                'div',
                { className: 'login_form_input_main' },
                react_2['default'].createElement(
                    'div',
                    { className: 'input_gorup' },
                    react_2['default'].createElement('label', { htmlFor: 'email', key: 'email' }, 'Email Address'),
                    react_2['default'].createElement(
                        'div',
                        { className: 'holder' },
                        react_2['default'].createElement('input', {
                            type: 'email',
                            className: 'form_input',
                            name: 'email',
                            id: 'email',
                            placeholder: 'Email Address',
                            value: data.email,
                            readOnly: true,
                        }),
                        react_2['default'].createElement(react_fontawesome_1.FontAwesomeIcon, {
                            icon: free_regular_svg_icons_1.faEnvelope,
                            className: 'icons_input',
                        }),
                    ),
                    errors.email && react_2['default'].createElement('span', { className: 'error' }, errors.email),
                ),
                react_2['default'].createElement(
                    'div',
                    { className: 'input_gorup' },
                    react_2['default'].createElement('label', { htmlFor: 'password' }, 'New Password'),
                    react_2['default'].createElement(
                        'div',
                        { className: 'holder' },
                        react_2['default'].createElement('input', {
                            type: 'password',
                            className: 'form_input',
                            name: 'password',
                            id: 'password',
                            placeholder: 'New Password',
                            onChange: function (e) {
                                return setData('password', e.target.value);
                            },
                            value: data.password,
                        }),
                        react_2['default'].createElement(react_fontawesome_1.FontAwesomeIcon, {
                            icon: free_solid_svg_icons_1.faLock,
                            className: 'icons_input',
                        }),
                    ),
                    errors.password && react_2['default'].createElement('span', { className: 'error' }, errors.password),
                ),
                react_2['default'].createElement(
                    'div',
                    { className: 'input_gorup' },
                    react_2['default'].createElement('label', { htmlFor: 'confirm_password' }, 'Confirm Password'),
                    react_2['default'].createElement(
                        'div',
                        { className: 'holder' },
                        react_2['default'].createElement('input', {
                            type: 'password',
                            className: 'form_input',
                            name: 'confirm_password',
                            id: 'confirm_password',
                            placeholder: 'Confirm Password',
                            onChange: function (e) {
                                return setData('password_confirmation', e.target.value);
                            },
                            value: data.password_confirmation,
                        }),
                        react_2['default'].createElement(react_fontawesome_1.FontAwesomeIcon, {
                            icon: free_solid_svg_icons_1.faLock,
                            className: 'icons_input',
                        }),
                    ),
                    errors.password_confirmation && react_2['default'].createElement('span', { className: 'error' }, errors.password_confirmation),
                ),
                react_2['default'].createElement(
                    'div',
                    { className: 'sibmit_buttons' },
                    react_2['default'].createElement(
                        'button',
                        { type: 'submit', disabled: processing || isFormInvalid, className: isFormInvalid || processing ? 'desabled' : '' },
                        processing ? 'Updating Password...' : 'Update New Password',
                    ),
                ),
                react_2['default'].createElement(
                    'div',
                    { className: 'switch_massage' },
                    react_2['default'].createElement(
                        'span',
                        { className: 'switcher' },
                        'Remember your password?',
                        ' ',
                        react_2['default'].createElement(react_1.Link, { className: 'link', href: '/login' }, 'Log in'),
                    ),
                ),
            ),
        ),
    );
};
exports['default'] = AdminUpdatePasswordForm;
