import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { editable, openModal, pane } from '../../modules/Factory'
import { Graph } from '../Graph'
import { uimap, GraphType, rootNodeId, UIGraphType } from '../../modules/Graph'
import { DragDropType, DragStartType } from '../../modules/DragDrop'
import { ComponentType } from '../../modules/Graph'

const SceneName = editable ( [ 'scene', 'name' ] )

const SceneOptions = pane ( 'scene' )

let lastGraph, lastUIgraph

export const Scene = Component
( { scene: [ 'scene' ]
    // update ui on scene name edit
  , editing: SceneName.path
    // ensure that we redraw on pane changes
  , pane: SceneOptions.path
    // update graph ui
  , block: [ 'block' ]
    // update graph on drag op
  , drop: [ '$dragdrop', 'drop' ]
  , drag: [ '$dragdrop', 'drag' ]
  }
, ( { state, signals }: ContextType ) => {
    const ownerType = 'scene'
    const dclass = state.drop && state.drop.ownerType === ownerType
    const klass = { Scene: true, drop: dclass }

    const scene: ComponentType = state.scene
    if ( !scene ) {
      return ''
    }

    const deleteModal = openModal
    ( { message: 'Delete scene ?'
      , type: 'scene'
      , _id: scene._id
      , operation: 'remove'
      , confirm: 'Delete'
      }
    , signals
    )

    // Prepare graph for display
    const select = state.select || {}
    const blockId = select.ownerType === ownerType ? select.id : null

    let graph: GraphType = scene.graph
    const drop: DragDropType = state.drop
    const drag: DragStartType = state.drag
    let dropSlotIdx: number
    let dropUINode
    let uigraph: UIGraphType
    if ( graph ) {

      if ( drag && drag.ownerType === ownerType && ! drag.copy ) {
        graph = drag.rgraph
      }

      uigraph = lastUIgraph
      if ( lastGraph !== graph ) {
        lastGraph = graph
        uigraph = lastUIgraph = uimap ( lastGraph )
      }

      if ( drop && drop.ownerType === ownerType ) {
        dropSlotIdx = drop.slotIdx
        dropUINode = uigraph.uiNodeById [ drop.nodeId ]
      }
    }

    // ====
    return <div class={ klass }>
        <div class='bar'>
          <SceneOptions.toggle class='fa fa-film'/>
          <SceneName class='name'/>
        </div>
        <SceneOptions>
          <div class='button delete'
            on-click={ deleteModal }>
            delete
          </div>
          <div class='button'>duplicate</div>
        </SceneOptions>
      <Graph key='scene.graph'
        selectedBlockId={ blockId }
        ownerType={ 'scene' }
        graph={ graph }
        uigraph={ uigraph }
        dropSlotIdx= { dropSlotIdx }
        dropUINode={ dropUINode }
        />
      </div>
  }
)
