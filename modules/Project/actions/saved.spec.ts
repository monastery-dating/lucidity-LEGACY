import { describe } from '../../Test/runner'
import saved from './saved'
import * as Baobab from 'baobab'

describe
( 'Project saved action', ( it ) => {
    it ( 'should set $saving to false', ( assert ) => {
        const state = new Baobab
        ( { project: { $saving: true, title: 'Foo' } } )

        saved ( { state } )

        assert.equal
        ( state.get ()
        , { project: { $saving: false, title: 'Foo' } }
        )
      }
    )
  }
)
