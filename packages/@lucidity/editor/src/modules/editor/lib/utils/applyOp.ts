import { fuse } from './fuse'
import { getAtPath } from './getAtPath'
import { getSiblings } from './getSiblings'
import { inSelection } from './inSelection'
import { makeRef } from './makeRef'
import { splitText } from './splitText'
import
  { ChangesType
  , CompositionType
  } from './types'

const PARTS = ['before', 'inside', 'after']

/** Apply an operation on the selected list of elements.
 * Modifies the 'changes' object in place.
 */
export function applyOp
( composition: CompositionType
, changes: ChangesType
, op: string
): ChangesType {
  const newlist: any [] = []
  // If a single element does not contain op, make all op
  const { elements, selected } = changes

  const forceOp = selected.find
  ( ref => elements [ ref ].elem.t.indexOf ( op ) < 0
  ) && true || false

  selected.forEach
  ( ( ref, idx ) => {
      const { elem, path } = elements [ ref ]
      let t: string
      if ( forceOp ) {
        t = op
      } else if ( elem.t !== 'T' && elem.t !== op ) {
        t = [ elem.t, op ].sort ().join ( '+' )
      } else if ( elem.t === op ) {
        t = 'T'
      } else {
        t = op
      }
      elements [ ref ].elem = { ... elem, t }
    }
  )
  return changes
}