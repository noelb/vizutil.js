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
    // FIXME: Should probably move this out of here and just into the demo utility class
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
    // FIXME: Should probably move this out of here and just into the demo utility class
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
    // FIXME: Should probably move this out of here and just into the demo utility class
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


    // FIXME: Should probably move this out of here and just into the demo utility class
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


    // Should probably make this create a cross outline instead of
    static getX(document, x, y, size=5, closed = false) {
        size /= 2;
        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d",
            "M " + (x - size) + " " + (y - size) + " " +
            "L " + (x + size) + " " + (y + size) + " " +
            "M " + (x - size) + " " + (y + size) + " " +
            "L " + (x + size) + " " + (y - size)
        );
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
    static getRect(document, x, y, width, height, center=true) {
        let path = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        if (center) {
            path.setAttribute("x",x-width/2);
            path.setAttribute("y",y-height/2);
        } else {
            path.setAttribute("x",x);
            path.setAttribute("y",y);
        }
        path.setAttribute("width",width);
        path.setAttribute("height",height);
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
    static getRoundedRect(document, x, y, width, height, rx=2, ry=null, center=true) {
        if (ry == null) ry = rx;
        let path = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        if (center) {
            path.setAttribute("x",x-width/2);
            path.setAttribute("y",y-height/2);
        } else {
            path.setAttribute("x",x);
            path.setAttribute("y",y);
        }
        path.setAttribute("rx",rx);
        path.setAttribute("ry",ry);
        path.setAttribute("width",width);
        path.setAttribute("height",height);
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
    static getCircle(document, cx, cy, r) {
        let path = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        path.setAttribute("cx",cx);
        path.setAttribute("cy",cy);
        path.setAttribute("r",r);
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
    static getEllipse(document, cx, cy, rx, ry) {
        let node = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        node.setAttribute("cx",cx);
        node.setAttribute("cy",cy);
        node.setAttribute("rx",rx);
        node.setAttribute("ry",ry);
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
    static getStar(document, cx, cy, radiusInner, radiusOuter, numPoints=5) {
        let pathStr = "";
        const STEPS = numPoints*2
        for (let i=0; i < STEPS; i++) {
            let theta = (2*Math.PI) * (i /STEPS);
            theta -= Math.PI/2; // Rotate so first point is at the top
            let r = (i%2==0) ? radiusOuter : radiusInner;
            let x = cx + Math.cos(theta) * r;
            let y = cy + Math.sin(theta) * r;
            pathStr += (i == 0) ? "M " : "L ";
            pathStr += x + " " + y + " ";
        }
        pathStr += "z";

        let node = document.createElementNS("http://www.w3.org/2000/svg", "path");
        node.setAttribute("d",pathStr);
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
    static getRegularPolygon(document, cx, cy, radius, numSides=5) {

        let pathStr = "";
        for (let i=0; i < numSides; i++) {
            let theta = (2*Math.PI) * (i /numSides);
            theta -= Math.PI/2; // Rotate so first point is at the top
            let x = cx + Math.cos(theta) * radius;
            let y = cy + Math.sin(theta) * radius;
            pathStr += x + "," + y + " ";
        }

        let node = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        node.setAttribute("points",pathStr);
        node.classList.add("vizutil");
        node.classList.add("vizutil-polygon");
        return node;

    }



    static getCross(document, cx, cy, radius, thickness=10, numPoints=4) {

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

        let halfThickness = thickness / 2;
        let step = (Math.PI*2) / numPoints;

        // Find the magnitude and offset distance of the long legs
        let magL = Math.sqrt( halfThickness*halfThickness + radius*radius );
        let offsetL = Math.asin( halfThickness / magL );

        // Find the magnitude and offset distance of the short legs
        let offsetS = (Math.PI*2) / (numPoints*2);
        let magS = halfThickness / Math.sin(offsetS);


        let pathStr = "";
        for (let i=0; i < numPoints; i++) {

            let theta = (2*Math.PI) * (i /numPoints);
            theta -= Math.PI/2; // Rotate so first point is at the top

            let x,y;

            // // The point
            // x = cx + Math.cos(theta) * radius;
            // y = cy + Math.sin(theta) * radius;
            // pathStr += x + "," + y + " ";

            // The first long one
            x = cx + Math.cos(theta+offsetL) * magL;
            y = cy + Math.sin(theta+offsetL) * magL;
            pathStr += x + "," + y + " ";

            // The short long one
            x = cx + Math.cos(theta+offsetS) * magS;
            y = cy + Math.sin(theta+offsetS) * magS;
            pathStr += x + "," + y + " ";

            // The other long one
            x = cx + Math.cos(theta+step - offsetL) * magL;
            y = cy + Math.sin(theta+step - offsetL) * magL;
            pathStr += x + "," + y + " ";
        }

        let node = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        node.setAttribute("points",pathStr);
        node.classList.add("vizutil");
        node.classList.add("vizutil-polygon");
        return node;

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



    static getArrow(document, x0, y0, x1, y1, thickness=10, arrowStyle=null) {
        let node = document.createElementNS("http://www.w3.org/2000/svg", "path");
/*
        let style = {
            headWidth: thickness*2,
            headLength: thickness*2,
            shaftOffset: 0
        };

        // Copy any arrow style params that were passed in
        if (arrowStyle != null) for (paramName in arrowStyle) style[paramName] = arrowStyle[paramName];

        // If there is no line, just return
        if (x0==x1 && y0==y1) return node;


        var fullVect:Point = end.subtract(start);
        var halfWidth:Number = (arrowStyle.headWidth != -1) ? arrowStyle.headWidth/2 : arrowStyle.headLength/2;

        //Figure out the line start/end points
        var startNorm:Point = new Point(fullVect.y,-fullVect.x);
        startNorm.normalize(arrowStyle.shaftThickness/2);
        var start1:Point = start.add(startNorm);
        var start2:Point = start.subtract(startNorm);
        var end1:Point = end.add(startNorm);
        var end2:Point = end.subtract(startNorm);

        //figure out where the arrow head starts
        var headPnt:Point = fullVect.clone();
        headPnt.normalize(headPnt.length-arrowStyle.headLength);
        headPnt = headPnt.add(start);

        //calculate the arrowhead corners
        var headPntNorm:Point = startNorm.clone();
        headPntNorm.normalize(halfWidth);
        var edge1:Point = headPnt.add(headPntNorm);
        var edge2:Point = headPnt.subtract(headPntNorm);

        //Figure out where the arrow connects the the shaft, then calc the intersections
        var shaftCenter:Point = Point.interpolate(end,headPnt,arrowStyle.shaftPosition);
        var inter1:Point = GeomUtil.getLineIntersection(start1,end1,shaftCenter,edge1);
        var inter2:Point = GeomUtil.getLineIntersection(start2,end2,shaftCenter,edge2);

        //Figure out the control points
        var edgeCenter:Point = Point.interpolate(end,headPnt,arrowStyle.edgeControlPosition);
        var edgeNorm:Point = startNorm.clone();
        edgeNorm.normalize(halfWidth*arrowStyle.edgeControlSize);
        var edgeCntrl1:Point = edgeCenter.add(edgeNorm);
        var edgeCntrl2:Point = edgeCenter.subtract(edgeNorm);


        graphics.moveTo(start1.x,start1.y);
        graphics.lineTo(inter1.x,inter1.y);
        graphics.lineTo(edge1.x,edge1.y);
        graphics.curveTo(edgeCntrl1.x,edgeCntrl1.y,end.x,end.y);
        graphics.curveTo(edgeCntrl2.x,edgeCntrl2.y,edge2.x,edge2.y);
        graphics.lineTo(inter2.x,inter2.y);
        graphics.lineTo(start2.x,start2.y);
        graphics.lineTo(start1.x,start1.y);
        */
        return node;

    }

    // FIXME: TODO
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