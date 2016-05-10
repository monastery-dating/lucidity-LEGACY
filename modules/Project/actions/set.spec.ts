import { describe } from '../../Test/runner'
import set from './set'
import * as Baobab from 'baobab'

describe
( 'Project set action', ( it ) => {
    it ( 'should set status in state', ( assert ) => {
        const state = new Baobab
        ( { project: { title: 'foo' } } )

        set ( { state, input: { title: 'Gods of India' } } )

        assert.equal
        ( state.get ()
        , { project: { title: 'Gods of India' } }
        )
      }
    )
  }
)
