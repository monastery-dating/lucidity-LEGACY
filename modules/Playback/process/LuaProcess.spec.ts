import { describe } from '../../Test'
import { start } from './ProcessHelper'
import './LuaProcess'

const LUA_CODE =
`
local process = require 'lucidity'

local send = process.send

function process.receive ( op, data )
  if op == 'add' then
    send ( 'value', data + 1 )
  elseif op == 'sub' then
    send ( 'value', data - 1 )
  end
end

process.listen ()
`

describe ( 'LuaProcess' , ( it ) => {

  it ( 'should start lua process', ( assert, done ) => {
    const lua = start ( 'lua', LUA_CODE )
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
})
