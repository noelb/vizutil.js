# vizutil.js

A set of utility libraries for working with geometry.



## Design Philosophy

We intentionally avoid the creation of numerous OOP constructs (rectangle class, 
path class, etc.).

While objects can help organize large code libraries, they also 
impose structures which may duplicate behaviour within your own code (e.g., you 
may find yourself constructing a lot of glue code to translate from a physics engine
to a graphics engine, and it can be annoying to add another set of objects into the mix).

This library uses (mostly) static methods that can be used in isolation
as much as possible. The library can then easily work alongside whatever
code base you may have. It's not the right architecture for every project, but 
for this type of library, iy can help reduce the amount of code you introduce 
into your projects.


## ECMA 6

The code base is written and maintained in ECMA 6. This means it will work in
most current browsers, but if you want to run it in older ones, you will need
to process it yourself.


## Point Objects

In keeping with our design philosophy, we don't introduce our own "point"
or "vector" object.

Instead, we use a simple array with two elements as a point. The zero position is "x", 
the one position is "y". Here is an example:

`
let mypoint = [123,567]
`

We also support "duck typing" on any object that has an XY value. We offer a duplicate
of every method with "XY" in the title to support this. Some methods accept an "xy" boolean
to switch between the two. Example XY point:

`
let mypoint = {x:123,y:567}
`


