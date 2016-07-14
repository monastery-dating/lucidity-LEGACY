import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { uimap, GraphType, rootNodeId, UIGraphType } from '../../modules/Graph'
import { Node } from '../Node'
import { DropTarget } from '../DropTarget'
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

  return nodes.map ( ( n ) => {
      const uinode = uiNodeById [ n ]
      const node = nodesById [ n ]
      return <Node
        blockId={ blockId }
        uinode={ uinode }
        node={ node }
        ownerType={ ownerType }
        />
    }
  )
}

export const Graph = Component
( { scale: [ '$ui', 'scale' ]
  }
, ( { props, state, signals }: ContextType ) => {
    const graph: GraphType = props.graph
    if ( !graph ) {
      return ''
    }
    const dropSlotIdx = props.dropSlotIdx
    const dropUINode = props.dropUINode
    const ownerType = props.ownerType
    const blockId = props.selectedBlockId
    
    // TODO: never compute uigraph here.
    const uigraph: UIGraphType = props.uigraph || uimap ( graph )

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
          { dropUINode ?
          <DropTarget key='DropTarget'
            uinode={ dropUINode } slotIdx={ dropSlotIdx }/>
          : ''
          }
          </g>
        </svg>
      </div>
  }
)
