import { Node } from './node.helper'
import { GraphType, LinkType, NodeType
       , NodeIOType, SlotType } from '../types'

import { Immutable as IM } from './immutable'

const newLink = function
( id: string
, parentId: string
) : LinkType
{
  return Object.freeze ( { id, parent: parentId || null, children: [] } )
}

export module Graph {

  export const create = function
  ( node: NodeType
  , anid?: string
  , parentId?: string
  ) : GraphType
  {
    const id = anid || Node.rootNodeId
    return Object.freeze
    ( { nodesById: Object.freeze ( { [ id ]: node } )
      , linksById: Object.freeze ( { [ id ]: newLink ( id, parentId ) } )
      , nodes: Object.freeze ( [ id ] )
      }
    )
  }

  export const insert = function
  ( graph: GraphType
  , parentId: string
  , pos: number
  , child: NodeType
  ) : GraphType
  {
    const id = Node.nextNodeId ( graph.nodesById )
    let g = graph
    // new information for the added element
    g = IM.update ( g, 'nodesById', id, child )
    g = IM.update ( g, 'linksById', id, newLink ( id, parentId ) )
    g = IM.update ( g, 'linksById', parentId, 'children'
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
  , child: NodeType
  ) : GraphType
  {
    return insert ( graph, parentId, -1, child )
  }

}
