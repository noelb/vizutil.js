/**
 *
 * GeomUtil
 *
 */
class GeomUtil {


    /**
     * Converts cartesian (x,y) coordinates, to polar coordinates (angle/length)
     *
     * @param x number
     * @param y
     * @returns {{r: number, theta: number}}
     */
    static toPolar(x, y) {
        return { r:Math.sqrt(x * x + y * y), theta: Math.atan2(y, x) };
    }



    /**
     *
     * @param r
     * @param theta
     * @param xy
     * @returns {*}
     */
    static toCart(r, theta, xy=false) {
        if (xy) return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
        else return [ r * Math.cos(theta), r * Math.sin(theta) ]
    }



    /**
     * Converts degrees to radians
     *
     * @param degrees
     * @returns {number}
     */
    static toRad(degrees) {
        return (degrees * Math.PI / 180);
    }



    /**
     * Converts radians to degrees
     *
     * @param radians
     * @returns {number}
     */
    static toDeg(radians) {
        return (radians * 180 / Math.PI);
    }



    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


    /**
     * Returns the distance between the two points
     *
     * @param x0
     * @param y0
     * @param x1
     * @param y1
     * @returns {number}
     */
    static distance(x0, y0, x1=0, y1=0) {
        let x = x1-x0;
        let y = y1-y0;
        return Math.sqrt(x*x + y*y);
    }


    // static distanceXY(p0, p1={x:0,y:0}) {
    //     return GeomUtil.distance(p0.x,p0.y,p1.x,p1.y);
    // }

    /**
     *
     * @deprecated
     */
    static distancePath(path) {
        return GeomUtil.pathLength(path);
    }


