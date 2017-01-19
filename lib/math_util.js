"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MathUtil = function () {
    function MathUtil() {
        var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        _classCallCheck(this, MathUtil);

        this.seed = seed;
    }

    /**
     *  Implementation of Park-Miller-Carta PRNG ported from:
     *  http://lab.polygonal.de/2007/04/21/a-good-pseudo-random-number-generator-prng/
     */


    _createClass(MathUtil, [{
        key: "random",
        value: function random() {
            this.seed = this.seed * 16807 % 2147483647;
            return this.seed / 2147483647;
        }
    }]);

    return MathUtil;
}();