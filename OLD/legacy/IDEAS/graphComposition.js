// ========================================================================== //
// First solution without declaration (but we cannot do type checking...)     //
// ========================================================================== //
self.setup ( scene /* THREE.Scene */, video /* THREE.RenderTarget */ )
{ self.subScene = scene
  self.subVideo = video
}

self.update ( ... )
{
  // and then call in update function:
  self.subScene.update ( self.scene   )
  self.subVideo.update ( self.target1 )
}

// ========================================================================== //
// Explicit declarations using an object                                      //
// ========================================================================== //
self.interface =
{ input1: 'THREE.Scene'
, input2: 'THREE.RenderTarget'
, output: 'THREE.RenderTarget'
}

// ========================================================================== //
// Declare the things that my script can receive                              //
// ========================================================================== //
self.info =
{ name:    'some.Name'       // the first part 'some' is used as color palette index
, author:  'Gaspard Bucher'
, down:
  [ { name: "geometry", type: 'THREE.Geometry' }
  , { name: "image",    type: 'THREE.RenderTarget' }
  ]
, up:
  [ { name: "image",    type: 'THREE.RenderTarget' }
  ]
}

// OR the same definition using functions:

self.info
( { name: 'some.Name'
  , author: 'Gaspard Bucher'
  }
)

self.up
( 'image', 'THREE.RenderTarget'
, ( connected ) => self.renderTarget1
)

self.up
( 'stats', 'lucy.Stats'
, ( connected ) =>
  { // The 'connected' boolean can be used as a rendering hint
    self.usingStats = connected
    return self.stats
  }
)

self.down
( 'geometry', 'THREE.Geometry'
, ( geom ) =>
  { let geom = geom || DEFAULT_GEOM
    self.object.geometry = geom
    self.object.needsUpdate = true
  }
)

self.down
( 'image', 'THREE.RenderTarget'
, ( image ) =>
  { self.object.texture1 = image || DEFAULT_TEXTURE
    self.object.needsUpdate = true
  }
)

// To connect a parent to a child, we call:
parent.receive
( 'image' // down slot name
, child.provide ( 'video', true ) // up slot name, connected: true
)

// ==> This creates a box with two slots up and two slots down:
//    +--^--------^--+
//    | some.Name    |
//    +--^--------^--+

// Then we need to make sure our graph is updated DEPTH FIRST so that all
// objects are ready when moving up the graph. With this we can completely avoid
// the responsability for the parent element to call update on it's (potentially
// inexistant) children.

// ========================================================================== //
// How do others handle scene graph construction ?                            //
// ========================================================================== //
