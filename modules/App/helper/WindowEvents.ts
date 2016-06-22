const COMMANDS: Keys = {}

interface Keys {
  [ key: string ]: ( e: Event ) => void
}
export const setGlobalKey =
( keys: Keys ) => {
  Object.assign ( COMMANDS, keys )
}

export const setup =
() => {
  const keydown = ( e: KeyboardEvent ) => {
    const cmd = ( e.shiftKey ? 'Shift-' : '' )
              + ( e.ctrlKey ? 'Ctrl-' : '' )
              + ( e.metaKey ? 'Cmd-' : '' )
              + ( e.altKey ? 'Alt-' : '' )
              + e.key
    const doit = COMMANDS [ cmd ]

    if ( doit ) {
      doit ( e )
    }
  }

  window.addEventListener ( 'keydown', keydown )
}

export const setupScreenEvents = ( controller ) => {
  const modeSignal = controller.getSignals ().app.mode
  const resizedSignal = controller.getSignals ().app.resized

  let fullscreen
  let mixedtype
  const doit = ( e ) => {
    const mode = fullscreen ? 'fullscreen' : ( mixedtype ? 'mixed' : 'normal' )
    e.preventDefault ()
    modeSignal ( { mode } )
  }
  const COMMANDS =
  { 'Cmd-f': ( e: Event ) => { fullscreen = !fullscreen; doit ( e ) }
  , 'Cmd-m': ( e: Event ) => { mixedtype = !mixedtype; doit ( e ) }
  , 'Ctrl-f': ( e: Event ) => { fullscreen = !fullscreen; doit ( e ) }
  , 'Ctrl-m': ( e: Event ) => { mixedtype = !mixedtype; doit ( e ) }
  // 'Alt-s' in code editor: toggle scrubber
  }

  setGlobalKey ( COMMANDS )

  const resize = ( e: UIEvent ) => {
    resizedSignal
    ( { size:
        { width: window.innerWidth
        , height: window.innerHeight
        }
      }
    )
  }

  window.addEventListener ( 'resize', resize )
}
