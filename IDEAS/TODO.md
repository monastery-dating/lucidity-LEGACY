# DEV

* Use a babel SCSS transpiler and make it live-reload with webpack-dev-server (makes it easier to move styles inline with components).

# PERFORMANCE

* Optimize graph draw to not replace svg elements but update them ? (sync ?)
  During drag hover, it might take less CPU.

* Make sure uigraph cache is used every time possible (eventually reduce cache usage to text size).


# INTERFACE

# SAVE

  1. Write to /$project/title
  2. Write to DB
  2. => on.update:
        write to /data/[/project.id]/title
        /$project/saving = false
  4. => database on.change
  5. => /$project/saving = false

# PLAYBACK

  1. Use a Monkey to store full project in tree with
     selected scene.
  2. Use a Monkey to update the $main function whenever the
     current scene changes.
  3. Use a Playback Component to display current scene inside
     top of Workbench.

# REFACTORING
  1. Change Graph structure and type:

  A graph is just a list of NodeLink ids.
  A NodeLink is
  { id: NodeLinkId
  , parentId: NodeLinkId
  , children: NodeLinkId[]
  , nodeId: NodeId
  }
  A Node is this thing with inputs, output, script, path, etc.

  2. Remove default exports: they are confusing since any name
     can be used and this can lead to stupid mistakes.

  3. Transform code from boxdrag to use the store instead of a service...
    --
    StartDrag => Post event to store
    DragMove => Post event to store
    --
    Drop => etc
