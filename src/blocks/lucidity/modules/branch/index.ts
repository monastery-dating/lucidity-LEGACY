import { set, toggle, when, unset } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'
import { ParagraphOption } from 'editor'

import { Branch, BranchIcon } from '../../components/Branch'
import { DragDropCallbacks, Position } from '../../lib/Graph/types'
import { State } from 'app'
import { DragDropType, DragStartType } from '../../lib/DragDrop'
import { BlockDefinition, SourceFragment, StringMap, BranchDefinition } from 'blocks/playback'
import { blockSourceChanged } from './chains/blockSourceChanged'
import { fragmentSourceChanged } from './chains/fragmentSourceChanged'

interface CheckTypes {
  $blockId: typeof State.branch.$blockId
}

interface ArrowArg {
  arrow: {
    nodeId: string
    path: string
    closed: boolean
  }
}

interface AddArg {
  
}

export interface BranchSignal extends DragDropCallbacks {
  add ( arg: AddArg ): void
  arrow ( arg: ArrowArg ): void
  select ( arg: { blockId: string, path: string } ): void
  blockSourceChanged ( arg: { path: string, source: string } ): void
  fragmentSourceChanged ( arg: { path: string, source: string } ): void
}

export interface BranchState {
  $move?: any
  $drag?: DragStartType
  $drop?: DragDropType
  // Pseudo type (this is not in state but in composition)
  $blockId?: string
  branch: BranchDefinition
}

const b1: BlockDefinition =
{ id: 'b1', name: 'add', lang: 'ts'
, children: [ 'b2', 'b3' ]
, meta: {}
, source: `
`
}

const b2: BlockDefinition =
{ id: 'b2', name: 'value1', lang: 'ts'
, children: []
, meta: { children: [] }
, source: `
`
}

const b3: BlockDefinition = 
{ id: 'b3', name: 'value2', lang: 'ts'
, children: []
, meta: { children: [] }
, source: `
`
}

const basicBranch
: BranchDefinition =
{ branch: 'root'
, entry: 'b1'
, blocks:
  { b1
  , b2
  , b3
  }
}

export const defaultBranch: BranchState =
{ branch: basicBranch
}

export const branchParagraph: ParagraphOption =
{ init: defaultBranch
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
    [ when ( state`${ props`path` }.$blockId`, props`blockId`, ( a, b ) => a === b )
    , { true:
      [ unset ( state`${ props`path` }.$blockId` )
      ]
    , false:
      [ set ( state`${ props`path` }.$blockId`, props`blockId` )
      ]
      }
    ]
  , blockSourceChanged
  , fragmentSourceChanged
  }
, state: {
    $scale: 1.0
  }
}

