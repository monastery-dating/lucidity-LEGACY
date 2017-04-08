import { BlockType } from '../../Block'
import { describe } from '../../Test/runner'
import { createScene } from './SceneHelper'
import { createGraph } from '../../Graph'

describe ( 'createScene', ( it ) => {

  it ( 'should return block and scene docs', ( assert, done ) => {
    const scene =
    createScene ()
    .then ( ( scene ) => {

      createGraph ()
      .then ( ( graph ) => {
        assert.equal
        ( scene
        , { _id: scene._id ? scene._id : 'bad'
          , type: 'scene'
          , graph
          }
        )
      })

    })

  })
})
