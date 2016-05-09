import { describe } from '../../Test/runner'
import clear  from './clear'
import * as Baobab from 'baobab'

describe
( 'Status clear action', ( it ) => {
    it ( 'should reset status in state', ( assert ) => {
        const state = new Baobab
        ( { status: { type: 'foo', message: 'bar' } } )

        clear ( { state } )

        assert.equal
        ( state.get ()
        , { status: { type: 'info', message: '' } }
        )
      }
    )
  }
)
