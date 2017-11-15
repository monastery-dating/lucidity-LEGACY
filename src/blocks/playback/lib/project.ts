import { LiveBlock } from './block'
import { LiveBranch } from './Branch'
import { extractSources } from './extractSources'
import { makeId, SourceFragment, StringMap } from './types'
import { compile } from 'blocks/playback/lib/compile';

let project: LiveProject

export function getProject (): LiveProject {
  if ( !project ) {
    project = new LiveProject
  }
  return project
}

export function newProject
(): LiveProject {
  return new LiveProject
}

export class LiveProject {
  branches: StringMap < LiveBranch >
  blockById: StringMap < LiveBlock >
  blocksByName: StringMap < LiveBlock [] >
  fragments: StringMap < SourceFragment >
  // Root context
  context: { [ key: string ]: any }
  // Type of context
  provide: { [ key: string ]: string }

  constructor () {
    this.branches = {}
    this.blockById = {}
    this.blocksByName = {}
    this.fragments = {}
    this.context = {}
    this.provide = {}
  }

  newBranch ( connect?: string ) {
    const branch = new LiveBranch ( this, connect )
    this.branches [ branch.id ] = branch
    this.addBlock ( branch.blocks [ branch.entry ] )
    return branch
  }

  newBlock ( branchId: string, parentId: string ) {
    const branch = this.branches [ branchId ]
    const block = branch.newBlock ( parentId )
    this.addBlock ( block )
    return block
  }

  private addBlock ( block: LiveBlock ) {
    const { id, name } = block

    if ( this.blockById [ id ] ) {
      throw new Error ( `Duplicate block id '${ id }'.`)
    }

    if ( ! name ) {
      throw new Error ( `Missing 'name' in block id '${ id }.`)
    }

    this.blockById [ id ] = block
    let list = this.blocksByName [ name ]

    if ( ! list ) {
      list = []
      this.blocksByName [ name ] = list
    } else if ( list [ 0 ].lang !== block.lang ) {
      throw new Error ( `Blocks of the same name should share the same lang.` )
    }
    list.push ( block )
    this.setBlockSource ( block.id, block.source )

    return block
  }

  setContext ( key: string, type: string, ctx: any ) : void {
    this.context [ key ] = ctx
    this.provide [ key ] = type
    this.changed ()
  }

  addFragment ( fragment: SourceFragment ) {
    this.fragments [ fragment.id ] = fragment
    fragment.sources = extractSources
    ( fragment.source
    , fragment.lang 
    ).sources
    this.changed ()
  }

  appendSource ( fragmentId: string, source: string ) {
    const fragment = this.fragments [ fragmentId ]
    const s = fragment.source
    fragment.source = s === ''
      ? source
      : s + '\n' + source
    fragment.sources = extractSources
    ( fragment.source
    , fragment.lang 
    ).sources
    this.changed ()
  }

  setBlockSource ( blockId: string, source: string ) {
    const block = this.blockById [ blockId ]
    // Not sure we need to set it in block.
    block.source = source
    const fragmentId = `$${ blockId }.source`
    const fragment: SourceFragment =
    { id: fragmentId
      // $     blockId . source
      // type  target    frag
    , frag: 'source'
    , type: '$'
    , target: block.id
    , lang: block.lang
    , source
    , sources: extractSources ( source, block.lang ).sources
    }
    this.fragments [ fragmentId ] = fragment
    this.changed ()
  }

  setFragmentSource ( fragmentId: string, source: string ) {
    throw new Error ( 'TODO' )
    // this.changed ()
  }

  changed () {
    const { main, linkedNodes } = compile ( this )
    main ()
  }
}
