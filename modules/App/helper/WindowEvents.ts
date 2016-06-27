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
    const cmd = ( e.metaKey ?  'Cmd-' : '' )
              + ( e.ctrlKey ?  'Ctrl-' : '' )
              + ( e.altKey ?   'Alt-' : '' )
              + ( e.shiftKey ? 'Shift-' : '' )
              + e.key.toLowerCase ()
    const doit = COMMANDS [ cmd ]

    if ( doit ) {
      doit ( e )
    }
    else {
      console.log ( cmd, e )
    }
  }

  window.addEventListener ( 'keydown', keydown )
}

export const setupScreenEvents = ( controller ) => {
  const modeSignal = controller.getSignals ().app.mode
  const resizedSignal = controller.getSignals ().app.resized

  let hideeditor
  let mixedtype
  const doit = ( e ) => {
    const mode = hideeditor ? 'fullscreen' : ( mixedtype ? 'mixed' : 'normal' )
    e.preventDefault ()
    modeSignal ( { mode } )
  }
  // Ctrl-Cmd-f == app fullscreen
  // Cmd-f
  const COMMANDS =
  { 'Cmd-Shift-f': ( e: Event ) => { hideeditor = !hideeditor; doit ( e ) }
  , 'Cmd-Shift-e': ( e: Event ) => { mixedtype = !mixedtype; doit ( e ) }
  , 'Ctrl-Shift-f': ( e: Event ) => { hideeditor = !hideeditor; doit ( e ) }
  , 'Ctrl-Shift-e': ( e: Event ) => { mixedtype = !mixedtype; doit ( e ) }
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
