
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

interface CompilerError {
  message: string
  loc: { line: number, ch: number }
}

export interface TranspileCallbackArgs {
  code: string
  scrub: ScrubCode
  errors: CompilerError[]
}

export interface TranspileCallback {
  ( { code, scrub, errors }: TranspileCallbackArgs )
}
