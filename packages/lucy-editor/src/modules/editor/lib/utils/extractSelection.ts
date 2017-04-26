import { fuse } from './fuse'
import { getAtPath } from './getAtPath'
import { getSiblings } from './getSiblings'
import { inSelection } from './inSelection'
import { makeRef } from './makeRef'
import { splitText } from './splitText'
import
  { ChangesType
  , CompositionType
  , ElementRefType
  , ElementNamedType
  , ElementRefTypeById
  , isStringElement
  , StringElementRefType
  , DoOperationType
  } from './types'

const PARTS = ['before', 'inside', 'after']

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

const PART_NAMES =
[ 'before', 'inside', 'after' ]

/** FIXME: This function is a complete mess. Needs better
 * handling of each case, maybe in different functions.
 */
function processSingleParent
( composition: CompositionType
, { anchorOffset, focusOffset }
, touched: ElementRefType []
): ChangesType {
  let changedPath
  let changedElem
  let parts
  let children = {}
  const { path, elem } = touched [ 0 ]
  if ( isStringElement ( elem )
       && touched.length === 1
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

  const updated: string [] = []
  const selected: string [] = []
  const elements: ElementRefTypeById = {}

  PART_NAMES
  .forEach
  ( key => {
      const list = parts [ key ]
      if ( ! list ) {
        return
      }
      list
      .forEach
      ( ( { elem, ref } ) => {
          elements [ ref ] =
          { path: changedPath.concat ( [ ref ] )
          , elem
          }
          updated.push ( ref )
          if ( key === 'inside' ) {
            selected.push ( ref )
          }
        }
      )
    }
  )

  if ( typeof changedElem.i === 'string' ) {
    const ref = changedPath [ changedPath.length - 1 ]
    elements [ ref ] =
    { path: changedPath
    , elem: Object.assign
      ( {}, changedElem, { i: {} } )
    }
    updated.unshift ( ref ) 
  }

  return { elements, updated, selected }
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
): ChangesType {
  const touched = inSelection ( composition, selection )
  if ( touched.length === 1 || hasSameParent ( touched ) ) {
    return processSingleParent ( composition, selection, touched )
  } else {
    // Start and end have different parent.
    throw new Error ( `Not implemented yet` )
  }
}
