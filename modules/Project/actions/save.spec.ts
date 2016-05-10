import { describe } from '../../Test/runner'
import save from './save'
import * as Baobab from 'baobab'

describe
( 'Project save action', ( it ) => {
    it ( 'should set $saveing to true', ( assert ) => {
        assert.pending ( 'Need async testing support..' )
        const state = new Baobab
        ( { project: { $editing: true, $saving: false, title: 'Foo' } } )

        save ( { state } )

        assert.equal
        ( state.get ()
        , { project: { $editing: false, $saving: true, title: 'Foo' } }
        )
      }
    )
  }
)
