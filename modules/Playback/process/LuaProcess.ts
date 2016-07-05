import { kill, register, spawn, ProcessType } from './ProcessHelper'
declare var require: any
declare var __dirname: string
declare var process: any

if ( window [ 'process' ] ) {
  // __dirname = ''
  const LUA_BIN  = `${__dirname}/app/build/lua/bin/luajit`
  const LUA_ROOT = `${__dirname}/app/build/lua`
  const LUA_PATHS = './?.lua;' +
  [ '?.lua'
  , 'share/lua/5.1/?.lua'
  , 'share/lua/5.1/?/init.lua'
  ].map ( e => `${LUA_ROOT}/${e}` ).join ( ';' )
  const LUA_CPATHS = './?.so;' +
  [ '?.so'
  , 'lib/lua/5.1/?.so'
  ].map ( e => `${LUA_ROOT}/${e}` ).join ( ';' )
  const LUA_BOOT = `package.path='${LUA_PATHS}';package.cpath='${LUA_CPATHS}';require('lucidity').boot()`


  const makeLua =
  ( source: string
  ): ProcessType => {

    const lua = spawn
    ( LUA_BIN
    , [ '-e', LUA_BOOT ]
    , { stdio: [ 'pipe', 'pipe', 'inherit' ] }
    )

    const luaprocess: ProcessType = {
      halt () {
        kill ( lua )
      }
    , send ( ...data ) {}
    , receive ( ...data ) {}
    }

    lua.stdout.setEncoding ( 'utf-8' )
    lua.stdout.on ( 'data', ( alldata ) => {
      // TODO: optimize this to avoid split !
      alldata.split ( '\n' ).forEach ( ( data ) => {
        console.log ( 'RECEIVE', data )
        if ( data === '' ) { return }
        const msg = JSON.parse ( data )
        luaprocess.receive ( ...msg )
      })
    })

/*
    lua.stderr.setEncoding ( 'utf-8' )
    lua.stderr.on ( 'data', ( data ) => {
      // TODO: optimize this to avoid split !
      console.log ( data )
      luaprocess.receive ( 'error', data )
    })
    */

    lua.stdin.setEncoding ( 'utf-8' )
    luaprocess.send = ( ...data ) => {
      const msg = JSON.stringify ( data )
      console.log ( 'JS: send ' + msg )
      lua.stdin.write ( msg + "\n" )
    }

    lua.on ( 'close', ( code ) => {
      console.log ( 'LUA EXITED', code )
    })

    luaprocess.send ( 'source', source )

    return luaprocess
  }

  register ( 'lua', makeLua )

}
