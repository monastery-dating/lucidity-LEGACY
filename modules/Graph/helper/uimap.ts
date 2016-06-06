import { defaultUILayout } from './uilayout'
import { BlockType, BlockByIdType } from '../../Block'
import { GraphWithBlocksType
       , GraphType
       , NodeType
       , UINodeType, UINodeByIdType
       , UIGraphType
       , UILayoutType
       , UIPosType
       , UISlotType } from '../types'

import { NodeHelper } from './NodeHelper'
const nextNodeId = NodeHelper.nextNodeId
const rootNodeId = NodeHelper.rootNodeId

import { minSize } from './minSize'

/** Compute svg path of a box with up and down slots.
 * The sizes have to be computed first in the 'info' field.
 */
const path = function
( boxdef : UINodeType
, layout : UILayoutType
) {
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

  // res.push ( `a50 50 0 0 1 50 50` )
  // res.push ( `l50 50` )

  return res.join ( ' ' )
}

/** Compute a class name from an object.
 *
 * @param {object} obj    - the object definition
 * @param {object} layout - constants and tmp svg element
 *
 * @returns {string}   - the class name
 */
const className =
( obj: BlockType
, link: NodeType
, layout : UILayoutType
) => {
  if ( link.id === rootNodeId ) {
    return 'scene'
  }

  const name = obj.name.split ( '.' ) [ 0 ]
  let num = 7
  for ( let i = 0; i < name.length; i += 1 ) {
    num += name.charCodeAt ( i )
  }
  return `box${1 + num % layout.PCOUNT}`
}

/** Compute box position.
 */
const boxPosition = function
( graph: GraphWithBlocksType
, id: string
, layout: UILayoutType
, uigraph: UIGraphType
, ctx: UIPosType
) {
  const link = graph.nodesById [ id ]
  const obj  = graph.blocksById [ link.blockId ]

  // store our position given by ctx
  uigraph.uiNodeById [ id ].pos = ctx
  let dy = layout.HEIGHT

/*
  if ( graph.type === 'files' ) {
    dy += layout.SUBPADY
  }
  else {
  */
    dy += layout.VPAD
    /*
  }
  */

  let x  = ctx.x

  const len  = Math.max ( link.children.length, ( obj.input || [] ).length )
  const sextra = uigraph.uiNodeById [ id ].sextra

  // get children
  for ( let i = 0; i < len + 1; i += 1 ) {
    const childId = link.children [ i ]
    const wtonext = ( sextra [ i ] || 0 ) + layout.SPAD + 2 * layout.SLOT

    if ( childId ) {

      boxPosition
      ( graph, childId, layout, uigraph
      , { x, y: ctx.y + dy }
      )
      x += layout.BPAD + uigraph.uiNodeById [ childId ].size.w
    }
    else if ( childId === null ) {
      // empty slot, add padding and click width
      x += layout.SCLICKW/2 + layout.SPAD + 2 * layout.SLOT
    }
  }

  return dy
}


