import { name } from './name'
import { describe } from '../../Test'
import { signalTest } from '../../Test'

describe
( 'Project name signal', ( it ) => {

    it ( 'should set project name', ( assert, done ) => {
        const docs = []
        const services =
        { data:
          { db:
            { bulkDocs ( d, clbk ) {
                d.forEach ( ( e ) => docs.push ( e ) )
                clbk ()
              }
            }
          }
        }

        const send = signalTest
        ( { other: 'data'
          , $factory: { editing: 'foo-bar' }
          }
        , name
        , services
        )

        send
        ( { value: 'John Difool'
          }
        , ( state ) => {

            assert.equal
            ( state.get ( [ 'project', 'name' ] )
            , 'John Difool' // not yet saved/changed
            )

            assert.equal
            ( state.get ( [ '$factory', 'project', 'name', 'value' ] )
            , 'John Difool' // temporary displayed value
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

  }
)
