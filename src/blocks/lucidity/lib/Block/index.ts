export * from './BlockType'
export * from './SlotType'

/*
interface TypeAndLabels {
  type: string
  labels: string[]
}

interface StringMap {
  [ key: string ]: string
}

type NumberArray = number[]
type Matrix = NumberArray[]

export interface BlockSignalsType {
  add ( input: { pos: number, parentId: string, ownerType: string } )
  arrow ( input: { arrow: { ownerType: string, nodeId: string, closed: boolean } } )
  name ( input: { value: string } )
  controls ( input: { controls: TypeAndLabels[] } )
  select ( input: { select: { ownerType: string, id: string, nodeId: string } } )
  tab ( input: { value: string } )
  values ( input: { values: number[], pos: number } )
  source ( input: { source: string } )
  typecheck ( input: { source: string } )
  sources ( input: { sources: StringMap } )
}

export * from './signals/add'

import { add } from './signals/add'
import { arrow } from './signals/arrow'
import { controls } from './signals/controls'
import { name } from './signals/name'
import { select } from './signals/select'
import { source } from './signals/source'
import { sources } from './signals/sources'
import { tab } from './signals/tab'
import { typecheck } from './signals/typecheck'
import { values } from './signals/values'
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
      , arrow
      , controls
      , name
      , select
      , source
      , sources
      , tab
      , typecheck
      , values
      }
    )

    return {} // meta information
  }
}

*/