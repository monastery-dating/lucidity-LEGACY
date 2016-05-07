import { NodeType, NodeIOType } from './node.type'
import { nextNodeId, rootNodeId } from './node.helper'
import { GraphType, LinkType } from './graph.type'
import { SlotType } from './slot.type'
import * as IM from '../util/merge.util'

const newLink = function
( id: string
, parentId: string
) : LinkType
{
  return Object.freeze ( { id, parent: parentId || null, children: [] } )
}

export const create = function
( node: NodeType
, anid?: string
, parentId?: string
) : GraphType
{
  const id = anid || rootNodeId
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
  const id = nextNodeId ( graph.nodesById )
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
