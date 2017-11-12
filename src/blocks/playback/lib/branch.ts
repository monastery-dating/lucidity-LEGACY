import * as project from './project'
import { makeId } from 'playback'
import { StringMap } from 'blocks/lucidity';

import { LiveBlock } from './block'
import { LiveProject } from './project'

export class LiveBranch {
  blocks: StringMap < LiveBlock >
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
    this.blocks [ block.id ] = block
    this.project.addBlock ( block )
  }
}