const uimapOne = function
( graph: GraphWithBlocksType
, id: string
, layout: UILayoutType
, uigraph: UIGraphType
, cachebox: UINodeByIdType
) {
  uigraph.uiNodeById [ id ] = <UINodeType> { id }
  uigraph.nodes.push ( id )
  /*
  if ( graph.type !== 'processing' ) {
    // not in graph: draw parent first
    uigraph.list.push ( id )
  }

  */


  const uibox = uigraph.uiNodeById [ id ]
  const cache = cachebox [ id ] || <UINodeType>{}

  const link = graph.nodesById [ id ]
  const obj  = graph.blocksById [ link.blockId ]

  uibox.name = obj.name
  uibox.blockId = obj._id
  uibox.type = obj.type
  uibox.className = uibox.name === cache.name
                  ? cache.className
                  : className ( obj, link, layout )
  // FIXME: only store text size in cache
  const ds = Math.max ( ( obj.input || [] ).length, ( link.children || [] ).length )

  let size = cache.size
  if ( !size ||
        size.cacheName !== obj.name ||
        size.us   !== ( obj.output ? 1 : 0 ) ||
        size.ds   !== ds
        ) {
    size = minSize ( obj, link, layout )
  }
  else {
    // cache.size is immutable
    size = Object.assign ( {}, size )
  }

  size.wde = 0

  const input = obj.input
  const slots : UISlotType[] = []
  const sl = layout.SLOT

  const sextra = [ 0 ] // extra spacing before slots
                       // first has 0 extra spacing
                       // second has spacing dependent on first child, etc

  if ( input ) {
    let   x = layout.RADIUS + layout.SPAD
    const y = layout.HEIGHT
    const len = Math.max ( link.children.length, input.length )


    // Compute sizes for all children
    const sline = `M${-sl} ${sl} h${2 * sl}`
    const spath = `M${-sl} ${0} l${sl} ${-sl} l${sl} ${sl}`
    const plus = `M${-sl} ${2*sl} h${2*sl} M${0} ${sl} v${2*sl}`
    const r = layout.RADIUS
    const cw = layout.SCLICKW
    const ch = layout.SCLICKH
    // start top left below rounded corner
    const clickp = [ `M${-cw/2} ${-sl + r}` ]
    clickp.push ( `a${r} ${r} 0 0 1 ${ r} ${-r}` )
    clickp.push ( `h${cw-2*r}` )
    clickp.push ( `a${r} ${r} 0 0 1 ${ r} ${ r}` )
    clickp.push ( `v${ch-2*r}` )
    clickp.push ( `a${r} ${r} 0 0 1 ${-r} ${ r}` )
    clickp.push ( `h${-cw+2*r}` )
    clickp.push ( `a${r} ${r} 0 0 1 ${-r} ${-r}` )
    clickp.push ( `v${-ch+2*r} z` )

    const click = clickp.join ('')

    const slotpad = layout.SPAD + 2 * layout.SLOT

    for ( let i = 0; i < len; i += 1 ) {
      const childId = link.children [ i ]
      const pos = { x: x + sl, y }

      if ( ! input [ i ] ) {
        // extra links outside of inputs...
        slots.push
        ( { path: sline
          , idx: i
          , pos
          , plus
          , click
          , flags: { detached: true, free: !childId }
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
          , flags: { free: !childId }
          }
        )
      }


      if ( childId ) {

        // We push in sextra the delta for slot i
        const w  = uimapOne ( graph, childId, layout, uigraph, cachebox )

        if ( i === len - 1 ) {
          // last
          sextra.push ( w + layout.BPAD - 2 * slotpad )
        }
        else {
          sextra.push ( w + layout.BPAD - slotpad )
        }
        x += w
      }
      else {
        // empty slot

        if ( i === len - 1 ) {
          sextra.push ( 0 )
        }
        else {
          // empty slot adds extra padding for click
          const w = layout.SCLICKW/2 + slotpad
          x += w // layout.SPAD + 2 * layout.SLOT
          sextra.push ( w + layout.BPAD - slotpad )
        }
      }
    }

    // Compute extra size for this box depending on i-1 children ( last child
    // does not change slot position )
    if ( sextra.length > 0 ) {
      size.wde = sextra.reduce ( ( sum, e ) => sum + e )
    }
    // sextra.pop ()

    size.w = Math.max ( size.w, size.wd + size.wde )
  }

  uibox.sextra = sextra

  uibox.size = size

  uibox.path  = path ( uibox, layout )
  uibox.slots = slots

  return uibox.size.w
}

/** Compute the layout of a graph.
 */
export const uimap =
( agraph: GraphType
, blocksById: BlockByIdType
, alayout?: UILayoutType
, cache?: UIGraphType
) : UIGraphType => {
  const graph =
  { nodes: agraph.nodes
  , nodesById: agraph.nodesById
  , blocksById
  }
  const layout = alayout || defaultUILayout
  const cachebox : UINodeByIdType = cache ? cache.uiNodeById : {}

  const startpos =
  { x: 0.5
  , y: 0.5 + layout.SLOT + layout.RADIUS
  }

  const uigraph : UIGraphType =
  { nodes: []
  , grabpos:
    { x: startpos.x + layout.RADIUS + layout.SPAD + layout.SLOT
    , y: startpos.y - layout.RADIUS + 6 // why do we need this 6 ?
    }
  , uiNodeById: {}
  }

  uimapOne
  ( graph, rootNodeId, layout, uigraph, cachebox )

  boxPosition
  ( graph, rootNodeId, layout, uigraph, startpos )

  return uigraph
}
