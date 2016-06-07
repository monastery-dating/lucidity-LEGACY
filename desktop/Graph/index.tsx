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
, blockId: string
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
        blockId={ blockId }
        uinode={ uinode }
        node={ node }
        ownerType={ ownerType }
        isghost={ isghost }/>
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
      let dropId: string
      if ( drop && drop.ownerType === ownerType ) {
        graph = drop.graph
        dropId = drop.nodeId
      }

      let dragId: string
      if ( drag && drag.ownerType === ownerType ) {
        dragId = drag.nodeId
      }

      const uigraph = uimap ( graph, rootId, dragId )

      const klass = Object.assign ( { Graph: true }, props.class )
      const style = props.style || {}

      return <svg class={ klass } style={ style }>{ mapUINodes ( graph, uigraph, ownerType, dropId, blockId ) }</svg>
    }
    else {
      return ''
    }
  }
)
