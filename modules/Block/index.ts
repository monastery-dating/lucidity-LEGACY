export interface BlockSignalsType {
  add ( input: { pos: number, parentId: string, ownerType: string } )
  name ( input: { value: string } )
  select ( input: { select: { ownerType: string, id: string } } )
  source ( input: { value: string } )
}

export * from './helper'
export * from './signals/add'
export * from './BlockType'
export * from './SlotType'

import * as Model from 'cerebral-model-baobab'
import { add } from './signals/add'
import { name } from './signals/name'
import { select } from './signals/select'
import { source } from './signals/source'
import { GraphType } from '../Graph'

const CurrentBlock = Model.monkey
( { cursors:
    { sceneById: [ 'data', 'scene' ]
    , sceneId: [ '$sceneId' ]
    , projectById: [ 'data', 'project' ]
    , projectId: [ '$projectId' ]
    , select: [ '$block' ]
    }
  , get ( state ) {
      const project = ( state.projectById || {} ) [ state.projectId ]
      const scene = ( state.sceneById || {} ) [ state.sceneId ]
      const choice = { project, scene }
      const select = state.select || {}
      let graph
      if ( project && select.ownerType === 'project' ) {
        graph = project.graph
      }
      else if ( scene && select.ownerType === 'scene' ) {
        graph = scene.graph
      }

      if ( graph ) {
        return graph.blocksById [ select.id ]
      }
      else {
        return undefined
      }
    }
  }
)

export const Block =
( options = {} ) => {
  return (module, controller) => {
    // This state is where we read and write to
    // the database
    module.addState
    ( CurrentBlock
    )

    module.addSignals
    ( { add
      , name
      , select
      , source
      }
    )

    return {} // meta information
  }
}
