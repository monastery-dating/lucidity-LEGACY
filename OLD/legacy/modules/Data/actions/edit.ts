const editables = ['project', 'scene', 'block']

export const edit =
( { state, input: { doc } } ) => {

  if ( doc && doc.type == 'user' ) {
    const editing = state.get ( [ '$factory', 'editing' ] )

    for ( const k of editables ) {
      // sceneId, blockId, projectId
      if ( doc [ `${k}Id` ] === editing ) {
        // trigger name edit
        state.set ( [ '$factory', 'editing' ], `${k}-name` )
        return
      }
    }
  }

}
