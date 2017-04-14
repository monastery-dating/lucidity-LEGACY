import { fuse } from './fuse'
import { getAtPath } from './getAtPath'
import { getSiblings } from './getSiblings'
import { inSelection } from './inSelection'
import { makeRef } from './makeRef'
import { simplifyChildren } from './resetPosition'
import { splitText } from './splitText'
import { ElementRefType
       , ElementNamedType
       , isStringElement
       , StringElementRefType
       , DoOperationType } from './types'

const PARTS = ['before', 'inside', 'after']

export function applyOp
( list: ElementNamedType []
, type: string
) {
  const newlist: any [] = []
  // If a single element does not contain op, make all op
  const forceOp = list.find
  ( ( { elem } ) => elem.t.indexOf ( type ) < 0 ) && true || false

  list.forEach
  ( ( { elem, ref }, idx ) => {
      let t
      if ( forceOp ) {
        t = type
      } else if ( elem.t !== 'T' && elem.t !== type ) {
        t = [ elem.t, type ].sort ().join ( '+' )
      } else if ( elem.t === type ) {
        t = 'T'
      } else {
        t = type
      }
      const nextobj = list [ idx + 1 ]
      if ( isStringElement ( elem ) && nextobj && isStringElement ( nextobj.elem ) ) {
        if ( elem.t === t && nextobj.elem.t === 'T' ) {
          // Fuse nextobj with elem
          list [ idx + 1 ] =
          { ref
            // Fuse elem + next
          , elem: fuse ( elem, nextobj.elem )
          }
          return
        } else if ( elem.t === 'T' && nextobj.elem.t === t ) {
          list [ idx + 1 ] =
          { ref: nextobj.ref
            // Fuse elem + next as next
          , elem: fuse ( elem, nextobj.elem, nextobj.elem )
          }
          return
        }
      }
      newlist.push
      ( { ref
        , elem: Object.assign ( {}, elem, { t } )
        }
      )
    }
  )
  return newlist
}

interface SplitResultType {
  before?: any
  inside?: any
  after?: any
}

function splitElement
( elem
, aref
, startOffset
, endOffset
, startP
, afterP = 0
): SplitResultType {
  const splitParts = splitText
  ( elem.i, startOffset || 0, endOffset || elem.i.length )
  const result: SplitResultType = {}

  let position = startP
  const increment = afterP !== 0 ? ( afterP - startP ) / 4 : 1
  let usedRef = false

  PARTS.forEach
  ( key => {
      const text = splitParts [ key ]
      if ( text.length > 0 ) {
        let ref = aref
        if ( aref && key !== 'inside' && ! usedRef ) {
          ref = aref
          // Only use ref once
          usedRef = true
        } else {
          ref = makeRef ()
        }
        result [ key ] =
        [ { ref
          , elem: { p: position, t: 'T', i: text }
          }
        ]
        position += increment
      }
    }
  )
  return result
}

interface ExtractedType {
  updated: ElementRefType []
  selected: StringElementRefType []
}

/** FIXME: This function is a complete mess. Needs better
 * handling of each case, maybe in different functions.
 */
