import { describe } from '../../Test/runner'
import set from './set'
import * as Baobab from 'baobab'

describe
( 'Status set action', ( it ) => {
    it ( 'should set status in state', ( assert ) => {
        const state = new Baobab
        ( { $status: [] } )

        set ( { state, input: { type: 'success', message: 'Good' } } )

        assert.equal
        ( state.get ()
        , { $status: [ { type: 'success', message: 'Good' } ] }
        )
      }
    )
  }
)
