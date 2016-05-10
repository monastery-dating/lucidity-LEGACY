import { describe } from '../../Test/runner'
import saving from './saving'
import * as Baobab from 'baobab'

describe
( 'Project saving action', ( it ) => {
    it ( 'should set $saving and $editing', ( assert ) => {
        const state = new Baobab
        ( { project: { $editing: true, title: 'Foo' } } )

        saving ( { state } )

        assert.equal
        ( state.get ()
        , { project: { $editing: false, $saving: true, title: 'Foo' } }
        )
      }
    )
  }
)
