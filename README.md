# vizutil.js

A set of utility libraries for working with geometry in javascript. 
Documentation and examples here: https://noelb.github.io/vizutil.js


## Repository

* src - ECMA 6 code. This version of the code will work in latest version of chrome, 
but (probably) not so much in other browsers
* lib - babel compiled version of src that should run in most browsers
* docs - src for the vizutil.js website (http://) and associated examples.
* build.sh - compiles the src to lib using babel for backwards compatibility



## API Design

This library avoids having numerous OOP constructs (e.g., rectangle, path, point 
classes) and instead uses (mostly) static methods and generic objects.
This should make it easier to use in conjunction with other geometry and graphics libraries.
In some cases you may want to simply copy and paste the function you 
want out of this library into your own utility classes rather than 
incorporating the whole family.


## ECMA 6

The code base is written and maintained in ECMA 6. This means it will work in
some current browsers, but if you want to run it in older ones, use the
babel compiled files in the "lib" directory (which should just be vanilla JS).



### Build Instructions

You need to have babel installed to compile the ECMA 6 code to javascript.
On OSX, you can do this:
~~~~
// 1. Install Homebrew - https://brew.sh/
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

// 2. Install Node
brew install node

// 3. Install babel
npm install --global babel-cli
~~~~

Once installed, you can run the "build.sh" shell script, or execute the following:
~~~~
babel src --out-dir lib --presets es2015
~~~~



## Point Objects

The library supports two formats to represent a point.


1. An array containing two values
~~~~
//A point with x=123, y=567
let mypoint = [123,567]
~~~~

2. An object with an x and y property
~~~~
//A point with x=123, y=567
let mypoint = {x:123,y:567}
~~~~


## Other libraries

If you like this library, you'll probably also find these libraries
to be incredibly useful.
* https://pomax.github.io/bezierjs/
* https://github.com/jsplumb/jsBezier


##