import { describe } from '../../Test/runner'
import { setAction } from './set.action'
import * as Baobab from 'baobab'

describe
( 'Factory set action', ( it ) => {
    it ( 'should push to db', ( assert ) => {
        const state = new Baobab
        ( { foo: { bar: true, bing: 'bong' } } )

        setAction ( { state, input: { path: [ 'foo', 'bar' ], value: 'baz' } } )

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
