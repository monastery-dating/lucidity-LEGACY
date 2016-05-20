import { NodeType, NodeByIdType, NodeIOType
       , NodeTypeChanges, SlotType } from '../types'
import { Immutable as IM } from './immutable'



export module Node {
  export const nextNodeId =
  ( nodesById: NodeByIdType
  ) : string => {
    let n : number = 0
    while ( nodesById [ `id${n}` ] ) {
      n += 1
    }
    return `id${n}`
  }

  export const rootNodeId = nextNodeId ( {} )

  export const create =
  ( name: string
  , source: string
  , basePath: string
  ) : NodeType => {
    const typeInfo = getType ( source )
    const path = `${basePath}/${name}.ts`

    return IM.merge
    ( { type: 'Node'
      , name
      , path
      , source
      }
    , typeInfo
    )
  }

  export const update =
  ( node: NodeType
  , changes: NodeTypeChanges
  ) : NodeType => {
    const newobj = IM.merge ( node, changes )
    if ( changes.source ) {
      const typeInfo = getType ( changes.source )
      return IM.merge ( newobj, typeInfo )
    }
    else {
      return newobj
    }
  }

  const getType =
  ( source: string
  ) : NodeIOType => {
    // TODO: parse source and read 'render' signature
    return { input: [ 'text:string', 'text:string' ]
           , output: 'text:string'
           , init: false
           }
  }

}
