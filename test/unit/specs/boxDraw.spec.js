import
{ DEFAULT_LAYOUT
, boxLayout
} from 'src/lib/boxDraw.js'

import Graph from './mock.graph.js'

describe
( 'boxDraw.boxLayout', () => {
    // initial state
    const bdefs = {}
    boxLayout ( Graph.graph, 'g0', DEFAULT_LAYOUT, bdefs, null )

    it
    ( 'should compute all', () => {
        expect
        ( bdefs.all )
        .toBe
        ( [ 'x' ] )
      }
    )
  }
)
