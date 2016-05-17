// FIXME: move Component to '/lib' ?
// FIXME: move Factory to '/lib' ?
// FIXME: should import styles ?
import { Component } from '../../../desktop/Component'


// Open/closeable pane
export const pane =
( name: string ) => {
  const PanePath = [ '$factory', 'pane', name ]

  let togglePane

  const comp = Component
  ( { active: PanePath // State of the pane.
    }
  , ( { state, children, signals } ) => {
      const active = state.active

      togglePane = ( e ) => {
        signals.$factory.set
        ( { path: PanePath, value: !active } )
      }

      return <div class={{ Pane: true, active }}>
          <div class='wrap'>
            { children }
          </div>
        </div>

    }
  )
  // Not sure I am not leaking here.
  comp.toggle = ( e ) => togglePane ( e )
  comp.path = PanePath
  return comp
}
