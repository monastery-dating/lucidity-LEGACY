import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { DragMoveType, DragStartType } from '../../modules/DragDrop'
import { defaultUILayout, GraphType } from '../../modules/Graph'
import { Graph } from '../Graph'
import { Node } from '../Node'
import { UINodeType, UISlotType, NodeType } from '../../modules/Graph/types'

export const Drag = Component
( { drag: [ '$dragdrop', 'drag' ]
  , move: [ '$dragdrop', 'move' ]
  , drop: [ '$dragdrop', 'drop' ]
  }
, ( { state, signals }: ContextType ) => {
    const drag: DragStartType = state.drag
    const move: DragMoveType  = state.move

    if ( !drag || !move ) {
      return <div id='drag' class={{ Drag: true }}></div>
    }

    const klass = { Drag: true, copy: move.copy || drag.ownerType === 'library' || drag.copy }

    if ( state.drop && state.drop.ownerType !== 'library' ) {
      // hide drag element
      // klass [ 'hide' ] = true
    }

    const x = move.clientPos.x
    const y = move.clientPos.y

    // draw Graph
    return <Graph key='drag.graph'
          class={ klass }
          position={{ x, y }}
          ownerType={ 'drag' }
          rootId={ drag.nodeId }
          graph={ drag.dgraph } />
  }
)
