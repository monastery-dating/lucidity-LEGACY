/* global it expect describe */
import { mockComposition } from './utils/testUtils'
import { doSelect } from './doSelect'
import { CaretSelectionType, RangeSelectionType } from './utils/types'

const composition = mockComposition ()

describe ( 'doSelect', () => {
  it ( 'shows start of line toolbox', () => {
    const selection: CaretSelectionType = 
    { anchorPath: [ 'zaahg' ]
    , anchorOffset: 0
    , position: { top: 0, left: 0 }
    , type: 'Caret'
    }
    expect
    ( doSelect ( composition, selection ) )
    .toEqual
    ( [ { op: 'toolbox'
        , value: { type: 'Paragraph', position: {} }
        }
      ]
    )
  })

  it ( 'shows select toolbox', () => {
    const selection: RangeSelectionType =
    { anchorPath: ['mcneu', 'jnaid', 'zzvgp']
    , anchorOffset: 0
    , position: { top: 0, left: 0 }
    , focusPath: ['mcneu', 'jnaid', 'zzvgp']
    , focusOffset: 4
    , type: 'Range'
    }
    expect
    ( doSelect ( composition, selection ) )
    .toEqual
    ( [ { op: 'toolbox'
        , value: { type: 'Select' }
        }
      ]
    )
  })
})
