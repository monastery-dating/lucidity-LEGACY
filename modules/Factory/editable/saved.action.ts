export const saved =
( { state, input: { saved } } ) => {
  if ( saved ) {
    console.log ( 'SAVED', saved )
    // clear all 'saving' flags on props if main object is saved
    state.unset ( [ '$factory', saved ] )
  }
}
