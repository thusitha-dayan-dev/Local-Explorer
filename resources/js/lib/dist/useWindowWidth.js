"use strict";
exports.__esModule = true;
exports.useWindowWidth = void 0;
var react_1 = require("react");
exports.useWindowWidth = function () {
    var _a = react_1.useState(window.innerWidth < 768), isMobile = _a[0], setIsMobile = _a[1];
    react_1.useEffect(function () {
        var handleResize = function () {
            setIsMobile(window.innerWidth < 768);
        };
        // Window එක resize වෙද්දී මේ function එක run වෙන්න ඕනේ
        window.addEventListener('resize', handleResize);
        // Component එක අයින් වෙද්දී event listener එකත් අයින් කරනවා (Cleanup)
        return function () { return window.removeEventListener('resize', handleResize); };
    }, []);
    return isMobile;
};
