import 
  { ChangesType, CompositionType
  , ElementType, ElementsType
  , ElementNamedType
  , ElementRefType
  , ElementRefTypeById
  , GroupElementType
  , isStringElement
  , isRangeSelection
  , StringElementType
  } from './types'
import { joinText } from './joinText'
import { isTextBlock } from './isTextBlock'
import { getAtPath } from './getAtPath'
import { rangeSelection } from './rangeSelection'

function simplifyParent
( composition: CompositionType
, changes: ChangesType
, parent: ElementRefType
): void {
  const { elements, updated, selected } = changes
  let deleted: string [] []
  const { path, elem } = parent
  if ( isStringElement ( elem ) ) {
    return
  }

  let last: ElementNamedType | undefined
  let allFused: boolean = true
  const children = parent.elem.i
  Object.keys
  ( parent.elem.i )
  .map
  ( ref => {
      const refElem = elements [ ref ]
      return refElem
        ? { ref, elem: refElem.elem }
        : { ref, elem: parent.elem.i [ ref ] }
    }
  )
  .sort
  ( (a, b) => {
      return a.elem.p - b.elem.p 
    }
  )
  .forEach
  ( refElem => {
      const { ref, elem } = refElem
      if ( ! last ) {
        last = refElem
      } else if ( last.elem.t === elem.t
                && isTextBlock ( last.elem )
                && isTextBlock ( elem ) ) {
        let lastElem: StringElementType = last.elem
        // make sure last is in updated
        if ( ! elements [ last.ref ] ) {
          // make a copy
          lastElem = Object.assign ( {}, last.elem )
          last =
          { elem: lastElem
          , ref: last.ref
          }
          const pathElem =
          { elem: lastElem
          , path: [ ...path, last.ref ]
          }
          elements [ last.ref ] = pathElem
          updated.push ( last.ref )
        }
        // fuse
        if ( selected.indexOf ( ref ) >= 0 ) {
          // When we fuse, there can only be one element in selected
          // so this works.
          const anchorOffset = lastElem.i.length
          const focusOffset = anchorOffset + elem.i.length
          const selectionPath = [ ...path, last.ref ]
          changes.selection = rangeSelection
          ( selectionPath, anchorOffset
          , selectionPath, focusOffset
          , { top: 0, left: 0 }
          )
        }

        lastElem.i = joinText ( lastElem.i, elem.i )

        // remove elem from updated list
        let idx = updated.indexOf ( ref )
        if ( idx >= 0 ) {
          updated.splice ( idx, 1 )
        }
        if ( ! deleted ) {
          changes.deleted = deleted = []
        }
        deleted.push ( [ ... path, ref ] )
      } else {
        allFused = false
        last = refElem
      }
    }
  )

  if ( last && allFused ) {
    const lastElem = last.elem
    // remove elem from updated list
    let idx = updated.indexOf ( last.ref )
    if ( idx >= 0 ) {
      updated.splice ( idx, 1 )
    }
    // change parent
    const parentRef = path [ path.length - 1 ]
    const t = lastElem.t === 'T'
      ? parent.elem.t
      : `${ parent.elem.t }+${ lastElem.t }`
    const elem = Object.assign
    ( {}, parent.elem, { t, i: lastElem.i } )

    elements [ parentRef ] = { elem, path }
    updated.push ( parentRef )
    const { selection } = changes
    if ( selection ) {
      // We should update path
      if ( isRangeSelection ( selection ) ) {
        selection.anchorPath = path
        selection.focusPath = path
      }
    }
  }
}

export function simplify
( composition: CompositionType
, changes: ChangesType
): ChangesType {
  const result: ElementsType = {}
  const { updated, elements } = changes
  const parents: ElementRefTypeById = {}
  updated.forEach
  ( ref => {
      const { elem, path } = elements [ ref ]
      const parentPath = path.slice ( 0, -1 )
      const parentId = parentPath [ parentPath.length - 1 ]
      if ( parentId ) {
        if ( ! parents [ parentId ] ) {
          const parent = getAtPath ( composition, parentPath )
          parents [ parentId ] = { elem: parent, path: parentPath }
        }
      }
    }
  )

  Object.keys ( parents )
  .forEach 
  ( parentId => {
      simplifyParent
      ( composition
      , changes
      , parents [ parentId ]
      )
    }
  )

  return changes
}