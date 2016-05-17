import { describe } from '../../Test/runner'
import { makeDoc } from './makeDoc.action'
import * as Baobab from 'baobab'

describe
( 'Factory makeDoc action', ( it ) => {

    it ( 'should prepare for db', ( assert ) => {
        const state = new Baobab
        ( { data: { main: { foo: { value: 'bong', _rev: '1-x' } } } } )
        let res
        const output = ( arg ) => { res = arg.doc }

        makeDoc
        ( { state
          , input: { path: [ 'data', 'main', 'foo', 'value' ], value: 'bing' }
          , output
          }
        )

        assert.equal
        ( res
        , { _id: 'foo'
          , type: 'main'
          , _rev: '1-x'
          , value: 'bing'
          }
        )
      }

    )
  }
)
