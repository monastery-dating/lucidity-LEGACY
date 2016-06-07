import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { DragMoveType, DragStartType } from '../../modules/DragDrop'
import { defaultUILayout, GraphType } from '../../modules/Graph'
import { Graph } from '../Graph'
import { Node } from '../Node'
import { UINodeType, UISlotType, NodeType } from '../../modules/Graph/types'

const ARROW_POS =
{ x: defaultUILayout.RADIUS + defaultUILayout.SPAD + defaultUILayout.SLOT
, y: 3 * defaultUILayout.SLOT
}

export const Drag = Component
( { drag: [ '$dragdrop', 'drag' ]
  , move: [ '$dragdrop', 'move' ]
  , drop: [ '$dragdrop', 'drop' ]
  }
, ( { state, signals }: ContextType ) => {
    const drag: DragStartType = state.drag
    const move: DragMoveType  = state.move
    const klass = { Drag: true }

    if ( !drag || !move ) {
      return <svg id='drag' class={ klass }></svg>
    }

    if ( state.drop && state.drop.ownerType !== 'library' ) {
      // hide drag element
      klass [ 'hide' ] = true
    }

    const uinode: UINodeType = drag.uinode
    const node: NodeType = { id: drag.nodeId, parent: null, children: [], blockId: drag.blockId }
    const x = move.clientPos.x - ARROW_POS.x
    const y = move.clientPos.y - ARROW_POS.y
    const style = { top: y, left: x }

    // draw Graph
    return <Graph key='drag.graph'
          class={ klass }
          style={ style }
          ownerType={ 'drag' }
          rootId={ drag.nodeId }
          graph={ drag.graph } />

/*
    return <svg id='drag' class={ klass } style={ style }>
          <Node ownerType='drag'
            uinode={ uinode }
            node={ node }/>
        </svg>
        */
  }
)
