import { ActionContextType } from '../../context.type'
import { GraphType, Immutable as IM } from '../../Graph'
import { updateGraphSource } from '../../Graph/helper/GraphHelper'

export const sourcesAction =
( { state
  , input: { sources }
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

  // We might need to do type checking of other sources someday...

  const doc = IM.update
  ( odoc, 'graph', 'blocksById', select.id, 'sources', sources )

  output.success ( { doc } )
}

// sourcesAction [ 'async' ] = true
