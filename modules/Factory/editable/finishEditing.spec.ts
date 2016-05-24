import { describe } from '../../Test/runner'
import { finishEditing } from './finishEditing.action'
import * as Baobab from 'baobab'

describe
( 'Factory finish editing', ( it ) => {
    it ( 'should prepare for save', ( assert ) => {
        const state = new Baobab
        ( { $factory:
            { project: { editing: true, name: 'Foo' }
            }
          , project: { name: 'bong' }
          }
        )

        const input = { path: [ 'project', 'name' ], value: 'newName' }
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
          , name: 'newName'
          }
        )

        assert.equal
        ( state.get ( [ 'project', 'name' ] )
        , 'bong' // not yet saved/changed
        )

        assert.equal
        ( state.get ( [ '$factory', 'project', 'name', 'value' ] )
        , 'newName' // temporary displayed value
        )

        assert.equal
        ( state.get ( [ '$factory', 'project', 'name', 'saving' ] )
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
