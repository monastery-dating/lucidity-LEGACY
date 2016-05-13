export const save =
( { state, services: { data: { db } }, output, input }
) => {

  db.put
  ( input.doc
  , ( err ) => {
      if ( err ) {
        output.error
        ( { status: { type: 'error', message: err } } )
      }
      else {
        output.success
        ( { status: { type: 'success', message: `Saved ${input.doc.type}` } } )
      }
    }
  )
}

save [ 'async' ] = true
