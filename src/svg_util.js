/**
 *
 *
 */
class SvgUtil {


    /**
     *
     * Get's the top-most SVG element of this element
     *
     * @param svgEle
     * @returns {*|Node}
     * @private
     */
    static _getRootSVG(svgEle) {
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
    static _mousePos(element, evt) {
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
    static _controlBar(document,pathSVG,path,controlIndex,pointIndex) {

        let isXY = "x" in path[0];

        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.classList.add("vizutil-cp-line");
        //line.setAttribute("stroke",style.strokeColor);
        //line.setAttribute("stroke-opacity",style.strokeOpacity)
        //line.setAttribute("stroke-dasharray", "2,2");

        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
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

        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        //group.setAttribute("data-id", data_id);
        group.appendChild(line);
        group.appendChild(circle);

        /* CREATE INTERACTION HANDLERS */
        let downHandler, upHandler, moveHandler;
        moveHandler = (e) => {
            let pnt = SvgUtil._mousePos( SvgUtil._getRootSVG(group), e );

            //Position the controls
            circle.setAttribute("cx",pnt.x);
            circle.setAttribute("cy",pnt.y);
            line.setAttribute("x1",pnt.x);
            line.setAttribute("y1",pnt.y);

            //Update the path
            if (isXY) {
                path[controlIndex].x = pnt.x;
                path[controlIndex].y = pnt.y;
            } else {
                path[controlIndex][0] = pnt.x;
                path[controlIndex][1] = pnt.y;
            }

            SvgUtil.curve(document,path,null,pathSVG);
        };
        downHandler = () => {
            document.removeEventListener("mousedown",downHandler);
            document.addEventListener("mousemove",moveHandler);
            document.addEventListener("mouseup",upHandler)
        };
        upHandler = () => {
            document.removeEventListener("mousemove",upHandler);
            document.removeEventListener("mousemove",moveHandler);
        };

        //LISTEN FOR CIRCLE CLICKS
        circle.addEventListener("mousedown",downHandler);


        return group;
    }



    static editControls(document,path,pathSVG) {


        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");

        //Append the control bars
        for (let i = 1; i < path.length; i+=3) {
            group.appendChild(
                SvgUtil._controlBar(document, pathSVG, path, i, i-1)
            );
            group.appendChild(
                SvgUtil._controlBar(document, pathSVG, path, i+1, i+2)
            );
        }

        return group;

    }


    /**
     * @param document
     * @param bezier
     */
    static curve(document,path,closed=false,target=null) {
        let isXY = "x" in path[0];

        //C x1 y1, x2 y2, x y
        let pathStr = "";
        if (isXY) {
            pathStr += "M "+path[0].x+" "+path[0].y+ " ";
            for (let i = 1; i < path.length; i+=3) {
                //Append the curve
                pathStr += "C " +
                    path[i+0].x + " " + path[i+0].y + " " +
                    path[i+1].x + " " + path[i+1].y + " " +
                    path[i+2].x + " " + path[i+2].y;
            }


        } else {
            pathStr += "M "+path[0][0]+" "+path[0][1] + " ";
            for (let i = 1; i < path.length; i+=3) {
                pathStr += "C " +
                    path[i+0][0] + " " + path[i+0][1] + " " +
                    path[i+1][0] + " " + path[i+1][1] + " " +
                    path[i+2][0] + " " + path[i+2][1];
            }
        }

        if (closed) pathStr += "z";


        let pathSVG = (target) ? target : document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathSVG.setAttribute("d", pathStr);
        pathSVG.classList.add("vizutil-path");

        return pathSVG;

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
        path.classList.add("vizutil-cross");
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
            if (i == 0) pathStr += "M "; else pathStr += "L ";
            pathStr += path[i].x + " " + path[i].y + " ";
        }
        if (closed) pathStr += "z";

        let node = document.createElementNS("http://www.w3.org/2000/svg", "path");
        node.setAttribute("d", pathStr);
        return node;
    }

}