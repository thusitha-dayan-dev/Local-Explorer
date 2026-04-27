'use strict';
exports.__esModule = true;
var react_1 = require('react');
var utils_1 = require('@/lib/utils');
var PageSider_1 = require('@/pages/web/Auth/components/PageSider');
var AdminUpdatePasswordForm_1 = require('./components/AdminUpdatePasswordForm');
var ResetPassword = function (_a) {
    var token = _a.token,
        email = _a.email;
    return react_1['default'].createElement(
        'main',
        { className: 'form_layout_main' },
        react_1['default'].createElement(PageSider_1['default'], { signupPageData: utils_1.adminUpdatePassword }),
        react_1['default'].createElement(AdminUpdatePasswordForm_1['default'], { email: email, token: token }),
    );
};
exports['default'] = ResetPassword;
