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
  { "g0":
    { "type": "main"
    , "name": "display"
    , "down":
      [ { "name": "image"
        , "type": "THREE.RenderTarget"
        , "receive": "g1.bloom"
        }
      ]
    }
  , "g1":
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
        , "receive": "g2.blur"
        }
      // just to test layout
      , { "name": "image2"
        , "type": "THREE.RenderTarget"
        }
      ]
    }
  , "g2": // we use a unique identifier to avoid messing stuff on rename
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
        , "receive": "g3.video"
        }
      , { "name": "image2"
        , "type": "THREE.RenderTarget"
        , "receive": "g4.crystal"
        }
      ]
    }
  , "g3":
    { "type": "file"
    , "name":  "generator.Video.js"
    , "up":
      [ { "name": "video"
        , "type": "THREE.RenderTarget"
        }
      ]
    , "down":
      [ { "name": "palette"
        , "type": "THREE.RenderTarget"
        }
      ]
    }
  , "g4":
    { "type": "file"
    , "name": "generator.Crystal.js"
    , "sel": true
    , "up":
      [ { "name": "crystal"
        , "type": "THREE.RenderTarget"
        }
      ]
    , "down":
      [ { "name": "image"
        , "type": "THREE.RenderTarget"
        }
      ]
    }
  }
, "assets": // format is a hack to draw until we work things out
  { "a0":
    { "type": "main"
    , "name": "assets"
    , "next": "g5"
    }
  , "g5":
    { "type": "file"
    , "name": "game"
    , "next": "g9"
    , "sub":  "g6"
    }
  , "g6":
    { "type": "file"
    , "name": "game.Player"
    , "next": "g7"
    }
  , "g7":
    { "type": "file"
    , "name": "game.Wall"
    , "next": "g8"
    }
  , "g8":
    { "type": "file"
    , "name": "game.Arena"
    }
  , "g9":
    { "type": "folder"
    , "name": "ai"
    , "sub":  "a9"
    , "next": "g10"
    }
  , "a9":
    { "type": "file"
    , "name": "ai.Learn"
    , "next": "a10"
    }
  , "a10":
    { "type": "file"
    , "name": "ai.Play"
    }
  , "g10":
    { "type": "folder"
    , "name": "palette"
    , "sub":  "g11"
    }
  , "g11":
    { "type": "file"
    , "name": "c.Palette"
    , "next": "g12"
    }
  , "g12":
    { "type": "file"
    , "name": "d.Palette"
    , "next": "g13"
    }
  , "g13":
    { "type": "file"
    , "name": "e.Palette"
    , "next": "g14"
    }
  , "g14":
    { "type": "file"
    , "name": "f.Palette"
    , "next": "g15"
    , "sel": true
    }
  , "g15":
    { "type": "file"
    , "name": "g.Palette"
    , "next": "g16"
    }
  , "g16":
    { "type": "file"
    , "name": "h.Palette"
    , "next": "g17"
    }
  , "g17":
    { "type": "file"
    , "name": "i.Palette"
    }
  }
}

