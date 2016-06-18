import * as ts from 'typescript'

interface SourceMap {
  [ key: string ]: string
}

const BASE_HOST =
{ getCompilationSettings (): ts.CompilerOptions {
    return  { target: ts.ScriptTarget.ES6
            , module: ts.ModuleKind.CommonJS
            }
  }

, getNewLine (): string {
    return '\n'
  }

, getCurrentDirectory (): string {
    return 'LUCIDITY' // ?
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

, resolveModuleNames ( moduleNames: string[], containingFile: string): ts.ResolvedModule[] {
    return moduleNames.map ( n => ( { resolvedFileName: n } ) )
    // isExternalLibraryImport?: boolean
  }
}

declare var require: any
const LUCIDITY_D_TS_SOURCE = require ( '!raw!../../../typings/lucidity/lucidity.d.ts' )
const LUCIDITY_D_TS = ts.ScriptSnapshot.fromString  ( LUCIDITY_D_TS_SOURCE )
const LIB_D_TS_SOURCE = require ( '!raw!../../../node_modules/typescript/lib/lib.es6.d.ts' )
const LIB_D_TS = ts.ScriptSnapshot.fromString ( LIB_D_TS_SOURCE )

const D_TS =
{ [ 'lucidity' ]: LUCIDITY_D_TS
, [ 'lib.d.ts' ]: LIB_D_TS
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
      return [ 'main.ts' ]
    }
  , getScriptVersion ( filename: string ): string {
      if ( filename === 'main.ts' ) {
        return mainFile.version.toString ()
      }
      else {
        return '1.0'
      }
    }

  , getScriptSnapshot ( filename: string ): ts.IScriptSnapshot {
      if ( filename === 'main.ts' ) {
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

interface CompilerError {
  message: string
  loc: { line: number, ch: number }
}

interface CompileReturn {
  code?: string
  errors?: CompilerError[]
}

export const compile =
( source: string
, typecheck: boolean = true
): CompileReturn => {
  mainFile.source = source
  mainFile.version++
  // First check for errors
  let diagnostics = []
  if ( typecheck ) {
    // Type checking should happen in web worker
    // and we send back errors with a signal: easy.
    diagnostics =
    // This doesn't seem to give any useful information.
    // [ ...LS.getCompilerOptionsDiagnostics ()
    [ ...LS.getSyntacticDiagnostics ( 'main.ts' )
    , ...LS.getSemanticDiagnostics ( 'main.ts' )
    ]
  }

  if ( diagnostics.length > 0 ) {
    let errors = diagnostics.map ( d => {
      const message =
      ts.flattenDiagnosticMessageText ( d.messageText, '\n' )
      if ( d.file ) {
        const { line, character } = d.file.getLineAndCharacterOfPosition ( d.start )
        return { loc: { line, ch: character }, message }
      }
      else {
        return { loc: { line: 0, ch: 0 }, message }
      }
    })
    return { errors }
  }

  const output = LS.getEmitOutput ( 'main.ts' )
  if (!output.emitSkipped) {
    // valid
    const code = output.outputFiles [ 0 ].text
    return { code }
  }
}
