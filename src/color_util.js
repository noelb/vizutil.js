/**
 *
 */
class ColorUtil {


    static rgbToHex(r, g, b) {
        r = Math.floor(r);
        g = Math.floor(g);
        b = Math.floor(b);
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    static intToRgb(bigint) {
        return {
            r:(bigint >> 16) & 255,
            g:(bigint >> 8) & 255,
            b:bigint & 255
        };
    }

    static hexToRgb(hex) {
        var bigint = parseInt(hex, 16);
        return intToRgb(bigint);
    }

    static lerp(r0,g0,b0,r1,g1,b1,percent) {
        return {
            r: r0 + (r1-r0)*percent,
            g: g0 + (g1-g0)*percent,
            b: b0 + (b1-b0)*percent
        }
    }

}


