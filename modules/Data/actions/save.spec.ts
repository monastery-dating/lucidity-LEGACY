import { DataServicesType } from '../../Data'
import { describe } from '../../Test/runner'
import { saveAction } from './save'
import * as Baobab from 'baobab'

describe
( 'Data save action', ( it ) => {
    it ( 'should save to db', ( assert ) => {
        const state = new Baobab
        ( { project: { _id: 'foobar' }
          }
        )

        let res
        const output =
        { success ( args ) { res = args }
        }
        const put = ( doc, clbk ) => clbk ()

        const data : DataServicesType =
        { db: { put } }
        const services = { data }

        saveAction
        ( { state
          , output
          , services
          , input: { doc: { type: 'foobar', name: 'newname' } }
          }
        )

        assert.equal
        ( res
        , { status: { type: 'success', message: 'Saved foobar' } }
        )
      }
    )

    it ( 'should send error out', ( assert ) => {
        const state = new Baobab
        ( { project: { _id: 'foobar' }
          }
        )

        let res
        const output =
        { error ( args ) { res = args }
        }
        const put = ( doc, clbk ) => clbk ( 'no good' )

        const services = { data: { db : { put } } }

        saveAction ( { state, output, services, input: { doc: { name: 'newname' } } } )

        assert.equal
        ( res
        , { status: { type: 'error', message: 'no good' } }
        )
      }
    )
  }
)
