// JSON graph parser
var BPAD   = 0 // padding between siblings

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

var computeSize = function ( graph, oinfo, id )
{
  if ( ! oinfo [ id ] ) oinfo [ id ] = {}
  var obj  = graph [ id ]
  var iobj = oinfo [ id ]

  iobj.smin = computeMinSize ( obj )

  if ( obj.down )
  {
    var sextra = [ 0 ] // extra spacing before slot i
                       // first has 0 extra spacing
                       // second has spacing dependent on first child, etc

    // Compute sizes for all children
    for ( var i = 0; i < obj.down.length; ++i )
    {
      var receive = obj.down [ i ].receive
      if ( receive )
      {
        var cname = receive.split ( '.' ) [ 0 ]
        // We push in sextra the delta for slot i
        var w  = computeSize ( graph, oinfo, cname ).w
        sextra.push ( w + BPAD - SPAD - 2 * SLOT )
      }
      else
      {
        sextra.push ( 0 )
      }
    }
    // Compute extra size for this box depending on i-1 children ( last child
    // does not change slot position )
    sextra.pop ()
    iobj.sextra = sextra
    var extra = sextra.reduce ( ( s, e ) => s + e )

    var w  = iobj.smin.w
    var wd = iobj.smin.wd + extra

    iobj.size =
    { w: Math.max ( w, wd )
    , h: iobj.smin.h
    , wd
    , wu: iobj.smin.wu
    , tw: iobj.smin.tw
    , th: iobj.smin.th
    }
  }
  else
  {
    iobj.size   = iobj.smin
  }

  return iobj.size
}

var drawOne = function ( graph, oinfo, id, ctx )
{
  var obj  = graph [ id ]
  var info = oinfo [ id ]
  var b = makeBox
  ( obj.name
  , ctx
  , info
  , id == 'fx0' ? 0 : hashName ( obj.name )
  , (obj.up || []).length
  , (obj.down || []).length
  )

  if ( obj.sel ) b.addClass ( 'sel' )

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
        drawOne ( GRAPH.graph, oinfo, cname, { x, y: ctx.y + HEIGHT } )
        x += BPAD + oinfo [ cname ].size.w
      }
    }
  }
}

var oinfo = {}
computeSize ( GRAPH.graph, oinfo, 'fx0' )

drawOne ( GRAPH.graph, oinfo, 'fx0', { x: 280, y: 120 } )
