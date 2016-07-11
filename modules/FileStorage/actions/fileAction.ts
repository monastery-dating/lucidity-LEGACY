import { ActionContextType } from '../../context.type'
import { GraphType, Immutable as IM, rootNodeId } from '../../Graph'
import { updateGraphSource } from '../../Graph/helper/GraphHelper'
import { FileChanged } from '../helper/types'

const nameRe = /^\d*\s*(.+)\.ts$/
/** A file changed in FS
 */
export const fileAction =
( { state
  , input
  , output
  } : ActionContextType
) => {
  const msg: FileChanged = input
  const odoc = state.get ( [ 'data', msg.type, msg._id ] )
  if ( !odoc ) {
    output.error
    ( { status:
        { type: 'error'
        , message: `Cannot sync with filesystem (${msg.type} not found in data).`
        }
      }
    )
    return
  }

  const ograph: GraphType = odoc.graph
  const nodesById = ograph.nodesById

  if ( msg.op === 'rename' ) {
    // name changed
    const doc = IM.update
    ( odoc, 'graph', 'blocksById', msg.blockId, 'name', msg.name )
    output.success ( { doc } )
  }

  else if ( msg.sourceName ) {
    const doc = IM.update
    ( odoc, 'graph', 'blocksById', msg.blockId, 'sources', msg.sourceName, msg.source )
    output.success ( { doc } )
  }

  else {
    // source changed
    updateGraphSource ( ograph, msg.blockId, msg.source, ( errors, graph ) => {
      if ( errors ) {
        output.error ( { status: { type: 'error', message: errors [ 0 ].message } } )
      }
      else {
        const doc = IM.update ( odoc, 'graph', graph )
        output.success ( { doc } )
      }
    })
  }
}

fileAction [ 'async' ] = true