    /**
     *
     * @param path An array of objects that have "x" and "y" properties
     * @returns {number}
     */
    static pathLength(path) {
        let xy = "x" in pnts[0];

        let distance = 0;
        for (let i=0; i < path.length-1; i+=1) {
            if (xy) distance += GeomUtil.distance(path[i].x,path[i].y, path[i+1].x,path[i+1].y);
            else distance += GeomUtil.distance(path[i][0],path[i][1], path[i+1][0],path[i+1][1]);
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
    static intersect(a0x,a0y,a1x,a1y,b0x,b0y,b1x,b1y,segment=true,xy=false) {

        let  _inRange = function(x,y,ax,ay,bx,by) {
            if (ax != bx) {
                return x <= ax != x < bx;
            } else {
                return y <= ay != y < by;
            }
        };

        //calculate directional constants
        let k1 = (a1y-a0y) / (a1x-a0x);
        let k2 = (b1y-b0y) / (b1x-b0x);

        // if the directional constants are equal, the lines are parallel,
        // meaning there is no intersection point.
        if (k1 == k2) return null;

        let x,y;
        let m1,m2;

        // an infinite directional constant means the line is vertical
        if( !isFinite(k1) ) {

            // so the intersection must be at the x coordinate of the line
            x = a0x;
            m2 = b0y - k2 * b0x;
            y = k2 * x + m2;

        // same as above for line 2
        } else if ( !isFinite(k2) ) {

            m1 = a0y - k1 * a0x;
            x = b0x;
            y = k1 * x + m1;

        // if neither of the lines are vertical
        } else {

            m1 = a0y - k1 * a0x;
            m2 = b0y - k2 * b0x;
            x = (m1-m2) / (k2-k1);
            y = k1 * x + m1;

        }

        if (x == null || y == null) return null; //TODO: Does this ever happen?

        //If it needs to be on a segment...
        if (segment) {
            //...ensure that the point is within the bounds of BOTH segments, otherwise there's no intersection
            if (!_inRange(x,y, a0x, a0y, a1x, a1y) || !_inRange(x,y, b0x, b0y, b1x, b1y)) {
                return null
            }
        }

        return xy ? {x:x,y:y} : [x,y];

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
    static interpolate(x0,y0,x1,y1,percent=.5,xy=false) {
        return xy ?
            {x:x0 + (x1-x0)*percent,  y:y0 + (y1-y0)*percent } :
            [ x0 + (x1-x0)*percent,  y0 + (y1-y0)*percent ];
    }




    /**
     * Returns a point that x "percent" along a path
     *-FIX ME!- This current assumes an array of consecutive values, not a nested array of points
     * @param path
     * @param percent
     * @returns {*[]}
     */
    static interpolatePath(path,percent) {

        //This is how far we need to travel along the path
        let length = percent * GeomUtil.pathLength( path );

        for (let i=0; i < path.length-2; i+=2) {

            let segmentLength = GeomUtil.distance(path[i],path[i+1],path[i+2],path[i+3]);

            if (length - segmentLength > 0) {
                length -= segmentLength;
            } else {
                return GeomUtil.interpolate(path[i],path[i+1],path[i+2],path[i+3],length/segmentLength);
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
    static rotate(x,y,angleInRadians,originX=0,originY=0,xy=false) {
        let rotatedX = Math.cos(angleInRadians) * (x - originX) - Math.sin(angleInRadians) * (y - originY) + originX;
        let rotatedY = Math.sin(angleInRadians) * (x - originX) + Math.cos(angleInRadians) * (y - originY) + originY;
        return xy ? {x:rotatedX,y:rotatedY} : [rotatedX,rotatedY];
    }


    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    /* https://gist.github.com/mbostock/8027637 */
    // getTotalLength
    // getPointAtLength
    //
    // static closestPoint2(pathNode, point) {
    //
    //     var distance2 = function(p) {
    //         var dx = p.x - point[0],
    //             dy = p.y - point[1];
    //         return dx * dx + dy * dy;
    //     }
    //
    //     var pathLength = pathNode.getTotalLength(),
    //         precision = 8,
    //         best,
    //         bestLength,
    //         bestDistance = Infinity;
    //
    //     // linear scan for coarse approximation
    //     for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
    //         if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
    //             best = scan, bestLength = scanLength, bestDistance = scanDistance;
    //         }
    //     }
    //
    //     // binary search for precise estimate
    //     precision /= 2;
    //     while (precision > 0.5) {
    //         var before,
    //             after,
    //             beforeLength,
    //             afterLength,
    //             beforeDistance,
    //             afterDistance;
    //         if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
    //             best = before, bestLength = beforeLength, bestDistance = beforeDistance;
    //         } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
    //             best = after, bestLength = afterLength, bestDistance = afterDistance;
    //         } else {
    //             precision /= 2;
    //         }
    //     }
    //
    //     best = [best.x, best.y];
    //     best.distance = Math.sqrt(bestDistance);
    //     return best;
    //
    // }


    /**
     *
     * Credit:
     * https://gist.github.com/mbostock/8027637
     *
     * @param pathNode {SVGPathElement}
     *
     */
    static closestPoint(pathNode, x, y, xy=false) {

        var distance2 = function(p) {
            var dx = p.x - x,
                dy = p.y - y;
            return dx * dx + dy * dy;
        };

        var pathLength =
            pathNode.getTotalLength(),
            precision = 8,
            best,
            bestLength,
            bestDistance = Infinity;

        // linear scan for coarse approximation
        for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
            if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
                best = scan, bestLength = scanLength, bestDistance = scanDistance;
            }
        }

        // binary search for precise estimate
        precision /= 2;
        while (precision > 0.5) {
            var before,
                after,
                beforeLength,
                afterLength,
                beforeDistance,
                afterDistance;
            if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
                best = before, bestLength = beforeLength, bestDistance = beforeDistance;
            } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
                best = after, bestLength = afterLength, bestDistance = afterDistance;
            } else {
                precision /= 2;
            }
        }

        if (xy) {
            best = {x:best.x, y:best.y, distance:Math.sqrt(bestDistance) };
        }  else {
            best = [best.x, best.y];
            best.distance = Math.sqrt(bestDistance); //XXX: This seems weird...
        }
        return best;

    }




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
     *
     * @returns { {x: number, y: number} | [Number,Number] }
     */
    static getOnBezier(percent,x0,y0,cx1,cy1,cx2,cy2,x3,y3,xy=false) {
        function b1(t) { return t*t*t }
        function b2(t) { return 3*t*t*(1-t) }
        function b3(t) { return 3*t*(1-t)*(1-t) }
        function b4(t) { return (1-t)*(1-t)*(1-t) }
        let pnt = [
            x0*b1(percent) + cx1*b2(percent) + cx2*b3(percent) + x3*b4(percent),
            y0*b1(percent) + cy1*b2(percent) + cy2*b3(percent) + y3*b4(percent)
        ];

        if (xy) {
            return {x:pnt[0],y:pnt[1]};
        } else {
            return pnt;
        }
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
    static splitBezierXY(array, perc) {
        array.unshift({x:0, y:0});
        var coll = [];
        while (array.length > 0) {
            for (var i = 0;i < array.length-1; i++) {
                coll.unshift(array[i]);
                array[i] = GeomUtil.interpolate(array[i], array[i+1], perc);
            }
            coll.unshift(array.pop());
        }
        return {
            b1: [{x:coll[5].x, y:coll[5].y}, {x:coll[2].x, y:coll[2].y},{x:coll[0].x, y:coll[0].y}],
            b2: [{x:coll[1].x - coll[0].x,y:coll[1].y-coll[0].y}, {x:coll[3].x - coll[0].x,y:coll[3].y-coll[0].y}, {x:coll[6].x - coll[0].x,y:coll[6].y-coll[0].y}]
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
     * @returns {{x: number, y: number}}
     */


    /**
     *
     * Catmull-Rom Spline
     *
     * Creates a smooth(ish) curve through an arbitrary array of points
     *
     * Ported w/ modifications from: http://actionsnippet.com/?p=1042
     *
     * @param path An array of points to draw a curve through
     * @param segments A number great than 1. The number of segments to build the curve out of.
     * @returns {Array} The path
     *
     */
    static cspline(path, segments=10) {

        let tangent = function(px,py,_px,_py) {
            return {
                x: (px - _px) / 2,
                y: (py - _py) / 2
            }
        };


        let xy = "x" in path[0];

        const res = 1/segments; //Convert segments into resolution steps

        let spline = [];

        let px = 0;
        let py = 0;
        let end = path.length-1;


        let m = [];
        m[0] = xy ?
            tangent( path[1].x, path[1].y, path[0].x, path[0].y ) :
            tangent( path[1][0], path[1][1], path[0][0], path[0][1] );
        for (let i=1; i < end; i++) {
            m[i] = xy ?
                tangent( path[i+1].x, path[i+1].y, path[i-1].x, path[i-1].y ) :
                tangent( path[i+1][0], path[i+1][1], path[i-1][0], path[i-1][1] );
        }
        m[end] = xy ?
            tangent( path[end].x, path[end].y, path[end-1].x, path[end-1].y ) :
            tangent( path[end][0], path[end][1], path[end-1][0], path[end-1][1] );

        for (let k = 0; k <end; k++){
            var k1 = k + 1;
            let pkx = xy ? path[k].x : path[k][0];
            let pky = xy ? path[k].y : path[k][1];
            let pk1x = xy ? path[k1].x : path[k1][0];
            let pk1y = xy ? path[k1].y : path[k1][1];

            var mk = m[k];
            var mk1 = m[k1];

            for (let t=0; t <= 1; t+=res) {
                var t_2 = t * t;
                var _1_t = 1 - t;
                var _2t = 2 * t;
                var h00 =  (1 + _2t) * (_1_t) * (_1_t);
                var h10 =  t  * (_1_t) * (_1_t);
                var h01 =  t_2 * (3 - _2t);
                var h11 =  t_2 * (t - 1);

                px = h00 * pkx + h10 * mk.x + h01 * pk1x + h11 * mk1.x;
                py = h00 * pky + h10 * mk.y + h01 * pk1y + h11 * mk1.y;

                if (xy)
                    spline.push( {x:px,y:py} );
                else
                    spline.push( [px,py] );
            }
        }

        return spline;
    }



}
