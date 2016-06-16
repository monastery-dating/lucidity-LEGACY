import { ActionContextType } from '../../context.type'
import { GraphType, Immutable as IM } from '../../Graph'
import { GraphHelper } from '../../Graph/helper/GraphHelper'

export const sourceAction =
( { state
  , input: { value }
  , output
  } : ActionContextType
) => {

  const select = state.get ( [ '$block' ] )
  if ( !select ) {
    // no block visible
    return
  }

  const odoc = state.get ( select.ownerType )
  const graph: GraphType = odoc.graph

  const source = graph.blocksById [ select.id ].source
  if ( source === value ) {
    output.error ( {} )
    return
  }

  try {
    // updateSource throws an exception if the source is invalid.
    // FIXME: Bubble this error up to state => Editor
    const doc = IM.update
    ( odoc, 'graph'
    , GraphHelper.updateSource ( graph, select.id, value )
    )
    output.success ( { doc } )
  }
  catch ( err ) {
    console.log ( err )
  }

}
