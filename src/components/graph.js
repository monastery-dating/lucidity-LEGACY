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

/** Compute the size of an element with it's children.
 * @param {Snap}   snap  Snap svg drawer
 * @param {object} graph graph definition
 * @param {object} oinfo computed object information
 * @param {string} id    name of object
 * @returns {object}     object size
 */
export const computeSize = function ( snap, graph, oinfo, id ) {
  if ( !oinfo [ id ] ) {
    oinfo [ id ] = {}
  }
  const obj  = graph [ id ]
  const iobj = oinfo [ id ]

  iobj.smin = computeMinSize ( snap, obj )

  if ( obj.down ) {
    const sextra = [ 0 ] // extra spacing before slot i
                         // first has 0 extra spacing
                         // second has spacing dependent on first child, etc

    // Compute sizes for all children
    for ( let i = 0; i < obj.down.length; i += 1 ) {
      const receive = obj.down [ i ].receive
      if ( receive ) {
        const cname = receive.split ( '.' ) [ 0 ]
        // We push in sextra the delta for slot i
        const w  = computeSize ( snap, graph, oinfo, cname ).w
        sextra.push ( w + BPAD - SPAD - 2 * SLOT )
      }
      else {
        sextra.push ( 0 )
      }
    }

    // Compute extra size for this box depending on i-1 children ( last child
    // does not change slot position )
    sextra.pop ()
    iobj.sextra = sextra
    const extra = sextra.reduce ( ( sum, e ) => sum + e )

    const w  = iobj.smin.w
    const wd = iobj.smin.wd + extra

    iobj.size =
    { w: Math.max ( w, wd )
    , h: iobj.smin.h
    , wd
    , wu: iobj.smin.wu
    , tw: iobj.smin.tw
    , th: iobj.smin.th
    }

  }
  else {
    if ( obj.next ) {
      computeSize ( snap, graph, oinfo, obj.next )
    }

    if ( obj.sub ) {
      computeSize ( snap, graph, oinfo, obj.sub )
    }

    iobj.size = iobj.smin
  }

  return iobj.size
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

