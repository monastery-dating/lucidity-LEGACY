import { compile as ts } from './typescript'
import { CompilerType } from './types'
import { StringMap } from '../types'
export
  { CompileResult
  , CompileSuccess
  , isCompileSuccess
  , SCRUBBER_VAR
  } from './types'

export const compilers: StringMap < CompilerType > =
{ ts
}