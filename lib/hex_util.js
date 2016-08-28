"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HexUtil = function () {
    function HexUtil() {
        var hexLength = arguments.length <= 0 || arguments[0] === undefined ? 40 : arguments[0];
        var pixelSize = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];

        _classCallCheck(this, HexUtil);

        //Distance from center of hex to a corner of the outline
        this.hexLength = hexLength;
        this.pixelSize = pixelSize;

        //Distance from center of hex to the middle of a side
        this.sideLength = this.hexLength * .5 / Math.tan(Math.PI / 6);
    }

    //Converts a grid position into the center point in pixel space


    _createClass(HexUtil, [{
        key: "getCenterPoint",
        value: function getCenterPoint(x, y) {
            //Loop through and draw the hexes and their numbers
            var xStep = this.hexLength * 1.5;
            var yStep = this.sideLength * 2;
            var offsetY = x % 2 == 0 ? 0 : yStep / 2;
            return { x: x * xStep, y: y * yStep + offsetY };
        }

        //Converts a grid position into the center point in pixel space

    }, {
        key: "getCenterGeoPt",
        value: function getCenterGeoPt(x, y) {
            var pt = this.getCenterPoint(x, y);
            return GeoUtil.invMercProject(pt.x, pt.y, this.pixelSize, this.pixelSize);
        }
    }, {
        key: "getHexCoord",
        value: function getHexCoord(posx, posy) {

            posx += this.hexLength;
            posy += this.sideLength;

            var hex_width = this.hexLength * 2;
            var hex_height = this.sideLength * 2;

            x = (posx - hex_width / 2) / (hex_width * 0.75);
            y = (posy - hex_height / 2) / hex_height;
            z = -0.5 * x - y;
            y = -0.5 * x + y;

            ix = Math.floor(x + 0.5);
            iy = Math.floor(y + 0.5);
            iz = Math.floor(z + 0.5);
            s = ix + iy + iz;

            if (s) {
                abs_dx = Math.abs(ix - x);
                abs_dy = Math.abs(iy - y);
                abs_dz = Math.abs(iz - z);
                if (abs_dx >= abs_dy && abs_dx >= abs_dz) {
                    ix -= s;
                } else if (abs_dy >= abs_dx && abs_dy >= abs_dz) {
                    iy -= s;
                } else {
                    iz -= s;
                }
            }

            //console.log(ix+":"+iy+":"+iz)
            // ----------------------------------------------------------------------
            // --- map_x and map_y are the map coordinates of the click
            // ----------------------------------------------------------------------
            var map_x = ix;
            var map_y = (iy - iz + (1 - ix % 2)) / 2 - 0.5;

            // ----------------------------------------------------------------------
            // --- Calculate coordinates of this hex.  We will use this
            // --- to place the highlight image.
            // ----------------------------------------------------------------------
            //tx = map_x * this.hexlength * 1.5;
            //ty = map_y * hex_height + (map_x % 2) * (hex_height / 2);

            return { x: map_x, y: map_y };
        }
    }]);

    return HexUtil;
}();