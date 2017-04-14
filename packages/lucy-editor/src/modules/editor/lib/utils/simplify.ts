import { ChangesType, ElementType, ElementsType, GroupElementType } from './types'
import { joinText } from './joinText'
import { isTextBlock } from './isTextBlock'

export function simplify
( composition: any
, changes: ChangesType
): ChangesType {
  const result: ElementsType = {}
  let p = 0
  let last: ElementType | undefined
  Object.keys
  ( children )
  .sort
  ( (a, b) => children [ a ].p - children [ b ].p )
  .forEach
  ( ref => {
      const elem = children [ ref ]
      if ( !last ) {
        last = Object.assign ( {}, children [ ref ], { p } )
        result [ ref ] = last
      } else if ( last.t === elem.t
                && isTextBlock ( last )
                && isTextBlock ( elem ) ) {
        // fuse
        last.i = joinText ( last.i, elem.i )
      } else {
        p += 1
        last = Object.assign ( {}, elem, { p } )
        result [ ref ] = last
      }
    }
  )

  return result
}