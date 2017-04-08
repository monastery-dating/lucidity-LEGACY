import './style.scss'
import { Component } from '../Component'
import { editable, pane } from '../../modules/Factory'
import { Graph } from '../Graph'
import { uimap, GraphType, rootNodeId, UIGraphType } from '../../modules/Graph'
import { DragDropType, DragStartType } from '../../modules/DragDrop'
import { ComponentType } from '../../modules/Graph'

const ProjectName = editable ( [ 'project', 'name' ] )

const ProjectOptions = pane ( 'project-opts' )

let lastGraph, lastUIgraph

export const Project = Component
( { comp: [ 'project' ]
    // update ui on project name edit
  , editing: ProjectName.path
    // ensure that we redraw on pane changes
  , pane: ProjectOptions.path
    // update graph ui. On source change this can make many redraws for
    // nothing. TODO: only sync to changes in block signature...
  , blockSelection: [ '$block' ]
    // update graph on drag op
  , drop: [ '$dragdrop', 'drop' ]
  , drag: [ '$dragdrop', 'drag' ]
  }
, ( { state, signals } ) => {
    const comp: ComponentType = state.comp
    if ( !comp ) {
      return ''
    }

    const ownerType = 'project'
    const dclass = state.drop && state.drop.ownerType === ownerType
    const klass = { Project: true, drop: dclass }

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
          <ProjectOptions.toggle class='fa fa-diamond'/>
          <ProjectName class='name'/>
        </div>
        <ProjectOptions>
          <div class='button delete'>delete</div>
          <div class='button'>duplicate</div>
        </ProjectOptions>
        <Graph key='project.graph'
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
