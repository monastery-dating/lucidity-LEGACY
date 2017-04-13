import { inSelection } from './inSelection'
import { mergeElements } from './mergeElements'
import { caretSelection } from './caretSelection'
import { CompositionType, ElementType, ElementRefType, OperationsType, PathType, SelectionType
       , StringElementType, StringElementRefType } from './types'

function handleStart
( ops: OperationsType
, path: PathType
, elem: StringElementType
, selection: SelectionType
, islast: Boolean
, backkey?: 'Backspace' | 'Del'
): ElementRefType | null {
  const offset = selection.anchorOffset
  if ( islast ) {
    // Edit in same element
    let offsetA = offset
    let offsetB = selection.type === 'Range'
      ? selection.focusOffset : offset
    if ( offsetA === offsetB ) {
      if ( backkey === 'Backspace' ) {
        offsetA -= 1
        if (offsetA < 0) {
          // FIXME: should move selection before element
          offsetA = 0
        }
      } else {
        offsetB += 1
        if ( offsetB > elem.i.length ) {
          // FIXME: should move carret to next element
          offsetB = elem.i.length
        }
      }
    }
    const text = elem.i.substr ( 0, offsetA ) +
      elem.i.substr ( offsetB )

    ops.push
    ( { op: 'update'
      , path
      , value: Object.assign ( {}, elem, { i: text } )
      }
    )

    ops.push
    ( { op: 'select'
      , value: caretSelection ( path, offsetA, selection.position )
      }
    )
  } else if ( offset === 0 ) {
    ops.push ( { op: 'delete', path } )
  } else if ( offset >= elem.i.length ) {
    ops.push
    ( { op: 'select'
      , value: caretSelection ( path, offset, selection.position )
      }
    )
  } else {
    // remove part
    const text = elem.i.substr ( 0, offset )
    const value = Object.assign ( {}, elem, { i: text } )
    ops.push
    ( { op: 'update'
      , path
      , value
      }
    )

    ops.push
    ( { op: 'select'
      , value: caretSelection ( path, offset, selection.position )
      }
    )
    return { path, elem: value }
  }
  return null
}

function handleEnd
( ops: OperationsType
, path: PathType
, elem: StringElementType
, selection: SelectionType
, backkey?: 'Backspace' | 'Del'
): ElementRefType | null {

  const offset = selection.type === 'Range'
      ? selection.focusOffset : selection.anchorOffset
  if ( offset === 0 ) {
    // no op
  } else if (offset === elem.i.length) {
    // remove all
    ops.push ( { op: 'delete', path } )
  } else {
    // remove part
    const text = elem.i.substr ( offset )
    const value = Object.assign ( {}, elem, { i: text } )
    ops.push
    ( { op: 'update'
      , path
      , value
      }
    )
    return { path, elem: value }
  }
  return null
}

/** Returns the list of operations to remove selected text.
 *
*/
export function deleteSelection
( composition: CompositionType
, selection: SelectionType
, backkey?: 'Backspace' | 'Del'
) : OperationsType | undefined {
  if ( ! backkey && selection.type === 'Caret' ) {
    // no selection and no key, nothing to do here
    return undefined
  }

  const touchedElements = inSelection ( composition, selection )
  const ops: OperationsType = []
  let start, end
  touchedElements.forEach
  ( ( { path, elem }, idx ) => {
    // We know that first and last elements are StringElementType. No idea how to
    // set this in inSelection... FIXME
    if ( idx === 0 ) {
      if ( typeof elem.i !== 'string' ) {
        throw new Error ( 'Bug in inSelection, first element should be a string element.' )
      }
      // Typescript should know that elem is a StringElementType by now.
      start = handleStart
      ( ops, path, <StringElementType>elem, selection
      , idx === touchedElements.length - 1
      , backkey
      )
    } else if ( idx === touchedElements.length - 1 ) {
      if ( typeof elem.i !== 'string' ) {
        throw new Error ( 'Bug in inSelection, last element should be a string element.' )
      }
      end = handleEnd
      ( ops, path, <StringElementType>elem, selection
      , backkey
      )
    } else {
      // remove
      ops.push ( { op: 'delete', path } )
    }
  })

  if ( start && end ) {
    // Can we merge last with first ?
    mergeElements ( composition, start, end, ops )
  }

  return ops
}
