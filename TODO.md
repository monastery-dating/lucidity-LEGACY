# PERFORMANCE

* Optimize graph draw to not replace svg elements but update them ? (sync ?)
  During drag hover, it might take less CPU.

* Make sure uigraph cache is used every time possible (eventually reduce cache usage to text size).


# INTERFACE


# REFACTORING

* 1. Transform store into
  a. user (library, prefs, etc)
  b. project (files, scenes->graph, selected scene)
  c. ui (drag/drop operations, computed graphs, etc)
     having the ui in the store will help us create tutorials by mocking
     ui events.
   ==> Use reducer composition
      ==> Different reducer functions add on different parts
          of the state tree.
          ==> user
          ==> project
              ==> scene
                  ==> node
          ==> ui ?
* 2. Transform code from boxdrag to use the store instead of a service...
  --
  StartDrag => Post event to store
  DragMove => Post event to store
  --
  Drop => etc
* Use seamless-immutable (once they have proper typings) ?
