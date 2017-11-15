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
( path: string
, branchId: string
, uigraph: UIGraphType
) => {
  const nodes = uigraph.nodes
  const uiNodeById = uigraph.uiNodeById

  return nodes.map ( ( n ) => {
      const uinode = uiNodeById [ n ]
      return (
        <Node
          branchId={ branchId }
          key={ n }
          path={ path }
          uinode={ uinode }
          />
      )
    }
  )
}

interface Props {
  // $scale: typeof State.prefs.branchScale ?
  branch: typeof State.branch.branch
}

interface EProps {
  dropSlotIdx?: number
  dropUINode?: any // ??
  path: string
  position?: any // ??
}

export const Graph = connect < Props, EProps > (
  { branch: state`${ props`path` }.branch`
  }
, function Graph
  ( { branch
    , dropSlotIdx
    , dropUINode
    , path
    , position
    }
  ) {
    if ( !branch ) {
      return null
    }

    const uigraph = uimap ( branch )

    const style: any = {}

    // TODO: implement scale change with slider
    // in the status bar.
    const transform = `scale(1.0)` // ${$scale})`

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
          { mapUINodes ( path, branch.id, uigraph ) }
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
