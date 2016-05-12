import { describe } from '../../Test/runner'
import edit from './edit'
import * as Baobab from 'baobab'

describe
( 'Project edit action', ( it ) => {
    it ( 'should set $project/editing to true', ( assert ) => {
        const state = new Baobab
        ( { $project: { editing: false, title: 'Foo' } } )

        edit ( { state } )

        assert.equal
        ( state.get ()
        , { $project: { editing: true, title: 'Foo' } }
        )
      }
    )
  }
)
