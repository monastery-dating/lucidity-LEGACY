import { caretSelection } from './caretSelection'
import { makeRef } from './makeRef'
import { canFuse } from './canFuse'
import { fuse } from './fuse'
import { isGroupElement, isStringElement, CompositionType, ElementRefType, GroupElementType, OperationsType, StringElementType } from './types'

/*********************************************************************
 * FIXME: ALL THIS NEEDS TO WORK ON ChangesType, not operations !
 * This would let us simplify this thing and use 'simplify' instead
 * of rewriting the logic.
 *********************************************************************
 */

function addDepth
( a: StringElementType
): GroupElementType {
  return Object.assign
  ( <GroupElementType>{}
  , a
  , { i:
      { [ makeRef () ]:
        { t: 'T'
        , p: 0
        , i: a.i
        }
      }
    }
  )
}

// Note that target === last element in para (can be para itself)
// and that source === first element in para (can be para itself)
function moveInPara
( composition: CompositionType
, targetName: string
, source: StringElementType
, ref: string
, alastPosition: number
, ops: OperationsType
): number {
  let lastPosition = alastPosition
  const targetPath = [ targetName ]
  const target = composition.i [ targetName ]

  if ( typeof target.i === 'string' ) {
    // FIXME: Typescript should know better...
    const starget = <StringElementType> target
    // No children, make first
    ops.push
    ( { op: 'update'
      , path: targetPath
      , value: addDepth ( starget )
      }
    )
    lastPosition = 0
  }

  const t = source.t === 'P' ? 'T' : source.t
  ops.push
  ( { op: 'update'
    , path: targetPath.concat ( [ ref ] )
    , value: Object.assign ( {}, source, { p: ++lastPosition, t } )
    }
  )
  return lastPosition
}

// FIXME: clarify when Caret selection should have a
// position and when it can not have one.
const position = { top: 0, left: 0 }

function mergeFlatEnd
( composition: CompositionType
, start: ElementRefType
, end: ElementRefType
, ops: OperationsType
): void {
  const hasDelete = ops.length > 0
  if ( hasDelete ) {
    // Remove end.update
    ops.pop ()
  }
  // End is just a simple paragraph, simply fuse or move in start para.
  if ( canFuse ( start ) && canFuse ( end ) 
      && start.elem.t === 'T'
     ) {
    // start and end are string element types
    const startElem = start.elem
    const endElem = end.elem
    ops.push
    ( { op: 'update'
      , path: start.path
      , value: fuse ( startElem, endElem )
      }
    )
    if ( hasDelete ) {
      // Remove start.update
      ops.shift ()
    } else {
      ops.push
      ( { op: 'select'
        , value: caretSelection
          ( start.path, startElem.i.length, position )
        }
      )
    }
  } else if ( isStringElement ( end.elem ) ) {
    const parentRef = start.path [ 0 ]
    const ref = end.path [ end.path.length - 1 ]
    moveInPara ( composition, parentRef, end.elem, ref, start.elem.p, ops )
    if ( ! hasDelete ) {
      ops.push
      ( { op: 'select'
        , value: caretSelection
          ( [ parentRef, ref ], 0, position )
        }
      )
    }
  } else {
    throw new Error ( `NOT IMPLEMENTED YET` )
  }
  ops.push ( { op: 'delete', path: end.path } )
}

// TODO: Could we use 'simplify' here ?
function mergeSamePara
( composition: CompositionType
, start: ElementRefType
, end: ElementRefType
, ops: OperationsType
): void {
  const hasDelete = ops.length > 0
  // start and end are in same paragraph. Fuse if possible or
  // leave as is.
  if ( canFuse ( start ) && canFuse ( end ) ) {
    if ( hasDelete ) {
      // Remove start.update and end.update
      ops.shift ()
      ops.pop ()
    }

    const parent = composition.i [ start.path [ 0 ] ]
    if ( isGroupElement ( parent ) ) {
      let minPos = Infinity
      let maxPos = -1
      const parentKeys = Object.keys ( parent .i )
      parentKeys.forEach
      ( ref => {
          const p = parent.i [ ref ].p
          if ( p < minPos ) {
            minPos = p
          }
          if ( p > maxPos ) {
            maxPos = p
          }
        }
      )

      if ( start.elem.p === minPos && end.elem.p === maxPos ) {
        // change parent to single content with start+end fuse.
        const path = start.path.slice ( 0, 1 )
        if ( hasDelete ) {
          ops.length = 0
        }
        ops.push
        ( { op: 'update'
          , path
          , value: fuse ( start.elem, end.elem, parent )
          }
        )
        ops.push
        ( { op: 'select'
          , value: caretSelection
            ( path, start.elem.i.length, position )
          }
        )
      } else {
        // fuse in start
        ops.push
        ( { op: 'update'
          , path: start.path
          , value: fuse ( start.elem, end.elem )
          }
        )
        ops.push ( { op: 'delete', path: end.path } )
      }
    }
  }
}

function mergeTwoPara
( composition: CompositionType
, start: ElementRefType
, end: ElementRefType
, ops: OperationsType
): void {
  const hasDelete = ops.length > 0
  if ( hasDelete ) {
    ops.pop ()
  }
  // Move each element from end para inside start para.
  // Make sure to move updated 'end' block
  let lastPosition = start.elem.p
  const endParaPath = end.path.slice ( 0, 1 )
  const children = composition.i [ endParaPath [ 0 ] ].i
  let skip = true
  const endRef = end.path [ 1 ]
  Object.keys ( children )
  .sort ( ( a, b ) => children [ a ].p - children [ b ].p )
  .forEach
  ( ( ref, idx ) => {
      let elem = children [ ref ]
      if ( ref === endRef ) {
        if ( canFuse ( start ) && canFuse ( end ) ) {
          ops.push
          ( { op: 'update'
            , path: start.path
            , value: fuse ( start.elem, end.elem )
            }
          )
          if ( hasDelete ) {
            // Remove start update
            ops.shift ()
          } else {
            ops.push
            ( { op: 'select'
              , value: caretSelection
                ( start.path, start.elem.i.length, position )
              }
            )
          }
          skip = false
          return
        } else if ( end.path.length === 2 ) {
          elem = end.elem
        } else {
          // Need to write 'end' update inside elem (it's parent)
          elem = Object.assign
          ( {}
          , elem
          , { i: Object.assign
              ( {}
              , elem.i
              , { [ end.path [ end.path.length - 1 ] ]: end.elem
                }
              )
            }
          )
        }
        // Stop skipping
        skip = false
      } else if ( skip ) {
        // deleted, ignore
        return
      }
      lastPosition = moveInPara
      ( composition, start.path [ 0 ], elem, ref, lastPosition, ops )
    }
   )
  ops.push ( { op: 'delete', path: end.path.slice ( 0, 1 ) } )
}

export function mergeElements
( composition: CompositionType
, start: ElementRefType
, end: ElementRefType
, ops: OperationsType = []
): OperationsType | null {
  if ( end.path.length === 1 ) {
    mergeFlatEnd ( composition, start, end, ops )
  } else if ( start.path [ 0 ] === end.path [ 0 ] ) {
    mergeSamePara ( composition, start, end, ops )
  } else {
    mergeTwoPara ( composition, start, end, ops )
  }
  return ops.length === 0 ? null : ops
}
