import { describe } from '../../Test/runner'
import { setAction } from './set.action'
import * as Baobab from 'baobab'

describe
( 'Factory set action', ( it ) => {
    it ( 'should set state', ( assert ) => {
        const state = new Baobab
        ( { foo: { bar: true, bing: 'bong' } } )
        let res
        const output = { save ( arg ) { res = arg } }

        setAction
        ( { state
          , input: { path: [ 'foo', 'bar' ], value: 'baz' }
          , output
          }
        )

        assert.equal
        ( state.get ()
        , { foo:
            { bar: 'baz'
            , bing: 'bong'
            }
          }
        )
      }
    )

    it ( 'should push to db on data path', ( assert ) => {
        const state = new Baobab
        ( { data: { main: { foo: { value: 'bong', _rev: '1-x' } } } } )
        let res
        const output = { save ( arg ) { res = arg } }

        setAction
        ( { state
          , input: { path: [ 'data', 'main', 'foo', 'value' ], value: 'bing' }
          , output
          }
        )

        assert.equal
        ( res
        , { path: [ 'data', 'main', 'foo', 'value' ]
          , value: 'bing'
          }
        )
      }
    )
  }
)
