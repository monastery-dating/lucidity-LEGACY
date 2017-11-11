import { NodeType, UILayoutType, UINodeSize } from '../types'
import { BlockDefinition } from 'blocks/playback'

/** Compute the minimum size to display the element.
 */
export const minSize =
( block: BlockDefinition
, layout: UILayoutType
) : UINodeSize => {
  const { meta } = block
  if ( !meta ) {
    throw new Error ( 'No block.meta (??)' )
  }
  const needExtraSlot = !meta.children
  let hasExtra = false
  let ds
  if ( block.closed ) {
    // done
    ds = 0
  }
  else if ( meta.children ) {
   // exact children length (and cope for extra detached)
   ds = Math.max
   ( meta.children.length, block.children.length )
  }
  else {
    // Always keep a free slot for untyped children
    ds = block.children.length + 1
    hasExtra = true
  }
  const us = 1 // alwasy show up slot.
  // has update = block.meta.isvoid || block.meta.update ? 1 : 0

  const tb = layout.tsizer ( block.name )

  let w : number = 6 * layout.ARROW
                   + tb.width
                   + layout.TPAD

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

  return { cacheName: block.name // cache reference
         , w
         , h: layout.HEIGHT
         , tx: 6 * layout.ARROW
         , ty: layout.HEIGHT / 2 + layout.THEIGHT / 4
         , wd
         , wu
         , ds
         , hasExtra
         , us
         , wde: 0
         }
}
