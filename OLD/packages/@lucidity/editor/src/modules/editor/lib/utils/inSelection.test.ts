/* global it expect describe */
import {mockComposition} from './testUtils'
import { rangeSelection } from './rangeSelection'
import { inSelection } from './inSelection'

const composition = mockComposition ()
const position = { top: 0, left: 0 }

describe ( 'inSelection', () => {
  it ( 'extracts selected elements', () => {
    const selection = rangeSelection
    ( [ 'mcneu', 'jnaid', 'zzvgp' ], 2
    , [ 'zaahg' ], 20
    , position
    )
    expect
    ( inSelection
      ( composition, selection ).map ( e => e.path.join ( '.' ) )
    )
    .toEqual
    ( [ 'mcneu.jnaid.zzvgp'
      , 'mcneu.mznao'
      , 'mcneu.mnahl'
      , 'mcneu.ncgow'
      , 'zhaog'
      , 'zaahg'
      ]
    )
  })

  it ( 'extracts selected elements in local selection accross markup', () => {
    const selection = rangeSelection
    ( [ 'zhaog', 'oiafg' ], 12
    , [ 'zhaog', 'haiou' ], 13
    , position
    )
    expect
    ( inSelection
      ( composition, selection).map ( e => e.path.join ( '.' ) )
    )
    .toEqual
    ( [ 'zhaog.oiafg'
      , 'zhaog.oaiue'
      , 'zhaog.haiou'
      ]
    )
  })

  it ( 'extracts selected elements three levels deep', () => {
    const selection = rangeSelection
    ( [ 'mcneu', 'jnaid', 'zzvgp' ], 2
    , [ 'zhaog', 'haiou' ], 35
    , position
    )
    expect
    ( inSelection ( composition, selection ).map
      ( e => e.path.join ( '.' ) )
    )
    .toEqual
    ( [ 'mcneu.jnaid.zzvgp'
      , 'mcneu.mznao'
      , 'mcneu.mnahl'
      , 'mcneu.ncgow'
      , 'zhaog.oiafg'
      , 'zhaog.oaiue'
      , 'zhaog.haiou'
      ]
    )
  })

  it ( 'returns single element', () => {
    const selection = rangeSelection
    ( [ 'mcneu', 'jnaid', 'zzvgp'], 2
    , [ 'mcneu', 'jnaid', 'zzvgp'], 2
    , position
    )
    expect
    ( inSelection
      ( composition, selection ).map ( e => e.path.join ( '.' ) )
    )
    .toEqual
    ( [ 'mcneu.jnaid.zzvgp'
      ]
    )
  })
})
