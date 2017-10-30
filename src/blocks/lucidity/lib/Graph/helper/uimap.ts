import { defaultUILayout } from './uilayout'
import { BlockType, BlockByIdType } from '../../../lib/Block'
import { GraphType
       , NodeType
       , NodeByIdType
       , UINodeType, UINodeByIdType
       , UIGraphType
       , UIArrowType
       , UILayoutType
       , UIPosType
       , UISlotType
       , nextNodeId
       , rootNodeId } from '../../../lib/Graph/types'

import { minSize } from './minSize'
import * as stringhash from 'string-hash'

/** Compute svg path of a box with up and down slots.
 * The sizes have to be computed first in the 'info' field.
 */
const path =
( boxdef : UINodeType
, layout : UILayoutType
) => {
  const { size, sextra }  = boxdef
  const { us, ds, w, wd, wde, wu, h } = size
  const r    = layout.RADIUS

  // path starts at top-left corner + RADIUS in x direction.
  // top-left is (0,0) because we translate with a <g> tag.
  const res = [ `M${r} 0` ]

  for ( let i = 0; i < us; i += 1 ) {
    res.push ( `h${layout.SPAD}` )
    res.push ( `l${layout.SLOT} ${-layout.SLOT}` )
    res.push ( `l${layout.SLOT} ${ layout.SLOT}` )
  }

  // SPAD   /\  SPAD  /\
  // +-----+  +------+  +-----------+
  // |--------- wu ----------|
  // |--------- w  -----------------|
  const rpadu = w - wu
  if ( rpadu > 0 ) {
    res.push ( `h${ rpadu + layout.SPAD }` )
  }
  else {
    res.push ( `h${ layout.SPAD }` )
  }

  res.push ( `a${r} ${r} 0 0 1 ${ r} ${ r}` )

  res.push ( `v${ h - 2 * r }`      )

  res.push ( `a${r} ${r} 0 0 1 ${-r} ${ r}` )

  const rpadd = w - wd - wde + ( sextra [ ds ] || 0 )
  if ( rpadd > 0 ) {
    res.push ( `h${ -rpadd - layout.SPAD }` )
  }
  else {
    // ??
    // console.log ( 'ERROR', w )
    res.push ( `h${ -layout.SPAD }` )
  }

  for ( let i = ds - 1; i >= 0; i -= 1 ) {
    res.push ( `l${ -layout.SLOT } ${ -layout.SLOT }` )
    res.push ( `l${ -layout.SLOT } ${  layout.SLOT }` )
    res.push ( `h${ -layout.SPAD - ( sextra [ i ] || 0 ) }` )
  }

  res.push ( `a${r} ${r} 0 0 1 ${-r} ${-r}` )

  res.push ( `v${ -h + 2 * r }`    )
  res.push ( `a${r} ${r} 0 0 1 ${ r} ${-r}` )

  return res.join ( ' ' )
}

const className =
( objName: string
, layout : UILayoutType
) => {
  const name = objName.split ( '.' ) [ 0 ]
  let num = 9 + stringhash ( name )
  return `box${1 + num % layout.PCOUNT}`
}

/** Compute box position.
 */
const boxPosition =
( graph: GraphType
, nodeId: string
, flags: NodeByIdType | undefined
, layout: UILayoutType
, uigraph: UIGraphType
, ctx: UIPosType
): number => {
  const node = graph.nodesById [ nodeId ]
  const block  = graph.blocksById [ node.blockId ]

  // store our position given by ctx
  uigraph.uiNodeById [ nodeId ].pos = ctx
  const dy = layout.HEIGHT + layout.VPAD

  let x  = ctx.x

  const uinode = uigraph.uiNodeById [ nodeId ]
  const ds = uinode.size.ds

  const sextra = uinode.sextra

  // get children
  let cheight = 0
  if ( node.closed ) {
    // do nothing
  }
  else {
    for ( let i = 0; i < ds; ++i ) {
      const childId = node.children [ i ]
      const wtonext = sextra [ i ] + layout.SPAD + 2 * layout.SLOT

      if ( childId ) {
        const h = boxPosition
        ( graph, childId, flags, layout, uigraph
        , { x, y: ctx.y + dy }
        )
        cheight = Math.max ( cheight, h )
        x += layout.BPAD + uigraph.uiNodeById [ childId ].size.w
      }
      else if ( childId === null ) {
        // empty slot, add slot padding
        x += layout.SPAD + 2 * layout.SLOT
      }
    }
  }

  return dy + cheight
}


