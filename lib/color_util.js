"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 */
var ColorUtil = function () {
    function ColorUtil() {
        _classCallCheck(this, ColorUtil);
    }

    _createClass(ColorUtil, null, [{
        key: "rgbToHex",
        value: function rgbToHex(r, g, b) {
            r = Math.floor(r);
            g = Math.floor(g);
            b = Math.floor(b);
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
    }, {
        key: "intToRgb",
        value: function intToRgb(bigint) {
            return {
                r: bigint >> 16 & 255,
                g: bigint >> 8 & 255,
                b: bigint & 255
            };
        }
    }, {
        key: "hexToRgb",
        value: function hexToRgb(hex) {
            var bigint = parseInt(hex, 16);
            return intToRgb(bigint);
        }
    }, {
        key: "lerp",
        value: function lerp(r0, g0, b0, r1, g1, b1, percent) {
            return {
                r: r0 + (r1 - r0) * percent,
                g: g0 + (g1 - g0) * percent,
                b: b0 + (b1 - b0) * percent
            };
        }
    }]);

    return ColorUtil;
}();