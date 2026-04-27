'use strict';
exports.__esModule = true;
var react_1 = require('react');
var utils_1 = require('@/lib/utils');
var PageSider_1 = require('@/pages/web/Auth/components/PageSider');
var EmailSentSuccessMassage_1 = require('./components/EmailSentSuccessMassage');
var EmailSentSuccess = function (_a) {
    var email = _a.email;
    return react_1['default'].createElement(
        'main',
        { className: 'form_layout_main' },
        react_1['default'].createElement(PageSider_1['default'], { signupPageData: utils_1.adminResetPassword }),
        react_1['default'].createElement(EmailSentSuccessMassage_1['default'], { email: email }),
    );
};
exports['default'] = EmailSentSuccess;
