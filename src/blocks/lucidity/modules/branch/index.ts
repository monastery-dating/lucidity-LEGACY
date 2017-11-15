import { set, toggle, when, unset } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'
import { ParagraphOption } from 'editor'

import { Branch, BranchIcon } from '../../components/Branch'
import { DragDropCallbacks, Position } from '../../lib/Graph/types'
import { State } from 'app'
import { DragDropType, DragStartType } from '../../lib/DragDrop'
import { LiveBlockDefinition, SourceFragment, StringMap, BranchDefinition, getProject } from 'blocks/playback'
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
  branchId: string
  parentId: string 
  path: string
  slotIdx: number
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

export const defaultBranch: BranchState =
{ branch: getProject ().newBranch ().definition ()
}

export const branchParagraph: ParagraphOption =
{ init () {
    const branch = getProject ().newBranch ()
    return { branch: branch.definition () }
  }
, tag: Branch
, toolbox: BranchIcon
}

export const branch =
{ signals:
  { add:
    [ ( c: any ) => {
        console.log ( 'ADD BLOCK', c.props )
      }
    ]
  , drag:
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

