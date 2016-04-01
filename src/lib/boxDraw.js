/** Compute Boxdef layout from a graph definition and draw
 * svg path from Boxdef
 */
import htmlEscape from 'html-escape'

/** Some constants for graph layout. These could live in a settings object when
 * calling boxLayout and path.
 */
export const DEFAULT_LAYOUT =
{ GRIDH:  8
, HEIGHT: 30
, RADIUS: 5
, SLOT:   5
, SPAD:   16
, TPAD:   10
, BPAD:   0  // pad between siblings
, PCOUNT: 12 // palette color count
, SUBPAD: 3 * 8 // (3*GRIDH) pad in sub assets
, VPAD:   3  // vertical padding between boxes
, tsizer: document.getElementById ( 'tsizer' )
}

/** Compute a class name from an object.
 *
 * @param {object} obj    - the object definition
 * @param {object} layout - constants and tmp svg element
 *
 * @returns {string}   - the class name
 */
const className = function ( obj, layout ) {
  if ( !obj.out ) {
    return 'main'
  }

  const name = obj.name.split ( '.' ) [ 0 ]
  let num = 7
  for ( let i = 0; i < name.length; i += 1 ) {
    num += name.charCodeAt ( i )
  }
  return `box${1 + num % layout.PCOUNT}`
}

/** Compute the minimum size to display the element.
 *
 * @param {object} obj    - object definition
 * @param {object} layout - constants and tmp svg element
 * @returns {object}      - {w, h, wd, wu, tw, th, ds, us}
 */
const minSize = function ( obj, layout ) {
  const ds     = ( obj.in  || [] ).length
  const us     = obj.out ? 1 : 0
  const tsizer = layout.tsizer
  const name   = htmlEscape ( obj.name )

  tsizer.innerHTML = name
  const tb = tsizer.getBBox ()

  let w  = tb.width + 2 * layout.TPAD

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

  return { w
         , h: layout.HEIGHT
         , wd
         , wu
         , tw: tb.width
         , th: tb.height
         , ds
         , us
         , name: obj.name // cache reference
         }
}

const boxLayoutOne = function ( graph, id, layout, bdefs, ghost ) {
  const obj  = graph [ id ]
  if ( !bdefs.boxdef [ id ] ) {
    bdefs.boxdef [ id ] = {}
  }
  const bdef = bdefs.boxdef [ id ]
  bdefs.all.push ( id )

  if ( bdef.name !== obj.name ) {
    bdef.name = obj.name
    bdef.className = className ( obj, layout )
  }

  let smin = bdef.smin
  if ( !smin ||
        smin.name !== obj.name ) {
    smin = minSize ( obj, layout )
  }

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
  if ( !bdefs.boxdef ) {
    bdefs.boxdef = {}
  }
  boxLayoutOne ( graph, id, layout, bdefs, ghost )
}

/** Create a box with up and down slots.
 * The sizes have to be computed first in the 'info' field.
 *
 * @param {object} boxdef - box layout definition
 * @param {object} layout - constants and tmp svg element
 * @returns {string} svg path
 */
export const path = function ( boxdef, layout ) {
  const ds = boxdef.ds
  const us = boxdef.us
  const sextra = boxdef.sextra
  const w  = boxdef.w
  const wd = boxdef.wd
  const wu = boxdef.wu
  const h  = boxdef.h
  const r  = layout.RADIUS

  /*
  w *= 2
  h *= 2
  r *= 2
  */

  // path starts at top-left corner + RADIUS in x direction.
  // top-left is (0,0) because we translate with a <g> tag.
  const res = [ `M${r} 0` ]

  for ( let i = 0; i < us; i += 1 ) {
    res.push ( `h${layout.SPAD}` )
    res.push ( `l${layout.SLOT} ${-layout.SLOT}` )
    res.push ( `l${layout.SLOT} ${ layout.SLOT}` )
  }

  const rpadu = w - wu
  if ( rpadu > 0 ) {
    res.push ( `h${ rpadu + layout.SPAD }` )
  }
  else {
    res.push ( `h${ layout.SPAD }` )
  }

  // SPAD   /\  SPAD  /\
  // +-----+  +------+  +--

  res.push ( `a${r} ${r} 0 0 1 ${ r} ${ r}` )

  res.push ( `v${ h - 2 * r }`      )

  res.push ( `a${r} ${r} 0 0 1 ${-r} ${ r}` )

  const rpadd = w - wd
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


/*
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
*/

