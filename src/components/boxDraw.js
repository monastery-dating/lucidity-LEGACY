/** Compute Boxdef layout from a graph definition and draw
 * svg path from Boxdef
 */
import htmlEscape from 'html-escape'

/** Some constants for graph layout. These could live in a settings object when
 * calling boxLayout and path.
 */
const DEFAULT_LAYOUT =
{ GRIDH:  8
, HEIGHT: 30
, RADIUS: 5
, SLOT:   5
, SPAD:   16
, TPAD:   10
, tmpdom: document.getElementById ( 'svgscratch' )
}

/** Compute the minimum size to display the element.
 *
 * @param {object} obj    - object definition
 * @param {object} layout - constants and tmp svg element
 * @returns {object}      - {w, h, wi, wo, tw, th}
 */
const minSize = function ( obj, layout ) {
  const downSlots = ( obj.in  || [] ).length
  const upSlot    = obj.out ? 1 : 0
  const tmpdom    = layout.tmpdom
  const name      = htmlEscape ( obj.name )

  const el = document.createElement ( 'text' )
  el.classList.add ( 'tbox' )
  el.innerHTML = name
  tmpdom.appendChild ( el )
  const tb = el.getBBox ()
  tmpdom.removeChild ( el )

  let w  = tb.width + 2 * layout.TPAD

  // width taken by inlets
  const wi = layout.RADIUS +
    downSlots * ( layout.SPAD + 2 * layout.SLOT ) +
    layout.SPAD + layout.RADIUS

  // width taken by outlets
  const wo = layout.RADIUS +
    upSlot    * ( layout.SPAD + 2 * layout.SLOT ) +
    layout.SPAD + layout.RADIUS

  w = Math.ceil
  ( Math.max ( w, wi, wo ) / layout.GRIDH ) * layout.GRIDH

  return { w
         , h: layout.HEIGHT
         , wi
         , wo
         , tw: tb.width
         , th: tb.height
         }
}

const boxLayoutOne = function ( graph, id, layout, bdefs, ghost ) {
  if ( !bdefs.boxdef [ id ] ) {
    bdefs.boxdef [ id ] = {}
  }
  const obj  = graph [ id ]
  const bdef = bdefs.boxdef [ id ]
  bdefs.all.push ( id )

  const smin = minSize ( obj, layout )

  const links  = obj.links

  if ( links ) {
    const sextra = [ 0 ] // extra spacing before slot i
                         // first has 0 extra spacing
                         // second has spacing dependent on first child, etc

    // Compute sizes for all children
    for ( const cname of links ) {
      // We push in sextra the delta for slot i
      const w  = boxLayoutOne ( graph, cname, layout, bdefs, ghost )
      sextra.push ( w + layout.BPAD - layout.SPAD - 2 * layout.SLOT )
    }

    // Compute extra size for this box depending on i-1 children ( last child
    // does not change slot position )
    sextra.pop ()
    bdef.sextra = sextra
    const extra = sextra.reduce ( ( sum, e ) => sum + e )

    const w  = smin.w
    const wd = smin.wd + extra

    bdef.size =
    { w: Math.max ( w, wd )
    , h: smin.h
    , wd
    , wu: smin.wu
    , tw: smin.tw
    , th: smin.th
    }

  }
  else {
    if ( obj.next ) {
      boxLayoutOne ( graph, obj.next, layout, bdefs, ghost )
    }

    if ( obj.sub ) {
      boxLayoutOne ( graph, obj.sub, layout, bdefs, ghost )
    }

    bdef.sextra = []
    bdef.size = smin
  }
  return bdef.size.w
}

/** Compute the layout of a graph.
 *
 * @param {object} graph  - graph definition
 * @param {string} id     - name of top-most object
 * @param {object} layout - constants and tmp svg element
 * @param {array}  bdefs  - previous values to update.
 *                          Contains an 'all' field with list of
 *                          elements and a 'boxdef' object with
 *                          computed values.
 * @param {object} ghost  - dragged object if exists
 * @returns {void}
 */
export const boxLayout = function ( graph, id, layout, bdefs, ghost ) {
  // empty list
  bdefs.all = []
  boxLayoutOne ( graph, id, layout || DEFAULT_LAYOUT, bdefs, ghost )
}


/** Create a box with up and down slots.
 * The sizes have to be computed first in the 'info' field.
 * FIXME: replace with 'path, x, y, class' functions
 *
 * @param {Snap} snap Snap svg drawer
 * @param {string} txt name to display in box
 * @param {object} pos x and y coordinates of top-left corner
 * @param {object} info junk field
 * @param {int} pal palette id number [1,12]
 * @param {int} upSlots number of up slots
 * @param {int} downSlots number of down slots
 * @returns {object} created objects { box, text }
 */
