import { NodeType, NodeIOType } from './node.type'
import { GraphType, LinkType } from './graph.type'
import { SlotType } from './slot.type'
import * as IM from '../util/merge.util'

export const nextGraphId = function
( graph : GraphType
) : string {
  const nodes = graph.nodes
  let n : number = 0
  while ( nodes [ `id${n}` ] ) {
    n += 1
  }
  return `id${n}`
}

export const rootGraphId = nextGraphId ( <GraphType> { nodes: {}} )

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
  const id = anid || rootGraphId
  return Object.freeze
  ( { nodes: Object.freeze ( { [ id ]: node } )
    , links: Object.freeze ( { [ id ]: newLink ( id, parentId ) } )
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
  const id = nextGraphId ( graph )
  let g = graph
  // new information for the added element
  g = IM.update ( g, 'nodes', id, child )
  g = IM.update ( g, 'links', id, newLink ( id, parentId ) )
  g = IM.update ( g, 'links', parentId, 'children'
  , ( children ) => IM.insert ( children, pos, id )
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
