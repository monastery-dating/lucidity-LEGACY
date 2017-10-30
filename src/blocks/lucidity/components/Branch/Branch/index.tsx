import { Signal, State } from 'app'
import { connect, Component, JSX } from 'builder'
import { props, signal, state } from 'cerebral/tags'
import { styled } from 'styled'
// import { editable, openModal, pane } from '../../modules/Factory'
import { rootNodeId, ComponentType, GraphType, NodeByIdType, UIGraphType } from '../../../lib/Graph'
import { uimap } from '../../../lib/Graph/helper/uimap'

import { Graph } from '../Graph'

import './style.scss'

function classNames ( obj: any ) {
  return Object.keys ( obj ).filter ( k => obj [ k ] ).join ( ' ' )
}

// const SceneName = editable ( [ 'scene', 'name' ] )

// const SceneOptions = pane ( 'scene' )

interface Props {
  graph: typeof State.branch.graph
  drag: typeof State.branch.$drag
  drop: typeof State.branch.$drop
}

interface EProps {
  path: string
}

const ABranch = styled.div`
background: #eee;
margin: ${ p => p.theme.blockMargin };
border: 1px dashed orange;
min-height: 2rem;
`

const Wrapper = styled.div`
margin: 2rem;
background: #28211c;
`

export const Branch = connect < Props, EProps > (
  { graph: state`${ props`path` }.graph`
    // update ui on scene name edit
  // , editing: SceneName.path
    // ensure that we redraw on pane changes
  // , pane: SceneOptions.path
    // update graph ui
  // , blockSelection: [ '$block' ]
    // update graph on drag op
  , drag: state`branch.$drag`
  , drop: state`branch.$drop`
  }
, class Branch extends Component < Props & EProps > {
    private lastGraph: any
    private lastUIgraph: any
    private lastflags: any

    render () {
      const { props } = this
      let { graph } = props
      const { drag, drop } = props
      if ( ! graph ) {
        return null
      }
      console.log ( 'Branch', graph )
      /*
      // TODO: cleanup CSS related to drop operations
      const dclass = drop && drop.ownerType === ownerType
      const klass = { Scene: true, drop: dclass }

      const deleteModal = openModal
      ( { message: 'Delete scene ?'
        , type: 'scene'
        , _id: branch._id
        , operation: 'remove'
        , confirm: 'Delete'
        }
      , signals
      )

      // Prepare graph for display
      // Prepare graph for display
      const selection = blockSelection // ?? || { ownerType: 'foobar', id: 'baz' }
      const blockId = selection.ownerType === ownerType ? selection.id : null

      let dropSlotIdx: number | undefined
      let dropUINode
      let flags: NodeByIdType | undefined = undefined
      let uigraph: UIGraphType | undefined = undefined
      if ( graph ) {

        if ( drop && drop.graph && drop.ownerType === ownerType ) {
          // FIXME: we should use drop graph flags but with
          // node structure from drag.rgraph / graph.
          flags = drop.graph.nodesById
        }

        if ( drag && drag.rgraph && drag.ownerType === ownerType && ! drag.copy ) {
          graph = drag.rgraph
        }

        uigraph = this.lastUIgraph
        if ( this.lastGraph !== graph || this.lastflags !== flags ) {
          this.lastGraph = graph
          this.lastflags = flags
          uigraph = this.lastUIgraph = uimap ( this.lastGraph, flags )
        }

        if ( drop && drop.ownerType === ownerType ) {
          // Find closest slot
          dropSlotIdx = drop.slotIdx
          dropUINode = ( drop.nodeId && uigraph )
            ? uigraph.uiNodeById [ drop.nodeId ]
            : undefined
        }
      }
      */

      const ownerType = 'scene'
      const klass = { Scene: true }
      const uigraph = this.lastUIgraph = uimap ( graph )

      // ====
      // return <ABranch />
      return (
        <Wrapper>
        { /*
          <div className='bar'>
            <SceneOptions.toggle className='fa fa-film'/>
            <SceneName className='name'/>
          </div>
          <SceneOptions>
            <div className='button delete'
              onClick={ deleteModal }>
              delete
            </div>
            <div className='button'>duplicate</div>
          </SceneOptions>
          */
          }
        <Graph
          dropSlotIdx= { undefined }
          dropUINode={ undefined }
          ownerType={ ownerType }
          path={ this.props.path }
          uigraph={ uigraph }
          />
        </Wrapper>
      )
    }
  }
)