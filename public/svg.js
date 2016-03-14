var s = Snap ( '#svg' )
var RADIUS = 5
var SLOT   = 5
var SPAD   = 16
var HEIGHT = 30
var TPAD   = 10

var computeMinSize = function ( obj )
{
  var downSlots = ( obj.down || [] ).length
  var upSlots   = ( obj.up   || [] ).length

  var t = s.text ( 0, 0, obj.name )
  t.addClass ( 'tbox' )
  var tb = t.getBBox ()
  t.remove ()

  var w  = tb.width + 2 * TPAD
  var wd = downSlots * ( SPAD + 2 * SLOT ) + 2 * RADIUS
  var wu = upSlots   * ( SPAD + 2 * SLOT ) + 2 * RADIUS

  return { w: Math.max ( w, wd, wu ), h: HEIGHT, tw: tb.width, th: tb.height }
}

var makeBox = function ( txt, pos, sz, pal, upSlots, downSlots )
{
  // size
  var w = sz.w
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
  var usedl = upSlots * ( SPAD + 2 * SLOT )
  if ( usedl < w )
  { path.push ( `h${ w - usedl }` )
  }

  // SPAD   /\  SPAD  /\
  // +-----+  +------+  +--

  path.push ( `a${r} ${r} 0 0 1 ${ r} ${ r}` )
  path.push ( `v${ h - 2 * r }`      )
  path.push ( `a${r} ${r} 0 0 1 ${-r} ${ r}` )

  var usedl = downSlots * ( SPAD + 2 * SLOT )
  if ( usedl < w )
  { path.push ( `h${ usedl - w }` )
  }
  for ( var i = 0; i < downSlots; ++i )
  {
    path.push ( `l${-SLOT} ${-SLOT}` )
    path.push ( `l${-SLOT} ${ SLOT}` )
    path.push ( `h${ -SPAD }` )
  }

  path.push ( `a${r} ${r} 0 0 1 ${-r} ${-r}` )
  // down slots
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
