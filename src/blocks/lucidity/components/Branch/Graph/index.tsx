import { Signal, State } from 'app'
import { connect, JSX } from 'builder'
import { props, signal, state } from 'cerebral/tags'
import { styled } from 'styled'

import { GraphType, rootNodeId, UIGraphType } from '../../../lib/Graph'
import { uimap } from '../../../lib/Graph/helper/uimap'
import { DragDropType, DragStartType } from '../../../lib/DragDrop'
import { Node } from '../Node'
import { DropTarget } from '../DropTarget'

import './style.scss'

const mapUINodes =
( graph: GraphType
, uigraph: UIGraphType
, ownerType: string
) => {
  const nodesById = graph.nodesById
  const nodes = uigraph.nodes
  const uiNodeById = uigraph.uiNodeById

  return nodes.map ( ( n ) => {
      const uinode = uiNodeById [ n ]
      const node = nodesById [ n ]
      return <Node
        key={ n }
        uinode={ uinode }
        node={ node }
        ownerType={ ownerType }
        />
    }
  )
}

interface Props {
  scale: typeof State.branch.$scale
  graph: typeof State.branch.graph
}

interface EProps {
  dropSlotIdx?: number
  dropUINode?: any // ??
  ownerType: string // ??
  path: string
  position?: any // ??
  uigraph: UIGraphType
}

export const Graph = connect < Props, EProps > (
  { scale: state`branch.$scale`
  , graph: state`${ props`path` }.graph`
  }
, function Graph ( { dropSlotIdx, dropUINode, graph, ownerType, path, position, scale, uigraph } ) {
    if ( !graph ) {
      return null
    }

    const style: any = {}

    // TODO: implement scale change with slider
    // in the status bar.
    const transform = `scale(${scale})`

    if ( position ) {
      style.left = (position.x - uigraph.grabpos.x) + 'px'
      style.top  = (position.y - uigraph.grabpos.y) + 'px'
    }

    const noSelect = ( e: any ) => {
      e.preventDefault ()
      /*
      signals.block.select
      ( { select: { id: '', nodeId: '', ownerType: '' } } )
      */
    }

    return <div className='Graph'
          style={ style }
          onClick={ noSelect }>
        <svg
          width={ uigraph.size.width }
          height={ uigraph.size.height }
          onClick={ noSelect }>
          <g transform={ transform }>
          { mapUINodes ( graph, uigraph, ownerType ) }
          { ( dropUINode && dropSlotIdx !== undefined ) ?
          <DropTarget key='DropTarget'
            uinode={ dropUINode } slotIdx={ dropSlotIdx }/>
          : ''
          }
          </g>
        </svg>
      </div>
  }
)
