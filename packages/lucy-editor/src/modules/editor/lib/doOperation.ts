import { applyOp } from './utils/applyOp'
import { extractSelection } from './utils/extractSelection'
import { rangeSelection } from './utils/rangeSelection'
import { simplify } from './utils/simplify'
import { changeParagraph } from './utils/changeParagraph'
import { CompositionType
       , ChangesType
       , ElementRefType
       , OperationType
       , SelectionType
       , StringElementRefType
       , StringElementType
       } from './utils/types'

function makeOps
( changes: ChangesType
, selection: SelectionType
): OperationType [] {
  const ops: OperationType [] = []

  updated.forEach
  ( ( { path, elem } ) => {
      ops.push
      ( { op: 'update'
        , path
        , value: elem
        }
      )
    }
  )

  if ( selected ) {
    const first = selected [ 0 ]
    const last = selected [ selected.length - 1 ]
    ops.push
    ( { op: 'select'
      , value: rangeSelection
        ( first.path, 0, last.path
        , last.elem.i.length
        , selection.position
        )
      }
    )
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
