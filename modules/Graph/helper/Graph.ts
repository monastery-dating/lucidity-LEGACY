import { Block } from './Block'
import { GraphType, BlockType, NodeType
       , BlockIOType, SlotType } from '../types'

import { Immutable as IM } from './immutable'

const newNode = function
( id: string
, parentId: string
) : NodeType
{
  return Object.freeze ( { id, parent: parentId || null, children: [] } )
}

export module Graph {

  export const create = function
  ( block: BlockType
  , anid?: string
  , parentId?: string
  ) : GraphType
  {
    const id = anid || Block.rootNodeId
    return Object.freeze
    ( { blocksById: Object.freeze ( { [ id ]: block } )
      , nodesById: Object.freeze ( { [ id ]: newNode ( id, parentId ) } )
      , nodes: Object.freeze ( [ id ] )
      }
    )
  }

  export const insert = function
  ( graph: GraphType
  , parentId: string
  , pos: number
  , child: BlockType
  ) : GraphType
  {
    const id = Block.nextNodeId ( graph.blocksById )
    let g = graph
    // new information for the added element
    g = IM.update ( g, 'blocksById', id, child )
    g = IM.update ( g, 'nodesById', id, newNode ( id, parentId ) )
    g = IM.update ( g, 'nodesById', parentId, 'children'
    , ( children ) => IM.insert ( children, pos, id )
    )
    g = IM.update ( g, 'nodes'
    , ( nodes ) => IM.append ( nodes, id )
    )
    return g
  }

  export const append = function
  ( graph: GraphType
  , parentId: string
  , child: BlockType
  ) : GraphType
  {
    return insert ( graph, parentId, -1, child )
  }

}
