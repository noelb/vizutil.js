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
        return {
            r:Math.sqrt(x * x + y * y),
            theta: Math.atan2(y, x)
        };
    }

    /**
     *
     * @param r
     * @param theta
     * @param xy
     * @returns {*}
     */
    static toCart(r, theta, xy=false) {
        if (xy) return {
            x: r * Math.cos(theta),
            y: r * Math.sin(theta)
            }
        else return [
            r * Math.cos(theta),
            r * Math.sin(theta)
        ]
    }

    static toRad(num) {
        return (num * Math.PI / 180);
    }

    static toDeg(num) {
        return (num * 180 / Math.PI);
    }



    static distance(x, y) {
        return Math.sqrt(x*x + y*y);
    }


    static distanceBetween(x1, y1, x2, y2) {
        return GeomUtil.distance(x2-x1,y2-y1);
    }


    static distanceBetweenXY(xy0,xy1) {
        return GeomUtil.distance(xy1.x-xy0.x,xy1.y-xy0.y);
    }


    static pathLength(path) {
        let distance = 0;
        for (let i=0; i < path.length-4; i+=2) {
            distance += GeomUtil.distanceBetween(
                path[i],path[i+1],
                path[i+2],path[i+3]
            );
        }
        return distance;
    }

    /**
     * 
     * Measures the total length of a path
     * 
     * @param path [{x,y}]
     * @returns number
     */
    static pathXYLength(path) {
        let distance = 0;
        for (let i=0; i < path.length-1; i+=1) {
            distance += GeomUtil.distanceBetween(
                path[i].x,path[i].y,
                path[i+1].x,path[i+1].y
            );
        }
        return distance;
    }


    /**
     *
     * Returns a point that is "percent" distance between two points
     *
     * @param x0 number
     * @param y0 number
     * @param x1 number
     * @param y1 numer
     * @param percent
     * @returns [[number,number],[number,number]]
     */
    static interpolate(x0,y0,x1,y1,percent) {
        return [
            x0 + (x1-x0)*percent,
            y0 + (y1-y0)*percent
        ];
    }

    /**
     * @param xy0 {x,y}
     * @param xy1 {x,y}
     * @param percent number
     * @return {x,y}
     */
    static interpolateXY(xy0,xy1,percent=.5) {
        return {
            x:xy0.x + (xy1.x-xy0.x)*percent,
            y:xy0.y + (xy1.y-xy0.y)*percent
        };
    }



    /**
     * Returns a point that x "percent" along a path
     *
     * @param path
     * @param percent
     * @returns [number,number]
     */
    static interpolatePath(path,percent) {

        //This is how far we need to travel along the path
        let length = percent * GeomUtil.pathLength( path );

        for (let i=0; i < path.length-2; i+=2) {

            let segmentLength = GeomUtil.distanceBetween(
                path[i],path[i+1],path[i+2],path[i+3]
            );

            if (length - segmentLength > 0) {
                length -= segmentLength;
            } else {
                return GeomUtil.interpolate(path[i],path[i+1],path[i+2],path[i+3],length/segmentLength);
            }

        }

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
    static getXYOnBezier(percent,p1,cp1,cp2,p2) {
        function b1(t) { return t*t*t }
        function b2(t) { return 3*t*t*(1-t) }
        function b3(t) { return 3*t*(1-t)*(1-t) }
        function b4(t) { return (1-t)*(1-t)*(1-t) }
        return {
            x: p1.x*b1(percent) + cp1.x*b2(percent) + cp2.x*b3(percent) + p2.x*b4(percent),
            y: p1.y*b1(percent) + cp1.y*b2(percent) + cp2.y*b3(percent) + p2.y*b4(percent)
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
    static splitBezier(array, perc) {
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

}
