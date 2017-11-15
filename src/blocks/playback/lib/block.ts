import { compilers } from './compilers'

import { LiveBranch } from './branch'
import { makeId, ParsedMeta } from './types'
import { BlockDefinition } from 'blocks/playback';

export class LiveBlock {
  children: string []
  // Extracted from source but saved for faster usage
  meta: ParsedMeta
  // ** UI stuff **
  closed?: boolean

  constructor
  ( private branch: LiveBranch
  , public name: string = 'new block'
  , public lang: string = 'ts'
  , public source: string = ''
  , public id: string = makeId ( branch.project.blockById )
  ) {
    this.meta = {}
    this.children = []
  }

  definition (): BlockDefinition {
    return (
      { id: this.id
      , children: this.children
      , name: this.name
      , lang: this.lang
      , source: this.source
      , meta: this.meta
      }
    )
  }
  
}