import { describe } from '../../Test/runner'
import set from './set'
import * as Baobab from 'baobab'

describe
( 'Status set action', ( it ) => {
    it ( 'should set status in state', ( assert ) => {
        const state = new Baobab
        ( { status: { type: 'foo', message: 'bar' } } )

        set ( { state, input: { type: 'ok', message: 'Good' } } )

        assert.equal
        ( state.get ()
        , { status: { type: 'ok', message: 'Good' } }
        )
      }
    )
  }
)
