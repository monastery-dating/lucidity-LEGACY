import { NodeType, NodeIOType } from './node.type'
import { GraphType } from './graph.type'
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

export const create = function
( node: NodeType
, anid?: string
, parentId?: string
) : GraphType
{
  const id = anid || rootGraphId
  return IM.merge
  ( { nodes:
      Object.freeze (
        { [ id ]: node }
      )
    , links:
      Object.freeze (
        { [ id ]: Object.freeze ( { id, parent: parentId || null, children: [] } ) }
      )
    }
  , {}
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
  // new information for the added element
  const childgraph = create ( child, id, parentId )
  let nodes = IM.merge ( graph.nodes, childgraph.nodes )
  let links = IM.merge ( graph.links, childgraph.links )
  // update existing graph
  const plink = graph.links [ parentId ]
  const children = IM.insert ( plink.children, pos, id )
  const nplink = IM.merge ( plink, { children } )

  // update parent link info
  links = IM.merge ( links, { [ parentId ]: nplink } )
  // merge updated graph with child graph
  return Object.freeze ( { nodes, links })
}

export const append = function
( graph: GraphType
, parentId: string
, child: NodeType
) : GraphType
{
  return insert ( graph, parentId, -1, child )
}
