import { ActionContextType } from '../../context.type'
import { GraphType } from '../../Graph'
import { Immutable as IM } from '../../Graph/helper/Immutable'
// FIXME: why is this 'undefined' if imported from 'Graph' above ?
import { createGraph, insertGraph } from '../../Graph/helper/GraphHelper'
import { rootBlockId } from '../../Block/BlockType'
import { BlockAddOperationType } from '../'
import { MAIN_SOURCE } from '../../Block/helper/BlockHelper'

export const addAction =
( { state
  , input
  , output
  } : ActionContextType
) => {
  const { pos, parentId, ownerType, componentId } =
  <BlockAddOperationType>input
  const owner = state.get ( [ ownerType ] )

  const doit = ( child ) => {
    const graph = insertGraph ( owner.graph, parentId, pos, child )
    const ownerupdate = Object.assign ( {}, owner, { graph } )

    let editname
    if ( state.get ( '$block' ) ) {
      const nid = graph.nodesById [ parentId ].children [ pos ]
      const id = graph.nodesById [ nid ].blockId
      // if editor is open, start editing name
      editname = id
    }

    output.success ( { doc: ownerupdate, editname } )
  }

  let child: GraphType
  if ( componentId ) {
    const child =
    state.get ( [ 'data', 'component', componentId ] ).graph
    doit ( child )
  }
  else {
    // if we have a block named 'default' in library, we use this
    const library = state.get ( [ 'data', 'component' ] )
    for ( const k in library ) {
      if ( library [ k ].name === 'default' ) {
        child = IM.update
        ( library [ k ].graph
        , 'blocksById', rootBlockId, 'name', 'new block' )
        break
      }
    }
    if ( !child ) {
      createGraph ( 'new block' )
      .then ( ( child ) => {
        doit ( child )
      })
      .catch ( ( errors ) => {
        output.errors ( { errors } )
      })
    }
    else {
      doit ( child )
    }
  }
}

addAction [ 'async' ] = true