const makeBox =
function ( snap, txt, pos, info, pal, upSlots, downSlots ) {
  const sextra = info.sextra
  const sz     = info.size
  const w  = sz.w
  const wd = sz.wd
  const wu = sz.wu
  const h = sz.h
  const r = RADIUS

  /*
  w *= 2
  h *= 2
  r *= 2
  */

  // path starts at top-left corner + RADIUS in pos.x direction.
  const path = [ `M${pos.x + r} ${pos.y}` ]

  for ( let i = 0; i < upSlots; i += 1 ) {
    path.push ( `h${SPAD}` )
    path.push ( `l${SLOT} ${-SLOT}` )
    path.push ( `l${SLOT} ${ SLOT}` )
  }

  const rpadu = w - wu
  if ( rpadu > 0 ) {
    path.push ( `h${ rpadu + SPAD }` )
  }
  else {
    path.push ( `h${ SPAD }` )
  }

  // SPAD   /\  SPAD  /\
  // +-----+  +------+  +--

  path.push ( `a${r} ${r} 0 0 1 ${ r} ${ r}` )

  path.push ( `v${ h - 2 * r }`      )

  path.push ( `a${r} ${r} 0 0 1 ${-r} ${ r}` )

  const rpadd = w - wd
  if ( rpadd > 0 ) {
    path.push ( `h${ -rpadd - SPAD }` )
  }
  else {
    path.push ( `h${ -SPAD }` )
  }

  for ( let i = downSlots - 1; i >= 0; i -= 1 ) {
    path.push ( `l${ -SLOT } ${ -SLOT }` )
    path.push ( `l${ -SLOT } ${  SLOT }` )
    path.push ( `h${ -SPAD - ( sextra [ i ] || 0 ) }` )
  }

  path.push ( `a${r} ${r} 0 0 1 ${-r} ${-r}` )

  path.push ( `v${ -h + 2 * r }`    )
  path.push ( `a${r} ${r} 0 0 1 ${ r} ${-r}` )

  // path.push ( `a50 50 0 0 1 50 50` )
  // path.push ( `l50 50` )

  const box = snap.path ( path.join ( ' ' ) )
  box.addClass ( `box${pal}` )

  const rb = box.getBBox ()

  const text = snap.text
  ( pos.x + TPAD
  , rb.y + rb.height / 2 + sz.th / 4
  , txt
  )

  text.addClass ( 'tbox' )
  text.addClass ( `box${pal}` )

  return { box, text }
}


import { GRIDH
       , HEIGHT
       , SLOT
       , SPAD
       , computeMinSize
       , makeBox
       } from './svg'

// JSON graph parser
const BPAD   = 0  // padding between siblings
const PCOUNT = 12 // palette color count
const SUBPAD = 3 * GRIDH // pad in sub assets
const VPAD   = 3  // padding between asset boxes

// To draw the graph we must:
// Go through all nodes recursively (Depth-First).
//
// ==> LAYOUT
// 1. Open node
// 2. Compute minimal node size from name + slots = self.minsize
// 3. Compute minimal node size from children = children.sizes.sum
// 4. Compute Max of self.minsize and children.sizes.sum = self.size
// 5. Return self.size
//
// ==> DRAW
// 1. Open node
// 2. Draw respecting self.size ( and later slot positions )
// 3. foreach child, draw

/** Compute an palette id from an object name.
 * @param {string} aname the object's name
 * @returns {int} the palette id
 */
export const hashName = function ( aname ) {
  const name = aname.split ( '.' ) [ 0 ]
  let num = 7
  for ( let i = 0; i < name.length; i += 1 ) {
    num += name.charCodeAt ( i )
  }
  return 1 + num % PCOUNT
}

/** Draw an element and it's children.
 *
 * @param {Snap}   snap  Snap svg drawer
 * @param {object} graph graph definition
 * @param {object} oinfo computed object information
 * @param {string} id    name of the object to draw
 * @param {object} ctx   top-left x,y position to draw
 * @returns {void}
 */
export const drawOne = function ( snap, graph, oinfo, id, ctx ) {
  const obj  = graph [ id ]
  const info = oinfo [ id ]
  const b = makeBox
  ( snap
  , obj.name
  , ctx
  , info
  , obj.type === 'main' ? 0 : hashName ( obj.name )
  , ( obj.up   || [] ).length
  , ( obj.down || [] ).length
  )

  if ( obj.sel ) {
    b.box.addClass ( 'sel' )
  }

  let x = ctx.x
  if ( obj.down ) {
    // get children
    for ( let i = 0; i < obj.down.length; i += 1 ) {
      const receive = obj.down [ i ].receive
      if ( receive ) {
        const cname = receive.split ( '.' ) [ 0 ]
        drawOne
        ( snap, graph, oinfo, cname, { x, y: ctx.y + HEIGHT } )
        x += BPAD + oinfo [ cname ].size.w
      }
    }

    return HEIGHT
  }
  else {
    let dy = HEIGHT + VPAD
    if ( obj.sub ) {
      dy += drawOne
      ( snap, graph, oinfo, obj.sub
      , { x: x + SUBPAD, y: ctx.y + dy }
      )
    }

    if ( obj.next ) {
      dy += drawOne
      ( snap, graph, oinfo, obj.next, { x, y: ctx.y + dy } )
    }

    return dy
  }
}

