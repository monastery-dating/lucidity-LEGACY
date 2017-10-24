/** All compilers must implement this public API
  const { js, errors } = compiler.compile ( source )
  scrub.js = compiler.scrubParse ( source, scrub.literals )

  // Should fill in
  const scrub: ScrubCode = { js: '', values: [], literals: [] }
    scrub.values = scrub.literals.map ( l => l.value )
  }

  // Done. Post result back.
  const data: TranspileCallbackArgs = { js, scrub, errors }
 * 
 */
export const SCRUBBER_VAR = '$scrub$'

export interface LiteralScrub {
  value: number
  text: string
  ch: number
  line: number
}

export interface ScrubCode {
  js: string
  values: number[]
  literals: LiteralScrub[]
}

export interface CompilerError {
  message: string
  line: number
  ch: number
}

export interface CompileSuccess {
  js: string
  scrub: ScrubCode
}

interface CompileFailure {
  errors: CompilerError []
}

export type CompileResult = CompileSuccess | CompileFailure

export function isCompileSuccess
( result: CompileResult
): result is CompileSuccess {
  return (<CompileSuccess>result).js !== undefined
}

export interface TranspileCallback {
  ( arg: CompileResult )
}

export interface CompilerType {
  ( source: string ): CompileResult
}