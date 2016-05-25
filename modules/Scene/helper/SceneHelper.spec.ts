import { describe } from '../../Test/runner'
import { SceneHelper } from './SceneHelper'
import { BlockType, GraphHelper } from '../../Graph'

describe ( 'SceneHelper.create', ( it ) => {

    it ( 'should return block and scene docs', ( assert ) => {
        const { scene, block } = SceneHelper.create ()
        const graph = GraphHelper.create ( <BlockType> block )

        assert.equal
        ( scene
        , { _id: scene._id ? scene._id : 'bad'
          , type: 'scene'
          , graph
          }
        )

      }
    )

  }
)
