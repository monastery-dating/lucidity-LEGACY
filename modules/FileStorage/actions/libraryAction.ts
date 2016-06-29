import { ActionContextType } from '../../context.type'
import { FileChanged } from '../helper/types'
import { createGraph, updateGraphSource } from '../../Graph/helper/GraphHelper'
import { Immutable as IM, rootNodeId } from '../../Graph'
import { createComponent } from '../../Library'

const nameRe = /^(.+)\.ts$/

export const libraryAction =
( { state
  , input
  , output
  } : ActionContextType
) => {
  const msg: FileChanged = input
  const paths = msg.path.split ( '/' )
  if ( paths.length > 1 ) {
    output.error
    ( { status: { type: 'error', message: 'complex component import not implemented yet.' } } )
    return
  }
  const re = nameRe.exec ( paths [ 0 ] )
  if ( re ) {
    const name = re [ 1 ]
    const comps = state.get ( [ 'data', 'component' ] )
    let odoc
    if ( msg._id ) {
      odoc = comps [ msg._id ]
      if ( !odoc ) {
        const message = `Sync error (unknown component id).`
        output.error ( { status: { type: 'error', message } } )
        return
      }
    }

    else {
      for ( const _id in comps ) {
        const comp = comps [ _id ]
        if ( comp.name === name ) {
          odoc = comp
          break
        }
      }
    }

    if ( odoc ) {
      // update
      if ( msg.op === 'rename' ) {
        const doc = IM.update ( odoc, 'name', name )
        output.success ( { doc } )
      }

      else {
        // FIXME: This would have to be fixed on update of complex components
        const node = odoc.graph.nodesById [ rootNodeId ]

        updateGraphSource ( odoc.graph, node.blockId, msg.source, ( errors, graph ) => {
          if ( errors ) {
            output.error
            ( { status: { type: 'error', message: errors [ 0 ].message } } )
          }
          else {
            const doc = IM.update ( odoc, 'graph', graph )
            output.success ( { doc } )
          }
        })
      }

    }
    else {
      // FIXME: This would have to be fixed on update of complex components
      // create
      createGraph ( name, msg.source )
      .then ( ( graph ) => {
          const doc = createComponent ( graph )
          output.success ( { doc } )
        }
      )
      .catch ( ( errors ) => {
        const message = errors [ 0 ].message
        output.error ( { status: { type: 'error', message } } )
      })
    }
  }

  else {
    const message = `Cannot import component (invalid component path '${msg.path}').`
    output.error ( { status: { type: 'error', message } } )
  }
}

libraryAction [ 'async' ] = true
