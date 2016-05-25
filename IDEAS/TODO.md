# DATA

We need to store 3 kinds of data:

  1. Project data
    - Project assets and scenes
    - Scene name, graph, etc
    - Block contents

  2. User state
    - Current project
      - selected scene
      - selected tab
      - etc

  3. Playback state
    - Slider values
    - Time position
    - etc

(1) should live in PouchDB-CouchDB on Lucidity.
    /data/...
(2) should also live in PouchDB-CouchDB, but under the user
    scope.
    /user/...
(3) should live in another real-time database, with eventual
    snapshots stored in /data/.

For (1) and (2), we need to create two functions:

  data.save ( type, id, values-to-merge ) ==> docs
  data.state ( values-to-merge ) ==> docs

# PERFORMANCE

  1. Make sure the component render is NOT called if state and props have not changed (this is the first reason why we use immutables so it better work).
  ==> Try switch to Inferno

  2. Optimize graph draw to not replace svg elements but update them ? (sync ?)
    During drag hover, it might take less CPU.

  3. Make sure uigraph cache is used every time possible (eventually reduce cache usage to text size).


# INTERFACE

# OPERATION

Group actions into an operation.

# SAVE

  1. Write to /$project/name
  2. Write to DB
  2. => on.update:
        write to /data/[/project.id]/name
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
