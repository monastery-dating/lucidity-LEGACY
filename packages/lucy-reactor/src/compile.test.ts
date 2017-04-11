/* global it expect describe */
import { Project, Program } from './types'
import { compile } from './compile'

const project: Project =
{ treeMap:
  { root:
    { children: [ 'section1', 'section2' ]
    }
  , section1:
    { children: [ 'script1', 'branch1' ]
    }
  , section2:
    { children: [ 'script2', 'branch2' ]
    }
  }
, contentMap:
  { section1:
    { type: 'section'
    , source: 'Foo stuff'
    }
  , section2:
    { type: 'section'
    , source: 'Bar stuff'
    }
  , script1:
    { type: 'script'
    , source: 'when ( true ).connect ( slot`#root`, branch`@foo` )'
    }
  , branch1:
    { type: 'branch'
    , source: `@foo`
    , branch:
      { nodeMap:
        { root:
          { id: 'root'
          , blockId: 'b1'
          , childrenIds: [ 'n2' ]
          }
        , n2:
          { id: 'n2'
          , parentId: 'root'
          , blockId: 'b2'
          , childrenIds: []
          }
        }
      , blockMap:
        { b1:
          { id: 'b1'
          , name: 'root'
          , source: ``
          }
        , b2:
          { id: 'b2'
          , name: '#slotA'
          , source: ``
          }
        }
      }
    }
  , script2:
    { type: 'script'
    , source: 'when ( state`bar` ).connect ( slot`#slotA`, branch`@bar` )'
    }
  , branch2:
    { type: 'branch'
    , source: `@bar`
    , branch:
      { nodeMap:
        { root:
          { id: 'root'
          , blockId: 'b1'
          , childrenIds: [ 'n2' ]
          }
        , n2:
          { id: 'n2'
          , parentId: 'root'
          , blockId: 'b2'
          , childrenIds: []
          }
        }
      , blockMap:
        { b1:
          { id: 'b1'
          , name: 'root'
          , source: ``
          }
        , b2:
          { id: 'b2'
          , name: '#slotA'
          , source: ``
          }
        }
      }
    }
  }
}

describe ( 'compile', () => {
  it ( 'should compile Project', () => {
    const program = compile ( project )
    expect
    ( Object.keys ( program.scriptMap ).sort ()
    ).toEqual
    ( [ 'script1', 'script2'
      ]
    )

    expect
    ( Object.keys ( program.branchMap ).sort ()
    ).toEqual
    ( [ 'branch1', 'branch2'
      ]
    )
  })
})