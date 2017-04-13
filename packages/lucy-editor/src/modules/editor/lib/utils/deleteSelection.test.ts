/* global it expect describe */
import {mockComposition} from './testUtils'
import { caretSelection } from './caretSelection'
import { rangeSelection } from './rangeSelection'
import { deleteSelection } from './deleteSelection'

const composition = mockComposition ()
const position = { top: 0, left: 0 }

describe ( 'deleteSelection', () => {
  it ( 'removes selected text in simple selection', () => {
    const selection = rangeSelection
    ( [ 'zhaog', 'oaiue' ], 1
    , [ 'zhaog', 'oaiue' ], 4
    , position
    )
    expect
    ( deleteSelection ( composition, selection )
    )
    .toEqual
    ( [ { op: 'update'
        , path: [ 'zhaog', 'oaiue' ]
        , value: { p: 1, t: 'B', i: 'mage' } 
        }
      , { op: 'select'
        , value: caretSelection
          ( [ 'zhaog', 'oaiue' ], 1, position )
        }
      ]
    )
  })

  it ( 'merge elements in wide selection without fuse', () => {
    const selection = rangeSelection
    ( [ 'mcneu', 'jnaid', 'zzvgp' ], 2
    , ['zaahg'], 20
    , position
    )
    expect
    ( deleteSelection ( composition, selection )
    )
    .toEqual
    ( [ { op: 'update'
        , path: [ 'mcneu', 'jnaid', 'zzvgp' ]
        , value: { p: 1, t: 'B+I', i: 'li' }
        }
      , { op: 'select'
        , value: caretSelection
          ( [ 'mcneu', 'jnaid', 'zzvgp' ], 2, position )
        }
      , { op: 'delete', path: [ 'mcneu', 'mznao' ] }
      , { op: 'delete', path: [ 'mcneu', 'mnahl' ] }
      , { op: 'delete', path: [ 'mcneu', 'ncgow' ] }
      , { op: 'delete', path: [ 'zhaog' ] }
      , { op: 'update', path: [ 'mcneu', 'zaahg' ]
        , value: { p: 2, t: 'T', i: 'ragraph. My tailor types fast.' }
        }
      , { op: 'delete', path: [ 'zaahg' ] }
      ]
    )
  })

  it ( 'merge elements in wide selection with fuse', () => {
    const selection = rangeSelection
    ( [ 'mcneu', 'mznao' ], 8
    , [ 'zaahg' ], 8
    , position
    )
    expect
    ( deleteSelection ( composition, selection )
    )
    .toEqual
    ( [ { op: 'select'
        , value: caretSelection
          ( [ 'mcneu', 'mznao' ], 8, position )
        }
      , { op: 'delete', path: [ 'mcneu', 'mnahl' ] }
      , { op: 'delete', path: [ 'mcneu', 'ncgow' ] }
      , { op: 'delete', path: [ 'zhaog' ] }
      , { op: 'update', path: [ 'mcneu', 'mznao' ]
        , value: { p: 2, t: 'T', i: 'to view the third paragraph. My tailor types fast.' }
        }
      , { op: 'delete', path: [ 'zaahg' ] }
      ]
    )
  })

  it ( 'merge elements in local selection accross markup with fuse', () => {
    const selection = rangeSelection
    ( [ 'zhaog', 'oiafg' ], 12
    , [ 'zhaog', 'haiou' ], 13
    , position
    )
    expect
    ( deleteSelection ( composition, selection )
    )
    .toEqual
    ( [ { op: 'update', path: [ 'zhaog' ]
        , value: { p: 1, t: 'P', i: 'This is the bomgolo frabilou elma tec.' }
        }
      , { op: 'select'
        , value: caretSelection
          ( [ 'zhaog' ], 12, position )
        }
      ]
    )
  })

  it ( 'wide selection two levels deep without fuse', () => {
    const selection = rangeSelection
    ( [ 'zhaog', 'oaiue' ], 3
    , [ 'zaahg' ], 32
    , position
    )
    expect
    ( deleteSelection ( composition, selection )
    )
    .toEqual
    ( [ { op: 'update', path: [ 'zhaog', 'oaiue' ]
        , value: { p: 1, t: 'B', i: 'mes' }
        }
        // Could be select in zhaog.zaahg (check what is expected)
      , { op: 'select'
        , value: caretSelection
          ( [ 'zhaog', 'oaiue' ], 3, position )
        }
      , { op: 'delete', path: [ 'zhaog', 'haiou'] }
      , { op: 'update', path: [ 'zhaog', 'zaahg' ]
        , value: {p: 2, t: 'T', i: 'tailor types fast.' }
        }
      , { op: 'delete', path: [ 'zaahg' ] }
      ]
    )
  })

  it ( 'wide selection three levels deep without fuse', () => {
    const selection = rangeSelection
    ( [ 'mcneu', 'jnaid', 'zzvgp' ], 2
    , [ 'zhaog', 'haiou' ], 35
    , position
    )
    expect
    ( deleteSelection ( composition, selection )
    )
    .toEqual
    ( [ { op: 'update', path: [ 'mcneu', 'jnaid', 'zzvgp' ]
        , value: { p: 1, t: 'B+I', i: 'li' }
        }
      , { op: 'select'
        , value: caretSelection
          ( [ 'mcneu', 'jnaid', 'zzvgp' ], 2, position )
        }
      , { op: 'delete', path: [ 'mcneu', 'mznao' ] }
      , { op: 'delete', path: [ 'mcneu', 'mnahl' ] }
      , { op: 'delete', path: [ 'mcneu', 'ncgow' ] }
      , { op: 'delete', path: [ 'zhaog', 'oiafg' ] }
      , { op: 'delete', path: [ 'zhaog', 'oaiue' ] }
      , { op: 'update', path: [ 'mcneu', 'haiou' ]
        , value: { p: 2, t: 'T', i: 'tec.' }
        }
      , { op: 'delete', path: [ 'zhaog' ] }
      ]
    )
  })
})