const uimapOne =
( graph: GraphType
, nodeId: string
, flags: NodeByIdType | undefined
, layout: UILayoutType
, uigraph: UIGraphType
, slotIdx: number
) => {
  uigraph.uiNodeById [ nodeId ] = <UINodeType> { id: nodeId, slotIdx }

  const uibox = uigraph.uiNodeById [ nodeId ]

  const node = graph.nodesById [ nodeId ]
  const block  = graph.blocksById [ node.blockId ]

  uibox.name = block.name

  if ( block.name === 'main' ) {
    uibox.className = 'main'
  }

  else {
    uibox.className = className ( block.name, layout )
  }

  const size = minSize ( block, node, layout )

  size.wde = 0

  const { meta } = block
  if ( !meta ) { 
    throw new Error ( 'No block.meta (??)' )
  }

  const childrenTypes = meta.children
  const slots : UISlotType[] = []
  const sl = layout.SLOT

  const sextra = [ 0 ] // extra spacing before slots
                       // first has 0 extra spacing
                       // second has spacing dependent on first child, etc
  const ds = size.ds

  const flagnode = flags ? flags [ nodeId ] : node

  if ( ds > 0 ) {
    let   x = layout.RADIUS + layout.SPAD
    const y = layout.HEIGHT


    const sline = layout.sline
    const spath = layout.spath
    const plus = layout.plus
    const click = layout.click

    const slotpad = layout.SPAD + 2 * layout.SLOT

    const serr = flagnode.serr
    for ( let i = 0; i < ds; i += 1 ) {
      const childId = node.children [ i ]
      const pos = { x: x + sl, y }
      const free = !childId
      const incompatible = serr && serr [ i ] ? true : false

      // TODO: could we use slot error 'serr' here ?
      if ( childrenTypes && !childrenTypes [ i ] ) {
        // extra links outside of inputs...
        slots.push
        ( { path: sline
          , idx: i
          , pos
          , plus
          , click
          , flags: { detached: true }
          }
        )
      }
      else if ( incompatible ) {
        slots.push
        ( { path: sline
          , idx: i
          , pos
          , plus
          , click
          , flags: { free, incompatible }
          }
        )
      }
      else {
        slots.push
        ( { path: spath
          , idx: i
          , pos
          , plus
          , click
          , flags: { free }
          }
        )
      }


      if ( node.closed ) {
        // should not draw slot
      }
      else {
        if ( childId ) {
          const nodes = uigraph.nodes

          // We push in sextra the delta for slot i
          let w = uimapOne
          ( graph, childId, flags, layout, uigraph, i )
          // w contains slotpad

          if ( size.hasExtra && i === ds - 2 ) {

            if ( x + w + slotpad < size.w ) {
              // Do not change w: we have enough space
              // OK
            }
            else if ( size.w > w && x + 2 * slotpad < size.w ) {
              w = size.w - 2 * slotpad
            }
            else {
              // computing space for last element
              // 1. No need for padding before.
              // 2. Move back on element below.
              w += - 2 * slotpad
            }
          }
          else if ( i === ds - 1 ) {
            // No extra space for after last element
            w += - slotpad
          }

          w = Math.max ( slotpad, w )
          sextra.push ( w - slotpad )
          x += w
        }
        else {
          // empty slot
          sextra.push ( 0 )
          x += slotpad
        }
      }
    }

    // Compute extra size for this box depending on i-1 children ( last child
    // does not change slot position )
    if ( sextra.length > 0 ) {
      size.wde = sextra.reduce ( ( sum, e ) => sum + e )
    }

    size.w = Math.max ( size.w, size.wd + size.wde )

  }

  uibox.invalid = flagnode.invalid
  uibox.sextra = sextra

  uibox.size = size

  uibox.path  = path ( uibox, layout )
  uibox.arrow = node.closed ? layout.ARROW_CLOSED : layout.ARROW_OPEN
  uibox.slots = slots

  // draw nodes from child to parent
  uigraph.nodes.push ( nodeId )
  return uibox.size.w
}

/** Compute the layout of a graph.
 */
export const uimap =
( graph: GraphType
// validity flags (drop preview)
, flags?: NodeByIdType
, alayout?: UILayoutType
) : UIGraphType => {
  const layout = alayout || defaultUILayout

  const startpos =
  { x: 0.5
  , y: 0.5 + layout.SLOT + layout.RADIUS
  }

  const uigraph : UIGraphType =
  { nodes: []
  , grabpos:
    { x: startpos.x + layout.RADIUS + layout.SPAD + layout.SLOT
    , y: startpos.y + layout.HEIGHT / 2 - 6 // 6 = pointer size
    }
  , uiNodeById: {}
  , size: { width: 0, height: 0 }
  }

  uimapOne
  ( graph, rootNodeId, flags, layout, uigraph, 0 )

  const height = boxPosition
  ( graph, rootNodeId, flags, layout, uigraph, startpos ) +
  layout.SCLICKH +
  layout.SLOT + 1
  const width = uigraph.uiNodeById [ rootNodeId ].size.w + 1
  uigraph.size = { width, height: height + 20 } // 20 = droptarget FIXME

  return uigraph
}
