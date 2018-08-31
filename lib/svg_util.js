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
        // FIXME: Should probably move this out of here and just into the demo utility class
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
        // FIXME: Should probably move this out of here and just into the demo utility class

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
        // FIXME: Should probably move this out of here and just into the demo utility class

    }, {
        key: "_controlBar",
        value: function _controlBar(document, pathSVG, path, controlIndex, pointIndex) {

            var isXY = "x" in path[0];

            var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.classList.add("vizutil-cp-line");
            //line.setAttribute("stroke",style.strokeColor);
            //line.setAttribute("stroke-opacity",style.strokeOpacity)
            //line.setAttribute("stroke-dasharray", "2,2");

            var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("r", "3");
            circle.classList.add("vizutil-cp-circle");
            //circle.setAttribute("stroke",style.strokeColor);
            //circle.setAttribute("stroke-opacity",style.strokeOpacity)
            //circle.setAttribute("fill", style.fillColor);
            //circle.setAttribute("fill-opacity", style.fillOpacity);

            if (isXY) {
                line.setAttribute("x1", path[controlIndex].x);
                line.setAttribute("y1", path[controlIndex].y);
                line.setAttribute("x2", path[pointIndex].x);
                line.setAttribute("y2", path[pointIndex].y);
                circle.setAttribute("cx", path[controlIndex].x);
                circle.setAttribute("cy", path[controlIndex].y);
            } else {
                line.setAttribute("x1", path[controlIndex][0]);
                line.setAttribute("y1", path[controlIndex][1]);
                line.setAttribute("x2", path[pointIndex][0]);
                line.setAttribute("y2", path[pointIndex][1]);
                circle.setAttribute("cx", path[controlIndex][0]);
                circle.setAttribute("cy", path[controlIndex][1]);
            }

            var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            //group.setAttribute("data-id", data_id);
            group.appendChild(line);
            group.appendChild(circle);

            /* CREATE INTERACTION HANDLERS */
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
                if (isXY) {
                    path[controlIndex].x = pnt.x;
                    path[controlIndex].y = pnt.y;
                } else {
                    path[controlIndex][0] = pnt.x;
                    path[controlIndex][1] = pnt.y;
                }

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

            //LISTEN FOR CIRCLE CLICKS
            circle.addEventListener("mousedown", _downHandler);

            return group;
        }

        // FIXME: Should probably move this out of here and just into the demo utility class

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
            var closed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var target = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

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
                    pathStr += "C " + path[_i + 0][0] + " " + path[_i + 0][1] + " " + path[_i + 1][0] + " " + path[_i + 1][1] + " " + path[_i + 2][0] + " " + path[_i + 2][1];
                }
            }

            if (closed) pathStr += "z";

            var pathSVG = target ? target : document.createElementNS("http://www.w3.org/2000/svg", "path");
            pathSVG.setAttribute("d", pathStr);
            pathSVG.classList.add("vizutil-path");

            return pathSVG;
        }

        // Should probably make this create a cross outline instead of

    }, {
        key: "getX",
        value: function getX(document, x, y) {
            var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5;
            var closed = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

            size /= 2;
            var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M " + (x - size) + " " + (y - size) + " " + "L " + (x + size) + " " + (y + size) + " " + "M " + (x - size) + " " + (y + size) + " " + "L " + (x + size) + " " + (y - size));
            path.setAttribute("fill", "none");

            path.classList.add("vizutil");
            path.classList.add("vizutil-cross");
            return path;
        }

        /**
         * @param document Document
         * @param x number
         * @param y number
         * @param width number
         * @param height number
         * @param center boolean
         * @returns SVGRectElement
         */

    }, {
        key: "getRect",
        value: function getRect(document, x, y, width, height) {
            var center = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

            var path = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            if (center) {
                path.setAttribute("x", x - width / 2);
                path.setAttribute("y", y - height / 2);
            } else {
                path.setAttribute("x", x);
                path.setAttribute("y", y);
            }
            path.setAttribute("width", width);
            path.setAttribute("height", height);
            path.classList.add("vizutil");
            path.classList.add("vizutil-rect");
            return path;
        }

        /**
         * @param document Document
         * @param x number
         * @param y number
         * @param width number
         * @param height number
         * @param rx number
         * @param ry number
         * @param center boolean
         * @returns SVGRectElement
         */

    }, {
        key: "getRoundedRect",
        value: function getRoundedRect(document, x, y, width, height) {
            var rx = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 2;
            var ry = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
            var center = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : true;

            if (ry == null) ry = rx;
            var path = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            if (center) {
                path.setAttribute("x", x - width / 2);
                path.setAttribute("y", y - height / 2);
            } else {
                path.setAttribute("x", x);
                path.setAttribute("y", y);
            }
            path.setAttribute("rx", rx);
            path.setAttribute("ry", ry);
            path.setAttribute("width", width);
            path.setAttribute("height", height);
            path.classList.add("vizutil");
            path.classList.add("vizutil-roundedrect");
            return path;
        }

        /**
         * @param document Document
         * @param cx number
         * @param cy number
         * @param r number
         * @returns SVGCircleElement
         */

    }, {
        key: "getCircle",
        value: function getCircle(document, cx, cy, r) {
            var path = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            path.setAttribute("cx", cx);
            path.setAttribute("cy", cy);
            path.setAttribute("r", r);
            path.classList.add("vizutil");
            path.classList.add("vizutil-circle");
            return path;
        }

        /**
         * @param document Document
         * @param cx number
         * @param cy number
         * @param rx number
         * @param ry number
         * @returns SVGEllipseElement
         */

    }, {
        key: "getEllipse",
        value: function getEllipse(document, cx, cy, rx, ry) {
            var node = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
            node.setAttribute("cx", cx);
            node.setAttribute("cy", cy);
            node.setAttribute("rx", rx);
            node.setAttribute("ry", ry);
            node.classList.add("vizutil");
            node.classList.add("vizutil-ellipse");
            return node;
        }

        /**
         * @param document Document
         * @param cx number
         * @param cy number
         * @param radiusInner number
         * @param radiusOuter number
         * @param numPoints number
         * @returns SVGPathElement
         */

    }, {
        key: "getStar",
        value: function getStar(document, cx, cy, radiusInner, radiusOuter) {
            var numPoints = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 5;

            var pathStr = "";
            var STEPS = numPoints * 2;
            for (var i = 0; i < STEPS; i++) {
                var theta = 2 * Math.PI * (i / STEPS);
                theta -= Math.PI / 2; // Rotate so first point is at the top
                var r = i % 2 == 0 ? radiusOuter : radiusInner;
                var x = cx + Math.cos(theta) * r;
                var y = cy + Math.sin(theta) * r;
                pathStr += i == 0 ? "M " : "L ";
                pathStr += x + " " + y + " ";
            }
            pathStr += "z";

            var node = document.createElementNS("http://www.w3.org/2000/svg", "path");
            node.setAttribute("d", pathStr);
            node.classList.add("vizutil");
            node.classList.add("vizutil-star");
            return node;
        }

        /**
         * @param document Document
         * @param cx number
         * @param cy number
         * @param radius number
         * @param numSides number
         * @returns SVGPolygonElement
         */

    }, {
        key: "getRegularPolygon",
        value: function getRegularPolygon(document, cx, cy, radius) {
            var numSides = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 5;


            var pathStr = "";
            for (var i = 0; i < numSides; i++) {
                var theta = 2 * Math.PI * (i / numSides);
                theta -= Math.PI / 2; // Rotate so first point is at the top
                var x = cx + Math.cos(theta) * radius;
                var y = cy + Math.sin(theta) * radius;
                pathStr += x + "," + y + " ";
            }

            var node = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            node.setAttribute("points", pathStr);
            node.classList.add("vizutil");
            node.classList.add("vizutil-polygon");
            return node;
        }
    }, {
        key: "getCross",
        value: function getCross(document, cx, cy, radius) {
            var thickness = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;
            var numPoints = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 4;


            // We build this similar to a star - imagine each point of the star is a block
            //      |
            //    -   -
            //      |
            //
            //
            // Let's start with the first block pointing north from the center
            // We start with the point in the top right corner of that block
            //       .
            //      |
            //    -   -
            //      |
            // The distance from the center to this point is magL
            // The offset angle from north to this point is offsetL
            //
            //
            // We then connect it to point near-ish the bottom right corner of the block (which will be where it intersects the next block)
            //      |.
            //    -   -
            //      |
            // This distance from the center to this point is magS
            // The offset angle fom north to this point is offsetS
            //
            //
            // We then connect to the point in the top left corner of the next block
            //      |
            //    -   - '
            //      |
            // We use the previously discovered values of magL and offsetL to find this position
            //
            // We then repeat this "numPoints" times

            var halfThickness = thickness / 2;
            var step = Math.PI * 2 / numPoints;

            // Find the magnitude and offset distance of the long legs
            var magL = Math.sqrt(halfThickness * halfThickness + radius * radius);
            var offsetL = Math.asin(halfThickness / magL);

            // Find the magnitude and offset distance of the short legs
            var offsetS = Math.PI * 2 / (numPoints * 2);
            var magS = halfThickness / Math.sin(offsetS);

            var pathStr = "";
            for (var i = 0; i < numPoints; i++) {

                var theta = 2 * Math.PI * (i / numPoints);
                theta -= Math.PI / 2; // Rotate so first point is at the top

                var x = void 0,
                    y = void 0;

                // // The point
                // x = cx + Math.cos(theta) * radius;
                // y = cy + Math.sin(theta) * radius;
                // pathStr += x + "," + y + " ";

                // The first long one
                x = cx + Math.cos(theta + offsetL) * magL;
                y = cy + Math.sin(theta + offsetL) * magL;
                pathStr += x + "," + y + " ";

                // The short long one
                x = cx + Math.cos(theta + offsetS) * magS;
                y = cy + Math.sin(theta + offsetS) * magS;
                pathStr += x + "," + y + " ";

                // The other long one
                x = cx + Math.cos(theta + step - offsetL) * magL;
                y = cy + Math.sin(theta + step - offsetL) * magL;
                pathStr += x + "," + y + " ";
            }

            var node = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            node.setAttribute("points", pathStr);
            node.classList.add("vizutil");
            node.classList.add("vizutil-polygon");
            return node;
        }
    }, {
        key: "getPath",
        value: function getPath(document, path) {
            var closed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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

        // FIXME: TODO

    }, {
        key: "getArrow",
        value: function getArrow(document, path) {
            var closed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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