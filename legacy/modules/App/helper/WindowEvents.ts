import { nwMakeMenus, webMakeMenus, MenuDef } from './makeMenus'
const COMMANDS: Keys = {}
declare var nw: any
declare var process: any

const VERSION = '0.1.0'

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
  }

  window.addEventListener ( 'keydown', keydown )
}

export const setupScreenEvents = ( controller ) => {
  const modeSignal = controller.getSignals ().app.mode
  const resizedSignal = controller.getSignals ().app.resized

  let hideeditor
  let mixedtype
  const doit = ( e?: Event ) => {
    const mode = hideeditor ? 'fullscreen' : ( mixedtype ? 'mixed' : 'normal' )
    if ( e ) {
      e.preventDefault ()
    }
    modeSignal ( { mode } )
  }

  if ( window [ 'nw' ] ) {
    const win = nw.Window.get ()
    if ( navigator.platform === 'MacIntel' ) {
      const menu = new nw.Menu ( { type: 'menubar' } )

      const MENUS: MenuDef[] =
        // ==================== Lucidity Menu
      [ { label: 'Lucidity'
        , submenu:
          [ { label: 'About Lucidity'
            , click: () => {
                alert ( `Lucidity ${VERSION}. Please visit http://lucidity.io.` )
              }
            }

          , { type: 'separator' }
          , { label: 'Preferences…'
            , click: () => {
                alert ( 'TODO' )
              }
            , key: ','
            , modifiers: 'cmd'
            }
          /* There does not seem a way to make these work in current NW.js
          , { type: 'separator' }
          , { label: 'Hide Lucidity'
            , click: () => {
                // hide
              }
            , key: 'h'
            , modifiers: 'cmd'
            }
          , { label: 'Hide Others'
            , click: () => {
                // hide others
              }
            , key: 'h'
            , modifiers: 'cmd+alt'
            }
          , { label: 'Show All'
            , click: () => {
                // ??
              }
            }
            */

          , { type: 'separator' }
          , { label: 'Quit'
            , click: () => {
                process.exit ()
              }
            , key: 'q'
            , modifiers: 'cmd'
            }
          ]
        }
        // ==================== Playback Menu
      , { label: 'Playback'
        , submenu:
          [ { label: 'Reload'
            , click: () => {
              window.location.reload ()
            }
            , key: 'r'
            , modifiers: 'cmd'
            }
          ]
        }
        // ==================== View Menu
      , { label: 'View ' // Extra space to avoid Mac OS inserting 'Enter Full Screen'
        , submenu:
          [ { label: 'Hide Editor'
            , click ( ) {
              this.label = hideeditor ? 'Hide Editor' : 'Show Editor'
              hideeditor = !hideeditor
              doit ()
            }
            , key: 'e'
            , modifiers: 'cmd'
            }
          , { label: 'Mixed Mode'
            , click () {
              this.label = mixedtype ? 'Mixed Mode' : 'Normal Mode'
              mixedtype = !mixedtype
              doit ()
            }
            , key: 'm'
            , modifiers: 'cmd'
            }
          , { label: 'Enter Fullscreen'
            , click () {
                console.log ( 'fullscreen' )
                this.label = win.isFullscreen ? 'Enter Fullscreen' : 'Exit Fullscreen'
                win.toggleFullscreen ()
              }
            , key: 'f'
            , modifiers: 'ctrl+cmd'
            }

          , { type: 'separator' }

          , { label: 'Developer Tools'
            , click: () => { win.showDevTools() }
            , key: 'i'
            , modifiers: 'cmd+alt'
            }
          ]
        }
      ]

      // ==================== Install Menu
      win.menu = nwMakeMenus ( MENUS )
    }
  }

  // Read this before choosing shortcuts:
  // https://developer.apple.com/library/mac/documentation/UserExperience/Conceptual/OSXHIGuidelines/Keyboard.html
  const commands = window [ 'nw' ] ? {} :
  { 'Cmd-e':  ( e: Event ) => { hideeditor = !hideeditor; doit ( e ) }
  , 'Ctrl-e': ( e: Event ) => { hideeditor = !hideeditor; doit ( e ) }
  , 'Cmd-m':  ( e: Event ) => { mixedtype = !mixedtype; doit ( e ) }
  , 'Ctrl-m': ( e: Event ) => { mixedtype = !mixedtype; doit ( e ) }
  , 'Cmd-r':  ( e: Event ) => { location.reload () }
  , 'Ctrl-r': ( e: Event ) => { location.reload () }
  // 'Alt-s' in code editor: toggle scrubber
  }

  setGlobalKey ( commands )

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
