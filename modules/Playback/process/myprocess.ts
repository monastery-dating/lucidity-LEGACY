// Lua component example to use as reference. Should be removed when everything is implemented and moved into lib.
import { Init, Update, Meta } from 'lucidity'
let lua, luadata, value

export const init: Init =
( { context, children, require, asset, cache, detached } ) => {
  value = children [ 0 ]
  if ( !cache.lua ) {
    const process = require ( 'lucidity-process' )
    lua = process ( 'lua' )
    luadata = cache.luadata = { data: null }

    lua.receive = ( op, data ) => {
      if ( op === 'value' ) {
        console.log ( 'receive from lua', data )
        luadata.data = data
      }
    }
  }

  lua = cache.lua

  asset.source ( 'main.lua', ( src ) => {
    lua.setSource ( src )
  })

  if ( detached ) {
    lua.halt ()
  }
  return { lua, luadata }
}

export const update: Update =
() => {
  const v = value ()
  console.log ( 'lua send', v )
  lua.send ( v )
}

export const meta: Meta =
{ description: "Create a lua process."
, tags: [ 'process', 'lua' ]
, author: 'Gaspard Bucher <gaspard@lucidity.io>'
, origin: 'lucidity.io/lua.Process'
, version: '1.0'
, provide: { luadata: 'lua.Data' }
, children: [ '(): number' ]
}
