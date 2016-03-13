var s = Snap ( '#svg' )
var RADIUS = 3
var HEIGHT = 26
var TPAD   = 10

var makeBox = function ( txt, x, y, pal )
{
  var r = s.rect ( x, y, 10, HEIGHT, 3, 3 )
  r.addClass ( 'box' + pal )

  var t = s.text ( x + TPAD, y, txt )
  t.addClass ( 'tbox' )

  var rb = r.getBBox ()
  var tb = t.getBBox ()

  t.attr
  ( { y: rb.y + rb.height / 2 + tb.height / 4
    }
  )

  r.attr
  ( { width: tb.width + 2 * TPAD
    }
  )
}

makeBox ( 'filter.Blur',      150, 150, 1 )
makeBox ( 'filter.Bloom',     150, 180, 1 )
makeBox ( 'generate.Crystal', 150, 210, 3 )
