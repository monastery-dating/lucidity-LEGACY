export const saved =
( { state, input: { saved } } ) => {
  if ( saved ) {
    const close = state.get ( [ '$factory', saved, 'close' ] )
    if ( close ) {
      // Clear all 'saving' flags
      state.unset ( [ '$factory', saved ] )
      // Clear drop after saving 'scene' or 'project'.
      state.unset ( [ '$dragdrop', 'drop' ] )
    }

    if ( saved === 'project' || saved === 'scene' ) {
      // Clear block operation
      const close = state.get ( [ '$factory', 'block', 'close' ] )

      if ( close ) {
        state.unset ( [ '$factory', 'block' ] )
      }

      // Edit name after creation
      const id = state.get ( '$factory.block.add' )
      if ( id ) {
        state.unset ( '$factory.block.add' )
        state.set ( '$block', { id, ownerType: saved } )
        state.set ( '$factory.block.name', true )
      }
    }
  }
}
