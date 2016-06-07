export const saved =
( { state, input: { saved } } ) => {
  if ( saved ) {
    // clear all 'saving' flags on props if main object is saved
    state.unset ( [ '$factory', saved ] )
    // end of drop operation: clear
    state.unset ( [ '$dragdrop', 'drop' ] )
  }
}
