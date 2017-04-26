import { applyOp } from './utils/applyOp'
import { extractSelection } from './utils/extractSelection'
import { rangeSelection } from './utils/rangeSelection'
import { simplify } from './utils/simplify'
import { changeParagraph } from './utils/changeParagraph'
import { CompositionType
       , ChangesType
       , ElementRefType
       , isStringElement
       , OperationType
       , SelectionType
       , StringElementRefType
       , StringElementType
       } from './utils/types'

function makeOps
( changes: ChangesType
, initialSelection: SelectionType
): OperationType [] {
  const ops: OperationType [] = []
  const { updated, selected, selection, elements, deleted } = changes

  if ( deleted ) {
    deleted.forEach
    ( path => {
        ops.push
        ( { op: 'delete'
          , path
          }
        )
      }
    )
  }

  updated.forEach
  ( ref => {
      const { path, elem } = elements [ ref ]
      ops.push
      ( { op: 'update'
        , path
        , value: elem
        }
      )
    }
  )

  if ( selection ) {
    ops.push
    ( { op: 'select'
      , value: { ...selection, position: initialSelection.position }
      }
    )
  } else if ( selected ) {
    const firstRef = selected [ 0 ]
    const firstRefElem = elements [ firstRef ]
    const lastRef = selected [ selected.length - 1 ]
    const lastRefElem = elements [ lastRef ]
    const lastElem = lastRefElem.elem

    if ( isStringElement ( lastElem ) ) {
      ops.push
      ( { op: 'select'
        , value: rangeSelection
          ( firstRefElem.path, 0, lastRefElem.path
          , lastElem.i.length
          , initialSelection.position
          )
        }
      )
    } else {
      throw new Error ( `Error in makeOps, element is not a string element.` )
    }

  }
  return ops
}

const SIMPLE_OP = {
  B: true,
  I: true
}

export function doOperation
( composition: CompositionType
, selection: SelectionType
, op: string
, opts?: any
): OperationType [] | undefined {
  if ( op === 'P' ) {
    return changeParagraph ( composition, selection, opts )
  } else if ( SIMPLE_OP [ op ] ) {
    return makeOps
    ( simplify
      ( composition
      , applyOp
        ( composition
        , extractSelection ( composition, selection )
        , op
        )
      )
    , selection
    )
  }
  return undefined
}
