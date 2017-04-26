import 
  { ChangesType, CompositionType
  , ElementType, ElementsType
  , ElementNamedType
  , ElementRefType
  , GroupElementType
  , isStringElement
  , StringElementType
  } from './types'
import { joinText } from './joinText'
import { isTextBlock } from './isTextBlock'
import { getAtPath } from './getAtPath'

interface ElementRefTypeById {
  [ key: string ]: ElementRefType
}

function simplifyParent
( composition: CompositionType
, updatedById: ElementRefTypeById
, updated: ElementRefType []
, parent: ElementRefType
): void {
  const { path, elem } = parent
  if ( isStringElement ( elem ) ) {
    return
  }

  // TODO: update selected if fusing...

  let last: ElementNamedType | undefined
  let allFused: boolean = true
  const children = parent.elem.i
  Object.keys
  ( parent.elem.i )
  .map
  ( ref => {
      const refElem = updatedById [ ref ]
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
        if ( ! updatedById [ last.ref ] ) {
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
          updatedById [ last.ref ] = pathElem
          updated.push ( pathElem )
        }
        // fuse
        lastElem.i = joinText ( lastElem.i, elem.i )
        // remove elem from updated list
        let idx = updated.findIndex
        ( pathElem => pathElem.elem === elem )
        if ( idx >= 0 ) {
          updated.splice ( idx, 1 )
        }
      } else {
        allFused = false
        last = refElem
      }
    }
  )

  if ( last && allFused ) {
    const lastElem = last.elem
    // remove elem from updated list
    let idx = updated.findIndex
    ( pathElem => pathElem.elem === lastElem )
    if ( idx >= 0 ) {
      updated.splice ( idx, 1 )
    }
    // change parent
    const elem = Object.assign
    ( {}, parent.elem, { t: lastElem.t, i: lastElem.i } )
    updated.push ( { elem, path } )
  }
}

export function simplify
( composition: CompositionType
, changes: ChangesType
): ChangesType {
  const result: ElementsType = {}
  const { updated } = changes
  const parents: ElementRefTypeById = {}
  const updatedById: ElementRefTypeById = {}
  updated.forEach
  ( refElem => {
      const { elem, path } = refElem
      updatedById [ path [ path.length - 1 ] ] = refElem
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
      , updatedById
      , updated
      , parents [ parentId ]
      )
    }
  )

  return changes
}