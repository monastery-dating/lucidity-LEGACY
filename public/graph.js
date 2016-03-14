// JSON graph parser
var BPAD   = 12 // padding between siblings

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
var hashName = function ( name )
{
  var name = name.split ( '.' ) [ 0 ]
  var num = 0
  for ( var i = 0; i < name.length; ++i )
  {
    num += name.charCodeAt ( i )
  }
  return 1 + ( num % 8 )
}

var computeSize = function ( graph, sizes, id )
{
  if ( ! sizes [ id ] ) sizes [ id ] = {}
  var obj  = graph [ id ]
  var sobj = sizes [ id ]

  sobj.min = computeMinSize ( obj )

  if ( obj.down )
  {
    var csizes = []
    // get children
    for ( var i = 0; i < obj.down.length; ++i )
    {
      var receive = obj.down [ i ].receive
      if ( receive )
      {
        var cname = receive.split ( '.' ) [ 0 ]
        csizes.push ( computeSize ( graph, sizes, cname ).w )
      }
    }
    var cw = csizes.reduce ( ( s, x ) => BPAD + s + x )
    sobj.size =
    { w: Math.max ( sobj.min.w, cw )
    , h: sobj.min.h
    , tw: sobj.min.tw
    , th: sobj.min.th
    }
  }
  else
  {
    sobj.size = sobj.min
  }

  return sobj.size
}

var drawOne = function ( graph, sizes, id, ctx )
{
  var obj = graph [ id ]
  var sz  = sizes [ id ]
  makeBox
  ( obj.name
  , ctx
  , sz.size
  , id == 'fx0' ? 0 : hashName ( obj.name )
  , (obj.up || []).length
  , (obj.down || []).length
  )

  var x = ctx.x
  if ( obj.down )
  {
    // get children
    for ( var i = 0; i < obj.down.length; ++i )
    {
      var receive = obj.down [ i ].receive
      if ( receive )
      {
        var cname = receive.split ( '.') [ 0 ]
        drawOne ( GRAPH.graph, sizes, cname, { x, y: ctx.y + HEIGHT } )
        x += BPAD + sizes [ cname ].size.w
      }
    }
  }
}

var sizes = {}
computeSize ( GRAPH.graph, sizes, 'fx0' )

drawOne ( GRAPH.graph, sizes, 'fx0', { x: 280, y: 120 } )
