import { finishedEditing } from './finishedEditing.signal'
import { describe } from '../../Test'
import { signalTest } from '../../Test'

describe
( 'Factory finished editing signal', ( it ) => {

    it ( 'should save', ( assert, done ) => {
        const services =
        { data: { db: { put ( e, clbk ) { clbk () } } }
        }
        const send = signalTest
        ( { other: 'data'
          , $factory: { editing: 'foo-bar' }
          }
        , finishedEditing 
        , services
        )

        send
        ( { path: [ 'user', 'name' ]
          , value: 'John Difool'
          }
        , ( state ) => {
            assert.equal
            ( state.get ()
            , { other: 'data'
              , $factory:
                { editing: false
                , user:
                  { name:
                    { saving: true
                    , value: 'John Difool'
                    }
                  }
                }
              }
            )
            done ()
            // async test done
          }
        )
      }
    )
  }
)
