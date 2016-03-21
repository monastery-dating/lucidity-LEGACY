<template>
  <div id='foo'>
    <pre>
     +------------------+
     | Scene.vue = main |
     +-^----------------+
     +-^-------+
     | Reverse |
     +-^-------+
     +-^----------+
     | Mix        |
     +-^--------^-+
     +-^----+ +-^-----+
     | Lucy | | Hello |
     +------+ +-------+
    </pre>
  
  {{ foo }}
  
  </div>
</template>

<script>
import Hello from './Hello'
import Lucy from './Lucy'
import Mix from './Mix'
import Reverse from './Reverse'

// SETUP  ========

const graph =
{ op: Reverse
, next:
  [ { op: Mix
    , next:
      [ { op: Lucy
        }
      , { op: Hello
        }
      ]
    }
  ]
}

// DEPTH-FIRST TRAVERSAL
const NO_ARGS = []

const initGraph = function ( g ) {
  const init = g.op.init
  if ( g.next ) {
    g.next.forEach ( initGraph )
  }
  g.data = {}
  if ( init ) {
    // some nodes might not need initialisation
    Reflect.apply ( init, g.data, NO_ARGS )
  }
}

// UPDATE ========
// context is an immutable object
// https://facebook.github.io/immutable-js
const merge = function ( a, b ) {
  for ( const k in b ) {
    if ( b.hasOwnProperty ( k ) ) {
      a [ k ] = b [ k ]
    }
  }
}

//
// The update process is a two way operation: first calling 'update' on all
// elements in the graph (parent to child) and then calling 'render' from child
// to parent.
const processGraph = function ( g, ctx ) {
  const renderArgs = [ ctx ]
  const update = g.op.update
  const render = g.op.render

  const childCtx =
  update ? merge ( ctx, Reflect.apply ( update, g.data, ctx ) ) : ctx

  if ( g.next ) {
    g.next.forEach
    ( e => {
        renderArgs.push ( processGraph ( e, childCtx ) )
      }
    )
  }

  if ( render ) {
    console.log ( g.op.name, renderArgs )
    return Reflect.apply ( render, g.data, renderArgs )
  }
  else {
    return {}
  }
}

initGraph ( graph )

export default
{ data () {
    return { msg: 'top' }
  }
, computed:
  { foo () {
      const res =
      processGraph
      ( graph
      , { time: 0
        , control:
          [ 1.2
          , 3.0
          , 10.0
          ]
        }
      )

      return res.text || 'nothing'
    }
  }
}
</script>

<style>
#foo { padding: 8px; }
</style>

