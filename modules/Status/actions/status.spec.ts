import { describe } from '../../Test/runner'
import { status }  from './status'
import * as Baobab from 'baobab'

describe
( 'Status set action', ( it ) => {
    it ( 'should set status in state', ( assert ) => {
        const state = new Baobab
        ( { $status: [] } )

        status
        ( { state
          , input:
            { status:  { type: 'success', message: 'Good' } }
          }
        )

        assert.equal
        ( state.get ()
        , { $status: [ { type: 'success', message: 'Good' } ] }
        )
      }
    )
  }
)
