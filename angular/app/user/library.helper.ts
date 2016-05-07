import { NodeType, NodeMapType } from '../types/node.type'
import { nextNodeId } from '../types/node.helper'
import { LibraryType } from './library.type'
import * as IM from '../util/merge.util'

const sortFunc = function
( nodesById: NodeMapType
) : ( a: string, b: string ) => number {
  return function ( a, b ) {
    const an = nodesById [ a ].name
    const bn = nodesById [ b ].name
    if ( an < bn ) {
      return -1
    }
    else if ( an > bn ) {
      return 1
    }
    else {
      return 0
    }
  }
}

export const create = function
( path: string
) : LibraryType {
  return Object.freeze
  ( { path
    , nodes: Object.freeze ( [] )
    , nodesById: Object.freeze ( {} )
    }
  )
}

export const add = function
( library: LibraryType
, node: NodeType
) : LibraryType {
  const id = nextNodeId ( library.nodesById )
  const l = IM.update ( library, 'nodesById', id, node )
  const sfunc = sortFunc ( l.nodesById )
  return IM.update ( l, 'nodes', ( n ) => IM.append
    ( n, id
    , ( a, b ) => sfunc ( a, b )
    )
  )
}

export const rename = function
( library: LibraryType
, id: string
, name: string
) : LibraryType {
  const l = IM.update ( library, 'nodesById', id, 'name', name )
  const sfunc = sortFunc ( l.nodesById )
  const nodes = IM.sort
  ( l.nodes
  , ( a, b ) => sfunc ( a, b )
  )
  return IM.update ( l, 'nodes', nodes )
}
