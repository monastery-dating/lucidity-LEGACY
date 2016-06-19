// This source is not included in 'app.js' but produces a standalone 'worker.js'
// script.
//
// This whole script is used by CodeHelper async 'compile' function.

import * as LanguageService from './LanguageService'
import { TranspileCallbackArgs, ScrubCode } from './types'

self.addEventListener ( 'message', ( e ) => {
  const source: string = e.data
  // Compile source and return compilation result
  const scrub: ScrubCode = { js: '', values: [], literals: [] }
  const { code, errors } = LanguageService.compile ( source )
  if ( errors ) {
    // do not compile scrubber
  }
  else {
    scrub.js = LanguageService.scrubParse ( source, scrub.literals )
    scrub.values = scrub.literals.map ( l => l.value )
  }

  // Done. Post result back.
  const data: TranspileCallbackArgs = { code, scrub, errors }

  self.postMessage ( data, [])
})
