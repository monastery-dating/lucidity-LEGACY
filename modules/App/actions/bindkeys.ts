import { ActionContextType } from '../../context.type'

let modeSignal
let resizedSignal
export const setKeySignals = ( signals ) => {
  modeSignal = signals.mode
  resizedSignal = signals.resized
}

export const bindkeys =
( { state
  , output
  } : ActionContextType
) => {

  let fullscreen
  let mixedtype
  const COMMANDS =
  { 'Cmd-f': () => { fullscreen = !fullscreen }
  , 'Cmd-m': () => { mixedtype = !mixedtype }
  , 'Ctrl-f': () => { fullscreen = !fullscreen }
  , 'Ctrl-m': () => { mixedtype = !mixedtype }
  // 'Alt-s' in code editor: toggle scrubber
  }

  const keydown = ( e: KeyboardEvent ) => {
    const editoropen = state.get ( [ '$block' ] )
    const cmd = ( e.shiftKey ? 'Shift-' : '' )
              + ( e.ctrlKey ? 'Ctrl-' : '' )
              + ( e.metaKey ? 'Cmd-' : '' )
              + ( e.altKey ? 'Alt-' : '' )
              + e.key
    const doit = COMMANDS [ cmd ]

    if ( doit ) {
      doit ()
      const mode = fullscreen ? 'fullscreen' : ( mixedtype ? 'mixed' : 'normal' )
      e.preventDefault ()
      modeSignal ( { mode } )
    }
  }

  const resize = ( e: UIEvent ) => {
    resizedSignal ( { size: { width: window.innerWidth, height: window.innerHeight } } )
  }

  window.addEventListener ( 'keydown', keydown )
  window.addEventListener ( 'resize', resize )
}