function processSingleParent
( composition
, { anchorOffset, focusOffset }
, touched
, op?: string
): ExtractedType {
  let changedPath
  let changedElem
  let parts
  let children = {}
  const { path, elem } = touched [ 0 ]
  if ( touched.length === 1
       && anchorOffset === 0 
       && focusOffset === elem.i.length ) {
    // full selection of a single element

    changedPath = path.slice ( 0, -1 )
    changedElem = getAtPath ( composition, changedPath )

    const ref = path [ path.length - 1 ]
    parts =
    { inside: [ { ref, elem } ] 
    , other:
      Object.keys ( changedElem.i )
      .filter ( key => key !== ref )
      .map ( ref => ( { ref, elem: changedElem.i [ ref ] } ) )
    }
  } else if ( touched.length === 1 && path.length === 1 ) {
    // Raw paragraph
    changedPath = path
    changedElem = elem
    parts = splitElement ( elem, null, anchorOffset, focusOffset, 0 )
  } else {
    // Parent is changed
    changedPath = path.slice ( 0, -1 )
    const parent = getAtPath ( composition, changedPath )
    children = Object.assign ( {}, parent.i )
    changedElem = parent
    if ( touched.length === 1 ) {
      const [ _, nextSibling ] = getSiblings ( composition, path )
      const afterP = nextSibling ? nextSibling.elem.p : 0
      const ref = path [ path.length - 1 ]
      parts = splitElement ( elem, ref, anchorOffset, focusOffset, elem.p, afterP )
    } else {
      // Multiple elements
      parts = {}
      touched.forEach
      ( ( { elem, path }, idx ) => {
          const ref = path [ path.length - 1 ]
          if (idx === 0) {
            // handle first
            const afterElem = touched [ 1 ].elem
            const startParts = splitElement
            ( elem, ref, anchorOffset, null, elem.p, afterElem.p )

            parts.before = startParts.before
            parts.inside = startParts.inside
          } else if (idx === touched.length - 1) {
            // handle last
            const [ _, nextSibling ] = getSiblings ( composition, path )
            const afterP = nextSibling ? nextSibling.elem.p : 0
            const endParts = splitElement
            ( elem, ref, null, focusOffset, elem.p, afterP )
            parts.after = endParts.after
            parts.inside = parts.inside.concat ( endParts.inside )
          } else {
            parts.inside.push({
              ref,
              elem
            })
          }
        }
      )
    }
  }

  if ( op ) {
    parts.inside = applyOp ( parts.inside, op )
  }

  Object.keys ( parts )
  .forEach
  ( key => {
      parts [ key ]
      .forEach
      ( ( { elem, ref } ) => {
          children [ ref ] = elem
        }
      )
    }
  )

  // TODO: return selection from fused ranges...
  children = simplifyChildren ( children )

  const keys = Object.keys ( children )

  // TODO: we could optimize rendering: filter unchanged elements
  // by comparing them with original children.

  if ( keys.length === 1 ) {
    // Single element: change parent
    const elem = children [ keys [ 0 ] ]
    // FIXME: should return t of 'T' or 'P' what about 'B' ?
    const updated =
    [ { path: changedPath
      , elem: Object.assign
        ( {}, changedElem, { i: elem.i, t: elem.t } )
      }
    ]

    const changes: any = { updated }

    return changes
  } else {
    const updated = keys
    .map
    ( ref => 
      ( { path: changedPath.concat ( [ ref ] )
        , elem: children [ ref ]
        }
      )
    )

    if ( typeof changedElem.i === 'string' ) {
      updated.unshift
      ( { path: changedPath
        , elem: Object.assign
          ( {}, changedElem, { i: {} } )
        }
      )
    }

    const changes: any = { updated }

    const inside = parts.inside
    if ( inside ) {
      changes.selected = inside.map
      ( ( { ref } ) => (
          { path: changedPath.concat ( [ ref ] )
          , elem: children [ ref ]
          }
        )
      )
    }
    return changes
  }
}

function hasSameParent
( list
) {
  const parentPath = list [ 0 ].path.slice ( 0, -1 ).join ( '.' )
  for ( const l of list ) {
    if ( l === list [ 0 ] ) {
      continue
    }
    if ( l.path.slice ( 0, -1 ).join ( '.' ) !== parentPath ) {
      return false
    }
  }
  return true
}

/** Given a composition and a selection, returns the
 * extracted elements in the selection in 'selected'.
 * In 'updated', returns changed elements.
 * Operations must first alter 'selected' in place and then
 * process 'updated'.
 */
export function extractSelection
( composition
, selection
, op?: string
): ExtractedType {
  const touched = inSelection ( composition, selection )
  if ( touched.length === 1 || hasSameParent ( touched ) ) {
    return processSingleParent ( composition, selection, touched, op )
  } else {
    // Start and end have different parent.
    throw new Error ( `Not implemented yet` )
  }
}
