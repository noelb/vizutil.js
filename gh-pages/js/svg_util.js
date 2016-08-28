"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 *
 */
var SvgUtil = function () {
    function SvgUtil() {
        _classCallCheck(this, SvgUtil);
    }

    _createClass(SvgUtil, null, [{
        key: "getControlBar",
        value: function getControlBar(document, x0, y0, x1, y1) {
            var data_id = arguments.length <= 5 || arguments[5] === undefined ? String(Math.round(Math.random() * Number.MAX_VALUE)) : arguments[5];

            var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x0);
            line.setAttribute("y1", y0);
            line.setAttribute("x2", x1);
            line.setAttribute("y2", y1);
            line.setAttribute("stroke-dasharray", "2,2");

            var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", x1);
            circle.setAttribute("cy", y1);
            circle.setAttribute("r", "5");

            var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("data-id", data_id);
            group.appendChild(line);
            group.appendChild(circle);

            return group;
        }

        /**
         *
         * @param document
         * @param bezier
         */

    }, {
        key: "getCurve",
        value: function getCurve(document, path) {
            var debug = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            //C x1 y1, x2 y2, x y
            var group = document.createElementNS("http://www.w3.org/2000/svg", "g");

            var isXY = "x" in path[0];
            var pathStr = "";

            if (isXY) {

                //Place the start point
                pathStr += "M " + path[0].x + " " + path[0].y + " ";

                for (var i = 1; i < path.length; i += 3) {

                    //Append the curve
                    pathStr += "C " + path[i + 0].x + " " + path[i + 0].y + " " + path[i + 1].x + " " + path[i + 1].y + " " + path[i + 2].x + " " + path[i + 2].y;

                    //Append the control bars
                    if (debug) {
                        group.appendChild(SvgUtil.getControlBar(document, path[i - 1].x, path[i - 1].y, path[i].x, path[i].y, i));
                        group.appendChild(SvgUtil.getControlBar(document, path[i + 2].x, path[i + 2].y, path[i + 1].x, path[i + 1].y, i + 1));
                    }
                }
            } else {
                pathStr += "M " + path[0][0] + " " + path[0][1] + " ";
                for (var _i = 1; _i < path.length; _i += 3) {
                    pathStr += "C " + path[_i + 0][0] + " " + path[_i + 0][0] + " " + path[_i + 1][1] + " " + path[_i + 1][1] + " " + path[_i + 2][2] + " " + path[_i + 2][2];
                }
            }

            if (closed) pathStr += "z";

            var curveNode = document.createElementNS("http://www.w3.org/2000/svg", "path");
            curveNode.setAttribute("d", pathStr);
            group.appendChild(curveNode);

            return group;
        }
    }, {
        key: "getCross",
        value: function getCross(document, x, y) {
            var size = arguments.length <= 3 || arguments[3] === undefined ? 5 : arguments[3];
            var closed = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

            size /= 2;
            var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M " + (x - size) + " " + (y - size) + " " + "L " + (x + size) + " " + (y + size) + " " + "M " + (x - size) + " " + (y + size) + " " + "L " + (x + size) + " " + (y - size));
            path.setAttribute("fill", "none");
            return path;
        }
    }, {
        key: "getPath",
        value: function getPath(document, path) {
            var closed = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            var isXY = "x" in path[0];
            var pathStr = "";

            if (isXY) {
                for (var i = 0; i < path.length; i++) {
                    if (i == 0) pathStr += "M ";else pathStr += "L ";
                    pathStr += path[i].x + " " + path[i].y + " ";
                }
            } else {
                for (var _i2 = 0; _i2 < path.length; _i2++) {
                    if (_i2 == 0) pathStr += "M ";else pathStr += "L ";
                    pathStr += path[_i2][0] + " " + path[_i2][1] + " ";
                }
            }

            if (closed) pathStr += "z";

            var node = document.createElementNS("http://www.w3.org/2000/svg", "path");
            node.setAttribute("d", pathStr);
            return node;
        }
    }, {
        key: "getArrow",
        value: function getArrow(document, path) {
            var closed = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            var pathStr = "";
            for (var i = 0; i < spline.length; i++) {
                if (i == 0) pathStr += "M ";else pathStr += "L ";
                pathStr += path[i].x + " " + path[i].y + " ";
            }
            if (closed) pathStr += "z";

            var node = document.createElementNS("http://www.w3.org/2000/svg", "path");
            node.setAttribute("d", pathStr);
            return node;
        }
    }]);

    return SvgUtil;
}();