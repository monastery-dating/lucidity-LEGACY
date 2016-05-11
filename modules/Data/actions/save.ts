const action =
( { state, services: { data: { db } }, output, input }
) => {
  const pid =
  state.get ( [ 'data', 'main', 'projectId', 'value' ] )

  db.put
  ( input
  , ( err ) => {
      if ( err ) {
        output.error ( { type: 'error', message: err } )
      }
      else {
        if ( pid !== input._id ) {
          db.put
          ( { _id: 'projectId'
            , type: 'main'
            , value: input._id
            }
          , ( err ) => {
              if ( err ) {
                console.log ( err )
                output.error ( { error: err } )
              }
              else {
                output.success ( {} )
              }
            }
          )

        }
        output.success ( {} )
      }
    }
  )
}

action [ 'async' ] = true

export default action
