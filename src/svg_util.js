/**
 *
 *
 */
class SvgUtil {

    static getPathXY(document,path, closed=false) {
        let pathStr = "";
        for (let i=0; i < spline.length; i++) {
            if (i == 0) pathStr += "M "; else pathStr += "L ";
            pathStr += path[i].x+" "+path[i].y+" ";
        }
        if (closed) pathStr += "z";

        let node = document.createElementNS("http://www.w3.org/2000/svg", "path");
        node.setAttribute("d", pathStr);
        return node;
    }

}

