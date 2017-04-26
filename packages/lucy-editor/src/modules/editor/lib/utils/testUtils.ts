import { ChangesType, CompositionType } from './types'

const MOCK1 = JSON.stringify
( { i: 
    // Block = PARAGRAPH / MEDIA LEVEL
    { mcneu:
      // position
      { p: 0
      // type <p>
      , t: 'P'
      // children or string
      , i:
        { uasuf:
          { p: 0
          // <span>
          , t: 'T'
          , i: 'You can click '
          }
          // Link
        , jnaid:
          { p: 1
          // <a>
          , t: 'A'
          , href: 'http://example.com'
          , i:
            { mnzjq:
              { p: 0
              , t: 'T'
              , i: 'this '
              }
            , zzvgp:
              { p: 1
              // <span class='s e'>
              , t: 'B+I'
              , i: 'link '
              }
            }
          }
        , mznao:
          { p: 2
          // <span>
          , t: 'T'
          , i: 'to view the next '
          }
        , mnahl:
          { p: 3
          , t: 'I'
          , i: 'page'
          }
        , ncgow:
          { p: 4
          , t: 'T'
          , i: '.'
          }
        }
      }
    , zhaog:
      { p: 1
      , t: 'P'
      , i:
        // Markup = bold, italic, etc
        { oiafg:
          { p: 0
          , t: 'T'
          , i: 'This is the first '
          }
        , oaiue:
          { p: 1
          , t: 'B'
          , i: 'message'
          }
        , haiou:
          { p: 2
          , t: 'T'
          , i: '. Hello blah bomgolo frabilou elma tec.'
          }
        }
      }
    , zaahg:
      { p: 2
      , t: 'P'
      , i: 'This is the third paragraph. My tailor types fast.'
      }
    }
  }
)

export function mockComposition
(): CompositionType {
  return JSON.parse ( MOCK1 )
}

let mod
declare var require: any

export function mockRef
(): void {
  if ( ! mod ) {
    mod = require ( './makeRef' )
  }
  let counter = 0
  mod.makeRef = () => `refe${ ++counter }`
}

interface ChangeResults {
  selected: string []
  updated: string []
  deleted: string []
}

export function changesResults
( changes: ChangesType
): ChangeResults {
  const { elements, selected, deleted, updated } = changes
  return (
    { selected: selected.map
      ( ref => {
          const refElem = elements [ ref ]
          return refElem.path.join ( '.' ) + '-' + refElem.elem.t
        }
      )
    , updated: updated.map
      ( ref => {
          const refElem = elements [ ref ]
          return refElem.path.join ( '.' ) + '-' + refElem.elem.t
        }
      )
    , deleted: ( deleted || [] ).map
      ( path => path.join ( '.' )
      )
    }
  )
}
