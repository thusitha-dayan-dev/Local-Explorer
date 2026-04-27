'use strict';
exports.__esModule = true;
var react_2 = require('@inertiajs/react');
var react_1 = require('react');
var utils_1 = require('@/lib/utils');
var PageSider_1 = require('@/pages/web/Auth/components/PageSider');
var AdminLoginForm_1 = require('./components/AdminLoginForm');
var AdminLogin = function () {
    return react_1['default'].createElement(
        'main',
        { className: 'form_layout_main' },
        react_1['default'].createElement(react_2.Head, { title: 'Admin Login' }),
        react_1['default'].createElement(PageSider_1['default'], { signupPageData: utils_1.adminLoginData }),
        react_1['default'].createElement(AdminLoginForm_1['default'], null),
    );
};
exports['default'] = AdminLogin;
