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
, blockId: string
) => {
  const nodesById = graph.nodesById
  const nodes = uigraph.nodes
  const uiNodeById = uigraph.uiNodeById
  const key = `Node-${ownerType}-`

  return nodes.map ( ( n ) => {
      const uinode = uiNodeById [ n ]
      const node = nodesById [ n ]
      return <Node key={ key + uinode.id }
        blockId={ blockId }
        uinode={ uinode }
        node={ node }
        ownerType={ ownerType }
        />
    }
  )
}

export const Graph = Component
( {
    // update graph on drag op
    drop: [ '$dragdrop', 'drop' ] // react to drag op
  , drag: [ '$dragdrop', 'drag' ]
  , select: [ '$block' ]
  }
, ( { props, state, signals }: ContextType ) => {
    const ownerType = props.ownerType
    const select = state.select || {}
    const blockId = select.ownerType === ownerType ? select.id : null

    let graph: GraphType = props.graph
    const drop: DragDropType = state.drop
    const drag: DragStartType = state.drag
    const rootId = props.rootId || NodeHelper.rootNodeId
    if ( graph ) {
      let nodeId: string
      let ghostId: string
      if ( drop && drop.ownerType === ownerType ) {
        graph = drop.graph
        nodeId = drop.nodeId
        ghostId = drop.ghostId
      }
      else if ( drag && drag.ownerType === ownerType && ! drag.copy ) {
        graph = drag.rgraph
      }

      const uigraph = uimap ( graph, ghostId, nodeId )

      const klass = Object.assign ( { Graph: true }, props.class )
      const style = props.style || {}
      const empty = { select: { id: '', ownerType: '' } }

      return <svg class={ klass } style={ style }
          on-click={ () => signals.block.select ( empty ) }>
          { mapUINodes ( graph, uigraph, ownerType, blockId ) }
        </svg>
    }
    else {
      return ''
    }
  }
)
