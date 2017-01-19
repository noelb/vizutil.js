# vizutil.js

A set of utility libraries for working with geometry in javascript. 


## Repository

* src - ECMA 6 javascript. This version of the code will work in latest version of chrome, 
(probably) not so much in other browsers
* lib - babel compiled version of src that should run in most browsers
* gh-pages - src for the vizutil.js website (http://)and associated examples.
    * gh-pages-push.sh - Publishes the vizutil.js demo site
    * gh-pages-server.sh - Starts up a local server to test locally
* build.sh - compiles the src to lib using babel for backwards compatibility


## API Design

This library avoids having numerous OOP constructs (rectangle class, path 
class, etc.). While well designed OOP can help organize large libraries,
it can also get messy when you stitch together a different libraries (e.g., 
a physics and graphics engines can each have their own point, vector, path 
objects, etc.)

This library uses (mostly) static methods that can be used in isolation. 
In some cases you may want to simply copy and paste the function you 
want out of this library into your own utility classes rather than 
incorporating the whole family.


## ECMA 6

The code base is written and maintained in ECMA 6. This means it will work in
some current browsers, but if you want to run it in older ones, use the
babel compiled files in the "lib" directory (which should just be vanilla JS).


## Point Objects

The library supports two formats to represent a point.


1. An array containing two values
`
//A point with x=123, y=567
let mypoint = [123,567]
`

2. An object with an x and y property
`
//A point with x=123, y=567
let mypoint = {x:123,y:567}
`


## Other (even more) excellent libraries

If you like this library, you'll probably also find these libraries
to be incredibly useful.
* https://pomax.github.io/bezierjs/
* https://github.com/jsplumb/jsBezier


##