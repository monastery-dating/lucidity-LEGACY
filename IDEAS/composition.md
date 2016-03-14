There should be a list of 'prototypes', filters, sources or such things.
Composing a scene with a simple graphical interface to drag effects together and
view the immediate result. Have some basic access to the uniforms, video source
and such to quickly evaluate if an idea seems interesting.

The 'library' of effects is split into several things:

  Base effects (simple effects to start with).
    Filters
      * blur
      * edge
      * age
    Sources
      * video
      * cube
    Etc

  Global Scene library
    
    These are scenes saved and available for reuse. It should be very easy to
    reuse parts of these scenes with drag & drop.

  Global Asset library

    These are images, videos, geometries, etc.

  Project Scene library

    These are selected scenes copied into the current project.

  Project Asset library

    These are assets copied into the current project.  

Effect editing and composition can happen inside the project scene library or
the workspace.

## What kind of effect composition do we need ?

1. Full image fx chain
  
  Apply an fx on an rendered result.

  * fxA works on a full image ]
    * fxA calls: fxB.update ( fxA.subTarget )
  * fxB knows how to write Image into a target        [ three.js target ]

2. Geometry, Material or other provided by sub fx

  A scene needs to be altered by sub elements (Geometry, Material).

  * fxA displays a simple element
    * fxA calls: fxB.update ( fxA.scene )
  * fxB knows how to write Geometry into a scene      [ three.js scene ]
    * fxB calls: fxC.update ( scene ) // same passed in object
  * fxC knows how to write Material into a scene      [ three.js scene ]

3. Geometry, video

  A scene needs to be given some Geometry and an image.

  * fxA calls: fxB.update ( fxA.scene, fxA.subTarget )

4. What if an element want to share what it provides to multiple elements ?

  Like a material or geometry ?
  Do we need to draw cables ?
  Can we make the box have many up slots with the same value ?
  What about vertical distance ?
  Could we have boxes that by default connect on contact but you can also use
  cables (maybe only when needed) ? But then I have to use SVG from the start.
  Grmbl.. Or maybe only to draw the cables ?
  Fonts in SVG are ugly.

  +---------------------+
  | top                 |
  +--^-------^----------+
     |    +--^------------+
     |?   | sub1          |
     |    +--^------------+
  +--^-------^-------+
  | sub2             |
  +------------------+

## Ideas for scene graph

See graphComposition.js
