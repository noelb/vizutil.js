/**
 *
 * GeomUtil
 *
 */
class GeomUtil {


    static toPolar(x, y) {
        return {
            r:Math.sqrt(x * x + y * y),
            theta: Math.atan2(y, x)
        };
    }


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


    static distance(x, y) {
        return Math.sqrt(x*x + y*y);
    }


    static distanceBetween(x1, y1, x2, y2) {
        return GeomUtil.distance(x2-x1,y2-y1);
    }

    static distanceBetweenXY(xy0,xy1) {
        return GeomUtil.distance(xy1.x-xy0.x,xy1.y-xy0.y);
    }


    static interpolate(x0,y0,x1,y1,percent) {
        return [
            x0 + (x1-x0)*percent,
            y0 + (y1-y0)*percent
        ];
    }


    static interpolateXY(xy0,xy1,percent) {
        return {
            x:xy0.x + (xy1.x-xy0.x)*percent,
            x:xy0.y + (xy1.y-xy0.y)*percent
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
