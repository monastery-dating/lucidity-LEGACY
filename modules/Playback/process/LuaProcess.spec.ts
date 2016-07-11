import { describe } from '../../Test'
import { start } from './ProcessHelper'
import './LuaProcess'

const LUA_CODE =
`
local send = lucidity.send

function lucidity.receive ( op, data )
  if op == 'add' then
    send ( 'value', data + 1 )
  elseif op == 'sub' then
    send ( 'value', data - 1 )
  end
end
`

const LUA_CODE2 =
`
local send = lucidity.send

function lucidity.receive ( op, data )
  if op == 'add' then
    send ( 'value', data + 10 )
  elseif op == 'sub' then
    send ( 'value', data - 10 )
  end
end
`

if ( !window [ 'process' ] ) {
  describe ( 'LuaProcess' , ( it ) => {
    it ( 'should fail in browser', ( assert ) => {
      assert.throws ( () => {
        const lua = start ( 'lua' )
      })
    })
  })
}

else {

  describe ( 'LuaProcess' , ( it ) => {

    it ( 'should start lua process', ( assert, done ) => {
      const lua = start ( 'lua' )
      lua.setSource ( LUA_CODE )
      let opi = 0
      const operations =
      [ { msg: [ 'add', 4 ], value: 5 }
      , { msg: [ 'sub', 9.003 ], value: 8.003 }
      , { msg: [ 'add', 9.003 ], value: 10.003 }
      ]
      const doit = () => {
        const op = operations [ opi ]
        if ( op ) {
          lua.send ( ...op.msg )
        }
        else {
          lua.halt ()
          done ()
        }
      }

      lua.receive = ( type, value ) => {
        if ( type === 'error' ) {
          assert.equal ( '', value )
          done ()
        }
        else if ( type === 'ready' ) {
          doit ()
        }
        else {
          assert.equal ( type, 'value' )
          let op = operations [ opi ]
          assert.equal ( value, op.value )
          ++opi
          doit ()
        }
      }

    })

    it ( 'should parse new source', ( assert, done ) => {
      const lua = start ( 'lua' )
      lua.setSource ( LUA_CODE )
      let opi = 0
      const operations =
      [ { msg: [ 'add', 4  ], value: 5 }
      , { msg: [ 'sub', 8  ], value: 7 }
      , { msg: 'source', value: null }
      , { msg: [ 'add', 4  ], value: 14 }
      , { msg: [ 'sub', 53 ], value: 43 }
      ]

      const doit = () => {
        const op = operations [ opi ]
        if ( op ) {
          if ( op.msg === 'source' ) {
            lua.setSource ( LUA_CODE2 )
          }
          else {
            lua.send ( ...op.msg )
          }
        }
        else {
          lua.halt ()
          done ()
        }
      }

      lua.receive = ( type, value ) => {
        if ( type === 'error' ) {
          assert.equal ( '', value )
          done ()
        }
        else if ( type === 'ready' ) {
          ++opi
          doit ()
        }
        else {
          assert.equal ( type, 'value' )
          let op = operations [ opi ]
          assert.equal ( value, op.value )
          ++opi
          doit ()
        }
      }

    })
  })

}
