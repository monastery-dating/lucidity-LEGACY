import getPath from './getPath'
import { SelectionType } from '../../../modules/editor/lib/utils/types'

declare var global: any

export default function getSelection
() : SelectionType {
  const selection = global.getSelection ()
  const { anchorNode, anchorOffset, focusNode, focusOffset, type } = selection
  const anchorPath = getPath(anchorNode)
  const focusPath = focusNode === anchorNode ? anchorPath : getPath ( focusNode )
  const anchorValue = anchorNode.textContent
  const focusValue = focusNode.textContent
  const rects = selection.getRangeAt ( 0 ).getClientRects ()

  let last = rects [ rects.length - 1 ]
  if ( type === 'Caret' ) {
    return (
      { anchorPath
      , anchorOffset
      , type
      , anchorValue
      , position:
        { top: last.top
        , left: last.left + last.width
        }
      }
    )
  }

  let first = rects [ 0 ]
  if ( ! first ) {
    // no selection
    throw new Error ( `Cannot get selection.` )
  }

  let end
  if ( first.top > last.top ||
      ( first.top === last.top &&
        ( first.left > last.left )
      )
     ) {
    end =
    { top: first.top
    , left: first.left + first.width
    }
  } else {
    end =
    { top: last.top
    , left: last.left + last.width
    }
  }

  const atop = anchorNode.parentElement.getBoundingClientRect ().top
  const ftop = focusNode.parentElement.getBoundingClientRect ().top
  if ( atop > ftop || ( anchorNode === focusNode && anchorOffset > focusOffset ) ) {
    // reverse
    return (
      { type
      , anchorOffset: focusOffset
      , focusOffset: anchorOffset
      , anchorPath: focusPath
      , focusPath: anchorPath
      , anchorValue: focusValue
      , position: end
      }
    )
  } else {
    return (
      { type
      , anchorOffset, focusOffset, anchorPath, focusPath
      , anchorValue
      , position: end
      }
    )
  }
}
