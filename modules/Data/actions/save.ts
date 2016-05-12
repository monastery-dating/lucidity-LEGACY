const action =
( { state, services: { data: { db } }, output, input }
) => {
  const pid =
  state.get ( [ 'project', '_id' ] )

  db.put
  ( input
  , ( err ) => {
      if ( err ) {
        output.error ( { type: 'error', message: err } )
      }
      else {
        if ( pid !== input._id ) {
          // Saving new project, write id as selected project
          // FIXME: this belongs in a new action
          // { _id: selectedId } ==> selectProject
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
