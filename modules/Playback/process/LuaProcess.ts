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
  (): ProcessType => {

    const lua = spawn
    ( LUA_BIN
    , [ '-e', LUA_BOOT ]
    , { stdio: [ 'pipe', 'pipe', 'inherit' ] }
    )

    const halt = () => {
      kill ( lua )
    }

    /*
    lua.stderr.setEncoding ( 'utf-8' )
    lua.stderr.on ( 'data', ( data ) => {
      // TODO: optimize this to avoid split !
      console.log ( data )
      luaprocess.receive ( 'error', data )
    })
    */

    lua.stdin.setEncoding ( 'utf-8' )
    const send = ( ...data ) => {
      const msg = JSON.stringify ( data )
      lua.stdin.write ( msg + "\n" )
    }

    lua.on ( 'close', ( code ) => {
      console.log ( 'LUA EXITED', code )
    })

    const luaprocess: ProcessType = {
      halt, setSource ( s ) {}, send, receive ( ...data ) {}
    }

    luaprocess.setSource = ( source: string ) => {
      if ( luaprocess.ready && source !== luaprocess.source ) {
        luaprocess.send ( 'source', source )
        luaprocess.source = source
      }
      else {
        luaprocess.source = source
      }
    }

    lua.stdout.setEncoding ( 'utf-8' )
    lua.stdout.on ( 'data', ( alldata ) => {
      // TODO: optimize this to avoid split !
      alldata.split ( '\n' ).forEach ( ( data ) => {
        if ( data === '' ) { return }
        const msg = JSON.parse ( data )
        if ( msg [ 0 ] === 'ready' ) {
          if ( !luaprocess.ready && luaprocess.source ) {
            luaprocess.send ( 'source', luaprocess.source )
            luaprocess.ready = true
            return
          }
        }
        luaprocess.receive ( ...msg )
      })
    })

    return luaprocess
  }

  register ( 'lua', makeLua )

}
