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

  }
)
