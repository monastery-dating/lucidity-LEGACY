import { NodeType, UILayoutType, UINodeSize } from '../types'
import { BlockType } from '../../Block'

/** Compute the minimum size to display the element.
 */
export const minSize =
( obj: BlockType
, link: NodeType
, layout: UILayoutType
) : UINodeSize => {
  const ds     = Math.max ( obj.input.length, link.children.length )
  const us     = obj.output ? 1 : 0

  const tb = layout.tsizer ( obj.name )

  let w : number = tb.width + 2 * layout.TPAD

  // width down (taken by inlets)
  const wd = layout.RADIUS +
    ds * ( layout.SPAD + 2 * layout.SLOT ) +
    layout.SPAD + layout.RADIUS

  // width up (taken by outlets)
  const wu = layout.RADIUS +
    us * ( layout.SPAD + 2 * layout.SLOT ) +
    layout.SPAD + layout.RADIUS

  w = Math.ceil
  ( Math.max ( w, wd, wu ) / layout.GRIDH ) * layout.GRIDH

  return { cacheName: obj.name // cache reference
         , w
         , h: layout.HEIGHT
         , tx: layout.TPAD
         , ty: layout.HEIGHT / 2 + layout.THEIGHT / 4
         , wd
         , wu
         , ds
         , us
         , wde: 0
         }
}
