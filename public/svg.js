var s = Snap ( '#svg' )
var RADIUS = 3
var SLOT   = 5
var SPAD   = 16
var HEIGHT = 26
var TPAD   = 10
var foo

var makeBox = function ( txt, x, y, pal, upSlots, downSlots )
{
  var t = s.text ( x + TPAD, y, txt )
  t.addClass ( 'tbox' )
  var tb = t.getBBox ()

  // size
  var w = tb.width + 2 * TPAD
  var h = HEIGHT
  var r = RADIUS

  /*
  w *= 2
  h *= 2
  r *= 2
  */

  // path starts at top-left corner + RADIUS in x direction.
  var path = [`M${x + r} ${y}`]

  // up slots
  var l = w - 2 * r
  // up total length
  var ul = upSlots * ( SPAD + 2 * SLOT ) + SPAD
  // down total length
  var dl = downSlots * ( SPAD + 2 * SLOT ) + SPAD

  l = Math.max ( l, ul, dl )
  
  for ( var i = 0; i < upSlots; ++i )
  {
    path.push ( `h${ SPAD }` )
    path.push ( `l${SLOT} ${-SLOT}` )
    path.push ( `l${SLOT} ${ SLOT}` )
  }
  var usedl = upSlots * ( SPAD + 2 * SLOT )
  if ( usedl < l )
  { path.push ( `h${ l - usedl }` )
  }

  // SPAD   /\  SPAD  /\
  // +-----+  +------+  +--

  path.push ( `a${r} ${r} 0 0 1 ${ r} ${ r}` )
  path.push ( `v${ h - 2 * r }`      )
  path.push ( `a${r} ${r} 0 0 1 ${-r} ${ r}` )

  var usedl = downSlots * ( SPAD + 2 * SLOT )
  if ( usedl < l )
  { path.push ( `h${ usedl - l }` )
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
  console.log ( path.join ( '' ) )

  var r = s.path ( path.join ( ' ' ) )
  /*
  var r = s.rect ( x, y, 10, HEIGHT, 3, 3 )


  r.attr
  ( { width: tb.width + 2 * TPAD
    }
  )
  */
  r.addClass ( 'box' + pal )

  var rb = r.getBBox ()
  // FIXME: who to bring to front without recreating ?
  t.remove ()
  t = s.text
  ( x + TPAD
  , rb.y + rb.height / 2 + tb.height / 4
  , txt
  )
  t.addClass ( 'tbox' )
}

makeBox ( 'filter.Blur',      150, 150, 1, 2, 1 )
makeBox ( 'filter.Bloom',     150, 180, 1, 1, 1 )
makeBox ( 'generate.Crystal', 150, 210, 3, 1, 2 )
