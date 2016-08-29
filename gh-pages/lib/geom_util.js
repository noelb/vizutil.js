"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * GeomUtil
 *
 */
var GeomUtil = function () {
    function GeomUtil() {
        _classCallCheck(this, GeomUtil);
    }

    _createClass(GeomUtil, null, [{
        key: "toPolar",


        /**
         * Converts cartesian (x,y) coordinates, to polar coordinates (angle/length)
         *
         * @param x number
         * @param y
         * @returns {{r: number, theta: number}}
         */
        value: function toPolar(x, y) {
            return { r: Math.sqrt(x * x + y * y), theta: Math.atan2(y, x) };
        }

        /**
         *
         * @param r
         * @param theta
         * @param xy
         * @returns {*}
         */

    }, {
        key: "toCart",
        value: function toCart(r, theta) {
            var xy = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            if (xy) return { x: r * Math.cos(theta), y: r * Math.sin(theta) };else return [r * Math.cos(theta), r * Math.sin(theta)];
        }

        /**
         * Converts degrees to radians
         *
         * @param degrees
         * @returns {number}
         */

    }, {
        key: "toRad",
        value: function toRad(degrees) {
            return degrees * Math.PI / 180;
        }

        /**
         * Converts radians to degrees
         *
         * @param radians
         * @returns {number}
         */

    }, {
        key: "toDeg",
        value: function toDeg(radians) {
            return radians * 180 / Math.PI;
        }

        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    }, {
        key: "distance",
        value: function distance(x0, y0) {
            var x1 = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
            var y1 = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

            var x = x1 - x0;
            var y = y1 - y0;
            return Math.sqrt(x * x + y * y);
        }
    }, {
        key: "distanceXY",
        value: function distanceXY(p0) {
            var p1 = arguments.length <= 1 || arguments[1] === undefined ? { x: 0, y: 0 } : arguments[1];

            return GeomUtil.distance(p0.x, p0.y, p1.x, p1.y);
        }

        /**
         *
         * @param path An array of objects that have "x" and "y" properties
         * @returns {number}
         */

    }, {
        key: "distancePath",
        value: function distancePath(path) {
            var distance = 0;
            for (var i = 0; i < path.length - 4; i += 2) {
                distance += GeomUtil.distance(path[i], path[i + 1], path[i + 2], path[i + 3]);
            }
            return distance;
        }

        /**
         *
         * @param path An array of objects that have "x" and "y" properties
         * @returns {number}
         */

    }, {
        key: "distancePathXY",
        value: function distancePathXY(path) {
            var distance = 0;
            for (var i = 0; i < path.length - 1; i += 1) {
                distance += GeomUtil.distance(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
            }
            return distance;
        }

        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

        /**
         *
         * @param x0 line0
         * @param y0
         * @param x1
         * @param y1
         * @param x2
         * @param y2
         * @param x3
         * @param y3
         * @returns {*}
         */

    }, {
        key: "intersect",
        value: function intersect(a0x, a0y, a1x, a1y, b0x, b0y, b1x, b1y) {
            var segment = arguments.length <= 8 || arguments[8] === undefined ? true : arguments[8];
            var xy = arguments.length <= 9 || arguments[9] === undefined ? false : arguments[9];


            //calculate directional constants
            var k1 = (a1y - a0y) / (a1x - a0x);
            var k2 = (b1y - b0y) / (b1x - b0x);

            // if the directional constants are equal, the lines are parallel,
            // meaning there is no intersection point.
            if (k1 == k2) return null;

            var x = void 0,
                y = void 0;
            var m1 = void 0,
                m2 = void 0;

            // an infinite directional constant means the line is vertical
            if (!isFinite(k1)) {

                // so the intersection must be at the x coordinate of the line
                x = a0x;
                m2 = b0y - k2 * b0x;
                y = k2 * x + m2;

                // same as above for line 2
            } else if (!isFinite(k2)) {

                m1 = a0y - k1 * a0x;
                x = b0x;
                y = k1 * x + m1;

                // if neither of the lines are vertical
            } else {

                m1 = a0y - k1 * a0x;
                m2 = b0y - k2 * b0x;
                x = (m1 - m2) / (k2 - k1);
                y = k1 * x + m1;
            }

            if (x == null || y == null) return null; //TODO: Does this ever happen?

            //If it needs to be on a segment...
            if (segment) {
                //...ensure that the point is within the bounds of BOTH segments, otherwise there's no intersection
                if (!GeomUtil._inRange(x, y, a0x, a0y, a1x, a1y) || !GeomUtil._inRange(x, y, b0x, b0y, b1x, b1y)) {
                    return null;
                }
            }

            return xy ? { x: x, y: y } : [x, y];
        }

        /**
         *
         * TODO: Double check how this works
         *
         * @param x - the x position of the point to test
         * @param y - the y position of the point to test
         * @param ax - the x position of the start point in the line segment
         * @param ay - the y position of the start point in the line segment
         * @param bx - the x position of the end point in the line segment
         * @param by - the y position of the end point in the line segment
         * @returns {boolean}
         * @private
         */

    }, {
        key: "_inRange",
        value: function _inRange(x, y, ax, ay, bx, by) {

            if (ax != bx) {
                return x <= ax != x < bx;
            } else {
                return y <= ay != y < by;
            }
        }

        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

        /**
         *
         * Returns a point that is "percent" distance between two points
         *
         * @param x0
         * @param y0
         * @param x1
         * @param y1
         * @param percent
         * @returns {*[]}
         */

    }, {
        key: "interpolate",
        value: function interpolate(x0, y0, x1, y1, percent) {
            return [x0 + (x1 - x0) * percent, y0 + (y1 - y0) * percent];
        }
    }, {
        key: "interpolateXY",
        value: function interpolateXY(p0, p1) {
            var percent = arguments.length <= 2 || arguments[2] === undefined ? .5 : arguments[2];

            return { x: p0.x + (p1.x - p0.x) * percent, y: p0.y + (p1.y - p0.y) * percent };
        }

        /**
         * Returns a point that x "percent" along a path
         *
         * @param path
         * @param percent
         * @returns {*[]}
         */

    }, {
        key: "interpolatePath",
        value: function interpolatePath(path, percent) {

            //This is how far we need to travel along the path
            var length = percent * GeomUtil.pathLength(path);

            for (var i = 0; i < path.length - 2; i += 2) {

                var segmentLength = GeomUtil.distance(path[i], path[i + 1], path[i + 2], path[i + 3]);

                if (length - segmentLength > 0) {
                    length -= segmentLength;
                } else {
                    return GeomUtil.interpolate(path[i], path[i + 1], path[i + 2], path[i + 3], length / segmentLength);
                }
            }
        }

        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

        /**
         * Rotates an x,y position around an origin point by an angle
         * Returns [x,y]
         *
         * @param x
         * @param y
         * @param angleInRadians
         * @param originX
         * @param originY
         * @returns {*[]}
         */

    }, {
        key: "rotate",
        value: function rotate(x, y, angleInRadians) {
            var originX = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
            var originY = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

            var rotatedX = Math.cos(angleInRadians) * (x - originX) - Math.sin(angleInRadians) * (y - originY) + originX;
            var rotatedY = Math.sin(angleInRadians) * (x - originX) + Math.cos(angleInRadians) * (y - originY) + originY;
            return [rotatedX, rotatedY];
        }

        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

        /**
         * Bernstein's Polynomials
         * http://iscriptdesign.com/?sketch=tutorial/splitbezier
         *
         * @param percent
         * @param x0
         * @param y0
         * @param cx1
         * @param cy1
         * @param cx2
         * @param cy2
         * @param x3
         * @param y3
         * @returns {{x: number, y: number}}
         */

    }, {
        key: "getOnBezier",
        value: function getOnBezier(percent, x0, y0, cx1, cy1, cx2, cy2, x3, y3) {
            function b1(t) {
                return t * t * t;
            }
            function b2(t) {
                return 3 * t * t * (1 - t);
            }
            function b3(t) {
                return 3 * t * (1 - t) * (1 - t);
            }
            function b4(t) {
                return (1 - t) * (1 - t) * (1 - t);
            }
            return [x0 * b1(percent) + cx1 * b2(percent) + cx2 * b3(percent) + x3 * b4(percent), y0 * b1(percent) + cy1 * b2(percent) + cy2 * b3(percent) + y3 * b4(percent)];
        }

        /**
         * Bernstein's Polynomials
         * http://iscriptdesign.com/?sketch=tutorial/splitbezier
         *
         * @param percent
         * @param p1
         * @param cp1
         * @param cp2
         * @param p2
         * @returns {{x: number, y: number}}
         */

    }, {
        key: "getOnBezierXY",
        value: function getOnBezierXY(percent, p1, cp1, cp2, p2) {
            var pnt = GeomUtil.getOnBezier(percent, p1.x, p1.y, cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);
            return { x: pnt[0], y: pnt[1] };
        }

        /**
         * de Casteljau's algorithm
         * http://iscriptdesign.com/?sketch=tutorial/splitbezier
         *
         * returns an object containing properties b1 & b2 each holding an array representing the either side of the split argument.
         * be aware that the argument is destructively modified. Call splitBezier(array.slice(0)) if you need to keep the original array.
         * The argument array is a representation of a quadratic bezier like [controlpoint1, controlpoint2, endpoint] (with points being objects holding x&y properties.
         *
         *    stores all the points of the tangentlines in an array which is returned. Note that the 1-percentage equals the percentage for the parametric bezier version.
         * You can use it like:
         * pts_red = getPoints(perc, [{x:0, y:0}, {x:x1, y:y1}, {x:x2, y:y2}, {x:x3, y:y3}]);
         * pts_blue = getPoints(1-perc, [{x:x3, y:y3}, {x:x2-x3, y:y2-y3}, {x:x1-x3, y:y1-y3}, {x:-1*x3, y:-1*y3}]);
         */

    }, {
        key: "splitBezierXY",
        value: function splitBezierXY(array, perc) {
            array.unshift({ x: 0, y: 0 });
            var coll = [];
            while (array.length > 0) {
                for (var i = 0; i < array.length - 1; i++) {
                    coll.unshift(array[i]);
                    array[i] = GeomUtil.interpolate(array[i], array[i + 1], perc);
                }
                coll.unshift(array.pop());
            }
            return {
                b1: [{ x: coll[5].x, y: coll[5].y }, { x: coll[2].x, y: coll[2].y }, { x: coll[0].x, y: coll[0].y }],
                b2: [{ x: coll[1].x - coll[0].x, y: coll[1].y - coll[0].y }, { x: coll[3].x - coll[0].x, y: coll[3].y - coll[0].y }, { x: coll[6].x - coll[0].x, y: coll[6].y - coll[0].y }]
            };
        }

        //
        // static createPolygon(sides,radius,offset) {
        //     if (offset == null) offset = 0;
        //
        //     var poly = [];
        //     for (var i=0; i < sides; i++) {
        //         poly.push(GeomUtil.toCart(
        //             radius,
        //             offset + (Math.PI*2 * i/sides)
        //         ));
        //     }
        //
        //     return poly;
        // }


        /**
         * Used by Catmull-Rom Spline
         *
         * @param pk1
         * @param pk_1
         * @returns {{x: number, y: number}}
         */

    }, {
        key: "tangent",
        value: function tangent(pk1, pk_1) {
            return {
                x: (pk1.x - pk_1.x) / 2,
                y: (pk1.y - pk_1.y) / 2
            };
        }

        /**
         *
         * Catmull-Rom Spline
         *
         * Creates a smooth(ish) curve through an arbitrary array of points
         *
         * Ported w/ modifications from: http://actionsnippet.com/?p=1042
         *
         * @param pnts An array of points to draw a curve through
         * @param res A number between 0-1 (0=Infinite,.1=10 segments,.2=5segments,etc.)
         * @returns {Array} The path
         *
         */

    }, {
        key: "csplineXY",
        value: function csplineXY(pnts) {
            var res = arguments.length <= 1 || arguments[1] === undefined ? .1 : arguments[1];


            var spline = [];

            var px = 0;
            var py = 0;
            var end = pnts.length - 1;

            var m = [GeomUtil.tangent(pnts[1], pnts[0])];
            for (var i = 1; i < end; i++) {
                m[i] = GeomUtil.tangent(pnts[i + 1], pnts[i - 1]);
            }
            m[end] = GeomUtil.tangent(pnts[end], pnts[end - 1]);

            for (var k = 0; k < end; k++) {
                var k1 = k + 1;
                var pk = pnts[k];
                var pk1 = pnts[k1];
                var mk = m[k];
                var mk1 = m[k1];

                for (var t = 0; t < 1; t += res) {
                    var t_2 = t * t;
                    var _1_t = 1 - t;
                    var _2t = 2 * t;
                    var h00 = (1 + _2t) * _1_t * _1_t;
                    var h10 = t * _1_t * _1_t;
                    var h01 = t_2 * (3 - _2t);
                    var h11 = t_2 * (t - 1);

                    px = h00 * pk.x + h10 * mk.x + h01 * pk1.x + h11 * mk1.x;
                    py = h00 * pk.y + h10 * mk.y + h01 * pk1.y + h11 * mk1.y;
                    spline.push({ x: px, y: py });
                }
            }

            return spline;
        }
    }]);

    return GeomUtil;
}();