import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { DragDropType, DragMoveType, DragStartType } from '../../modules/DragDrop'
import { defaultUILayout, GraphType, NodeByIdType, uimap } from '../../modules/Graph'
import { Graph } from '../Graph'
import { Node } from '../Node'
import { UINodeType, UISlotType, NodeType } from '../../modules/Graph/types'

let lastflags, lastGraph, lastUIgraph

export const Drag = Component
( { drag: [ '$dragdrop', 'drag' ]
  , move: [ '$dragdrop', 'move' ]
  , drop: [ '$dragdrop', 'drop' ]
  }
, ( { state, signals }: ContextType ) => {
    const drag: DragStartType = state.drag
    const move: DragMoveType  = state.move
    const drop: DragDropType  = state.drop

    let flags: NodeByIdType = null

    if ( !drag || !move ) {
      return <div id='drag' class={{ Drag: true }}></div>
    }
    
    const graph = drag.dgraph

    if ( drop ) {
      flags = drop.graph.nodesById
    }

    const klass = { Drag: true, copy: move.copy || drag.ownerType === 'library' || drag.copy }

    let uigraph = lastUIgraph
    if ( lastGraph !== graph || lastflags !== flags ) {
      lastGraph = graph
      lastflags = flags
      uigraph = lastUIgraph = uimap ( lastGraph, flags )
    }

    const x = move.clientPos.x
    const y = move.clientPos.y

    // draw Graph
    return <Graph key='drag.graph'
          class={ klass }
          position={{ x, y }}
          ownerType={ 'drag' }
          rootId={ drag.nodeId }
          graph={ graph }
          uigraph={ uigraph } />
  }
)
