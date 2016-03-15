// JSON graph parser
var BPAD   = 0  // padding between siblings
var PCOUNT = 12 // palette color count
var SUBPAD = 3 * GRIDH // pad in sub assets
var VPAD   = 3  // padding between asset boxes

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
  var num = 7
  for ( var i = 0; i < name.length; ++i )
  {
    num += name.charCodeAt ( i )
  }
  return 1 + ( num % PCOUNT )
}
console.log ( hashName ( 'generator' ) )

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
    if ( obj.next )
    { computeSize ( graph, oinfo, obj.next )
    }

    if ( obj.sub )
    { computeSize ( graph, oinfo, obj.sub )
    }

    iobj.size   = iobj.smin
  }

  return iobj.size
}

var drawOne = function ( graph, oinfo, id, ctx, type )
{
  var obj  = graph [ id ]
  var info = oinfo [ id ]
  var b = makeBox
  ( obj.name
  , ctx
  , info
  , obj.type == 'main' ? 0 : hashName ( obj.name )
  , (obj.up || []).length
  , (obj.down || []).length
  , type
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
        drawOne
        ( graph, oinfo, cname, { x, y: ctx.y + HEIGHT }, type )
        x += BPAD + oinfo [ cname ].size.w
      }
    }
    return HEIGHT
  }
  else
  {
    var dy = HEIGHT + VPAD
    if ( obj.sub )
    { dy += drawOne
      ( graph, oinfo, obj.sub
      , { x: x + SUBPAD, y: ctx.y + dy }
      , type
      )
    }

    if ( obj.next )
    { dy += drawOne
      ( graph, oinfo, obj.next, { x, y: ctx.y + dy }, type )
    }
    return dy
  }
}

var ginfo = {}
var ainfo = {}

computeSize ( GRAPH.graph,  ginfo, 'g0' )
computeSize ( GRAPH.assets, ainfo, 'a0' )

drawOne ( GRAPH.graph,  ginfo, 'g0', { x: 220, y: 20 }, 'box'   )
drawOne ( GRAPH.assets, ainfo, 'a0', { x: 20,  y: 20 }, 'asset' )
