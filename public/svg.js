var s = Snap ( '#svg' )
var RADIUS = 5
var SLOT   = 5
var SPAD   = 16
var HEIGHT = 30
var TPAD   = 10
var GRIDH  = 8

var computeMinSize = function ( obj )
{
  var downSlots = ( obj.down || [] ).length
  var upSlots   = ( obj.up   || [] ).length

  var t = s.text ( 0, 0, obj.name )
  t.addClass ( 'tbox' )
  var tb = t.getBBox ()
  t.remove ()

  var w  = tb.width + 2 * TPAD
  var wd = RADIUS + downSlots * ( SPAD + 2 * SLOT ) + SPAD + RADIUS
  var wu = RADIUS + upSlots   * ( SPAD + 2 * SLOT ) + SPAD + RADIUS

  w = Math.ceil ( Math.max ( w, wd, wu ) / GRIDH ) * GRIDH

  return { w
         , h: HEIGHT
         , wd
         , wu
         , tw: tb.width
         , th: tb.height
         }
}

var makeBox = function ( txt, pos, info, pal, upSlots, downSlots, type )
{
  var sextra = info.sextra
  var sz     = info.size
  var w  = sz.w
  var wd = sz.wd
  var wu = sz.wu
  var h = sz.h
  var r = RADIUS

  /*
  w *= 2
  h *= 2
  r *= 2
  */

  // path starts at top-left corner + RADIUS in pos.x direction.
  var path = [`M${pos.x + r} ${pos.y}`]

  for ( var i = 0; i < upSlots; ++i )
  {
    path.push ( `h${ SPAD }` )
    path.push ( `l${SLOT} ${-SLOT}` )
    path.push ( `l${SLOT} ${ SLOT}` )
  }

  var rpadu = w - wu
  if ( rpadu > 0 )
  { path.push ( `h${ rpadu + SPAD }` )
  }
  else
  { path.push ( `h${ SPAD }` )
  }

  // SPAD   /\  SPAD  /\
  // +-----+  +------+  +--

  path.push ( `a${r} ${r} 0 0 1 ${ r} ${ r}` )

  path.push ( `v${ h - 2 * r }`      )
  
  path.push ( `a${r} ${r} 0 0 1 ${-r} ${ r}` )

  var rpadd = w - wd
  if ( rpadd > 0 )
  { path.push ( `h${ - rpadd - SPAD }` )
  }
  else
  { path.push ( `h${ - SPAD }` )
  }

  for ( var i = downSlots - 1; i >= 0; --i )
  {
    path.push ( `l${ - SLOT } ${ - SLOT }` )
    path.push ( `l${ - SLOT } ${   SLOT }` )
    path.push ( `h${ - SPAD - ( sextra [ i ] || 0 ) }` )
  }

  path.push ( `a${r} ${r} 0 0 1 ${-r} ${-r}` )

  path.push ( `v${ - h + 2 * r }`    )
  path.push ( `a${r} ${r} 0 0 1 ${ r} ${-r}` )
  
  // path.push ( `a50 50 0 0 1 50 50` )
  // path.push ( `l50 50` )

  var r = s.path ( path.join ( ' ' ) )
  /*
  var r = s.rect ( pos.x, pos.y, 10, HEIGHT, 3, 3 )


  r.attr
  ( { width: tb.width + 2 * TPAD
    }
  )
  */
  r.addClass ( 'box' + pal )

  var rb = r.getBBox ()

  t = s.text
  ( pos.x + TPAD
  , rb.y + rb.height / 2 + sz.th / 4
  , txt
  )
  t.addClass ( 'tbox' )
  return r
}
