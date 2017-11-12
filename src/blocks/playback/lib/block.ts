import { compilers } from './compilers'

import { LiveBranch } from './branch'
import { makeId, ParsedMeta } from './types'

export class LiveBlock {
  id: string
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
  ) {
    this.meta = {}
    this.children = []
    this.id = makeId ( branch.project.blockById )
    branch.addBlock ( this )
  }
}