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
  const odoc = state.get ( [ 'data', msg.ownerType, msg._id ] )
  if ( !odoc ) {
    output.error
    ( { status:
        { type: 'error'
        , message: `Cannot sync with filesystem (${msg.ownerType} not found in data).`
        }
      }
    )
    return
  }


  // path = scenes/Intro/main/1 foo/2 bar.ts
  const path = msg.path.split ( '/' )
  if ( msg.ownerType === 'scene' ) {
    // remove 'scenes'
    path.shift ()
  }
  // path = Intro/main/1 foo/2 bar.ts
  // remove scene or project name
  const filename = path.shift ()
  // path = main/1 foo/2 bar.ts
  if ( path.length === 0 ) {
    // FIXME .lucy changes
    output.error
    ( { status:
        { type: 'error'
        , message: 'Changes to .lucy files not implemented yet.'
        }
      }
    )
    return
  }

  const ograph: GraphType = odoc.graph
  const nodesById = ograph.nodesById
  let nodeId = rootNodeId
  path.shift ()
  // path = 1 foo/2 bar.ts
  console.log ( path, 'START' )
  while ( nodeId && path.length > 0 ) {
    const filename = path.shift ()
    const idx = parseInt ( filename ) - 1
    const node = nodesById [ nodeId ]
    nodeId = ( node.children || [] ) [ idx ]
    console.log ( path, filename, idx, nodeId )
  }

  if ( !nodeId ) {
    output.error
    ( { status:
        { type: 'error'
        , message: `Could not sync source for '${msg.path}' (node not found).`
        }
      }
    )
    return
  }
  const node = ograph.nodesById [ nodeId ]

  if ( msg.op === 'rename' ) {
    // name changed
    console.log ( 'rename', msg.name )
    const re = nameRe.exec ( msg.name )
    if ( re ) {
      const doc = IM.update
      ( odoc, 'graph', 'blocksById', node.blockId, 'name', re [ 1 ] )
      output.success ( { doc } )
    }
    else {
      output.error
      ( { status:
          { type: 'error'
          , message: `Could not rename node (invalid file name '${msg.name}').`
          }
        }
      )
    }
  }

  else {
    // source changed
    updateGraphSource ( ograph, node.blockId, msg.source, ( errors, graph ) => {
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
