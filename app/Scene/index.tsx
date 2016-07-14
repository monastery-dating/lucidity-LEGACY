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
( { comp: [ 'scene' ]
    // update ui on scene name edit
  , editing: SceneName.path
    // ensure that we redraw on pane changes
  , pane: SceneOptions.path
    // update graph ui
  , blockSelection: [ '$block' ]
    // update graph on drag op
  , drop: [ '$dragdrop', 'drop' ]
  , drag: [ '$dragdrop', 'drag' ]
  }
, ( { state, signals }: ContextType ) => {
    const comp: ComponentType = state.comp
    if ( !comp ) {
      return ''
    }

    const ownerType = 'scene'
    // TODO: cleanup CSS related to drop operations
    const dclass = state.drop && state.drop.ownerType === ownerType
    const klass = { Scene: true, drop: dclass }

    const deleteModal = openModal
    ( { message: 'Delete scene ?'
      , type: 'scene'
      , _id: comp._id
      , operation: 'remove'
      , confirm: 'Delete'
      }
    , signals
    )

    // Prepare graph for display
    // Prepare graph for display
    const selection = state.blockSelection || {}
    const blockId = selection.ownerType === ownerType ? selection.id : null

    let graph: GraphType = comp.graph
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
        // Find closest slot
        const slots =
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
        ownerType={ ownerType }
        graph={ graph }
        uigraph={ uigraph }
        dropSlotIdx= { dropSlotIdx }
        dropUINode={ dropUINode }
        />
      </div>
  }
)
