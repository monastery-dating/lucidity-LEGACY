// This is the graph.json inside a scene folder.
// We only store down links ( receive ). We do not store link definitions
// and types ( these are checked on connection ).
//
// It is used to setup graph processing and draw the graph in the editor.
//
// The goal with this is to store minimal information to avoid duplication and
// out of sync data as much as possible.
//
// EDITOR
//   1. The graph is read
//   2. The files are loaded ==> we get missing information and out-of-sync
//      warnings
//   3. We do not call 'setup' on the scripts
//   4. The graph can be drawn
//
// PLAYBACK
//   1. The graph is read
//   2. The files are loaded
//   3. Setup is called (DEPTH-FIRST)
//   4. Connections are established
//   5. Run
//
GRAPH = { "graph":
  { "fx0":
    { "type": "main"
    , "name": "main"
    , "down":
      [ { "name": "image"
        , "type": "THREE.RenderTarget"
        , "receive": "fx1.bloom"
        }
      ]
    }
  , "fx1":
    { "type": "directory"
    , "name": "filter.Bloom"
    , "files":
      { "index.js" : { "type": "file" }
      , "frag.glsl": { "type": "file" }
      , "vert.glsl": { "type": "file" }
      }
    , "up":
      [ { "name": "bloom"
        , "type": "THREE.RenderTarget"
        }
      ]
    , "down":
      [ { "name": "image"
        , "type": "THREE.RenderTarget"
        , "receive": "fx2.blur"
        }
      ]
    }
  , "fx2": // we use a unique identifier to avoid messing stuff on rename
           // these ids are incremented per scene, on object addition.
    { "type": "directory"
    , "name": "filter.Mix" // this is the folder name
    , "files":
      { "index.js" : { "type": "file" }
      , "frag.glsl": { "type": "file" }
      , "vert.glsl": { "type": "file" }
      }
    , "up":
      [ { "name": "blur"
        , "type": "THREE.RenderTarget"
        }
      ]
    , "down":
      [ { "name": "image1"
        , "type": "THREE.RenderTarget"
        , "receive": "fx3.video"
        }
      , { "name": "image2"
        , "type": "THREE.RenderTarget"
        , "receive": "fx4.crystal"
        }
      ]
    }
  , "fx3":
    { "type": "file"
    , "name":  "generator.Video.js"
    , "up":
      [ { "name": "video"
        , "type": "THREE.RenderTarget"
        }
      ]
    }
  , "fx4":
    { "type": "file"
    , "name": "generator.Crystal.js"
    , "up":
      [ { "name": "crystal"
        , "type": "THREE.RenderTarget"
        }
      ]
    }
  }
}

