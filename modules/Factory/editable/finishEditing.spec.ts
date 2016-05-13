import { describe } from '../../Test/runner'
import { finishEditing } from './finishEditing.action'
import * as Baobab from 'baobab'

describe
( 'Factory finish editing', ( it ) => {
    it ( 'should prepare for save', ( assert ) => {
        const state = new Baobab
        ( { $factory:
            { project: { editing: true, title: 'Foo' }
            }
          , project: { title: 'bong' }
          }
        )

        const input = { path: [ 'project', 'title' ], value: 'newTitle' }
        let res
        const output =
        { success: ( e ) => { res = e }
        }

        finishEditing ( { state, input, output } )

        assert.equal
        ( typeof res.doc._id
        , 'string'
        )

        assert.equal
        ( res.doc
        , { type: 'project'
          , _id: res.doc._id
          , title: 'newTitle'
          }
        )

        assert.equal
        ( state.get ( [ 'project', 'title' ] )
        , 'bong' // not yet saved/changed
        )

        assert.equal
        ( state.get ( [ '$factory', 'project', 'title', 'value' ] )
        , 'newTitle' // temporary displayed value
        )

        assert.equal
        ( state.get ( [ '$factory', 'project', 'title', 'saving' ] )
        , true
        )

        assert.equal
        ( state.get ( [ '$factory', 'editing' ] )
        , false
        )
      }
    )
  }
)
