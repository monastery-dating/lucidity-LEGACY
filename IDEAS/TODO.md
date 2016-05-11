# DEV

* Use a babel SCSS transpiler and make it live-reload with webpack-dev-server (makes it easier to move styles inline with components).

# PERFORMANCE

* Optimize graph draw to not replace svg elements but update them ? (sync ?)
  During drag hover, it might take less CPU.

* Make sure uigraph cache is used every time possible (eventually reduce cache usage to text size).


# INTERFACE

# SAVE

  1. Write to /project/title
  2. => on.update:
        write to /data/[/project.id]/title
        /project/$saving = false
  4. => database save
  5. => /project/$saving = false

# PLAYBACK

  1. Use a Monkey to store full project in tree with
     selected scene.
  2. Use a Monkey to update the $main function whenever the
     current scene changes.
  3. Use a Playback Component to display current scene inside
     top of Workbench.

# REFACTORING

  1. Recreate state tree
    ==> user
       ==> model
       ==> views
    ==> project
       ==> model
          ==> scene
            ==> node
       ==> views
         ==> selected scene, etc.

  2. Use uimap in Graph component or with Facet ?

    uimap should be called by the master component rendering a graph.
    his should only happen when the prop for this component (a graph) is changed. No need to tinker with uimap outside of rendering components !! As simple as that !!

    or use Monkeys ?

  3. Transform code from boxdrag to use the store instead of a service...
    --
    StartDrag => Post event to store
    DragMove => Post event to store
    --
    Drop => etc
