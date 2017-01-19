var Util = (function () {
    var module = {};


    /* - - - - - - - - - - - - - - - - - - - - - - - - - */


    var WIDTH = 500;
    var BORDER = 100;

    module.WIDTH = WIDTH;
    module.BORDER = BORDER;

    module.randomPoint = function(){
        return [(WIDTH - BORDER * 2) * Math.random() + BORDER, (WIDTH - BORDER * 2) * Math.random() + BORDER];
    };

    module.randomCP = function(pnt) {
        return [
            pnt[0] + (Math.random()*BORDER*2 - BORDER),
            pnt[1] + (Math.random()*BORDER*2 - BORDER)
        ]
    };

    module.randomPath = function(numPoints) {
        var pnts = [];
        for (var i=0; i < numPoints; i++) pnts.push( module.randomPoint() );
        return pnts;
    };


    module.randomBezier = function(numPoints) {
        if (numPoints == null) numPoints  = Math.floor(Math.random()*5) + 2;
        var pnts = module.randomPath(numPoints);
        // pnts = [
        //     [100,100],[200,100],[300,100]
        // ];

        var bezier = [pnts[0]];

        for (var i=0; i < pnts.length-1; i++) {

            //Add the first control point
            var p = pnts[i];
            var cp = bezier[ bezier.length-2 ];
            if (cp == null) {
                bezier.push( module.randomPoint() );
            } else {
                var rot = GeomUtil.rotate(cp[0],cp[1],Math.PI,p[0],p[1]);
                bezier.push( rot );
            }

            //Add the second control point
            bezier.push( module.randomCP(pnts[i+1]) );

            //Add the next point
            bezier.push(pnts[i+1]);

        }

        return bezier;
    };


    module.randomSVGPath = function(numPoints) {
        var bezier = Util.randomBezier(numPoints);
        return SvgUtil.curve(document, bezier);
    };


    /* - - - - - - - - - - - - - - - - - - - - - - - - - */


    module.getMousePos = function(element, event) {
        var rect = element.getBoundingClientRect(), root = document.documentElement;
        var mouseX = event.clientX - rect.left - root.scrollLeft;
        var mouseY = event.clientY - rect.top - root.scrollTop;
        return [mouseX, mouseY];
    };


    module.onMouse = function(element,start,drag,end) {

        var el = element;
        el.addEventListener("mousedown", function(event){
            if (start) start(event);
            if (drag) el.addEventListener("mousemove", drag, false);
        }, false);

        el.addEventListener("mouseup", function(event){
            if (drag) el.removeEventListener("mousemove", drag, false);
            if (end) end(event);
        }, false);

    };


    /* - - - - - - - - - - - - - - - - - - - - - - - - - */


    return module;

})();