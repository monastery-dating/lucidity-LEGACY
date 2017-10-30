import { set, toggle } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'

import { Branch, BranchIcon } from '../../components/Branch'
import { rootNodeId, DragDropCallbacks, GraphType, Position } from '../../lib/Graph/types'
import { DragDropType, DragStartType } from '../../lib/DragDrop'

interface SelectArg {
  select: {
    id: string
    nodeId: string
    ownerType: string
  }
}

interface ArrowArg {
  arrow: {
    nodeId: string
    ownerType: string
    closed: boolean
  }
}

interface AddArg {
  
}

export interface BranchSignal extends DragDropCallbacks {
  add ( arg: AddArg ): void
  arrow ( arg: ArrowArg ): void
  select ( arg: SelectArg ): void
}

export interface BranchState {
  $move?: any
  $drag?: DragStartType
  $drop?: DragDropType
  $blockId?: string
  $scale?: number
  // Pseudo type (this is not in state but in composition)
  graph: GraphType
}

const graph: GraphType =
{ blocksById:
  { b1:
    { id: 'b1', name: 'add', source: ''
    , meta: {}
    }
  , b2:
    { id: 'b2', name: 'value1', source: ''
    , meta: { children: [] }
    }
  , b3:
    { id: 'b3', name: 'value2', source: ''
    , meta: { children: [] }
    }
  }
, nodesById:
  { [ rootNodeId ]:
    { id: 'n1', blockId: 'b1', children: [ 'n2', 'n3' ] }
  , n2:
    { id: 'n2', blockId: 'b2', children: [] }
  , n3:
    { id: 'n3', blockId: 'b3', children: [] }
  }
}

export const init: BranchState = { graph }

export const branchParagraph =
{ init
, tag: Branch
, toolbox: BranchIcon
}

export const branch =
{ signals:
  { drag:
    [ () => {
        throw new Error ( 'FIXME: refactor dragdrop.drag into branch.drag' )
      }
    ]
  , move:
    [ () => {
        throw new Error ( 'FIXME: refactor dragdrop.move into branch.move' )
      }
    ]
  , select:
    [ () => {
        throw new Error ( 'FIXME: refactor block.select into branch.select' )
      }
    ]
  }
, state: {
    $scale: 1.0
  }
}

