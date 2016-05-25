import { describe } from '../../Test/runner'
import { SceneHelper } from './SceneHelper'
import { BlockType, GraphHelper } from '../../Graph'

describe ( 'SceneHelper.create', ( it ) => {

    it ( 'should return block and scene docs', ( assert ) => {
        const docs = SceneHelper.create ( { _id: 'foo', type: 'scene' } )
        assert.equal
        ( docs.length
        , 2
        )

        assert.equal
        ( docs [ 0 ]
        , {
          }
        )

        const graph = GraphHelper.create ( <BlockType>docs [ 0 ] )

        assert.equal
        ( docs [ 1 ]
        , { _id: 'foo'
          , type: 'scene'
          , graph
          }
        )

      }
    )

  }
)
