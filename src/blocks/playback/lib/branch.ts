import * as project from './project'
import { makeId, BranchDefinition, BlockDefinition } from 'playback'
import { StringMap } from 'blocks/lucidity';

import { LiveBlock } from './block'
import { LiveProject } from './project'

export class LiveBranch {
  blocks: { [ key: string ]: LiveBlock }
  entry: string
  id: string

  constructor
  ( public project: LiveProject
  , connect: string = 'root'
  ) {
    this.id = makeId ( project.branches )
    const root = new LiveBlock ( this, connect )
    this.entry = root.id
    this.blocks = { [ root.id ]: root }
  }

  definition (): BranchDefinition {
    return (
      { id: this.id
      , entry: this.entry
      , blocks: Object.assign
        ( {}
        , ... Object.keys ( this.blocks ).map
          ( blockId => ( { [ blockId ]: this.blocks [ blockId ].definition () } )
          )
        )
      }
    )
  }

  newBlock
  ( parentId: string
  , slotIdx?: number
  ) {
    const parent = this.blocks [ parentId ]
    if ( ! parent ) {
      throw new Error ( `Cannot create block (invalid parent block id '${ parentId }')` )
    }
    const block = new LiveBlock ( this )
    if ( slotIdx === undefined ) {
      parent.children.push ( block.id )
    } else {
      parent.children [ slotIdx ] = block.id
    }
    this.blocks [ block.id ] = block
    return block
  }
}
