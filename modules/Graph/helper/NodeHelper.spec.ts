import { describe } from '../../Test/runner'
import { NodeType, NodeByIdType } from '../types'
import { createNode, nextNodeId } from './NodeHelper'

describe ( 'createNode', ( it ) => {

    it ( 'should set defaults', ( assert ) => {
        const node = createNode ( 'blockxx', 'n0', 'pa')
        assert.equal
        ( node
        , { id: 'n0'
          , blockId: 'blockxx'
          , parent: 'pa'
          , children: []
          }
        )
      }
    )

    it ( 'should set values', ( assert ) => {
        const node = createNode
        ( 'blockxx' , 'id99', 'n0', [ 'id7', 'id8' ] )
        assert.equal
        ( node
        , { id: 'id99'
          , blockId: 'blockxx'
          , parent: 'n0'
          , children: [ 'id7', 'id8' ]
          }
        )
      }
    )

  }
)

describe ( 'nextNodeId', ( it ) => {
    it ( 'should return id0 on empty map', ( assert ) => {
        assert.equal
        ( nextNodeId ( {} )
        , 'n0'
        )
      }
    )

    it ( 'should return first free in graph', ( assert ) => {
        const n = createNode ( 'foo', '', '' )
        assert.equal
        ( nextNodeId ( <NodeByIdType> { n0: n, n3: n } )
        , 'n1'
        )
      }
    )
  }
)
