export default
{ files:
  { all:
    [ { name: 'ai.Play'  }
    , { name: 'ai.Learn' }
    , { name: 'foo'      }
    ]
  }
, graph:
  { g0:
    { name: 'cubes'
    , in: { target: 'THREE.RenderTarget' }
    , link: [ 'g1' ]
    }
  , g1:
    { name: 'filter.Bloom'
    , out: [ { target: 'THREE.RenderTarget' } ]
    , in:
      [ { target: 'THREE.RenderTarget' }
      , { target: 'THREE.RenderTarget' }
      ]
    , link: [ 'g2' ]
    , files:
      [ 'frag.glsl'
      , 'index.js'
      , 'vert.glsl'
      ]
    }
  , g2:
    { name: 'filter.Mix'
    , out: [ 'target: THREE.RenderTarget' ]
    , in:
      [ { target: 'THREE.RenderTarget' }
      , { target: 'THREE.RenderTarget' }
      ]
    , link: [ 'g3', 'g4' ]
    , files:
      [ 'frag.glsl'
      , 'index.js'
      , 'vert.glsl'
      ]
    }
  , g3:
    { out: [ { target: 'THREE.RenderTarget' } ]
    , name: 'generator.Video'
    , link: []
    }
  , g4:
    { out: [ { target: 'THREE.RenderTarget' } ]
    , name: 'generator.Crystal'
    , sel: true
    , link: []
    }
  }
}
