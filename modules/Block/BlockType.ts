import { GraphType } from '../Graph'
import { SlotType } from './SlotType'
import { ScrubCode } from '../Code'
import { StringMap } from 'lucidity'

export interface BlockTypeChanges {
  name?: string
  source?: string
}


export interface PlaybackMetaType {
  // context changes
  expect?: StringMap
  // one for each slot
  provide?: StringMap
  all?: boolean // set to true if children: 'all'
  isvoid?: boolean // set to true if it has an update but not type for update
  children?: string[]
  update?: string // normalized type
}

export interface SourceCode {
  name: string
  source: string
  type: string
}

export interface CompiledCode {
  js?: string
  scrub?: ScrubCode
  meta?: PlaybackMetaType
}

export interface BlockSourceInfo extends CompiledCode {
  // Extra compilation information.
  compiled?: Map<string, CompiledCode>
}

export interface BlockType extends BlockSourceInfo {
  id: string
  name: string
  source: string
  // Extra file sources
  sources?: Map<string, SourceCode>
}

export interface BlockByIdType {
  [ id: string ]: BlockType
}

export interface BlockAddOperationType {
  pos: number
  parentId: string
  ownerType: string
  componentId?: string
}

// basic compiler type checks
const typetest = function
( a: BlockType ) : BlockTypeChanges {
  return a
}
