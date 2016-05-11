import { describe } from '../../Test/runner'
import save from './save'
import * as Baobab from 'baobab'

describe
( 'Data save action', ( it ) => {
    it ( 'should save to db', ( assert ) => {
        const state = new Baobab
        ( { project: { $editing: true, $saving: false, title: 'Foo' }
          , data: { main: { projectId: { value: 'foobar' } } }
          }
        )

        let res
        const output =
        { success ( args ) { res = args }
        , error ( args ) { res = args }
        }
        const put = ( doc, clbk ) => clbk ()

        const services = { data: { db : { put } } }

        save ( { state, output, services, input: { title: 'newtitle' } } )

        assert.equal
        ( res
        , {}
        )
      }
    )

    it ( 'should send error out', ( assert ) => {
        const state = new Baobab
        ( { project: { $editing: true, $saving: false, title: 'Foo' }
          , data: { main: { projectId: { value: 'foobar' } } }
          }
        )

        let res
        const output =
        { success ( args ) { res = args }
        , error ( args ) { res = args }
        }
        const put = ( doc, clbk ) => clbk ( 'no good' )

        const services = { data: { db : { put } } }

        save ( { state, output, services, input: { title: 'newtitle' } } )

        assert.equal
        ( res
        , { type: 'error', message: 'no good' }
        )
      }
    )
  }
)
