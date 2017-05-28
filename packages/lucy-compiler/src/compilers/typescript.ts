/** All compiler must implement this public API:
 * 
 */
import * as ts from 'typescript'
import { definitions } from '@lucidity/ts-definitions'
import
  { CompilerError
  , LiteralScrub
  , SCRUBBER_VAR
  , ScrubCode
  , CompileResult
  } from './types'
import { StringMap } from '../types'

const D_TS = Object.keys ( definitions ).reduce
( ( acc, name ) => {
    acc [ name + '.ts' ] = ts.ScriptSnapshot.fromString
    ( definitions [ name ] )
    return acc
  }
, < StringMap < ts.IScriptSnapshot > > {}
)

const MAIN_FILE = 'main.ts'
const UNARY_AFTER = [ '=', '(', '?', ':', '[', '*', '/', '+' ]
const SCRUB_PREFIX = `declare var ${SCRUBBER_VAR}: number[]\n`

interface SourceMap {
  [ key: string ]: string
}

const BASE_HOST =
{ getCompilationSettings (): ts.CompilerOptions {
    return  { target: ts.ScriptTarget.ES2015
            , module: ts.ModuleKind.CommonJS
            }
  }

, getNewLine (): string {
    return '\n'
  }

, getCurrentDirectory (): string {
    return ''
  }

, getDefaultLibFileName(options: ts.CompilerOptions): string {
    return "lib.d.ts";
  }

, log ( s: string ): void {
    console.log ( 'LOG', s )
  }

, trace ( s: string ): void {
    console.log ( 'TRACE', s )
  }

, error ( s: string ): void {
    console.error ( 'ERROR', s )
  }

, useCaseSensitiveFileNames (): boolean {
    return true
  }

, resolveModuleNames
  ( moduleNames: string []
  , containingFile: string
  ): ts.ResolvedModule[] {
    return moduleNames.map
    ( modName => {
        if ( containingFile === MAIN_FILE ) {
          // No relative import
          return { resolvedFileName: modName + '.ts' }
        } else {
          const base = containingFile.substr
          ( 0, containingFile.length - 3 )
          const path = modName.split( '/' ).reduce
          ( ( acc, part, idx ) => {
              if ( part === '.' ) {
              } else if ( part === '..' ) {
                acc.pop ()
              } else {
                acc.push ( part )
              }
              return acc
            }
          , base.split ( '/' )
          ).join ( '/' )
          console.log ( path )
          return { resolvedFileName: path + '.ts' }
        }
      }
    )
  }
}

const libShot =
( filename: string
): ts.IScriptSnapshot => {
  const s = D_TS [ filename ]
  return s
}

const mainFile =
{ source: ''
, version: 1
}

// This is used by typesript checker. This provides the type checking environment for scripts.
const LanguageHost =
(): ts.LanguageServiceHost => {

  const lh =
  { getScriptFileNames (): string[] {
      return [ MAIN_FILE ]
    }
  , getScriptVersion ( filename: string ): string {
      if ( filename === MAIN_FILE ) {
        return mainFile.version.toString ()
      }
      else {
        return '1.0'
      }
    }

  , getScriptSnapshot ( filename: string ): ts.IScriptSnapshot {
      if ( filename === MAIN_FILE ) {
        return ts.ScriptSnapshot.fromString ( mainFile.source )
      }
      return libShot ( filename )
    }
    // getLocalizedDiagnosticMessages?(): any;
    // getCancellationToken?(): HostCancellationToken;
  }

  return Object.assign ( BASE_HOST, lh )
}

export const create =
(): ts.LanguageService => {
  // FIXME: Use a DocumentRegistry to at least store types for
  // things like lib.d.ts, lucidity, THREE.js and share them.
  const host = LanguageHost ()
  return ts.createLanguageService ( host, ts.createDocumentRegistry () )
}

const LS = create ()


interface CompileCodeSuccess {
  js: string
}

interface CompileCodeFailure {
  errors: CompilerError []
}

type CompileCodeResult = CompileCodeSuccess | CompileCodeFailure

function isCompileCodeSuccess
( compiled: CompileCodeResult
): compiled is CompileCodeSuccess {
  return ( < CompileCodeSuccess > compiled ).js !== undefined
}

const addLiteral =
( literals: LiteralScrub[]
, line: number
, ch: number
, text: string
) => {
  if ( text.substr ( 0, 2 ) === '0x' ) {
    return null
  }
  const value = parseFloat ( text )
  return literals.push ( { text, line, ch, value } ) - 1
}

export const scrubParse =
( source: string
, literals: LiteralScrub[]
, mode: string = 'javascript'
): string => {
  // TODO: REIMPLEMENT LATER (using legacy LanguageService code)
  return source
}

/* Private types in TS */
interface LineAndCharacter {
    line: number;
    character: number;
}
interface SourceFile {
  getLineAndCharacterOfPosition(pos: number): LineAndCharacter;
}

interface Diagnostic {
  file: SourceFile;
  start: number;
  length: number;
  messageText: string | DiagnosticMessageChain;
  category: DiagnosticCategory;
  code: number;
}

interface DiagnosticMessageChain {
  messageText: string;
  category: DiagnosticCategory;
  code: number;
  next?: DiagnosticMessageChain;
}

enum DiagnosticCategory {
  Warning = 0,
  Error = 1,
  Message = 2,
}
/* End private types in TS */

export function compileCode
( source: string
, typecheck: boolean = true
): CompileCodeResult {
  mainFile.source = source
  mainFile.version++
  // First check for errors
  let diagnostics: Diagnostic[] = []
  if ( typecheck ) {
    // Type checking should happen in web worker
    // and we send back errors with a signal: easy.
    // http://www.html5rocks.com/en/tutorials/workers/basics/
    diagnostics =
    // This doesn't seem to give any useful information.
    // [ ...LS.getCompilerOptionsDiagnostics ()
    [ ...LS.getSyntacticDiagnostics ( MAIN_FILE )
    , ...LS.getSemanticDiagnostics ( MAIN_FILE )
    ]
  }

  if ( diagnostics.length > 0 ) {
    let errors = diagnostics.map ( d => {
      const message =
      ts.flattenDiagnosticMessageText ( d.messageText, '\n' )
      if ( d.file ) {
        const { line, character } = d.file.getLineAndCharacterOfPosition ( d.start )
        return { line, ch: character, message }
      }
      else {
        return { line: 0, ch: 0, message }
      }
    })
    return { errors }
  }

  const output = LS.getEmitOutput ( MAIN_FILE )
  if (!output.emitSkipped) {
    // valid
    const js = output.outputFiles [ 0 ].text
    return { js }
  }
  else {
    // FIXME: Improve this error message
    const error =
    { message: 'Could not compile (emitSkipped).'
    , line: 0
    , ch: 0
    }
    return { errors: [ error ] }
  }
}

// We export compile in case we want to work without a worker
export function compile
( source: string
): CompileResult {
  const compiled = compileCode ( source )
  if ( ! isCompileCodeSuccess ( compiled ) ) {
    return compiled
  }

  const scrub: ScrubCode = { js: '', values: [], literals: [] }
  scrub.js = scrubParse ( source, scrub.literals )
  scrub.values = scrub.literals.map ( l => l.value )

  // Done. Post result back.
  return { js: compiled.js, scrub }
}