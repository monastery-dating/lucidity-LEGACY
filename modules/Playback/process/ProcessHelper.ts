declare var process:any
declare var require:any
export interface ProcessType {
  send ( ...any )
  receive ( ...any )
  setSource ( source: string )
  halt (): void

  source?: string
  ready?: boolean
}

interface MakeProcessType {
  (): ProcessType
}

interface ProcessMakers {
  [ key: string ]: MakeProcessType
}

const PROCESS_MAKERS: ProcessMakers = {}

export const register =
( lang: string
, make: MakeProcessType
) => {
  PROCESS_MAKERS [ lang ] = make
}

if ( window [ 'process' ] ) {
  // Make sure on ( 'exit' ) is called.
  const cleanExit = () => { process.exit () }
  process.on ( 'SIGINT', cleanExit ) // ctrl-c
  process.on ( 'SIGTERM', cleanExit ) // kill
}

export const start =
( lang: string
, oldprocess?: ProcessType
): ProcessType => {
  if ( oldprocess ) {
    oldprocess.halt ()
  }
  const maker = PROCESS_MAKERS [ lang ]
  if ( maker ) {
    return maker ()
  }
  throw `Invalid language '${lang}' (not process maker).`
}

const children = []
let nativespawn

export const spawn =
( ...args ) => {
  if ( !nativespawn ) {
    nativespawn = require ( 'child_process' ).spawn
    const cleanExit = function() { process.exit() };
    process.on ( 'SIGINT', cleanExit ) // ctrl-c
    process.on ( 'SIGTERM', cleanExit ) // kill

    const unload = () => {
      children.forEach ( child => {
        child.kill ( 'SIGHUP' )
      })
    }

    process.on ( 'exit', () => {
      children.forEach ( child => {
        child.kill ( 'SIGHUP' )
      })
    })

    window.addEventListener ( 'unload', () => {
      window.removeEventListener ( 'unload', unload )
      unload ()
    })
  }
  const child = nativespawn ( ...args )
  children.push ( child )

  return child
}

export const kill =
( child
) => {
  for ( let i = 0; i < children.length; ++i ) {
    if ( children [ i ] === child ) {
      delete children [ i ]
      break
    }
  }
  child.kill ( 'SIGHUP' )
}
