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
        key: "_getRootSVG",


        /**
         *
         * Get's the top-most SVG element of this element
         *
         * @param svgEle
         * @returns {*|Node}
         * @private
         */
        value: function _getRootSVG(svgEle) {
            while (svgEle.parentNode instanceof SVGElement) {
                svgEle = svgEle.parentNode;
            }
            return svgEle;
        }

        /**
         *
         * Converts mouseevent coordinates to be relative to a particular html element
         *
         * @param svgEle
         * @returns {*|Node}
         * @private
         */

    }, {
        key: "_mousePos",
        value: function _mousePos(element, evt) {
            var rect = element.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }

        /**
         *
         * Creates an editable drag-point that represents a control point of a bezier.
         *
         * @param document
         * @param pathSVG
         * @param path
         * @param controlIndex
         * @param pointIndex
         * @returns {Element}
         * @private
         */

    }, {
        key: "_controlBar",
        value: function _controlBar(document, pathSVG, path, controlIndex, pointIndex) {
            var isXY = "x" in path[0];

            var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("stroke", "#ff0000");
            line.setAttribute("stroke-dasharray", "2,2");

            var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("r", "5");
            circle.setAttribute("fill", "#ff0000");

            if (isXY) {
                line.setAttribute("x1", path[controlIndex].x);
                line.setAttribute("y1", path[controlIndex].y);
                line.setAttribute("x2", path[pointIndex].x);
                line.setAttribute("y2", path[pointIndex].y);
                circle.setAttribute("cx", path[controlIndex].x);
                circle.setAttribute("cy", path[controlIndex].y);
            }

            var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            //group.setAttribute("data-id", data_id);
            group.appendChild(line);
            group.appendChild(circle);

            /* HANDLE MOUSE EVENTS */
            var _downHandler = void 0,
                _upHandler = void 0,
                moveHandler = void 0;

            moveHandler = function moveHandler(e) {
                var pnt = SvgUtil._mousePos(SvgUtil._getRootSVG(group), e);

                //Position the controls
                circle.setAttribute("cx", pnt.x);
                circle.setAttribute("cy", pnt.y);
                line.setAttribute("x1", pnt.x);
                line.setAttribute("y1", pnt.y);

                //Update the path
                path[controlIndex].x = pnt.x;
                path[controlIndex].y = pnt.y;
                SvgUtil.curve(document, path, null, pathSVG);
            };

            _downHandler = function downHandler() {
                document.removeEventListener("mousedown", _downHandler);
                document.addEventListener("mousemove", moveHandler);
                document.addEventListener("mouseup", _upHandler);
            };

            _upHandler = function upHandler() {
                document.removeEventListener("mousemove", _upHandler);
                document.removeEventListener("mousemove", moveHandler);
            };

            circle.addEventListener("mousedown", _downHandler);

            return group;
        }
    }, {
        key: "editControls",
        value: function editControls(document, path, pathSVG) {

            var group = document.createElementNS("http://www.w3.org/2000/svg", "g");

            //Append the control bars
            for (var i = 1; i < path.length; i += 3) {
                group.appendChild(SvgUtil._controlBar(document, pathSVG, path, i, i - 1));
                group.appendChild(SvgUtil._controlBar(document, pathSVG, path, i + 1, i + 2));
            }

            return group;
        }

        /**
         * @param document
         * @param bezier
         */

    }, {
        key: "curve",
        value: function curve(document, path) {
            var closed = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
            var target = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

            var isXY = "x" in path[0];

            //C x1 y1, x2 y2, x y
            var pathStr = "";
            if (isXY) {
                pathStr += "M " + path[0].x + " " + path[0].y + " ";
                for (var i = 1; i < path.length; i += 3) {
                    //Append the curve
                    pathStr += "C " + path[i + 0].x + " " + path[i + 0].y + " " + path[i + 1].x + " " + path[i + 1].y + " " + path[i + 2].x + " " + path[i + 2].y;
                }
            } else {
                pathStr += "M " + path[0][0] + " " + path[0][1] + " ";
                for (var _i = 1; _i < path.length; _i += 3) {
                    pathStr += "C " + path[_i + 0][0] + " " + path[_i + 0][0] + " " + path[_i + 1][1] + " " + path[_i + 1][1] + " " + path[_i + 2][2] + " " + path[_i + 2][2];
                }
            }

            if (closed) pathStr += "z";

            var pathSVG = target ? target : document.createElementNS("http://www.w3.org/2000/svg", "path");
            pathSVG.setAttribute("d", pathStr);

            return pathSVG;
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