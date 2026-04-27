'use strict';
exports.__esModule = true;
var react_2 = require('@inertiajs/react');
var react_1 = require('react');
var utils_1 = require('@/lib/utils');
var PageSider_1 = require('@/pages/web/Auth/components/PageSider');
var AdminForgetPasswordForm_1 = require('./components/AdminForgetPasswordForm');
var AdminResetPassword = function () {
    return react_1['default'].createElement(
        'main',
        { className: 'form_layout_main' },
        react_1['default'].createElement(react_2.Head, { title: 'Admin Reset Password' }),
        react_1['default'].createElement(PageSider_1['default'], { signupPageData: utils_1.adminResetPassword }),
        react_1['default'].createElement(AdminForgetPasswordForm_1['default'], null),
    );
};
exports['default'] = AdminResetPassword;
