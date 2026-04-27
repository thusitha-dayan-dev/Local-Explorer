'use strict';
exports.__esModule = true;
var react_fontawesome_1 = require('@fortawesome/react-fontawesome');
var react_2 = require('@inertiajs/react');
var react_1 = require('react');
('@fortawesome/react-fontawesome');
var free_solid_svg_icons_1 = require('@fortawesome/free-solid-svg-icons');
var EmailSentSuccessMassage = function (_a) {
    var email = _a.email;
    var _b = react_1.useState(email),
        Email = _b[0],
        setEmail = _b[1];
    var _c = react_1.useState(false),
        isResent = _c[0],
        setIsResent = _c[1];
    var auth_cooldown = react_2.usePage().props.auth_cooldown;
    var _d = react_1.useState(0),
        timer = _d[0],
        setTimer = _d[1];
    var _e = react_2.useForm({
            email: Email,
        }),
        data = _e.data,
        setData = _e.setData,
        post = _e.post,
        processing = _e.processing,
        errors = _e.errors,
        clearErrors = _e.clearErrors;
    var _f = react_1.useState(true),
        isDesable = _f[0],
        setIsDesable = _f[1];
    react_1.useEffect(
        function () {
            if (auth_cooldown > 0) {
                setTimer(Math.floor(auth_cooldown));
            } else {
                setTimer(0);
            }
        },
        [auth_cooldown],
    );
    react_1.useEffect(
        function () {
            if (timer <= 0) return;
            var interval = setInterval(function () {
                setTimer(function (prev) {
                    return prev > 0 ? prev - 1 : 0;
                });
            }, 1000);
            return function () {
                return clearInterval(interval);
            };
        },
        [timer > 0],
    );
    react_1.useEffect(
        function () {
            var isFormEmpty = !data.email || timer > 0;
            if (isFormEmpty) {
                setIsDesable(true);
            } else {
                setIsDesable(false);
            }
        },
        [data, errors],
    );
    react_1.useEffect(
        function () {
            var savedEmail = email || localStorage.getItem('reset_email');
            if (savedEmail) {
                setEmail(savedEmail);
                setData('email', savedEmail);
                if (email) localStorage.setItem('reset_email', email);
            }
        },
        [email, timer],
    );
    var handleSubmit = function (e) {
        e.preventDefault();
        post('/admin/forget-password-send', {
            onSuccess: function () {
                setIsResent(true);
            },
        });
    };
    return react_1['default'].createElement(
        'section',
        { className: 'center_form' },
        react_1['default'].createElement(react_2.Head, { title: 'Check Your Email' }),
        react_1['default'].createElement(
            'div',
            { className: 'loging_page_main' },
            react_1['default'].createElement(
                'div',
                { className: 'hedder' },
                react_1['default'].createElement('h2', null, 'Check your email'),
                react_1['default'].createElement('span', { className: 'title' }, "You didn't receive the message Click Request a new one."),
            ),
            react_1['default'].createElement(
                'div',
                { className: 'page_main_layout' },
                react_1['default'].createElement(
                    'div',
                    { className: 'icon_send_massage' },
                    react_1['default'].createElement(react_fontawesome_1.FontAwesomeIcon, {
                        icon: free_solid_svg_icons_1.faEnvelopeCircleCheck,
                        className: 'email_icon',
                    }),
                    react_1['default'].createElement(
                        'p',
                        { className: 'massage' },
                        isResent
                            ? react_1['default'].createElement(
                                  react_1['default'].Fragment,
                                  null,
                                  react_1['default'].createElement(
                                      'span',
                                      null,
                                      "We've ",
                                      react_1['default'].createElement('b', { style: { color: '#121bbc' } }, 'resent'),
                                      ' the password reset link to:',
                                  ),
                              )
                            : react_1['default'].createElement(react_1['default'].Fragment, null, "We've sent a password reset link to:"),
                        react_1['default'].createElement('span', { className: 'user_email' }, Email),
                    ),
                ),
                react_1['default'].createElement(
                    'form',
                    { className: 'resend_massage', onSubmit: handleSubmit },
                    react_1['default'].createElement(
                        'button',
                        { type: 'submit', disabled: processing || isDesable, className: isDesable || processing ? 'desabled' : '' },
                        processing
                            ? react_1['default'].createElement(
                                  react_1['default'].Fragment,
                                  null,
                                  'Resending Email',
                                  react_1['default'].createElement(react_fontawesome_1.FontAwesomeIcon, {
                                      icon: free_solid_svg_icons_1.faSpinner,
                                      className: 'rotet_icon_main',
                                      style: { marginLeft: '10px', fontSize: '1.2rem' },
                                  }),
                              )
                            : isDesable
                              ? react_1['default'].createElement(react_1['default'].Fragment, null, 'Resend in ', timer, 's')
                              : react_1['default'].createElement(
                                    react_1['default'].Fragment,
                                    null,
                                    react_1['default'].createElement('span', null, 'Request a new one'),
                                    react_1['default'].createElement(react_fontawesome_1.FontAwesomeIcon, {
                                        icon: free_solid_svg_icons_1.faRotateBack,
                                    }),
                                ),
                    ),
                ),
                react_1['default'].createElement(
                    'div',
                    { className: 'info_box' },
                    react_1['default'].createElement(
                        'span',
                        { className: 'main_span' },
                        react_1['default'].createElement('span', null, '\uD83D\uDCA1'),
                        react_1['default'].createElement(
                            'span',
                            null,
                            react_1['default'].createElement('b', null, 'Tip:'),
                            " If you don't see the email, please check your ",
                            react_1['default'].createElement('b', null, 'Spam'),
                            ' or ',
                            react_1['default'].createElement('b', null, 'Junk'),
                            ' folder.',
                        ),
                    ),
                ),
            ),
            react_1['default'].createElement(
                'div',
                { className: 'switch_massage' },
                react_1['default'].createElement(
                    'span',
                    { className: 'switcher' },
                    react_1['default'].createElement('span', null, 'Wrong email?'),
                    react_1['default'].createElement(react_2.Link, { href: '/admin/forget-password', className: 'link' }, 'Change it'),
                ),
            ),
        ),
    );
};
exports['default'] = EmailSentSuccessMassage;
