import { NodeType, NodeIOType, NodeTypeChanges } from './node.type'
import { SlotType } from './slot.type'
import { merge } from '../util/merge.util'

export const create = function
( name: string
, source: string
, basePath: string
) : NodeType
{
  const typeInfo = getType ( source )
  const path = `${basePath}/${name}.ts`

  return merge ( { type: 'Node'
                 , name
                 , path
                 , source
                 }
                , typeInfo
               )
}

export const update = function
( node: NodeType
, changes: NodeTypeChanges
) : NodeType
{
  const newobj = merge ( node, changes )
  if ( changes.source ) {
    const typeInfo = getType ( changes.source )
    return merge ( newobj, typeInfo )
  }
  else {
    return newobj
  }
}

const getType = function
( source: string
) : NodeIOType
{
  // TODO: parse source and read 'render' signature
  return { input: [ 'text:string', 'text:string' ]
         , output: 'text:string'
         , init: false
         }
}
