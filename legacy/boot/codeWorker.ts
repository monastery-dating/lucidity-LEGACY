// This source is not included in 'app.js' but produces a standalone 'worker.js'
// script.
//
// This whole script is used by CodeHelper async 'compile' function.
// Remove normal browser self types. We are in the worker.
const me = <any>self
if ( typeof document === 'undefined' ) {
  // codemirror.js tests 'document.createRange'
  me [ 'document' ] = { createElement ( tag ) { return { setAttribute () {} } } }
  me [ 'window' ] = {}
}

import * as LanguageService from '../modules/Code/helper/LanguageService'
import { TranspileCallbackArgs, ScrubCode } from '../modules/Code/helper/types'

// We export compile in case we want to work without a worker
export const compile =
( source: string ): TranspileCallbackArgs => {
  // Compile source and return compilation result
  const scrub: ScrubCode = { js: '', values: [], literals: [] }
  const { js, errors } = LanguageService.compile ( source )
  if ( errors ) {
    // do not compile scrubber
  }
  else {
    scrub.js = LanguageService.scrubParse ( source, scrub.literals )
    scrub.values = scrub.literals.map ( l => l.value )
  }

  // Done. Post result back.
  const data: TranspileCallbackArgs = { js, scrub, errors }

  return data
}

self.addEventListener ( 'message', ( e ) => {
  const { id, source } = e.data
  const data = compile ( source )
  me.postMessage ( { id, data } )
})

me.postMessage ( { id: 'ready' } )
