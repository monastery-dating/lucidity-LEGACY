import { changed } from './changed.signal'
import { describe } from '../../Test'
import { signalTest } from '../../Test'

describe
( 'Factory changed signal', ( it ) => {

    it ( 'should save', ( assert, done ) => {
        const services =
        { data: { db: { put ( e, clbk ) { clbk () } } }
        }
        const send = signalTest
        ( { other: 'data'
          , $factory: { editing: 'foo-bar' }
          }
        , changed
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
              , $status:
                [ { type: 'success'
                  , message: 'Saved main'
                  }
                , { type: 'success'
                  , message: 'Saved user'
                  }
                ]
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
