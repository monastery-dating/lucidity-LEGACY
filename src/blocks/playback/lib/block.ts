import { compilers } from './compilers'

import { LiveBranch } from './branch'
import { makeId, ParsedMeta } from './types'
import { BlockDefinition, CompiledNode } from 'blocks/playback';
import { compileSource, runModule, Source } from 'blocks/playback/lib/compile'
import { isCompileSuccess, CompilerError } from 'blocks/playback/lib/compilers/types';
import { Update, Init, Meta } from 'blocks/lucidity';

interface Foo extends Meta {
  // set to true if children: 'all'
  all?: boolean
  // set to true if it has an update but not type for update
  isvoid?: boolean
  children?: string[]
}

function parseMeta ( meta: Meta ): ParsedMeta {
  const { children } = meta
  const parsedMeta: ParsedMeta = Object.assign
  ( {}
  , meta
  , { children: children === 'all'
      ? []
      : children
    }
  )
  if ( children === 'all' ) {
    delete parsedMeta.children
    parsedMeta.all = true
  }
  return parsedMeta
}

export class LiveBlock {
  children: string []
  // Extracted from source but saved for faster usage
  meta: ParsedMeta
  // ** UI stuff **
  closed?: boolean
  js: string
  errors?: CompilerError []
  update?: Update
  init?: Init

  constructor
  ( public branch: LiveBranch
  , public name: string = 'new block'
  , public lang: string = 'ts'
  , public source: string = ''
  , public id: string = makeId ( branch.project.blockById )
  ) {
    this.js = ''
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

  /** Passed source has fragments resolved
   */
  compile ( source: Source ): CompiledNode {
    const compiled = compileSource ( source )
    if ( ! isCompileSuccess ( compiled ) ) {
      const { errors } = compiled
      this.errors = errors
      // Of course, this should bubble properly up to the inline editor. But for
      // now we just break.
      console.warn ( `Could not compile: ${ errors.map ( e => e.message ).join ( '\n' ) }.` )
    } else {
      this.js = compiled.js
      const exported = runModule ( compiled )
      const { meta } = exported
      if ( meta ) {
        this.meta = parseMeta ( meta )
      } else {
        delete this.meta
      }
      this.update = exported.update
      this.init = exported.init
    }
    return this
  }
}
