import { ContextType } from '../../context.type'
import { DataServicesType } from '../../Data'
import { describe } from '../../Test/runner'
import { save } from './save'
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

        save
        ( { state
          , output
          , services
          , input: { doc: { type: 'foobar', title: 'newtitle' } }
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

        save ( { state, output, services, input: { doc: { title: 'newtitle' } } } )

        assert.equal
        ( res
        , { status: { type: 'error', message: 'no good' } }
        )
      }
    )
  }
)
