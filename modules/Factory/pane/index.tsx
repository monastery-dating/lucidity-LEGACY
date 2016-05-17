// FIXME: move Component to '/lib' ?
// FIXME: move Factory to '/lib' ?
// FIXME: should import styles ?
import { Component } from '../../../desktop/Component'
import { ContextType } from '../../context.type'


// Open/closeable pane
export const pane =
( name: string ) => {
  const panePath = [ '$factory', 'pane', name ]

  const comp = Component
  ( { active: panePath // State of the pane.
    }
  , ( { state, props, children, signals } ) => {
      const active = state.active

      const klass = Object.assign
      ( {}, props.class || {}, { Pane: true, active } )

      return <div class={ klass }>
          <div class='wrap'>
            { children }
          </div>
        </div>

    }
  )
  comp.toggle = Component
  ( { active: panePath
    }
  , ( { state, props, children, signals }: ContextType ) => {
      const active = state.active

      const toggle = ( e ) => {
        signals.$factory.set
        ( { path: panePath, value: !state.active } )
      }

      const klass = Object.assign
      ( {}, props.class || {}, { active } )

      return <div class={ klass } on-click={ toggle }>
        { children }</div>
    }
  )
  return comp
}
