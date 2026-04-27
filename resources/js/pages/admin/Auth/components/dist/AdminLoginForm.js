"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var free_regular_svg_icons_1 = require("@fortawesome/free-regular-svg-icons");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var react_1 = require("@inertiajs/react");
var react_2 = require("react");
var AdminLoginForm = function () {
    var _a = react_1.useForm({
        email: '',
        password: ''
    }), data = _a.data, setData = _a.setData, post = _a.post, processing = _a.processing, errors = _a.errors, clearErrors = _a.clearErrors;
    var _b = react_2.useState(false), showPassword = _b[0], setShowPassword = _b[1];
    var _c = react_2.useState(true), isDesable = _c[0], setIsDesable = _c[1];
    var flash = react_1.usePage().props.flash;
    react_2.useEffect(function () {
        var isFormEmpty = !data.email || !data.password;
        if (isFormEmpty) {
            setIsDesable(true);
        }
        else {
            setIsDesable(false);
        }
    }, [data, errors]);
    var handleSubmit = function (e) {
        e.preventDefault();
        post('/admin/login/verification');
    };
    var _d = react_2.useState({
        show: false,
        message: '',
        type: 'success'
    }), alert = _d[0], setAlert = _d[1];
    react_2.useEffect(function () {
        if (errors.error) {
            setAlert({ show: true, message: errors.error, type: 'error' });
        }
    }, [errors]);
    return (react_2["default"].createElement("section", { className: "center_form" },
        react_2["default"].createElement(react_1.Head, { title: "Admin Login" }),
        react_2["default"].createElement("form", { className: "loging_page_main", onSubmit: handleSubmit },
            alert.show && (react_2["default"].createElement("div", { className: "main_error" },
                react_2["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faX, className: "close_btn", onClick: function () { return setAlert(function (prev) { return (__assign(__assign({}, prev), { show: false })); }); } }),
                react_2["default"].createElement("div", { className: "massage" },
                    react_2["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faExclamation }),
                    react_2["default"].createElement("span", { className: "main_error_massage" }, alert.message)))),
            react_2["default"].createElement("div", { className: "hedder" },
                react_2["default"].createElement("h1", null, "Welcome back"),
                react_2["default"].createElement("span", { className: "title" }, "Sign in to your admin account to continue.")),
            react_2["default"].createElement("div", { className: "login_form_input_main" },
                react_2["default"].createElement("div", { className: "input_gorup" },
                    react_2["default"].createElement("label", { htmlFor: "email" }, "Email Address"),
                    react_2["default"].createElement("div", { className: "holder" },
                        react_2["default"].createElement("input", { type: "email", name: "email", id: "email", className: "form_input", placeholder: "Email Address", onChange: function (e) { return setData('email', e.target.value); }, value: data.email }),
                        react_2["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_regular_svg_icons_1.faEnvelope, className: "icons_input" })),
                    errors.email && react_2["default"].createElement("span", { className: "error" }, errors.email)),
                react_2["default"].createElement("div", { className: "input_gorup" },
                    react_2["default"].createElement("label", { htmlFor: "password" }, "Password"),
                    react_2["default"].createElement("div", { className: "holder" },
                        react_2["default"].createElement("input", { type: showPassword ? 'text' : 'password', name: "password", id: "password", className: "form_input over", placeholder: "Password", onChange: function (e) { return setData('password', e.target.value); }, value: data.password }),
                        react_2["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faLock, className: "icons_input" })),
                    errors.password && react_2["default"].createElement("span", { className: "error" }, errors.password)),
                react_2["default"].createElement("div", { className: "remember_gorup" },
                    react_2["default"].createElement("span", { className: "liner" },
                        react_2["default"].createElement("input", { type: "checkbox", style: { cursor: 'pointer' }, name: "remember_token", id: "remember", onClick: function (e) {
                                if (showPassword)
                                    setShowPassword(false);
                                else
                                    setShowPassword(true);
                            } }),
                        react_2["default"].createElement("label", { htmlFor: "remember" }, "Show Password")),
                    react_2["default"].createElement("span", { className: "liner" },
                        react_2["default"].createElement(react_1.Link, { href: '/admin/forget-password', className: "link" }, "Reset Password"))),
                react_2["default"].createElement("div", { className: "sibmit_buttons" },
                    react_2["default"].createElement("button", { type: "submit", disabled: processing || isDesable, className: isDesable || processing ? 'desabled' : '' }, processing ? (react_2["default"].createElement(react_2["default"].Fragment, null,
                        "Validating Info",
                        react_2["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faSpinner, className: "rotet_icon_main", style: { marginLeft: '10px', fontSize: '1.2rem' } }))) : (react_2["default"].createElement(react_2["default"].Fragment, null,
                        "Sign In",
                        react_2["default"].createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faRightLong, style: { marginLeft: '10px' } })))))))));
};
exports["default"] = AdminLoginForm;
