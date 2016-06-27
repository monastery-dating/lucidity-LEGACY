import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { uimap, GraphType, rootNodeId, UIGraphType } from '../../modules/Graph'
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
  , scale: [ '$ui', 'scale' ]
  }
, ( { props, state, signals }: ContextType ) => {
    const ownerType = props.ownerType
    const select = state.select || {}
    const blockId = select.ownerType === ownerType ? select.id : null

    let graph: GraphType = props.graph
    const drop: DragDropType = state.drop
    const drag: DragStartType = state.drag
    const rootId = props.rootId || rootNodeId
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

      // FIXME: use uigraph in cache if { graph, ghostId, nodesId } are all the same...
      const uigraph = uimap ( graph, ghostId, nodeId )

      const klass = Object.assign ( { Graph: true }, props.class )
      const style: any = {}
      // TODO: implement scale change with slider
      // in the status bar.
      const scale = state.scale || 1
      const transform = `scale(${scale})`

      const pos = props.position

      if ( pos ) {
        style.left = (pos.x - uigraph.grabpos.x) + 'px'
        style.top  = (pos.y - uigraph.grabpos.y) + 'px'
      }

      const noSelect = ( e ) => {
        e.preventDefault ()
        signals.block.select
        ( { select: { id: '', nodeId: '', ownerType: '' } } )
      }

      return <div class={ klass }
            style={ style }
            on-click={ noSelect }>
          <svg
            width={ uigraph.size.width }
            height={ uigraph.size.height }
            on-click={ noSelect }>
            <g transform={ transform }>
            { mapUINodes ( graph, uigraph, ownerType, blockId ) }
            </g>
          </svg>
        </div>
    }
    else {
      return ''
    }
  }
)
