import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { uimap, GraphType, GraphHelper, NodeHelper, UIGraphType } from '../../modules/Graph'
import { Node } from '../Node'
import { SceneType } from '../../modules/Scene'
import { ProjectType } from '../../modules/Project'
import { DragDropType, DragStartType } from '../../modules/DragDrop'

const mapUINodes =
( graph: GraphType
, uigraph: UIGraphType
, ownerType: string
, dropId: string
) => {
  const nodesById = graph.nodesById
  const nodes = uigraph.nodes
  const uiNodeById = uigraph.uiNodeById
  const key = `Node-${ownerType}-`

  return nodes.map ( ( n ) => {
      const uinode = uiNodeById [ n ]
      const node = nodesById [ n ]
      let isghost = false
      if ( n === dropId ) {
        // special drop element
        isghost = true
      }
      return <Node key={ key + uinode.id }
        uinode={ uinode }
        node={ node }
        ownerType={ ownerType }
        isghost={ isghost }/>
    }
  )
}

export const Graph = Component
( { blocksById: [ 'data', 'block' ]
  , blockId: [ 'user', 'blockId' ]
    // update ui on block change
  , block: [ 'block' ]
    // update graph on drag op
  , drop: [ '$dragdrop', 'drop' ] // react to drag op
  , drag: [ '$dragdrop', 'drag' ]
  }
, ( { props, state, signals }: ContextType ) => {
    const ownerType = props.ownerType
    let graph: GraphType = props.graph
    const drop: DragDropType = state.drop
    const drag: DragStartType = state.drag
    const rootId = props.rootId || NodeHelper.rootNodeId
    if ( graph ) {
      let blocksById = state.blocksById
      // Could we get rid of blocksById dependency ? Or just
      // pass the required elements from 'scene' to avoid redraw if
      // any existing block changes ?
      let dropId: string
      if ( drop && drop.ownerType === ownerType ) {
        graph = drop.graph
        dropId = drop.nodeId

        if ( drag.ownerType === 'library' ) {
          // We need to add the block since it is not
          // in state.blocksById
          blocksById =
          Object.assign ( {}, blocksById, { [ drag.blockId ]: drag.block })
        }
      }

      let dragId: string
      if ( drag && drag.ownerType === ownerType ) {
        dragId = drag.nodeId
      }

      const uigraph = uimap
      ( graph, blocksById, rootId, dragId )

      const klass = Object.assign ( { Graph: true }, props.class )
      const style = props.style || {}

      console.log ( 'Graph.class', klass )

      return <svg class={ klass } style={ style }>{ mapUINodes ( graph, uigraph, ownerType, dropId ) }</svg>
    }
    else {
      return ''
    }
  }
)
