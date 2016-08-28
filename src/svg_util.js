/**
 *
 *
 */
class SvgUtil {


    static getControlBar(document,x0,y0,x1,y1,data_id=String(Math.round(Math.random()*Number.MAX_VALUE))) {
        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x0);
        line.setAttribute("y1", y0);
        line.setAttribute("x2", x1);
        line.setAttribute("y2", y1);
        line.setAttribute("stroke-dasharray", "2,2");

        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx",x1);
        circle.setAttribute("cy",y1);
        circle.setAttribute("r","5");

        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
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
    static getCurve(document,path,debug=true) {
        //C x1 y1, x2 y2, x y
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");

        let isXY = "x" in path[0];
        let pathStr = "";

        if (isXY) {

            //Place the start point
            pathStr += "M "+path[0].x+" "+path[0].y+ " ";

            for (let i = 1; i < path.length; i+=3) {

                //Append the curve
                pathStr += "C " +
                    path[i+0].x + " " + path[i+0].y + " " +
                    path[i+1].x + " " + path[i+1].y + " " +
                    path[i+2].x + " " + path[i+2].y;

                //Append the control bars
                if (debug) {
                    group.appendChild( SvgUtil.getControlBar(document, path[i-1].x,path[i-1].y,path[i].x,path[i].y,i) );
                    group.appendChild( SvgUtil.getControlBar(document, path[i+2].x,path[i+2].y,path[i+1].x,path[i+1].y,i+1) );
                }
            }


        } else {
            pathStr += "M "+path[0][0]+" "+path[0][1] + " ";
            for (let i = 1; i < path.length; i+=3) {
                pathStr += "C " +
                    path[i+0][0] + " " + path[i+0][0] + " " +
                    path[i+1][1] + " " + path[i+1][1] + " " +
                    path[i+2][2] + " " + path[i+2][2];
            }
        }

        if (closed) pathStr += "z";

        let curveNode = document.createElementNS("http://www.w3.org/2000/svg", "path");
        curveNode.setAttribute("d", pathStr);
        group.appendChild( curveNode );

        return group;

    }

    static getCross(document, x, y, size=5, closed = false) {
        size /= 2;
        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d",
            "M " + (x - size) + " " + (y - size) + " " +
            "L " + (x + size) + " " + (y + size) + " " +
            "M " + (x - size) + " " + (y + size) + " " +
            "L " + (x + size) + " " + (y - size)
        );
        path.setAttribute("fill", "none");
        return path;
    }


    static getPath(document, path, closed = false) {
        let isXY = "x" in path[0];
        let pathStr = "";

        if (isXY) {
            for (let i = 0; i < path.length; i++) {
                if (i == 0) pathStr += "M "; else pathStr += "L ";
                pathStr += path[i].x + " " + path[i].y + " ";
            }
        } else {
            for (let i = 0; i < path.length; i++) {
                if (i == 0) pathStr += "M "; else pathStr += "L ";
                pathStr += path[i][0] + " " + path[i][1] + " ";
            }
        }

        if (closed) pathStr += "z";

        let node = document.createElementNS("http://www.w3.org/2000/svg", "path");
        node.setAttribute("d", pathStr);
        return node;
    }

    static getArrow(document, path, closed = false) {
        let pathStr = "";
        for (let i = 0; i < spline.length; i++) {
            if (i == 0) pathStr += "M ";else pathStr += "L ";
            pathStr += path[i].x + " " + path[i].y + " ";
        }
        if (closed) pathStr += "z";

        let node = document.createElementNS("http://www.w3.org/2000/svg", "path");
        node.setAttribute("d", pathStr);
        return node;
    }

}