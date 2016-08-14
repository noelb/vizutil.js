# vizutil.js

A set of utility libraries for working with geometry.



## Design Philosophy

Many similar libraries use a lot of constructs (rectangle objects, 
path objects, etc.).

While these constructs can help organize large code libraries, they also 
impose structures which may not be compatible with your own code base. As
a result, you may find yourself constructing a lot of glue code to
translate one framework to another.

This library uses (mostly) static methods that can be used in isolation
as much as possible. The library can then easily work alongside whatever
code base you may have rather than dictating those constructs for you. It's
not the right architecture for every project, but is for those who like to use
as little code as possible to achieve their ends.

...

## Point Objects

In keeping with our design philosophy, we don't introduce yet another new "point"
or "vector" object.

Instead we use a simple array with two elements. The zero position is "x", the one
position is "y". Here is an example point:
[123,567]

We also support "duck typing" on any object that has an XY value. We offer a duplicated
of every method with "XY" in the title to support this. Some methods accept an "xy" boolean
to switch between the two. Example XY point:
{x:123,y:567}


