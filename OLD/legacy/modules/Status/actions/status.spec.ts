import { describe } from '../../Test/runner'
import { status, resetRef
       , MAX_STATUS_HISTORY
       , MIN_STATUS_HISTORY
       , HISTORY_PATH }  from './status'
import * as Baobab from 'baobab'

describe
( 'Status set action', ( it ) => {
    it ( 'should set status in state', ( assert ) => {
        resetRef ()
        const state = new Baobab
        ( { $status: { list: [] } } )

        status
        ( { state
          , input:
            { status:  { type: 'success', message: 'Good' } }
          }
        )

        assert.equal
        ( state.get ( HISTORY_PATH )
        , [ { type: 'success', message: 'Good', ref: 1 }
          ]
        )
      }
    )

    it ( 'should not grow history beyond max', ( assert ) => {
        resetRef ()
        const list = []
        for ( let i = 0; i < MAX_STATUS_HISTORY; ++i ) {
          list.push ( { type: 'success', message: `${i}-message` } )
        }
        const state = new Baobab
        ( { $status: { list } } )

        status
        ( { state
          , input:
            { status:  { type: 'success', message: 'Good' } }
          }
        )

        const hist = state.get ( )
        assert.equal
        ( state.get ( HISTORY_PATH ).length
        , MIN_STATUS_HISTORY
        )
      }
    )

  }
)
