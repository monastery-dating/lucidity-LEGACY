# TODO

// ======= Tuesday ========== //
- On [electron] project open: (match .lucy filetype)
  - Save path in recent projects for chooser.
  - read 'scenes' for list of scenes.

- On [electron] library sync:
  - Read all files in library path and load them in library.

// ======= Wednesday ========== //

- Lua bridge for torch7

// ======= Thursday ========== //

- Voice recognition

- Draw scene...

// ==== end of time available at home ==== //

- Unique scene name, cannot name block starting with two numbers and space.

- Check detach: seems to not work

- Use a target around slot connection (one target moved to closest slot), like
  in lubyk instead of changing graph shape.

- If an object becomes invalid: detach.

- Watch out for 'null' values in children in graph. Should only happen if the
  node is typed.

- Control performance: check after migration to Cerebral state-tree...

- Show scrollbars on graph views (but style them).

- Make changing 0xff0000 numbers like 3 numbers: 0x [ff] [00] [00].

- Do not allow 'main' block name change.

- Remove controls ?


# DATA

We need to store these kinds of data:

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

  4. Library data
    - Objects from other users (including lucidity)
    - Objects created by owner

(1) should live in PouchDB-CouchDB on Lucidity.
    /data/...
(2) should also live in PouchDB-CouchDB, but under the user
    scope.
    /user/...
(3) should live in another real-time database, with eventual
    snapshots stored in /data/.
(4) should allow some kind of versioning, pull request, etc
    - we use the github api !
      get tree: https://developer.github.com/v3/git/trees/#get-a-tree
      edit: https://developer.github.com/v3/repos/contents
    - for each project, user can set access tokens to corresponding repo and can
      then 'commit' project (makes a self contained executable project).
    - for the library, user's can have multiple sources with and without write
      access. When adding/updating an object to the library, the user selects
      where this object is written to (his own public lib, his own private lib,
      his clone of lucy-library, etc).

For all versioning needs: https://developer.github.com/v3/repos/contents/
Library goes to a github repo.
Each project can have a github repo link (per user).

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


# PLAYBACK TYPE CHECKING

We can type check blocks by adding a 'meta' export with one field per function. For the 'init' function, the type must be two objects, one for the expected values in context and one for what the element provides (if anything). The 'render' function type is made of two values (one for input and one for output). For example:

    // A script that provides a function on number (no init function).
    export const meta =
    { render: [ 'number', 'number' ]
    }

    // A script that provides a function on number
    export const meta =
    { init:   [ { renderer: 'THREE.WebGLRenderer' }
              , { object3D: 'THREE.Object3D' }
              ]
    , render: [ 'number', 'number' ]
    }
# PLAYBACK INIT

The **init** function takes a context and an object to allow destructuring, avoid any mistakes in argument position, and allow more options if needed later.

The init function is called multiple times (when a local source file is changed, when an asset is changed, etc). The user must take care of using the 'cache' to avoid unwanted multiple initialization. The function is run **at least** once before script rendering.

## INIT Calls

The init function is called when:

  1. The block source changes.
  2. Graph is changed (connect, disconnect, etc).
  2. Used assets are modified/downloaded.
  3. Scenes are added/removed (optional).
  4. Screen is moved or resized (optional).

Optional calls are enabled by the init return values: `{ screen: true, scenes: true }`

## INIT Parameters
  **ctx**

  Rendering context passed at this point in graph.

  **helpers**

  See below.

# INIT Return value

  Init returns the changed context for sub-nodes.

## INIT Helpers
  **cache**

  1. Manage state through specialized blocks (db) that pass a state thing to their children.

  2. Initialization of this block state is done with the init function, with things written to the cache. Exposition through the script with closures.

  **require**
  1. Use normal
     const THREE = require ( 'THREE' )
  2. If the library is not downloaded yet, the
     require throws a MissingLibrary error and
     we download it and retry 'init'.


  **asset**

  1. Assets are downloaded (and declared) in the init function through an 'asset' function. The project assets are pre-downloaded and are accessed by their filename. If an asset is not available, just like 'require', we throw a MissingAsset error, and try to find the asset.

  In both **cache** and **asset** a Promise can be returned for async asset fetch/download, etc.

  **other sources**

  How do we access other sources in a block (like fragment and vertex shaders) ?

  * Through local import ? No: it is not made for reading files.
  * With 'asset' ? This would allow us to rerun the function on source changes. But asset becomes more complex and loads things depending on block context. Can be confusing.
  * Use a third parameter called 'source' ? This is the best option as it actually creates the empty tabs. Content is then saved in document in sources object.


A script with some state and assets:
===============
import SomeDB from 'somedb'

let db
let cat

export const init =
( { asset, cache, source } ) => {

  // ====== ASSET
  // Get an image. This code runs async and does not 'return' a value. With this code we can check on compile time if all assets with the given name exist and if decide when we download, notify progress, etc. We can also cache the element. The downside is we need an API for this and translations to THREE.Image, etc.

  asset.image ( 'Cat.jpg', ( i ) => cat = i )
  asset.source ( 'blur.frag', ( s ) => {
      shader.fragment = s
      shader.changed = true
    }
  )

  // ====== OTHER SOURCE FILE
  source ( 'frag.glsl', ( s ) => {
    // do this that
  })

  // ====== CACHE
  // Simplest case
  cache.db = db = cache.db || new SomeDB ()

  if ( cache.db ) {
    db = cache.db
  }
  else {
    db = cache.db = new SomeDB ()
    db.doSomething ()
  }

  // For async code, the init function can return a Promise.
}
===============

# PLAYBACK RENDER

This function is called in 'main' once whenever the source code of any element or the structure of the graph changes. If an element animates, the render can be called more often. When a script does not have a 'render' function (purely structural block) the block can grow its children (there is always a free slot). In this case, if the parent calls child () this triggers the render functions found lower in the graph (left depth-first).

# REFACTORING

  1. Remove default exports: they are confusing since any name
     can be used and this can lead to stupid mistakes.
  2. Remove 'export module' and import libs with * as Foo. This makes it easier to import just a function and it's simpler.
  3. Make 'parent' and 'parentId' consistent (use parentId).

# FINANCES

Create different prices:

## Free 0$

  - public projects (owner write, public read)

## Standard 10$/month

  - private projects, sharing
  - github integration
  - dropbox integration for assets

## Pro 25$/month

  - Desktop app (midi, etc)
  - DAW plugin
  - Receive new library objects 6 month sooner (they finance its development)

## What about making Lucidity completely server free ?

Then people only pay for an app, they buy the app, get updates now and then and that's it. The rest of the social, networking stuff is handled from each app with a simple file system db thing.

If we really need people to have this thing sync online, it could backup to dropbox app, or some other cloud people use anyway...

Pro: no server to maintain, simple pricing for users
Con: no per month revenue


# DRAG & DROP

1. drag scene/project ==> graph for dragged elements
                      ==> drag.nodeId === nodeId : do not draw children
                          uimap ( ..., dragNodeId ) ?
   drag library ==> graph with a single node

# COMPONENT semver

Ask user on adding a script to the library for:

- name
- validation button = [ cancel ] [ major ] [ minor ] [ patch ] if the script has a meta field. The buttons then update the semver version number in the script before saving it.
