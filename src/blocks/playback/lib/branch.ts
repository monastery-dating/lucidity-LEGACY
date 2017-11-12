import * as project from './project'
import { makeId } from 'playback'
import { StringMap } from 'blocks/lucidity';

import { LiveBlock } from './block'
import { LiveProject } from './project'

export class LiveBranch {
  blocks: StringMap < LiveBlock >
  entry: string
  id: string

  constructor
  ( public project: LiveProject
  , public connect?: string
  ) {
    this.blocks = {}
    this.id = makeId ( project.branches )
    project.addBranch ( this )
  }

  addBlock
  ( block: LiveBlock
  ) {
    if ( Object.keys ( this.blocks ).length === 0 ) {
      this.entry = block.id
    }
    this.blocks [ block.id ] = block
    this.project.addBlock ( block )
  }
}
