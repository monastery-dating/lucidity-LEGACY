import { describe } from '../../Test/runner'
import { expect } from 'chai'
import set from './set'
import * as Baobab from 'baobab'

describe
( 'Status set action', ( it ) => {
    it ( 'should set status in state', () => {
        const state = new Baobab
        ( { status: { type: 'foo', message: 'bar' } } )

        set ( { state, input: { type: 'ok', message: 'Good' } } )

        expect ( state.get () ).deep.equal
        ( { status: { type: 'ok', message: 'Good' } } )
      }
    )
  }
)
