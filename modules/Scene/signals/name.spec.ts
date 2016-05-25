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

        // FIXME
        const send = signalTest
        ( { other: 'data'
          , $factory: { editing: 'foo-bar' }
          }
        , name
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

    it ( 'should select project', ( assert, done ) => {
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

        // FIXME
        const send = signalTest
        ( { other: 'data'
          , $factory: { editing: 'foo-bar' }
          }
        , name
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
