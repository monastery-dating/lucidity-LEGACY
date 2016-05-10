import { describe } from '../../Test/runner'
import save from './save'
import * as Baobab from 'baobab'

describe
( 'Project save action', ( it ) => {
    it ( 'should set $saveing to true', ( assert, done ) => {
        const state = new Baobab
        ( { project: { $editing: true, $saving: false, title: 'Foo' } } )
        const output =
        { success ( args ) {
            assert.equal
            ( args
            , { save: 'ok' }
            )
            done ()
          }
        }

        save ( { state, output } )

        assert.equal
        ( state.get ()
        , { project: { $editing: false, $saving: true, title: 'Foo' } }
        )
      }
    )
  }
)
