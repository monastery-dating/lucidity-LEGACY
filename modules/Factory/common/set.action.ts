import * as check from 'check-types'

export const setAction =
( { state
  , input: { path, value }
  , output
  }
) => {
  if ( path [ 0 ] === 'data' ) {
    // this is a save
    output.save ( { path, value } )
  }
  else {
    // we could write this even during a save for faster UI ops
    state.set ( path, value )
  }
}

setAction [ 'input' ] =
{ path: check.array.of.string
, value: check.assigned
}

setAction [ 'outputs' ] = [ 'save' ]
