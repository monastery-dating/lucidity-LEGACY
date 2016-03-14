// JSON graph parser

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

var drawOne = function ( graph, id, ctx )
{
  var obj = graph [ id ]
  makeBox
  ( obj.name
  , ctx.x
  , ctx.y
  , id == 'fx0' ? 0 : hashName ( obj.name )
  , (obj.up || []).length
  , (obj.down || []).length
  )

  // get children
  for ( var i = 0; i < (obj.down || []).length; ++i )
  {
    var receive = ( obj.down [ i ].receive || '' ).split ( '.' )
    var cname = receive [ 0 ]
    var cslot = receive [ 1 ]
    if ( cname != '' )
    {
      drawOne ( GRAPH.graph, cname, { x: ctx.x + i * 100, y: ctx.y + 30 } )
    }
  }
}

drawOne ( GRAPH.graph, 'fx0', { x: 280, y: 120 } )
