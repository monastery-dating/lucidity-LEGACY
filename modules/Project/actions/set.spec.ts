import { describe } from '../../Test/runner'
import set from './set'
import * as Baobab from 'baobab'

describe
( 'Project set action', ( it ) => {
    it ( 'should push to db', ( assert ) => {
        const state = new Baobab
        ( { $project: { editing: true, saving: false, title: 'Foo' } } )
        const output =
        { success ( args ) {
            assert.equal
            ( args.title
            , 'newtitle'
            )
          }
        }

        set ( { state, output, input: { title: 'newtitle' } } )

        assert.equal
        ( state.get ()
        , { $project:
            { editing: false
            , saving: true
              // set to avoid UI flicker with revert to old title during save
            , title: 'newtitle'
            }
          }
        )
      }
    )

    it ( 'should not save if title same', ( assert ) => {
        const state = new Baobab
        ( { project: { title: 'foo' } } )

        const output =
        { success ( args ) {
          console.log ( 'success called' )
            assert.equal
            ( args
            , { save: 'ok' }
            )
          }
        }

        set ( { state, output, input: { title: 'foo' } } )

        assert.equal
        ( state.get ()
        , { $project: { editing: false }
          , project: { title: 'foo' } }
        )
      }
    )
  }
)
