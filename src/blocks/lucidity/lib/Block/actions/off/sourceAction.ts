/*
import { ActionContextType } from '../../context.type'
import { GraphType, Immutable as IM } from '../../Graph'
import { updateGraphSource } from '../../Graph/helper/GraphHelper'

export const sourceAction =
( { state
  , input: { source }
  , output
  } : ActionContextType
) => {

  const select = state.get ( [ '$block' ] )
  if ( !select ) {
    // no block visible
    return
  }

  const odoc = state.get ( select.ownerType )
  const ograph: GraphType = odoc.graph

  updateGraphSource ( ograph, select.id, source, ( errors, graph ) => {
    if ( errors ) {
      output.error ( { errors } )
    }
    else {
      const doc = IM.update ( odoc, 'graph', graph )
      output.success ( { doc } )
    }
  })
}

sourceAction [ 'async' ] = true
*/