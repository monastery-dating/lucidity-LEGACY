import { UILayoutType, defaultUILayout, getTsizer } from './uilayout.type'
import { UIGraphType, UIBoxesType } from './uigraph.type'
import { UIBoxType, UIBoxSize, UIPosType } from './uibox.type'
import { GraphType } from './graph.type'
import { rootGraphId } from './graph.helper'
import { BoxType } from './box.type'

import { escape, merge } from '../util/index'

/** Compute svg path of a box with up and down slots.
 * The sizes have to be computed first in the 'info' field.
 */
const path = function
( boxdef : UIBoxType
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

  console.log ( boxdef.name, sextra )


  res.push ( `a${r} ${r} 0 0 1 ${ r} ${ r}` )

  res.push ( `v${ h - 2 * r }`      )

  res.push ( `a${r} ${r} 0 0 1 ${-r} ${ r}` )

  const rpadd = w - wd - wde
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
const className = function ( obj, layout : UILayoutType ) {
  if ( obj.type ) {
    return 'main'
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
( graph: GraphType
, id: string
, layout: UILayoutType
, uiboxes: UIBoxesType
, ghost
, ctx: UIPosType
) {
  const obj  = graph.boxes [ id ]

  // store our position given by ctx
  uiboxes [ id ].pos = ctx
  let dy = layout.HEIGHT

  let x  = ctx.x
  const input = obj.in
  const link = obj.link || []

  if ( graph.type === 'files' ) {
    dy += layout.SUBPADY
  }
  else {
    dy += layout.VPAD
  }
  // get children
  for ( let i = 0; i < input.length; i += 1 ) {
    const cname = link [ i ]
    if ( cname ) {
      boxPosition
      ( graph, cname, layout, uiboxes, ghost
      , { x, y: ctx.y + dy }
      )
      x += layout.BPAD + uiboxes [ cname ].size.w
    }
  }

  if ( obj.sub || obj.next ) {
    // files rendering
    if ( obj.sub ) {
      dy += boxPosition
      ( graph, obj.sub, layout, uiboxes, ghost
      , { x: x + layout.SUBPADX
        , y: ctx.y + dy
        }
      )
    }

    if ( obj.next ) {
      dy += boxPosition
      ( graph, obj.next, layout, uiboxes, ghost
      , { x
        , y: ctx.y + dy
        }
      )
    }
  }

  return dy
}

/** Compute the minimum size to display the element.
 */
const minSize = function
( obj: BoxType
, layout: UILayoutType
) : UIBoxSize {
  const ds     = obj.in.length
  const us     = obj.out ? 1 : 0
  // FIXME: We should find a better way to get hold of the
  // DOM element...
  const tsizer = layout.tsizer || ( layout.tsizer = getTsizer () )
  const name   = escape ( obj.name )

  tsizer.innerHTML = name
  const tb = tsizer.getBBox ()

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
         , ty: layout.HEIGHT / 2 + tb.height / 4
         , wd
         , wu
         , ds
         , us
         , wde: 0
         }
}

const uimapOne = function
( graph: GraphType
, id: string
, layout: UILayoutType
, uigraph: UIGraphType
, ghost
, cachebox: UIBoxesType
) {
  uigraph.uibox [ id ] = <UIBoxType> { id }
  uigraph.list.push ( id )

  const uibox = uigraph.uibox [ id ]
  const cache = cachebox [ id ] || <UIBoxType>{}

  const obj  = graph.boxes [ id ]

  uibox.name = obj.name
  uibox.className = uibox.name === cache.name
                  ? cache.className
                  : className ( obj, layout )

  let size = cache.size
  if ( !size ||
        size.cacheName !== obj.name ||
        size.us   !== ( obj.out ? 1 : 0 ) ||
        size.ds   !== ( obj.in || [] ).length
        ) {
    size = minSize ( obj, layout )
  }
  else {
    // cache.size is immutable
    size = merge ( size, {} )
  }

  size.wde = 0

  const input = obj.in
  const slots : string[] = []
  const sl = layout.SLOT

  const sextra = [ 0 ] // extra spacing before slots
                       // first has 0 extra spacing
                       // second has spacing dependent on first child, etc

  if ( input ) {
    let   x = layout.RADIUS + layout.SPAD
    const y = layout.HEIGHT
    const link = obj.link || []


    // Compute sizes for all children
    for ( let i = 0; i < input.length; i += 1 ) {
      slots.push
      ( `M${x} ${y} l${sl} ${-sl} l${sl} ${sl}`
      )
      const cname = link [ i ]
      if ( cname ) {
        // We push in sextra the delta for slot i
        const w  = uimapOne ( graph, cname, layout, uigraph, ghost, cachebox )
        sextra.push ( w + layout.BPAD - layout.SPAD - 2 * layout.SLOT )
        x += w
      }
      else {
        x += layout.SPAD + 2 * layout.SLOT
        sextra.push ( 0 )
      }
    }

    // Compute extra size for this box depending on i-1 children ( last child
    // does not change slot position )
    sextra.pop ()
    console.log ( uibox.name, sextra, '[0]')
    if ( sextra.length > 0 ) {
      size.wde = sextra.reduce ( ( sum, e ) => sum + e )
    }

    size.w = Math.max ( size.w, size.wd + size.wde )
  }

  uibox.sextra = sextra

  if ( obj.sub ) {
    uimapOne ( graph, obj.sub, layout, uigraph, ghost, cachebox )
  }

  if ( obj.next ) {
    uimapOne ( graph, obj.next, layout, uigraph, ghost, cachebox )
  }

  uibox.size = size

  uibox.path  = path ( uibox, layout )
  uibox.slots = slots
  return uibox.size.w
}

/** Compute the layout of a graph.
 */
export const uimap = function
( graph: GraphType
, alayout?: UILayoutType
, cache?: UIGraphType
, ghost?: Object
) : UIGraphType {
  const uigraph : UIGraphType =
  { list: []
  , uibox: {}
  }


  const layout = alayout || defaultUILayout

  const cachebox : UIBoxesType = cache ? cache.uibox : {}

  uimapOne
  ( graph, rootGraphId, layout, uigraph, ghost, cachebox )

  boxPosition
  ( graph, rootGraphId, layout, uigraph.uibox, ghost, { x: 0, y: 0 } )

  return uigraph
}
