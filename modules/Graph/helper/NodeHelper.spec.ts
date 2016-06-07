import { describe } from '../../Test/runner'
import { NodeType, NodeByIdType } from '../types'
import { NodeHelper } from './NodeHelper'

describe ( 'NodeHelper.create', ( it ) => {

    it ( 'should set defaults', ( assert ) => {
        const node = NodeHelper.create ( 'blockxx', 'n0', 'pa')
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
        const node = NodeHelper.create
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

describe ( 'NodeHelper.nextNodeId', ( it ) => {
    it ( 'should return id0 on empty map', ( assert ) => {
        assert.equal
        ( NodeHelper.nextNodeId ( {} )
        , 'n0'
        )
      }
    )

    it ( 'should return first free in graph', ( assert ) => {
        const n = NodeHelper.create ( 'foo', '', '' )
        assert.equal
        ( NodeHelper.nextNodeId ( <NodeByIdType> { n0: n, n3: n } )
        , 'n1'
        )
      }
    )
  }
)
